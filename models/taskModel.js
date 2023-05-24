const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")


const TaskSchema = new mongoose.Schema({
    group: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Group",
        required: true,
        },
    createdBy: {                                                                                            //taski olusturan kisi
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        },
    title: {
        type: String,
        required: true,
        },
    description: {
        type: String,
        required: true,
        },
    assignedTo: {                                                                                           //taski yapan kisi
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        },
    status: {                                                                                               //taskin durumu
        type: String,
        enum: ["todo", "in_progress", "completed"],
        default: "todo",
        },
    isFavorite: {                                                                                           //task favoriye alinabilir.
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
    },
});

module.exports = mongoose.model("Task", TaskSchema);
