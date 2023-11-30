// deleteReservationRoute.js

const express = require('express');
const router = express.Router();
const Reservation = require("../models/reservation"); // Import Reservation model

// DELETE request to delete a reservation based on email and phone
router.delete('/', async (req, res) => {
  const { email, phone } = req.body;

  try {
    // Find and delete the reservation based on email and phone
    const deletedReservation = await Reservation.findOneAndDelete({ email, phone });

    if (!deletedReservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    // Handle successful deletion
    return res.status(200).json({ message: 'Reservation deleted successfully' });
  } catch (error) {
    console.error('Error deleting reservation:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
