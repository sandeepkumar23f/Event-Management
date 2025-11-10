import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { ObjectId } from "mongodb";
import { connection } from "../../config/dbconfig.js";

// function of admin login
const SECRET_KEY = process.env.JWT_SECRET;
export const adminSignUp = async (req, res) => {
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

      jwt.sign(tokenData, SECRET_KEY, { expiresIn: "5d" }, (error, token) => {
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
};

// // function of admin signup
export const adminLogin = async (req, res) => {
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
      jwt.sign(tokenData, SECRET_KEY, { expiresIn: "5d" }, (error, token) => {
        if (error)
          return res
            .status(500)
            .send({ success: false, message: "Jwt eerror" });
        res.cookie("token", token, {
          httpOnly: true,
          sameSite: "lax",
          secure: false,
          expires: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
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
};
