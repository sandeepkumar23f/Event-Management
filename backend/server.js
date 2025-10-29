import express from "express";
import { ObjectId } from "mongodb";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { connection } from "./dbconfig.js";
dotenv.config();
const app = express();
const port = 5000;
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// Admin signup
app.post("/admin-signup", async (req, res) => {
  const adminData = req.body;
  if (adminData.email && adminData.password) {
    const db = await connection();
    const collection = await db.collection("admins");
    const result = await collection.insertOne(adminData);
    if (result.acknowledged) {
      const tokenData = {
        _id: result.insertedId.toString(),
        email: adminData.email,
      };

      jwt.sign(tokenData, "Google", { expiresIn: "5d" }, (error, token) => {
        if (error)
          return res.status(500).send({ success: false, message: "JWT error" });

        res.cookie("token", token, {
          httpOnly: true,
          sameSite: "lax",
          secure: false,
          expires: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        });

        res.send({ success: true, message: "Admin Signup done" });
      });
    }
  }
});

// User signup
app.post("/user-signup", async (req, res) => {
  const userData = req.body;
  if (userData.email && userData.password) {
    const db = await connection();
    const collection = await db.collection("users");
    const result = await collection.insertOne(userData);
    if (result.acknowledged) {
      const tokenData = {
        _id: result.insertedId.toString(),
        email: userData.email,
      };

      jwt.sign(tokenData, "Google", { expiresIn: "5d" }, (error, token) => {
        if (error)
          return res.status(500).send({ success: false, message: "JWT error" });

        res.cookie("token", token, {
          httpOnly: true,
          sameSite: "lax",
          secure: false,
          expires: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        });

        res.send({ success: true, message: "User Signup done" });
      });
    }
  }
});

// Admin Login
app.post("/admin-login", async (req, res) => {
  const adminData = req.body;
  if (adminData.email && adminData.password) {
    const db = await connection();
    const collection = await db.collection("admins");
    const result = await collection.findOne({
      email: adminData.email,
      password: adminData.password,
    });
    if (result) {
      const tokenData = { _id: result._id.toString(), email: result.email };
      jwt.sign(tokenData, "Google", { expiresIn: "5d" }, (error, token) => {
        if (error)
          return res
            .status(500)
            .send({ success: false, message: "Jwt eerror" });
        res.cookie("token", token, {
          httpOnly: true,
          sameSite: "lax",
          secure: false,
          expiresIn: 5 * 24 * 60 * 60 * 1000,
        });
        res.send({ success: true, message: "Admin Login Done" });
      });
    } else {
      res.send({
        success: false,
        message: "Admin login failed",
      });
    }
  }
});

// User Login
app.post("/user-login", async (req, res) => {
  const userData = req.body;
  if (userData.email && userData.password) {
    const db = await connection();
    const collection = await db.collection("users");
    const result = await collection.findOne({
      email: userData.email,
      password: userData.password,
    });
    if (result) {
      const tokenData = { _id: result._id.toString(), email: result.email };
      jwt.sign(tokenData, "Google", { expiresIn: "5d" }, (error, token) => {
        if (error)
          return res
            .status(500)
            .send({ success: false, message: "User Login failed" });
        res.cookie("token", token, {
          httpOnly: true,
          secure: false,
          sameSite: "lax",
          expires: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        });
        res
          .status(200)
          .send({ success: true, message: "User Login Successfully done" });
      });
    } else {
      res.send({
        success: false,
        message: "User login failed",
      });
    }
  }
});

// Admin dashboard mcq section
app.post("/add-question/:eventId", verifyJWTToken, async (req, res) => {
  try {
    const { description, options, correctOption } = req.body;
    const { eventId } = req.params;

    if (
      !description?.trim() ||
      !Array.isArray(options) ||
      options.length !== 4
    ) {
      return res.status(400).json({
        success: false,
        message: "Question description and exactly four options are required",
      });
    }

    if (!correctOption?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Correct option is required",
      });
    }

    const cleanOptions = options
      .map((opt) => opt.trim())
      .filter((opt) => opt !== "");
    if (cleanOptions.length !== 4) {
      return res.status(400).json({
        success: false,
        message: "Please provide four valid non-empty options",
      });
    }

    const validLabels = ["A", "B", "C", "D"];
    const isValidCorrectOption =
      validLabels.includes(correctOption.toUpperCase()) ||
      cleanOptions.includes(correctOption);

    if (!isValidCorrectOption) {
      return res.status(400).json({
        success: false,
        message:
          "Correct option must be one of A, B, C, or D (or match an option text)",
      });
    }

    const qn = {
      description: description.trim(),
      options: cleanOptions,
      correctOption: correctOption.trim().toUpperCase(),
      userId: new ObjectId(req.user._id),
      eventId: new ObjectId(eventId),
      createdAt: new Date(),
    };

    const db = await connection();
    const collection = db.collection("questions");
    const result = await collection.insertOne(qn);

    if (result.acknowledged) {
      return res.status(200).json({
        success: true,
        message: "Question added successfully",
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Error adding question",
      });
    }
  } catch (error) {
    console.error("Error adding question:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while adding question",
    });
  }
});

