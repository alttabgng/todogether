const Task = require("../models/taskModel");
const Group = require("../models/groupModel");
const User = require("../models/userModel");
const CustomError = require("../helpers/error/CustomError");
const asyncErrorWrapper = require("express-async-handler");
const { sendJwtToClient } = require("../helpers/authorization/tokenHelpers");



// Yeni bir görev oluşturma
const createTask = asyncErrorWrapper(async (req, res, next) => {
    const { group, createdBy, title, description, assignedTo } = req.body;

    const task = await Task.create({
        group,
        createdBy,
        title,
        description,
        assignedTo,
    });

    if (!task) {
        return res.status(500).json({
            success: false,
            message: 'Task could not be created',
        });
    }

    // Kullanıcı modelindeki tasks alanını güncelleme
    const updatedUser = await User.findByIdAndUpdate(
        createdBy,
        { $push: { tasks: task._id } },
        { new: true }
    );

    if (!updatedUser) {
        return res.status(404).json({
            success: false,
            message: 'User not found',
        });
    }

    // Grup modelindeki tasks alanını güncelleme
    const updatedGroup = await Group.findByIdAndUpdate(
        group,
        { $push: { tasks: task._id } },
        { new: true }
    );

    if (!updatedGroup) {
        return res.status(404).json({
            success: false,
            message: 'Group not found',
        });
    }

    return res.status(201).json({
        success: true,
        data: task,
    });
});

// Görevi güncelleme
const updateTask = asyncErrorWrapper(async (req, res, next) => {
    const { taskId } = req.params;
    const { title, description, assignedTo, status } = req.body;

    let task = await Task.findById(taskId);


    if (!task) {
        return next(new CustomError("Task not found", 404));
    }

    task.title = title || task.title;
    task.description = description || task.description;
    task.assignedTo = assignedTo || task.assignedTo;
    task.status = status || task.status;
    task.updatedAt = Date.now();

    await task.save();

    return res.status(200).json({
    success: true,
    data: task,
    });
});

// Görevi silme
const deleteTask = asyncErrorWrapper(async (req, res, next) => {
    const { taskId } = req.params;

    let task = await Task.findByIdAndDelete(taskId);

    if (!task) {
    return next(new CustomError("Task not found", 404));
    }

    return res.status(200).json({
    success: true,
    message: "Task deleted successfully",
    });
});

// Tüm görevleri getirme
const getAllTasks = asyncErrorWrapper(async (req, res, next) => {
    const tasks = await Task.find();

    return res.status(200).json({
    success: true,
    data: tasks,
    });
});

// Belirli bir grubun görevlerini getirme
const getGroupTasks = asyncErrorWrapper(async (req, res, next) => {
    const { groupId } = req.params;

    const tasks = await Task.find({ group: groupId });

    return res.status(200).json({
    success: true,
    data: tasks,
    });
});

module.exports = {
    createTask,
    updateTask,
    deleteTask,
    getAllTasks,
    getGroupTasks,
};
