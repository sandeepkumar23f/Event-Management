import { connection } from "../../config/dbconfig.js";
import { ObjectId } from "mongodb"
export const userQuestionsById = async(req,res)=>{
    try{
        console.log("userQuestionById function called");
        const { id: eventId} = req.params;
        // const adminId  = req.user._id;
        const db = await connection();
        const eventsCollections = db.collection("events")
        const questionCollections = db.collection("questions");
        if(!ObjectId.isValid(eventId)){
            return res.status(400).json({
                success: false,
                message: "Event id is not valid"
            })
        }
        const event = await eventsCollections.findOne({
            _id: new ObjectId(eventId)
        });
        if(!event){
            return res.status(404).json({
                success: false,
                message: "Event not found"
            })
        }

        const questions = await questionCollections
        .find({ eventId: new ObjectId(eventId)})
        .project({ correctOption: 0}) // by this project i am hiding the correct option from the user
        .toArray();

        if(!questions || questions.length === 0){
            return res.status(200).json({
                success: true,
                message: "No question found for this event",
                questions: []
            })
        }

        return res.status(200).json({
            success: true,
            message: "Event Questions fetched successfully",
            questions,
        })
    }
    catch(error){
        res.status(500).json({
            success: false,
            message: "Server error please try again later"
        })
    }
}