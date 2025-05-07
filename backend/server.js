const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const TodoModel = require('./models/Todo');

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB using MONGO_URL from environment variable
const mongoUrl = process.env.MONGO_URL;
if (!mongoUrl) {
    console.error('❌ MONGO_URL not defined in environment variables');
    process.exit(1);
}

mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('✅ MongoDB connected successfully'))
    .catch((err) => {
        console.error('❌ MongoDB connection error:', err.message);
        process.exit(1);
    });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

// Routes
app.post('/add', (req, res) => {
    const { task } = req.body;
    TodoModel.create({ task })
        .then(result => res.json(result))
        .catch(err => res.status(500).json({ error: err.message }));
});

app.get('/get', (req, res) => {
    TodoModel.find().sort({ createdAt: -1 })
        .then(result => res.json(result))
        .catch(err => res.status(500).json({ error: err.message }));
});

app.put('/edit/:id', (req, res) => {
    const { id } = req.params;
    TodoModel.findByIdAndUpdate(id, { done: true }, { new: true })
        .then(result => res.json(result))
        .catch(err => res.status(500).json({ error: err.message }));
});

app.put('/update/:id', (req, res) => {
    const { id } = req.params;
    const { task } = req.body;
    TodoModel.findByIdAndUpdate(id, { task }, { new: true })
        .then(result => res.json(result))
        .catch(err => res.status(500).json({ error: err.message }));
});

app.delete('/delete/:id', (req, res) => {
    const { id } = req.params;
    TodoModel.findByIdAndDelete(id)
        .then(result => res.json({ message: 'Todo deleted', task: result }))
        .catch(err => res.status(500).json({ error: err.message }));
});

module.exports = app;

