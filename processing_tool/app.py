import os
import cv2
import numpy as np
import uuid
from flask import Flask, request, render_template, send_from_directory, jsonify
from werkzeug.utils import secure_filename
import threading
import time

app = Flask(__name__)

# Configure upload folder and allowed extensions
UPLOAD_FOLDER = 'uploads'
PROCESSED_FOLDER = 'processed'
ALLOWED_EXTENSIONS = {'mp4', 'avi', 'mov', 'webm', 'mkv'}

# Ensure directories exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(PROCESSED_FOLDER, exist_ok=True)
os.makedirs('templates', exist_ok=True)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['PROCESSED_FOLDER'] = PROCESSED_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 200 * 1024 * 1024  # 200MB max upload

# Track processing status
processing_status = {}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def create_sketchy_outline(input_path, output_path, params):
    """
    Process video to create sketchy outline effect - faster version
    """
    # Update status and print debug info
    job_id = os.path.basename(output_path).split('.')[0]
    processing_status[job_id] = {'status': 'processing', 'progress': 0}
    print(f"Starting to process video: {input_path} -> {output_path}")
    
    try:
        # Open the input video
        cap = cv2.VideoCapture(input_path)
        if not cap.isOpened():
            print(f"ERROR: Could not open video file {input_path}")
            processing_status[job_id] = {'status': 'error', 'message': 'Could not open video file'}
            return
        
        # Get video properties
        fps = cap.get(cv2.CAP_PROP_FPS)
        frame_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
        height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
        
        print(f"Video info: {width}x{height}, {fps} fps, {frame_count} frames")
        
        # Limit resolution for faster processing
        max_dimension = 400  # Reduced from 800 for speed
        if width > max_dimension or height > max_dimension:
            if width > height:
                new_width = max_dimension
                new_height = int(height * (max_dimension / width))
            else:
                new_height = max_dimension
                new_width = int(width * (max_dimension / height))
            width, height = new_width, new_height
            print(f"Resized to: {width}x{height}")
        
        # Define codec and create VideoWriter object
        fourcc = cv2.VideoWriter_fourcc(*'mp4v')
        out = cv2.VideoWriter(output_path, fourcc, fps, (width, height))
        
        # Extract parameters with defaults
        edge_low = params.get('edge_low', 50)
        edge_high = params.get('edge_high', 150)
        grid_spacing = params.get('grid_spacing', 20)
        sketch_factor = params.get('sketch_factor', 0.7)
        
        # Skip frames to speed up processing
        frame_skip = 2  # Process every 2nd frame
        
        # Create a single graph paper background to reuse
        graph_paper = np.ones((height, width, 3), dtype=np.uint8) * 245  # Light gray
        
        # Draw grid lines
        for x in range(0, width, grid_spacing):
            cv2.line(graph_paper, (x, 0), (x, height), (200, 200, 200), 1)
        for y in range(0, height, grid_spacing):
            cv2.line(graph_paper, (0, y), (width, y), (200, 200, 200), 1)
        
        # Process each frame
        frame_index = 0
        processed_count = 0
        last_frame = None
        
        while True:
            ret, frame = cap.read()
            if not ret:
                break
            
            # Skip frames to speed up processing
            if frame_index % frame_skip != 0 and last_frame is not None:
                # Write the last processed frame again
                out.write(last_frame)
                frame_index += 1
                processed_count += 1
                # Update progress more frequently
                if frame_index % 5 == 0:
                    progress = int(100 * frame_index / frame_count)
                    processing_status[job_id] = {
                        'status': 'processing', 
                        'progress': progress
                    }
                    print(f"Progress: {progress}% (frame {frame_index}/{frame_count})")
                continue
            
            # Resize if needed
            if frame.shape[1] != width or frame.shape[0] != height:
                frame = cv2.resize(frame, (width, height))
            
            # Convert to grayscale
            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            
            # Apply Gaussian blur
            blurred = cv2.GaussianBlur(gray, (5, 5), 0)
            
            # Apply Canny edge detection
            edges = cv2.Canny(blurred, edge_low, edge_high)
            
            # Dilate the edges slightly for better visibility
            kernel = np.ones((2, 2), np.uint8)
            dilated_edges = cv2.dilate(edges, kernel, iterations=1)
            
            # Combine graph paper and edges (simplified for speed)
            result = graph_paper.copy()
            result[dilated_edges > 0] = (0, 0, 0)  # Black edges
            
            # Simplified sketchy effect (much faster)
            if sketch_factor < 0.8:  # Only add noise if sketch factor is high enough
                mask = np.zeros_like(dilated_edges)
                cv2.randn(mask, 0, 255)  # Random noise
                sketch_mask = (mask > 240) & (dilated_edges > 0)  # Only near edges
                result[sketch_mask] = (0, 0, 0)  # Add random dots
            
            # Save the processed frame
            last_frame = result
            out.write(result)
            
            # Update progress
            frame_index += 1
            processed_count += 1
            if frame_index % 5 == 0:
                progress = int(100 * frame_index / frame_count)
                processing_status[job_id] = {
                    'status': 'processing', 
                    'progress': progress
                }
                print(f"Progress: {progress}% (frame {frame_index}/{frame_count})")
        
        # Release resources
        cap.release()
        out.release()
        
        # Update status to complete
        processing_status[job_id] = {'status': 'completed', 'progress': 100}
        print(f"Processing complete: {processed_count} frames processed")
        
    except Exception as e:
        print(f"Error processing video: {str(e)}")
        processing_status[job_id] = {'status': 'error', 'message': str(e)}

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'video' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['video']
    
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    if file and allowed_file(file.filename):
        # Generate unique filename
        unique_id = str(uuid.uuid4())
        filename = secure_filename(file.filename)
        base_name, extension = os.path.splitext(filename)
        safe_filename = f"{base_name}_{unique_id}{extension}"
        output_filename = f"{unique_id}.mp4"
        
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], safe_filename)
        output_path = os.path.join(app.config['PROCESSED_FOLDER'], output_filename)
        
        file.save(filepath)
        print(f"File saved: {filepath}")
        
        # Get parameters from form
        params = {
            'edge_low': int(request.form.get('edge_low', 50)),
            'edge_high': int(request.form.get('edge_high', 150)),
            'grid_spacing': int(request.form.get('grid_spacing', 20)),
            'sketch_factor': float(request.form.get('sketch_factor', 0.7))
        }
        
        print(f"Processing parameters: {params}")
        
        # Start processing in background thread
        threading.Thread(
            target=create_sketchy_outline, 
            args=(filepath, output_path, params)
        ).start()
        
        return jsonify({
            'success': True,
            'job_id': unique_id,
            'message': 'File uploaded and processing started'
        })
    
    return jsonify({'error': 'File type not allowed'}), 400