app.get("/questions/:eventId", verifyJWTToken, async (req, res) => {
  try {
    const db = await connection();
    const collection = await db.collection("questions");
    const { eventId } = req.params;

    const questions = await collection
      .find({
        userId: new ObjectId(req.user._id),
        eventId: new ObjectId(eventId),
      })
      .toArray();

    res.status(200).json({
      success: true,
      message: "Questions fetched successfully",
      questions,
    });
  } catch (err) {
    console.error("Error fetching questions:", err);
    res.status(500).json({
      success: false,
      message: "Server error while fetching questions",
      error: err.message,
    });
  }
});

app.get("/question/:id", verifyJWTToken, async (req, res) => {
  try {
    const db = await connection();
    const collection = db.collection("questions");
    const { id } = req.params;

    const question = await collection.findOne({
      _id: new ObjectId(id),
      userId: new ObjectId(req.user._id),
    });

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Question fetched successfully",
      question,
    });
  } catch (err) {
    console.error("Error fetching question:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
});

app.put("/update-question/:questionId", verifyJWTToken, async (req, res) => {
  try {
    const db = await connection();
    const collection = db.collection("questions");
    const { questionId } = req.params;
    const { description, options, correctOption, eventId } = req.body;

    const result = await collection.updateOne(
      {
        _id: new ObjectId(questionId),
        userId: new ObjectId(req.user._id),
        eventId: new ObjectId(eventId),
      },
      { $set: { description, options, correctOption } }
    );

    if (result.modifiedCount > 0) {
      res.status(200).json({
        success: true,
        message: "Question updated successfully",
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Question not found or no changes made",
      });
    }
  } catch (error) {
    console.error("Error updating question:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});

app.delete("/delete/:id/:eventId", verifyJWTToken, async (req, res) => {
  try {
    const db = await connection();
    const collection = await db.collection("questions");
    const { id, eventId } = req.params;

    const result = await collection.deleteOne({
      _id: new ObjectId(id),
      userId: new ObjectId(req.user._id),
      eventId: new ObjectId(eventId),
    });

    if (result.deletedCount > 0) {
      res.status(200).send({
        success: true,
        message: "Question deleted successfully",
      });
    } else {
      res.status(404).send({
        success: false,
        message: "Question not found",
      });
    }
  } catch (error) {
    console.error("Error deleting Question: ", error.message);
    res.status(500).send({
      success: false,
      message: "Server error please try again later",
    });
  }
});

// create mcq event
app.post("/create-mcq-event", verifyJWTToken, async (req, res) => {
  try {
    const { name, description, date, capacity } = req.body;
    if (!name || !description || !date || !capacity) {
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
      capacity: parseInt(capacity),
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
});
// get mcq events
app.get("/events", verifyJWTToken, async (req, res) => {
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
});
// events
app.get("/events/:id", verifyJWTToken, async (req, res) => {
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
});
// update event data
app.put("/update-event/:id", verifyJWTToken, async (req, res) => {
  try {
    const db = await connection();
    const collection = db.collection("events");
    const { id } = req.params;
    const { name, description, date, capacity } = req.body;

    const updateFields = {};
    if (name) updateFields.name = name;
    if (description) updateFields.description = description;
    if (date) updateFields.date = new Date(date);
    if (capacity) updateFields.capacity = parseInt(capacity);

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
});
// delete event
app.delete("/delete-event/:id", verifyJWTToken, async (req, res) => {
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
});

// user routes
app.get("/explore-events", async (req, res) => {
  try {
    const db = await connection();
    const collection = db.collection("events");

    const currentDate = new Date();

    // Fetch upcoming events, sorted by date
    const events = await collection
      .find({ date: { $gte: currentDate } })
      .sort({ date: 1 })
      .toArray();

    if (events.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No upcoming events found.",
      });
    }

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
      error: error.message,
    });
  }
});

// check user for already registered events || explore events by userId
app.get("/explore-events/:id", verifyJWTToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const db = await connection();
    const eventsCollection = db.collection("events");

    const event = await eventsCollection.findOne({ _id: new ObjectId(id) });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    const alreadyRegistered = event.participants?.some(
      (p) => p.userId.toString() === userId
    );

    res.status(200).json({
      success: true,
      event,
      alreadyRegistered,
    });
  } catch (error) {
    console.error("Error fetching event:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching event",
    });
  }
});


