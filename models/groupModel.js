const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const GroupSchema = new mongoose.Schema({

    name: {
    type: String,
    required: [true, "Please provide a name for the group"],
    unique: true,
    },
    members: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        role: {
            type: String,
            enum: ["admin", "user"],
            default: "user",
        },
        }],
    createdAt: {
    type: Date,
    default: Date.now,
    },
});

module.exports = mongoose.model("Group", GroupSchema);