import { connection } from "../../config/dbconfig.js";
import { ObjectId } from "mongodb";

export const submitQuiz = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { answers } = req.body;
    const userId = req.user._id;

    const db = await connection();
    const questionCollections = db.collection("questions");
    const submissionsCollections = db.collection("submissions");
    const usersCollection = db.collection("users");

    // find user
    const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
    const userName = user?.name || "Anonymous";
    const email = user?.email || "No Email";

    // check already submitted
    const existingSubmission = await submissionsCollections.findOne({
      eventId: new ObjectId(eventId),
      userId: new ObjectId(userId),
    });

    if (existingSubmission) {
      return res.status(400).json({
        success: false,
        message: "You have already submitted this quiz",
      });
    }

    // fetch questions for that event
    const questions = await questionCollections
      .find({ eventId: new ObjectId(eventId) })
      .toArray();

    if (!questions || questions.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No questions found for this event",
      });
    }

    let score = 0;

    questions.forEach((q) => {
  const qid = q._id.toString();
  const userAnswer = answers[qid]?.trim().toUpperCase();
  const correctIndex = q.correctOption?.toUpperCase().charCodeAt(0) - 65;
  const correctText = q.options[correctIndex]?.trim().toUpperCase();

  console.log("QUESTION:", q.description);
  console.log("USER ANSWER:", userAnswer);
  console.log("CORRECT TEXT:", correctText);

  if (userAnswer && userAnswer === correctText) score++;
});


    await submissionsCollections.insertOne({
      userId: new ObjectId(userId),
      userName,
      email,
      eventId: new ObjectId(eventId),
      score,
      total: questions.length,
      answers,
      createdAt: new Date(),
    });

    res.status(200).json({
      success: true,
      message: "Quiz submitted successfully",
      score,
      total: questions.length,
    });
  } catch (err) {
    console.error("Error submitting quiz:", err.message);
    res.status(500).json({
      success: false,
      message: "Server error, please try again later",
    });
  }
};




export const checkSubmission = async(req,res)=>{
    try{
        const { eventId } = req.params;
        const  userId  = req.user._id;
        
        const db = await connection();
        const submissionsCollections = db.collection("submissions");

        const existing = await submissionsCollections.findOne({
            eventId: new ObjectId(eventId),
            userId: new ObjectId(userId)
        });

        if(existing){
            return res.status(200).json({
                submitted: true,
                success: true,
            })
        }
        res.status(200).json({
            success: true,
            submitted: false,
        })
    }
    catch(err){
        console.error("Error checking submissions: ",err.message);
        res.status(500).json({
            success: false,
            message: "Server error"
        })
    }
}