const express = require("express");
const router = express.Router();
const User = require("../model/user");
const Job = require("../model/job");
const { authenticateToken } = require("./authentcation");
const mongoose = require("mongoose");
const Company=require("../model/company");

// =======================
// Add a Job (Only Admins)
// =======================


router.post("/addjob", authenticateToken, async (req, res) => {
    try {
        let { url, title, country, skills, desc, salary, experienceLevel, jobType, position, company } = req.body;
        const { id } = req.headers; // Recruiter ID from token

        if (!url || !title || !country || !skills || !desc || !salary || !experienceLevel || !jobType || !position || !company) {
            return res.status(400).json({ message: "All fields are required", success: false });
        }

        const user = await User.findById(id);
        if (!user) return res.status(404).json({ message: "User not found" });
        if (user.role !== "recruiter") return res.status(403).json({ message: "You are not authorized to add jobs" });

        // Convert salary safely
        salary = typeof salary === "string" ? salary.replace(/[^0-9.-]+/g, "") : salary;
        salary = parseFloat(salary);

        // Ensure skills is an array
        skills = Array.isArray(skills) ? skills.map(skill => skill.trim()) : skills.split(",").map(skill => skill.trim());

        // Convert company to ObjectId
        if (!mongoose.Types.ObjectId.isValid(company)) {
            return res.status(400).json({ message: "Invalid Company ID" });
        }

        const job = await Job.create({
            url,
            title,
            country,
            skills,
            desc,
            salary,
            experienceLevel,
            jobType,
            position,
            company: new mongoose.Types.ObjectId(company), 
            created_by: id, 
        });

        return res.status(201).json({ message: "New Job Added Successfully", data: job, success: true });

    } catch (e) {
        console.error("Error while adding job:", e);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});


// ==========================
// Get Job by ID (Public API)
// ==========================

router.get("/getjob/:id", async (req, res) => {
    try {
        console.log("Received job ID:", req.params.id);  // Debugging

        const { id } = req.params;

        const job = await Job.findById(id).populate("company created_by", "name email");

        if (!job) {
            return res.status(404).json({ message: "Job not found", success: false });
        }

        return res.status(200).json({ message: "Job found", job, success: true });

    } catch (e) {
        console.error("Error fetching job:", e);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});


// =======================
// Get All Jobs (Public API)
// =======================
router.get("/alljobs", async (req, res) => {
    try {
        const jobs = await Job.find().sort({ createdAt: -1 }).populate("company", "name");

        return res.status(200).json({ message: "Success", data: jobs });

    } catch (e) {
        console.error("Error fetching jobs:", e);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

// ================================
// Update Job by Admin (Admin Only)
// ================================
router.put("/updatejob", authenticateToken, async (req, res) => {
    try {
        const { jobid } = req.headers;
        if (!jobid) return res.status(400).json({ message: "Job ID is required" });

        const updatedJob = await Job.findByIdAndUpdate(jobid, req.body, { new: true });

        if (!updatedJob) return res.status(404).json({ message: "Job not found" });

        return res.status(200).json({ message: "Job updated successfully", job: updatedJob });

    } catch (e) {
        console.error("Error updating job:", e);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

// ========================
// Delete Job (Admin Only)
// ========================
router.delete("/deletejob", authenticateToken, async (req, res) => {
    try {
        const { jobid } = req.headers;
        if (!jobid) return res.status(400).json({ message: "Job ID is required" });

        const deletedJob = await Job.findByIdAndDelete(jobid);
        if (!deletedJob) return res.status(404).json({ message: "Job not found" });

        return res.status(200).json({ message: "Job deleted successfully" });

    } catch (e) {
        console.error("Error deleting job:", e);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = router;
