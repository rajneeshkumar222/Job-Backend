const mongoose = require("mongoose");

const companySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    website: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true,
    },
    skills: {
        type: [String], 
        required: true,
    },
    position: {  
        type: String, 
        required: true,
    }
}, { timestamps: true });

module.exports = mongoose.model("Company", companySchema);
