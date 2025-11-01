// this is for registration for event
import { connection } from "../../config/dbconfig.js";
import { ObjectId } from "mongodb"
export const userRegistration = async (req, res) => {
  try {
    console.log("Incoming register request for:", req.params.id);

    const { id: eventId } = req.params;
    const userId = req.user._id;
    const { name, email, password } = req.body;

    const db = await connection();
    const eventsCollection = db.collection("events");
    const registrationsCollection = db.collection("registrations");

    const event = await eventsCollection.findOne({
      _id: new ObjectId(eventId),
    });
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
};

 // for user to see their all registered events
 export const myRegistration = async (req,res)=>{
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

    const eventIds = userRegs.map((r) => new ObjectId(r.eventId));

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
 }