const User = require("../../models/userModel");
const CustomError = require("../../helpers/error/CustomError");
const asyncErrorWrapper = require("express-async-handler");

//bu fonksiyon ile kullanici var mi yok mu kontrol edilir. Bu fonksiyonu kullanici silme ve blocklama islemlerinde kullanacagiz.
const checkUserExist = asyncErrorWrapper(async (req, res, next) => {

    const {id} = req.params;
    const user = await User.findById(id);

    if(!user) {
        return next(new CustomError("There is no such user with that id", 400));
    }
    next();                                                                         //kullanici varsa next fonksiyonu ile bir sonraki fonksiyona gecilir.
});

module.exports = { checkUserExist }