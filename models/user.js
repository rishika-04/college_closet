import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    first_name: { type: String, maxlength: 50, default: "" },
    last_name: { type: String, maxlength: 50, default: "" },
    mobile: { type: String, match: /^[0-9]{10}$/, default: "" },

    // Add "" into enum list so signup doesn't break
    block: { 
        type: String, 
        enum: ["", "1", "2", "3", "4", "5", "6"], 
        default: "" 
    },

    wing: { 
        type: String, 
        enum: ["", "A", "B", "C", "D"], 
        default: "" 
    },

    room: { type: Number, min: 1, max: 9999, default: null },

    branch: { 
        type: String, 
        enum: ["", "CSE", "BAI", "BCY", "BSA", "BCG", "BEY", "BET", "ECE"],
        default: "" 
    },

    year: { type: Number, enum: [1, 2, 3, 4, null], default: null },

    image_url: { type: String, default: '/images/default_pff.jpg' },

    email: { 
        type: String, 
        required: true, 
        unique: true,
        match: /^[a-zA-Z0-9._%+-]+@vitbhopal\.ac\.in$/ 
    },

    password: { type: String, required: true, minlength: 8, select: false },

    created_at: { type: Date, default: Date.now },
});



export default mongoose.models.User || mongoose.model("User", userSchema);
