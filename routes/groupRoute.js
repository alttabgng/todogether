const express = require("express");
const { getAccessToRoute, getAdminAccess } = require("../middlewares/authorization/auth.js");

const {
    createGroup,
    getAllGroups,
    getGroup,
    addUserToGroup,
    deleteGroup,
    removeUserFromGroup,
} = require("../controllers/groupController");

const router = express.Router();


router.post("/", getAccessToRoute, createGroup);
router.get("/", getAllGroups);
router.get("/:id", getGroup);

router.post("/:groupId/users", getAccessToRoute, addUserToGroup);
router.delete("/:groupId", getAccessToRoute, getAdminAccess, deleteGroup);
router.delete("/:groupId/users/:userId", getAccessToRoute, getAdminAccess, removeUserFromGroup);

module.exports = router;
