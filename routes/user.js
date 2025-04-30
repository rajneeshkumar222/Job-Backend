const express = require("express");
const router = express.Router();
const User = require("../model/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { authenticateToken } = require("./authentcation");

// signup route 

// router.post("/signup", async (req, res) => {
//     try {

//         const { username, password, email, phone } = req.body;

//         // Check if any field is empty
//         if (!username || !password || !email || !phone) {
//             return res.status(400).json({
//                 message: "Please fill all the details",
//             });
//         }

//         // Check if email already exists
//         const existUser = await User.findOne({ email: email });
//         if (existUser) {
//             return res.status(400).json({
//                 message: "User already exists",
//             });
//         }

//         // Validate username length
//         if (username.length < 4) {
//             return res.status(400).json({
//                 message: "Username must be at least 4 characters long",
//             });
//         }

//         // Validate password length
//         if (password.length <= 5) {
//             return res.status(400).json({
//                 message: "Password must be greater than 5 characters",
//             });
//         }

//         // Hash the password
//         const hashPass = await bcrypt.hash(password, 10);

//         // Create new user
//         const newUser = await User.create({
//             username,
//             password: hashPass,
//             email,
//             phone,
//         });

//         return res.status(201).json({
//             message: "Signup Successfully",
//             user: newUser,
//         });

//     } catch (e) {
//         console.error("Error while Signup:", e);
//         return res.status(500).json({
//             message: "Internal Server Error",
//             error: e.message,
//         });
//     }
// });
router.post("/signup", async (req, res) => {
    try {
        const { username, password, email, phone } = req.body;

        if (!username || !password || !email || !phone) {
            return res.status(400).json({ message: "Please fill all the details" });
        }

        const existUser = await User.findOne({ email: email });
        if (existUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        if (username.length < 4) {
            return res.status(400).json({ message: "Username must be at least 4 characters long" });
        }

        if (password.length <= 5) {
            return res.status(400).json({ message: "Password must be greater than 5 characters" });
        }

        const hashPass = await bcrypt.hash(password, 10);

        // Assign "recruiter" role only to a specific email
        const recruiterEmail = "raj@gmial.com"; // Change this to the recruiter’s email
        const role = email === recruiterEmail ? "recruiter" : "student";

        const newUser = await User.create({
            username,
            password: hashPass,
            email,
            phone,
            role, // Store role in DB
        });

        return res.status(201).json({
            message: "Signup Successfully",
            user: newUser,
        });

    } catch (e) {
        console.error("Error while Signup:", e);
        return res.status(500).json({ message: "Internal Server Error", error: e.message });
    }
});

// login route 

// router.post("/login", async (req, res) => {
//     try {
//         const { email, password } = req.body;
//         if (!email || !password) {
//             return res.status(402).json({
//                 message: "please fill all the details carefully !",
//             })
//         }
//         const existUser = await User.findOne({ email });
//         if (!existUser) {
//             return res.status(402).json({
//                 message: "User is not be register !, Please Register Yourself !",
//             })
//         }

//         const isMatch = await bcrypt.compare(password, existUser.password);

//         if (!isMatch) {
//             return res.status(401).json({ message: "Incorrect Password!" });
//         }

//         const token = jwt.sign(
//             { id: existUser._id, role: existUser.role },
//             process.env.SECRET_KEY,
//             { expiresIn: "30d" }
//         );

//         return res.status(200).json({
//             message: "Login Successfully",
//             token: token,  
//             id: existUser._id,
//             role: existUser.role
//         });



//     }
//     catch (e) {
//         console.error("Error while login", e);
//     }
// });
 
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Please fill all the details carefully!" });
        }

        const existUser = await User.findOne({ email });
        if (!existUser) {
            return res.status(400).json({ message: "User is not registered! Please Register Yourself!" });
        }

        const isMatch = await bcrypt.compare(password, existUser.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Incorrect Password!" });
        }

        const token = jwt.sign(
            { id: existUser._id, role: existUser.role },  // Include role in JWT
            process.env.SECRET_KEY,
            { expiresIn: "30d" }
        );

        return res.status(200).json({
            message: "Login Successfully",
            token: token,
            user: {
                id: existUser._id,
                email: existUser.email,
                username: existUser.username,
                role: existUser.role,  
            },
        });

    } catch (e) {
        console.error("Error while login", e);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});
router.get("/auth", authenticateToken, async (req, res) => {
    try {
        const { id } = req.user; // Use req.user.id from token
        if (!id) {
            return res.status(400).json({ message: "User ID missing in token" });
        }

        const data = await User.findById(id).select("-password");
        if (!data) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json(data);
    }
    catch (e) {
        return res.status(500).json({
            message: "Internal server Error",
        });
    }
});

module.exports = router;