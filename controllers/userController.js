const User = require("../models/userModel");
const CustomError = require("../helpers/error/CustomError");
const asyncErrorWrapper = require("express-async-handler");


const createUser = asyncErrorWrapper(async (req, res, next) => {

    const {name, email, password, role} = req.body;

    const user = await User.create({
        name,
        email,
        password,
        role
    });

    sendJwtToClient (user, res);                //kullanici olusturuldugunda otomatik olarak token olusturulur ve kullaniciya gonderilir.

});


const deleteUser = asyncErrorWrapper(async(req, res, next) => {

    const {id} = req.params;
    const user = await User.findByIdAndDelete(id);


    return res.status(200).json({
        success: true,
        message: "Delete Operation Successful"
    });
});

//
const updateUser = asyncErrorWrapper(async(req, res, next) => {

    const {id} = req.params;
    const {name, email, role} = req.body;

    let user = await User.findById(id);

    user.name = name;
    user.email = email;
    user.role = role;

    await user.save();

    return res.status(200).json({
        success: true,
        message: "Update Operation Successful"
    });
});



const getSingleUser = asyncErrorWrapper(async (req, res, next) => {

    const {id} = req.params;                                                                //id bilgisi url'den alinir.
    const user = await User.findById(id);                                                   //id bilgisi ile kullanici bilgileri alinir.

    return res.status(200)
    .json({
        success: true,
        data: user
});
});

const getAllUsers = asyncErrorWrapper(async (req, res, next) => {
    const users = await User.find();                                                        //tum kullanici bilgileri alinir.

    return res.status(200)
    .json({
        success: true,
        data: users
});
});





module.exports = {createUser, deleteUser, updateUser, getAllUsers, getSingleUser, }