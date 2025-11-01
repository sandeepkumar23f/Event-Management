import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { ObjectId } from "mongodb";
import { connection } from "../../config/dbconfig.js";

// user signup
export const userSignup = async (req, res) => {
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
};

export const userLogin = async (req, res) => {
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
};
