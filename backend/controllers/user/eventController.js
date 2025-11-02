import { connection } from "../../config/dbconfig.js";
import { ObjectId } from 'mongodb'; // Make sure this import is correct

export const eventUser = async (req, res) => {
  try {
    console.log("eventUser function called");
    const db = await connection();
    const collection = db.collection("events");

    const currentDate = new Date();

    // Fetch upcoming events, sorted by date
    const events = await collection
      .find({ date: { $gte: currentDate } })
      .sort({ date: 1 })
      .toArray();

    console.log(`Found ${events.length} events`);

    // Return empty array instead of 404 for better UX
    res.status(200).json({
      success: true,
      message: "Events fetched successfully",
      events: events || [],
    });
  } catch (error) {
    console.error("Error in eventUser:", error);
    res.status(500).json({
      success: false,
      message: "Server error, please try again later",
      error: error.message,
    });
  }
}

// check user for already registered events || explore events by userId
export const exploreEventById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id; 

    console.log("Event ID:", id);
    console.log("User ID from token:", userId);

    if (!id || !ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid event ID format",
      });
    }

    const db = await connection();
    const eventsCollection = db.collection("events");

    const event = await eventsCollection.findOne({ 
      _id: new ObjectId(id) 
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    const alreadyRegistered = event.participants?.some(
      (p) => p.userId && p.userId.toString() === userId.toString()
    );

    res.status(200).json({
      success: true,
      event,
      alreadyRegistered,
    });
  } catch (error) {
    console.error("Error in exploreEventById:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching event",
      error: error.message,
    });
  }
}