const express = require("express");
const ReservationsController = require("../controllers/ReservationsController");

const route = express.Router();

route.post("/", ReservationsController.createReservation);

route.get("/", ReservationsController.getAllReservations);

route.put("/:id", ReservationsController.updateReservationStatus);

route.delete("/:id", ReservationsController.deleteReservationById);

module.exports = route;