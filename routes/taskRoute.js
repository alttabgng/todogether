const express = require("express");
const { getAccessToRoute } = require("../middlewares/authorization/auth.js");

const {
    createTask,
    updateTask,
    deleteTask,
    getAllTasks,
    getGroupTasks,
} = require("../controllers/taskController");

const router = express.Router();

router.post("/", getAccessToRoute, createTask);
router.put("/:taskId", getAccessToRoute, updateTask);
router.delete("/:taskId", getAccessToRoute, deleteTask);
router.get("/", getAllTasks);
router.get("/group/:groupId", getGroupTasks);

module.exports = router;
