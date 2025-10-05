const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const jwt = require('jsonwebtoken');

// Middleware to verify JWT
const auth = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};

// Create Task
router.post('/', auth, async (req, res) => {
    try {
        const task = new Task({ ...req.body, createdBy: req.user.id });
        await task.save();
        res.status(201).json(task);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get All Tasks
router.get('/', auth, async (req, res) => {
    try {
        const tasks = await Task.find().populate('assignedTo', 'name email role');
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update Task
router.put('/:id', auth, async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(task);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Delete Task
router.delete('/:id', auth, async (req, res) => {
    try {
        await Task.findByIdAndDelete(req.params.id);
        res.json({ message: 'Task deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
