const User = require("../models/userModel");
const CustomError = require("../helpers/error/CustomError");
const asyncErrorWrapper = require("express-async-handler");
const {sendJwtToClient} = require("../helpers/authorization/tokenHelpers");
const {validateUserInput, comparePassword} = require("../helpers/input/inputHelpers");
const sendEmail = require("../helpers/libraries/sendEmail");



const login = asyncErrorWrapper(async (req, res, next) => {         //kullanici login oldugunda token olusturulur ve kullaniciya gonderilir.
    const{email, password} = req.body;

    if(!validateUserInput(email,password)) {
        return next(new CustomError("Please check your login information",400));
    }

    const user = await User.findOne({email}).select("+password");

    if(!comparePassword(password, user.password)) {
        return next(new CustomError("Please check your credentails",400));
    }

    sendJwtToClient (user, res);
});


const logout = asyncErrorWrapper(async (req, res, next) => {
    const {NODE_ENV} = process.env;

    return res.status(200).cookie({
        httpOnly: true,
        expires: new Date(Date.now()),
        secure: NODE_ENV === "development" ? false : true
    }).json({
        success: true,
        message: "Logout Successfull"
    })
})


// Bu fonksiyon ile oturum açmış kullanıcı kendi bilgilerini görebilir.
const getUser = (req, res ,next) => {
    res.json({
        success: true,
        data: {
            id: req.user.id,                    //req.user degiskeni getAccessToRoute fonksiyonundan gelen kullanici bilgileridir.
            name: req.user.name,
            email: req.user.email
        }
    });
};



//Forgot Password

const forgotPassword = asyncErrorWrapper(async (req, res, next) => {

    const resetEmail = req.body.email;                                      //kullanici email adresini gonderir.
    const user = await User.findOne({email: resetEmail});                   //kullaniciyi varsa buluruz.

    if(!user) {                                                             //kullanici yoksa hata dondururuz.
        return next(new CustomError("There is no user with that email", 404));
    }

    const resetPasswordToken = user.getResetPasswordTokenFromUser();        //kullaniciya resetPasswordToken olustururuz.

    await user.save();                                                      //kullaniciyi kaydederiz.

    const resetPasswordUrl = `http://localhost:5000/api/auth/resetpassword?resetPasswordToken=${resetPasswordToken}`;      //kullaniciya resetPasswordToken'i gondeririz.

    const emailTemplate = `
        <h3>Reset Your Password</h3>
        <p>This <a href='${resetPasswordUrl}' target='_blank'>link</a> will expire in 1 hour.</p>
    `;
                                                                            // target = '_blank' : yeni sekmede acilir.
    try {
        await sendEmail({
            from: process.env.SMTP_USER,
            to: resetEmail,                                                 //kullaniciya gonderilecek email adresi
            subject: "Reset Your Password",
            html: emailTemplate,                                            //kullaniciya gonderilecek email template'i
        });

    return res.status(200).json({
        success: true,
        message: "Token sent to your email"
    });
    }
    catch (err) {
        user.resetPasswordToken = undefined;                                //kullaniciya email gonderilemezse resetPasswordToken'i sifirlariz.
        user.resetPasswordExpire = undefined;

        await user.save();                                                  //tekrardan yeni token olusturmak icin kullaniciyi kaydederiz.

        return next(new CustomError("Email could not be sent", 500));
    }
});


//Reset Password

const resetPassword = asyncErrorWrapper(async (req, res, next) => {

    const {resetPasswordToken} = req.query;                                 //kullaniciya gonderilen resetPasswordToken'i aliriz.

    const {password} = req.body;                                            //kullanici yeni sifresini gonderir.
    if(!resetPasswordToken) {                                               //kullaniciya gonderilen resetPasswordToken'i yoksa hata dondururuz.
        return next(new CustomError("Please provide a valid token", 400));
    }

    let user = await User.findOne({                                         //kullaniciyi buluruz.
        resetPasswordToken: resetPasswordToken,                             //kullaniciya gonderilen resetPasswordToken'i ile kullaniciyi buluruz.
        resetPasswordExpire: {$gt: Date.now()}                              //kullaniciya gonderilen resetPasswordToken'in gecerlilik suresi dolmamis olmasi gerekir.$gt = greater than mongoDB operatoru
    });
    if(!user) {
        return next(new CustomError("Invalid token or session expired", 400));
    }

    user.password = password;                                               //kullaniciya yeni sifresini atariz.
    user.resetPasswordToken = undefined;                                    //kullaniciya gonderilen resetPasswordToken'i sifirlariz.
    user.resetPasswordExpire = undefined;                                   //kullaniciya gonderilen resetPasswordToken'in gecerlilik suresini sifirlariz.

    await user.save();

    return res.status(200).json({
        success: true,
        message: "Reset Password Successfull"
    });
});

//Bu fonksiyon ile kullanici bilgilerini guncelleyebilir.
const editDetails = asyncErrorWrapper(async (req, res, next) => {

    const editInformation = req.body;

    const user = await User.findByIdAndUpdate(req.user.id, editInformation, {
        new: true,
        runValidators: true
    });

    return res.status(200).json({
        success: true,
        data: user
    });

});




module.exports = { login, logout, getUser, forgotPassword, resetPassword, editDetails };
