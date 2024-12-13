import express from "express";
import {
    createEvent,
    getEventsByRestaurant,
    getAllEvents,
    rsvpToEvent,
    deleteEvent,
} from "../controllers/eventController.js";

const router = express.Router();

router.post("/", createEvent); // Create a new event
router.get("/", getAllEvents); // Get all events
router.get("/restaurant/:restaurantId", getEventsByRestaurant); // Get events by restaurant
router.post("/:eventId/rsvp", rsvpToEvent); // RSVP to an event
router.delete("/:eventId", deleteEvent); // Delete an event

export default router;
