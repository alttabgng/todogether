const CustomError = require("../../helpers/error/CustomError");
const asyncErrorWrapper = require("express-async-handler");
const User = require("../../models/userModel");
const Group = require("../../models/groupModel");
const jwt = require("jsonwebtoken");
const { isTokenIncluded, getAccessTokenFromHeader } = require("../../helpers/authorization/tokenHelpers");




//bu fonksiyon ile kullanici giriş yapmış mı diye kontrol edilir.
const getAccessToRoute = (req, res, next) => {

    const {JWT_SECRET_KEY} = process.env;
    if(!isTokenIncluded(req)) {                                                                                     //token gonderilmemisse
        return next(new CustomError("You are not authorized to access this route", 401));
    }

    const access_token = getAccessTokenFromHeader(req);                                                             //token gonderilmisse token degiskenine atilir.

    jwt.verify(access_token, process.env.JWT_SECRET_KEY, (err, decoded) => {                                        //token dogrulanir.
        if(err) {
            return next
                (new CustomError("You are not authorized to access this route", 401));
        }
        req.user = {                                                                                                //token dogrulandiktan sonra kullanici bilgileri req.user degiskenine atilir.
            id: decoded.id,
            name: decoded.name,
            email: decoded.email
        }

        next();
})
};

// Bu fonksiyon ile admin giriş yapmış mı diye kontrol edilir. Eğer admin giriş yapmışsa, kullanıcı işlemlerini yapabilir. Yani kullanıcı oluşturabilir, silebilir, güncelleyebilir.
const getAdminAccess = asyncErrorWrapper (async(req, res, next) => {

    const {id} = req.user;

    const user = await User.findById(id)

    if(user.role !== "admin") {
        return next(new CustomError("Only admins can access this route",403));
    }
    next();
});


module.exports = {getAccessToRoute, getAdminAccess};
