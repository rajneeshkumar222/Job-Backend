const Application = require("../model/application");
const Job = require("../model/job");
const express = require("express");
const router = express.Router(); 

// Change method from GET to POST
router.post("/apply", async (req, res) => {
    try {
        const { id, jobid } = req.body;  

        if (!id || !jobid) {
            return res.status(400).json({ message: "User ID and Job ID are required" });
        }

        // Check if user has already applied
        const existApplication = await Application.findOne({ job: jobid, applicant: id });
        if (existApplication) { 
            return res.status(400).json({
                message: "You have already applied for this job",
                success: false
            });
        }

        // Check if the job exists
        const job = await Job.findById(jobid);
        if (!job) {
            return res.status(404).json({
                message: "Job not found",
                success: false
            });
        }

        // Create a new application
        const newApplication = new Application({
            job: jobid,
            applicant: id, 
        });

        await newApplication.save();  // Explicitly save the new application

        // Ensure job.application exists before pushing
        if (!job.application) job.application = []; 
        job.application.push(newApplication.id);
        await job.save();

        return res.status(201).json({
            message: "Job applied successfully.",
            success: true
        });

    } catch (e) {
        console.log(e);
        return res.status(500).json({
            message: "Something went wrong!",
            success: false,
        });
    }
});

module.exports = router;
