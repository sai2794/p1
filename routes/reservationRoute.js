var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");

const Day = require("../models/day").model;
const Reservation = require("../models/reservation").model;

// Parameters:
// {
//   "date": String ("Dec 02 2019 06:00"),
//   "table": table id,
// 	"name": String,
// 	"phone": String,
// 	"email": String
// }

router.post("/", function(req, res, next) {
  Day.find({ date: req.body.date }, (err, days) => {
    if (!err) {
      if (days.length > 0) {
        let day = days[0];
        day.tables.forEach(table => {
          if (table._id == req.body.table) {
            // The correct table is table
            table.reservation = new Reservation({
              name: req.body.name,
              phone: req.body.phone,
              email: req.body.email
            });
            table.isAvailable = false;
            day.save(err => {
              if (err) {
                console.log(err);
              } else {
                console.log("Reserved");
                res.status(200).send("Added Reservation");
              }
            });
          }
        });
      } else {
        console.log("Day not found");
      }
    }
  });
});
router.delete("/", function(req, res, next) {
  const { date, table, name, phone } = req.body;

  Day.findOne({ date: date }, (err, day) => {
    if (!err && day) {
      const tableToUpdate = day.tables.find(t => t._id == table);

      if (tableToUpdate) {
        const reservationToDelete = tableToUpdate.reservation;

        if (
          reservationToDelete &&
          reservationToDelete.name === name &&
          reservationToDelete.phone === phone
        ) {
          tableToUpdate.reservation = null;
          tableToUpdate.isAvailable = true;

          day.save(err => {
            if (err) {
              console.log(err);
              res.status(500).send("Error: Could not delete reservation");
            } else {
              console.log("Reservation deleted");
              res.status(200).send("Deleted Reservation");
            }
          });
        } else {
          res.status(404).send("Reservation not found");
        }
      } else {
        res.status(404).send("Table not found");
      }
    } else {
      console.log("Error fetching day or day not found");
      res.status(500).send("Error: Could not find day or day not found");
    }
  });
});

module.exports = router;
