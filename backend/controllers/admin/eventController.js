import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { ObjectId } from "mongodb";
import { connection } from "../../config/dbconfig.js";

export const createMcqEvent = async (req, res) => {
  try {
    const { name, description, date, location,duration } = req.body;
    if (!name || !description || !date || !location || !duration) {
      res.status(400).send({
        success: false,
        message: "All fields are required",
      });
    }
    const db = await connection();
    const collection = await db.collection("events");
    const mcq = {
      name,
      description,
      date: new Date(date),
      location,
      duration,
      createdBy: new ObjectId(req.user._id),
      createdAt: new Date(),
    };
    const result = await collection.insertOne(mcq);
    if (result.acknowledged) {
      return res.status(200).json({
        success: true,
        message: "Event added successfully",
        result,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Error adding Event",
      });
    }
  } catch (error) {
    console.error("Error adding Event", error.message);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const events = async (req, res) => {
  try {
    const db = await connection();
    const collection = db.collection("events");
    const currentDate = new Date();
    const events = await collection
      .find({
        createdBy: new ObjectId(req.user._id),
        date: { $gte: currentDate },
      })
      .sort({ date: 1 })
      .toArray();

    res.status(200).json({
      success: true,
      message: "Events fetched successfully",
      events,
    });
  } catch (error) {
    console.error("Error fetching events:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error, please try again later",
    });
  }
};

// get events by admin id
export const eventsById = async (req, res) => {
  try {
    const db = await connection();
    const collection = await db.collection("events");
    const { id } = req.params;
    const event = await collection.findOne({
      _id: new ObjectId(id),
      createdBy: new ObjectId(req.user._id),
    });
    if (!event) {
      return res.status(400).json({
        success: false,
        message: "Event not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Event fetched successfully",
      event,
    });
  } catch (error) {
    console.error("Error fetching Event", error.message);
    res.status(500).json({
      success: false,
      message: "Server error please try again later ",
    });
  }
};

// update event by admin id
export const updateEventById = async (req, res) => {
  try {
    const db = await connection();
    const collection = db.collection("events");
    const { id } = req.params;
    const { name, description, date, location, duration } = req.body; //  added location (missing before)

    const updateFields = {};
    if (name) updateFields.name = name.trim();
    if (description) updateFields.description = description.trim();
    if (date) updateFields.date = new Date(date);
    if (location) updateFields.location = location.trim();
    if (duration) updateFields.duration = parseInt(duration);

    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No fields provided for update",
      });
    }

    const result = await collection.updateOne(
      { _id: new ObjectId(id), createdBy: new ObjectId(req.user._id) },
      { $set: updateFields }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Event not found or unauthorized",
      });
    }

    if (result.modifiedCount > 0) {
      return res.status(200).json({
        success: true,
        message: "Event updated successfully",
      });
    } else {
      return res.status(200).json({
        success: true,
        message: "No changes detected",
      });
    }
  } catch (error) {
    console.error("Error updating event:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error, please try again later",
    });
  }
};


// delete event by admin id
export const deleteEventById = async (req, res) => {
  try {
    const db = await connection();
    const collection = db.collection("events");
    const { id } = req.params;

    console.log("Deleting event ID:", id, "User ID:", req.user._id);

    const result = await collection.deleteOne({
      _id: new ObjectId(id),
      createdBy: new ObjectId(req.user._id),
    });

    if (result.deletedCount > 0) {
      return res.status(200).json({
        success: true,
        message: "Event deleted successfully",
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Event not found or you are not authorized",
      });
    }
  } catch (error) {
    console.error("Error deleting event:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error, please try again later",
    });
  }
};

let activeContests = {};

export const startContest = async (req, res) => {
  try {
    const { id } = req.params;
    const db = await connection();
    const eventsCollection = db.collection("events");

    const event = await eventsCollection.findOne({ _id: new ObjectId(id) });
    if (!event) {
      return res.status(404).json({
        success: false,
        message: "No event found",
      });
    }

    // Check if already started
    if (event.isStarted || activeContests[id]?.started) {
      return res.json({
        success: false,
        message: "Event already started",
      });
    }

    const duration = parseInt(event.duration, 10) * 60 * 1000;
    const startTime = Date.now();
    const endTime = startTime + duration;

    // Save in memory for immediate use
    activeContests[id] = { started: true, startTime, duration };

    // 🔹 Persist in MongoDB
    await eventsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { isStarted: true, startTime, endTime } }
    );

    // 🔹 Auto end after duration
    setTimeout(async () => {
      if (activeContests[id]) {
        activeContests[id].started = false;
        delete activeContests[id];

        await eventsCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: { isStarted: false } }
        );

        console.log(`Contest ${id} ended automatically after ${event.duration} minutes`);
      }
    }, duration);

    return res.json({
      success: true,
      message: `Contest started for ${event.duration} minutes`,
      startTime,
      duration,
    });
  } catch (error) {
    console.error("Error starting contest:", error);
    return res.status(500).json({
      success: false,
      message: "Server error, please try again later",
    });
  }
};

export const contestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const db = await connection();
    const event = await db.collection("events").findOne({ _id: new ObjectId(id) });

    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    const { isStarted, startTime, endTime, duration } = event;
    res.json({
      success: true,
      isStarted: isStarted || false,
      startTime: startTime || null,
      endTime: endTime || null,
      duration: duration || 0,
    });
  } catch (error) {
    console.error("Error fetching contest status:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
