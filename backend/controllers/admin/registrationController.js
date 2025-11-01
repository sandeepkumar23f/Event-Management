import { connection } from "../../config/dbconfig.js";
import { ObjectId } from "mongodb";

export const viewRegistration = async (req, res) => {
  try {
    const { id: eventId } = req.params;
    const adminId = req.user._id;
    const db = await connection();
    const eventsCollection = db.collection("events");
    const registrationsCollection = db.collection("registrations");

    if (!ObjectId.isValid(eventId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid event ID format",
      });
    }

    const event = await eventsCollection.findOne({ _id: new ObjectId(eventId) });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    if (event.userId && event.userId.toString() !== adminId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to view this event’s registrations",
      });
    }

    const registrations = await registrationsCollection
      .find({ eventId: new ObjectId(eventId) })
      .toArray();

    res.status(200).json({
      success: true,
      count: registrations.length,
      eventName: event.eventName || event.title || "Event",
      registrations,
    });
  } catch (error) {
    console.error("Error fetching event registrations:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error please try again later",
    });
  }
};
