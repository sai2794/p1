require("dotenv").config();
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors");

// MongoDB
var mongoose = require("mongoose");
mongoose.connect(process.env.MONGO_URL, {
  useUnifiedTopology: true,
  useNewUrlParser: true
});
var db = mongoose.connection;

// Express
var app = express();
app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Routes
app.use("/availability", require("./routes/availabilityRoute"));
app.use("/reserve", require("./routes/reservationRoute"));
// app.delete('/delete-reservation', async (req, res) => {
//   const { email, phone } = req.body;

//   try {
//     // Find and delete the reservation based on email, phone, and date
//     const deletedReservation = await Reservation.findOneAndDelete({
//       email,
//       phone,
//       date // Adjust this based on your schema structure for date comparison
//     });

//     if (!deletedReservation) {
//       return res.status(404).json({ message: 'Reservation not found' });
//     }

//     // Handle successful deletion
//     return res.status(200).json({ message: 'Reservation deleted successfully' });
//   } catch (error) {
//     console.error('Error deleting reservation:', error);
//     return res.status(500).json({ message: 'Internal server error' });
//   }
// });
// app.use('/delete-reservation', require('./routes/deleteReservationRoute'));
// app.delete('/deleteReservation', (req, res) => {
//   const { name, phone } = req.body;

//   Reservation.findOneAndDelete({ name, phone }, (err, deletedReservation) => {
//     if (err) {
//       return res.status(500).json({ error: 'Error deleting reservation' });
//     }
//     if (!deletedReservation) {
//       return res.status(404).json({ error: 'Reservation not found' });
//     }
//     return res.status(200).json({ message: 'Reservation deleted successfully' });
//   });
// });

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", _ => {
  console.log("Connected to DB");
});

module.exports = app;
