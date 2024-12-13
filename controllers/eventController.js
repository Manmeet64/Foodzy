import eventModel from "../models/eventModel.js";
import { v4 as uuidv4 } from "uuid";

//create an event for a restaurant
export const createEvent = async (req, res) => {
    try {
        let event = req.body;
        let eventId = uuidv4();
        event.eventId = eventId;

        let newEvent = await eventModel.create(event);
        res.status(201).json({
            success: true,
            message: "Event created successfully",
            event: newEvent,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error creating event",
            error: error.message,
        });
    }
};
//get events by a restaurant
export const getEventsByRestaurant = async (req, res) => {
    try {
        const { restaurantId } = req.params;

        const events = await eventModel.find({ restaurantId });

        res.status(200).json({
            success: true,
            events,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error fetching events for restaurant",
            error: error.message,
        });
    }
};

//get all the events
export const getAllEvents = async (req, res) => {
    try {
        const events = await eventModel.find();

        res.status(200).json({
            success: true,
            events,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error fetching all events",
            error: error.message,
        });
    }
};
//For users to RSVP to attend an event.

export const rsvpToEvent = async (req, res) => {
    try {
        const { eventId } = req.params;
        const { userId } = req.body;

        const event = await eventModel.findOne({ eventId });
        if (!event) {
            return res.status(404).json({
                success: false,
                message: "Event not found",
            });
        }

        // Check if user has already RSVP'd
        const isAlreadyAttending = event.attendees.some(
            (attendee) => attendee.userId === userId
        );
        if (isAlreadyAttending) {
            return res.status(400).json({
                success: false,
                message: "User has already RSVP'd to this event",
            });
        }

        // Add the user to attendees
        event.attendees.push({ userId });

        await event.save();

        res.status(200).json({
            success: true,
            message: "RSVP successful",
            event,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error RSVPing to event",
            error: error.message,
        });
    }
};
//For restaurant owners/admins to delete events.
export const deleteEvent = async (req, res) => {
    try {
        const { eventId } = req.params;

        const event = await eventModel.findOneAndDelete({ eventId });
        if (!event) {
            return res.status(404).json({
                success: false,
                message: "Event not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Event deleted successfully",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error deleting event",
            error: error.message,
        });
    }
};
