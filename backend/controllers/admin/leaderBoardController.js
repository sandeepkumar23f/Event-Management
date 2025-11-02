import { connection } from "../../config/dbconfig.js";
import { ObjectId } from "mongodb";

export const leaderBoard = async (req, res) => {
  try {
    const { id: eventId } = req.params;
    const db = await connection();
    const eventsCollections = db.collection("events");
    const submissionsCollections = db.collection("submissions");

    if (!ObjectId.isValid(eventId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Event ID",
      });
    }

    const event = await eventsCollections.findOne({
      _id: new ObjectId(eventId),
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    //  Fetch submissions for the event and sort by score (descending)
    const submissions = await submissionsCollections
      .find({ eventId: new ObjectId(eventId) })
      .sort({ score: -1 })
      .toArray();

    res.status(200).json({
      success: true,
      count: submissions.length,
      eventName: event.eventname || event.title || "Event",
      leaderboard: submissions.map((sub, index) => ({
        rank: index + 1,
        userName: sub.userName || "Anonymous",
        score: sub.score,
        submittedAt: sub.createdAt,
      })),
    });
  } catch (err) {
    console.error("Error fetching event submissions:", err.message);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};
