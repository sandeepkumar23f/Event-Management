import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { ObjectId } from "mongodb";
import { connection } from "../../config/dbconfig.js";

export const createMcqEvent = async (req, res) => {
  try {
    const { name, description, date, location } = req.body;
    if (!name || !description || !date || !location) {
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
    const { name, description, date } = req.body;

    const updateFields = {};
    if (name) updateFields.name = name;
    if (description) updateFields.description = description;
    if (date) updateFields.date = new Date(date);
    if (location) updateFields.location = location;

    const result = await collection.updateOne(
      { _id: new ObjectId(id), createdBy: new ObjectId(req.user._id) },
      { $set: updateFields }
    );

    if (result.modifiedCount > 0) {
      res.status(200).json({
        success: true,
        message: "Event updated successfully",
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Event not found or no changes made",
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

// for admin if admin clicks on start then contest will start
export const startEvent = async(req,res)=>{
    try {
    const { id } = req.params;
    const adminId = req.user._id;

    const db = await connection();
    const eventsCollection = db.collection("events");

    const event = await eventsCollection.findOne({
      _id: new ObjectId(id),
      createdBy: new ObjectId(adminId),
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found or unauthorized",
      });
    }

    await eventsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { status: "started" } }
    );

    res.status(200).json({
      success: true,
      message: "Your event started successfully",
    });
  } catch (error) {
    console.error("Error starting event:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
}
