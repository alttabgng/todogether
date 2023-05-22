const express = require('express')
const {getAccessToRoute, getAdminAccess} = require("../middlewares/authorization/auth");
const { checkUserExist } = require("../middlewares/database/databaseErrorHelpers");
const { blockUser } = require("../controllers/adminController");

const router = express.Router();


router.use([getAccessToRoute, getAdminAccess]);                         //tum routelerde geçerli oldu. Her seferinde tekrardan yazmamıza gerek kalmadı.

router.get("/block/:id", checkUserExist, blockUser);


module.exports = router;


