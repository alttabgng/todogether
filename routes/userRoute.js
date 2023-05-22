const express = require("express");
const { createUser, deleteUser, updateUser, getAllUsers, getSingleUser } = require("../controllers/userController.js");
const { checkUserExist } = require("../middlewares/database/databaseErrorHelpers.js");
const { getAccessToRoute, getAdminAccess } = require("../middlewares/authorization/auth.js");

const router = express.Router();

router.post("/", createUser);
router.get("/", getAllUsers);
router.get("/:id", checkUserExist, getSingleUser);
router.put("/:id", checkUserExist, updateUser);
router.delete("/:id", checkUserExist, deleteUser);



module.exports = router;