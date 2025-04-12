const express = require('express');
const router = express.Router();
const Room = require('../models/Room');
const auth = require('../middleware/auth');

router.post('/add', auth, async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).send('Only admin can add rooms');
    const room = new Room(req.body);
    await room.save();
    res.send('Room added');
});

router.get('/', async (req, res) => {
    const rooms = await Room.find();
    res.json(rooms);
});

module.exports = router;