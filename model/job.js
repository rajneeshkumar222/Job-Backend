const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true
    },
    skills: [{
        type: String,
        required: true
    }],
    salary: {
        type: Number,
        required: true
    },
    experienceLevel: {
        type: String,
        required: true
    },
    position: {
        type: String,
        required: true
    },
    company: {   
        type: String,
        required: true
    },
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", required: true
    },
    application: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Application"
    }] // ✅ Add this field
});

module.exports = mongoose.model("Job", jobSchema);