// register for event route
app.post("/register-event/:id", verifyJWTToken, async (req, res) => {
  try {
    console.log("Incoming register request for:", req.params.id);

    const { id: eventId } = req.params;
    const userId = req.user._id;
    const { name, email, password } = req.body;

    const db = await connection();
    const eventsCollection = db.collection("events");
    const registrationsCollection = db.collection("registrations");

    const event = await eventsCollection.findOne({ _id: new ObjectId(eventId) });
    if (!event)
      return res
        .status(404)
        .json({ success: false, message: "Event not found" });

    const alreadyRegistered = await registrationsCollection.findOne({
      eventId: new ObjectId(eventId),
      userId: new ObjectId(userId),
    });
    if (alreadyRegistered)
      return res
        .status(400)
        .json({ success: false, message: "Already registered for this event" });

    const registrationCount = await registrationsCollection.countDocuments({
      eventId: new ObjectId(eventId),
    });
    if (registrationCount >= event.capacity)
      return res
        .status(400)
        .json({ success: false, message: "Event is full" });

    const newRegistration = {
      eventId: new ObjectId(eventId),
      userId: new ObjectId(userId),
      name,
      email,
      password,
      registeredAt: new Date(),
    };

    const result = await registrationsCollection.insertOne(newRegistration);

    if (result.acknowledged) {
      res.status(200).json({
        success: true,
        message: "Registered successfully!",
      });
    } else {
      res
        .status(500)
        .json({ success: false, message: "Event registration failed" });
    }
  } catch (error) {
    console.error("Error registering event:", error);
    res.status(500).json({
      success: false,
      message: "Server error, please try again later",
    });
  }
});

// for admin so that admin can see the the user who have been registered for that event
app.get("/event-registrations/:id", verifyJWTToken, async(req,res)=>{
  try{
    const { id: eventId} = req.params;
    const adminId = req.user._id;
    const db = await connection();
    const eventsCollection = db.collection("events");
    const registrationsCollection = db.collection("registrations");

    const event = await eventsCollection.findOne({
      _id: new ObjectId(eventId),
      
    });

    if(!event)
      return res.status(403).json({
    success: false,
    message: "You are not authorized to view this event’s registrations"
    });

    const registrations = await registrationsCollection
    .find({eventId: new ObjectId(eventId)})
    .toArray();

    res.status(200).json({
      success: true,
      count: registrations.length,
      registrations
    });
  }
  catch(error){
    console.error("Error fetching event registrations: ", error.message);
    res.status(500).json({
      success: false,
      message: "Server error please try again later"
    })
  }
})

// for admin if admin clicks on start then contest will start
app.post("/start-event/:id", verifyJWTToken, async (req, res) => {
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
});
 // for user to see their all registered events
 app.get("/my-registrations", verifyJWTToken, async (req, res) => {
  try {
    const db = await connection();
    const registrations = db.collection("registrations");
    const events = db.collection("events");

    const userId = new ObjectId(req.user._id); 
    // Fetch all registrations for the logged-in user
    const userRegs = await registrations.find({ userId }).toArray();

    if (userRegs.length === 0) {
      return res.json({ success: true, events: [] });
    }

    // Extract all eventIds
    const eventIds = userRegs.map((r) => new ObjectId(r.eventId));

    // Fetch those events
    const registeredEvents = await events
      .find({ _id: { $in: eventIds } })
      .toArray();

    console.log(` Found ${registeredEvents.length} registered events for user ${userId}`);

    res.json({ success: true, events: registeredEvents });
  } catch (error) {
    console.error("Error fetching registered events:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching registered events",
    });
  }
});



function verifyJWTToken(req, res, next) {
  console.log("Cookies received:", req.cookies);

  // First try cookie
  let token = req.cookies?.token;

  // If not found, try Authorization header
  if (!token && req.headers.authorization) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: "No token found" });
  }

  jwt.verify(token, "Google", (error, decoded) => {
    if (error) {
      return res.status(403).json({ success: false, message: "Invalid token" });
    }

    req.user = decoded;
    next();
  });
}

app.listen(port, (req, res) => {
  console.log(`app is listening on port ${port}`);
});
