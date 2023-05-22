const express = require('express')
const {getAccessToRoute, getAdminAccess} = require("../middlewares/authorization/auth");
const { checkUserExist } = require("../middlewares/database/databaseErrorHelpers");
const { login, logout, getUser, forgotPassword, resetPassword, editDetails, } = require("../controllers/authController");

const router = express.Router();

router.post("/login", login);
router.get("/logout", getAccessToRoute, logout);
router.get("/profile", getAccessToRoute, getUser);
router.post("/forgotpassword", forgotPassword);
router.put("/resetpassword", resetPassword);
router.put("/edit", getAccessToRoute, editDetails);



module.exports = router;