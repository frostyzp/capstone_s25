const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/wishing_well', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Wish Schema
const wishSchema = new mongoose.Schema({
    wish: String,
    skips: { type: Number, default: 0 },
    date: { type: Date, default: Date.now }
});

const Wish = mongoose.model('Wish', wishSchema);

// Routes
app.post('/api/wishes', async (req, res) => {
    try {
        const newWish = new Wish({
            wish: req.body.wish,
            skips: Math.floor(Math.random() * 50) + 1
        });
        await newWish.save();
        res.json(newWish);
    } catch (error) {
        res.status(500).json({ error: 'Failed to save wish' });
    }
});

app.get('/api/wishes', async (req, res) => {
    try {
        const wishes = await Wish.find().sort({ date: -1 });
        res.json(wishes);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch wishes' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 