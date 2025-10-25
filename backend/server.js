import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser";
import dotenv from "dotenv"
import mongoose from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";
import  { connection, collectionName } from "./dbconfig.js"
dotenv.config();
const app = express();
const port = 5000;
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))
app.use(express.json());
app.use(cookieParser())

app.get("/",(req,res)=>{
    res.send("Welcome to event management API")
})

// Admin signup 
app.post("/admin-signup",async (req,res)=>{
    const adminData = req.body;
    if(adminData.email && adminData.password){
        const db = await connection();
        const collection = await db.collection("admins");
        const result = await collection.insertOne(adminData);
        if(result){
            const tokenData = { _id: result.insertedId, email: adminData.email};
            jwt.sign(tokenData,"Google", {expiresIn: "5d"},(error,token)=>{
                if(error)
                    return res.status(500).send({ success: false, message: "JWT error"});
                res.cookie('token',token,{
                        httpOnly: true,
                        sameSite: "lax",
                        secure: false,
                        expiresIn: 5 * 24 * 60 * 60 * 1000
                    });
                    res.send({success: true, message: "Admin Signup done"})
            });
        } else{
            res.send({
                success: false,
                message: "Signup failed"
            })
        }
    }
})

// User signup
app.post("/user-signup", async(req,res)=>{
    const userData = req.body;
    if(userData.email && userData.password){
        const db = await connection();
        const collection = await db.collection("users");
        const result = await collection.insertOne(userData);
        if(result){
            const tokenData = { _id: result.insertedId,email: userData.email};
            jwt.sign(tokenData,"Google",{expiresIn: "5d"},(error,token)=>{
                if(error) return res.status(500).send({success: false, message: "JWT error"});
                res.cookie('token',token,{
                    httpOnly: true,
                    secure: false,
                    sameSite: "lax",
                    expiresIn: 5 * 24 * 60 * 60 * 1000
                });
                res.send({ success: true, message: "User Signup done"})
            });
        } else{
            res.send({
                success: false,
                message: "User signup failed"
            })
        }
    }
});

// Admin Login
app.post("/admin-login",async (req,res)=>{
    const adminData = req.body;
    if(adminData.email && adminData.password){
        const db = await connection();
        const collection = await db.collection("admins");
        const result = await collection.findOne({
            email: adminData.email,
            password: adminData.password
        });
        if(result){
            const tokenData = { _id: result._id,email: result.password};
            jwt.sign(tokenData,"Google",{expiresIn: "5d"},(error,token)=>{
                if(error) 
                    return res.status(500).send({success: false, message: "Jwt eerror"});
                res.cookie('token',token,{
                    httpOnly: true,
                    sameSite: "lax",
                    secure: false,
                    expiresIn: 5 * 24 * 60 * 60 * 1000
                });
                res.send({ success: true, message: "Admin Login Done"})
            });
        } else{
            res.send({
                success: false,
                message: "Admin login failed"
            })
        }
    }
})

// User Login
app.post("/user-login", async (req,res)=>{
    const userData = req.body;
    if(userData.email && userData.password){
        const db = await connection();
        const collection = await db.collection("users");
        const result = await collection.findOne({
            email: userData.email,
            password: userData.password
        });
        if(result){
            const tokenData = { _id: result._id, email: result.email};
            jwt.sign(tokenData,"Google",{expiresIn: "5d"}, (error,token)=>{
                if(error)
                    return res.status(500).send({ success: false, message: "User Login failed"})
                res.cookie('token',token,{
                    httpOnly: true,
                    secure: true,
                    sameSite: "lax",
                    expiresIn: 5 * 24 * 60 * 60 * 1000
                });
                res.status(200).send({ success: true, message: "User Login Successfully done"})
            });
        } else{
            res.send({
                success: false,
                message: "User login failed"
            })
        }
    }
})

// Admin dashboard
app.post("/admin-dashboard",(req,res)=>{
    
})
app.listen(port,(req,res)=>{
    console.log(`app is listening on port ${port}`)
})