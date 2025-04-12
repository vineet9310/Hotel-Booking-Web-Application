const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Room = require('../models/Room');
const auth = require('../middleware/auth');

router.post('/create', auth, async (req, res) => {
    try {
        const { roomId, checkIn, checkOut, guestName, guestEmail, guestPhone } = req.body;

        const room = await Room.findById(roomId);
        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }
        if (!room.available) {
            return res.status(400).json({ message: 'Room not available' });
        }

        const booking = new Booking({
            userId: req.user.id,
            roomId,
            dateFrom: new Date(checkIn),
            dateTo: new Date(checkOut),
            guestName,
            guestEmail,
            guestPhone
        });
        await booking.save();

        room.available -= 1;
        await room.save();

        res.status(201).json({ message: 'Booking created successfully', booking });
    } catch (error) {
        console.error('Booking creation error:', error);
        res.status(500).json({ message: 'Failed to create booking' });
    }
});

router.get('/my', auth, async (req, res) => {
    const bookings = await Booking.find({ userId: req.user.id }).populate('roomId');
    res.json(bookings);
});

router.post('/cancel/:id', auth, async (req, res) => {
    const booking = await Booking.findById(req.params.id);
    if (booking.userId.toString() !== req.user.id) return res.status(403).send("Unauthorized");

    booking.status = 'cancelled';
    await booking.save();

    const room = await Room.findById(booking.roomId);
    room.available += 1;
    await room.save();

    res.send("Booking cancelled");
});

module.exports = router;