// this is for admin to add the question for their specific event
import { connection } from "../../config/dbconfig.js";
import { ObjectId } from "mongodb"
export const addQuestion = async (req, res) => {
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
};
//
export const questionsEvent = async (req, res) => {
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
};

//
export const questionsEventId = async (req, res) => {
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
};

export const updateQuestionEventId = async (req, res) => {
  try {
    const db = await connection();
    const collection = db.collection("questions");
    const { id } = req.params; // Changed from questionId to id
    const { description, options, correctOption, eventId } = req.body;

    console.log('Update question called with:', {
      questionId: id,
      eventId,
      userId: req.user._id,
      description,
      options,
      correctOption
    });

    // Validate required fields
    if (!description?.trim() || !Array.isArray(options) || options.length !== 4) {
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

    // Clean and validate options
    const cleanOptions = options
      .map((opt) => opt.trim())
      .filter((opt) => opt !== "");
    if (cleanOptions.length !== 4) {
      return res.status(400).json({
        success: false,
        message: "Please provide four valid non-empty options",
      });
    }

    // Validate correct option
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

    const result = await collection.updateOne(
      {
        _id: new ObjectId(id), // Now using id instead of questionId
        userId: new ObjectId(req.user._id),
        eventId: new ObjectId(eventId),
      },
      { 
        $set: { 
          description: description.trim(),
          options: cleanOptions,
          correctOption: correctOption.trim().toUpperCase(),
          updatedAt: new Date()
        } 
      }
    );

    console.log('Update result:', result);

    if (result.modifiedCount > 0) {
      res.status(200).json({
        success: true,
        message: "Question updated successfully",
      });
    } else {
      // Check if question exists to provide better error message
      const existingQuestion = await collection.findOne({
        _id: new ObjectId(id),
        userId: new ObjectId(req.user._id),
        eventId: new ObjectId(eventId),
      });

      if (existingQuestion) {
        res.status(200).json({
          success: true,
          message: "No changes made to the question",
        });
      } else {
        res.status(404).json({
          success: false,
          message: "Question not found",
        });
      }
    }
  } catch (error) {
    console.error("Error updating question:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
export const deleteQuestionEventId = async (req, res) => {
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
};