@app.route('/status/<job_id>')
def get_status(job_id):
    if job_id in processing_status:
        return jsonify(processing_status[job_id])
    return jsonify({'status': 'not_found'}), 404

@app.route('/download/<job_id>')
def download_file(job_id):
    filename = f"{job_id}.mp4"
    return send_from_directory(app.config['PROCESSED_FOLDER'], filename, as_attachment=True)

# Create HTML template
with open('templates/index.html', 'w') as f:
    f.write('''
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Video to Sketchy Outline Converter</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            line-height: 1.6;
        }
        h1 {
            text-align: center;
            margin-bottom: 30px;
        }
        .upload-container {
            border: 2px dashed #ccc;
            padding: 20px;
            text-align: center;
            margin-bottom: 20px;
            cursor: pointer;
        }
        .upload-container:hover {
            background-color: #f9f9f9;
        }
        .hidden {
            display: none;
        }
        #statusContainer {
            margin-top: 20px;
            padding: 15px;
            background-color: #f0f0f0;
            border-radius: 5px;
        }
        progress {
            width: 100%;
            height: 20px;
            margin-top: 10px;
        }
        .param-container {
            margin-bottom: 15px;
        }
        .param-slider {
            width: 100%;
        }
    </style>
</head>
<body>
    <h1>Video to Sketchy Outline Converter</h1>
    
    <div class="upload-container" id="dropArea">
        <p>Drag and drop your video here or click to select</p>
        <input type="file" id="fileInput" accept=".mp4,.avi,.mov,.webm,.mkv" class="hidden">
    </div>
    
    <div class="param-container">
        <label for="edgeLow">Edge Detection Sensitivity (Low Threshold):</label>
        <input type="range" id="edgeLow" class="param-slider" min="10" max="100" value="50">
        <span id="edgeLowValue">50</span>
    </div>
    
    <div class="param-container">
        <label for="edgeHigh">Edge Detection Sensitivity (High Threshold):</label>
        <input type="range" id="edgeHigh" class="param-slider" min="100" max="300" value="150">
        <span id="edgeHighValue">150</span>
    </div>
    
    <div class="param-container">
        <label for="gridSpacing">Grid Spacing:</label>
        <input type="range" id="gridSpacing" class="param-slider" min="10" max="50" value="20">
        <span id="gridSpacingValue">20</span>
    </div>
    
    <div class="param-container">
        <label for="sketchFactor">Sketchiness Factor:</label>
        <input type="range" id="sketchFactor" class="param-slider" min="0.5" max="0.9" step="0.05" value="0.7">
        <span id="sketchFactorValue">0.7</span>
    </div>
    
    <button id="uploadButton" disabled>Upload and Process</button>
    
    <div id="statusContainer" class="hidden">
        <p id="statusMessage">Processing...</p>
        <progress id="progressBar" value="0" max="100"></progress>
        <div id="downloadContainer" class="hidden">
            <a id="downloadLink" href="#" class="button">Download Processed Video</a>
        </div>
    </div>

    <script>
        const dropArea = document.getElementById('dropArea');
        const fileInput = document.getElementById('fileInput');
        const uploadButton = document.getElementById('uploadButton');
        const statusContainer = document.getElementById('statusContainer');
        const statusMessage = document.getElementById('statusMessage');
        const progressBar = document.getElementById('progressBar');
        const downloadContainer = document.getElementById('downloadContainer');
        const downloadLink = document.getElementById('downloadLink');
        
        // Parameter sliders
        const edgeLow = document.getElementById('edgeLow');
        const edgeHigh = document.getElementById('edgeHigh');
        const gridSpacing = document.getElementById('gridSpacing');
        const sketchFactor = document.getElementById('sketchFactor');
        
        // Parameter value displays
        const edgeLowValue = document.getElementById('edgeLowValue');
        const edgeHighValue = document.getElementById('edgeHighValue');
        const gridSpacingValue = document.getElementById('gridSpacingValue');
        const sketchFactorValue = document.getElementById('sketchFactorValue');
        
        // Update displayed values when sliders change
        edgeLow.addEventListener('input', () => { edgeLowValue.textContent = edgeLow.value; });
        edgeHigh.addEventListener('input', () => { edgeHighValue.textContent = edgeHigh.value; });
        gridSpacing.addEventListener('input', () => { gridSpacingValue.textContent = gridSpacing.value; });
        sketchFactor.addEventListener('input', () => { sketchFactorValue.textContent = sketchFactor.value; });
        
        let selectedFile = null;
        
        // Handle file selection via click
        dropArea.addEventListener('click', () => {
            fileInput.click();
        });
        
        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                selectedFile = e.target.files[0];
                dropArea.innerHTML = `<p>Selected file: ${selectedFile.name}</p>`;
                uploadButton.disabled = false;
            }
        });
        
        // Handle drag and drop
        dropArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropArea.style.background = '#e9e9e9';
        });
        
        dropArea.addEventListener('dragleave', () => {
            dropArea.style.background = '';
        });
        
        dropArea.addEventListener('drop', (e) => {
            e.preventDefault();
            dropArea.style.background = '';
            
            if (e.dataTransfer.files.length > 0) {
                selectedFile = e.dataTransfer.files[0];
                
                // Check if file is a video
                if (!selectedFile.type.startsWith('video/')) {
                    alert('Please select a video file');
                    return;
                }
                
                dropArea.innerHTML = `<p>Selected file: ${selectedFile.name}</p>`;
                uploadButton.disabled = false;
            }
        });
        
        // Handle upload and processing
        uploadButton.addEventListener('click', async () => {
            if (!selectedFile) return;
            
            const formData = new FormData();
            formData.append('video', selectedFile);
            formData.append('edge_low', edgeLow.value);
            formData.append('edge_high', edgeHigh.value);
            formData.append('grid_spacing', gridSpacing.value);
            formData.append('sketch_factor', sketchFactor.value);
            
            try {
                statusContainer.classList.remove('hidden');
                statusMessage.textContent = 'Uploading...';
                
                const response = await fetch('/upload', {
                    method: 'POST',
                    body: formData
                });
                
                const result = await response.json();
                
                if (result.success) {
                    const jobId = result.job_id;
                    statusMessage.textContent = 'Processing video...';
                    
                    // Poll for status
                    const statusInterval = setInterval(async () => {
                        const statusResponse = await fetch(`/status/${jobId}`);
                        const statusResult = await statusResponse.json();
                        
                        if (statusResult.status === 'processing') {
                            progressBar.value = statusResult.progress;
                            statusMessage.textContent = `Processing: ${statusResult.progress}%`;
                        } 
                        else if (statusResult.status === 'completed') {
                            clearInterval(statusInterval);
                            statusMessage.textContent = 'Processing complete!';
                            progressBar.value = 100;
                            
                            downloadLink.href = `/download/${jobId}`;
                            downloadContainer.classList.remove('hidden');
                        }
                        else if (statusResult.status === 'error') {
                            clearInterval(statusInterval);
                            statusMessage.textContent = `Error: ${statusResult.message}`;
                        }
                    }, 1000);
                } else {
                    statusMessage.textContent = `Error: ${result.error}`;
                }
            } catch (error) {
                console.error('Error:', error);
                statusMessage.textContent = 'An error occurred during upload';
            }
        });
    </script>
</body>
</html>
    ''')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)