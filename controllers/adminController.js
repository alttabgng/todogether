const User = require("../models/userModel");
const CustomError = require("../helpers/error/CustomError");
const asyncErrorWrapper = require("express-async-handler");


const blockUser = asyncErrorWrapper(async (req, res, next) => {
    const {id} = req.params;
    const user = await User.findById(id);

    user.blocked = !user.blocked;                                   //veri tabaninda block ozelligini true ise false, false ise true yapar.

    await user.save();

    return res.status(200).json({
        success: true,
        message: "Block - Unblock Successfull"
    });
});




module.exports = { blockUser, }