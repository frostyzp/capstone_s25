const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for all routes
app.use(cors());

// Parse JSON bodies
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/wishing_well', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Define Wish schema
const wishSchema = new mongoose.Schema({
    wish: String,
    skips: Number,
    date: { type: Date, default: Date.now }
});

const Wish = mongoose.model('Wish', wishSchema);

// API Routes
app.get('/api/wishes', async (req, res) => {
    try {
        const wishes = await Wish.find().sort({ date: -1 });
        res.json(wishes);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch wishes' });
    }
});

app.post('/api/wishes', async (req, res) => {
    try {
        const { wish } = req.body;
        const newWish = new Wish({
            wish,
            skips: Math.floor(Math.random() * 50) + 1
        });
        await newWish.save();
        res.status(201).json(newWish);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create wish' });
    }
});

// Serve static files from the wishing directory
app.use(express.static(path.join(__dirname, 'wishing')));

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 