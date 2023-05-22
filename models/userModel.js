const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
const crypto = require("crypto");                           //crypto modulu ile random string olusturacagiz. (reset password icin)

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide a name"],
    },
    email: {
        type: String,
        required: [true, "Please provide a email"],
        unique: true,
        match: [
            /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/,           //email formati kontrol edildi.
            "Please provide a valid email",
        ],
    },
    role: {
        type: String,
        default: "user",
        enum: ["user", "admin"],
    },
    password: {
        type: String,
        minlength: [6, "Please provide a password with min length 6"],
        required: [true, "Please provide a password"],
        select: false,                                              //select false yapmamizin sebebi eger getAllUsers diye bir fonksiyon tanimlarsak password alanimizin degerinin gorulmemesi icin.
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
    },
    profile_image: {
        type: String,
        default: "default.jpg"
    },
    blocked: {                                                      //admin isterse bazi kullanicilarin hesaplarini bloke edebilir.
        type: Boolean,
        default: false,
    },
    resetPasswordToken: {
        type: String,
    },
    resetPasswordExpire: {
        type: Date,
    },
});

// UserSchema methods

// Bu fonksiyon ile password hashlendi.
UserSchema.methods.generateJwtFromUser = function() {
    const { JWT_SECRET_KEY, JWT_EXPIRE } = process.env;

    const payload = {
        id: this._id,
        name: this.name,
        email: this.email
    };

    const token = jwt.sign(payload, JWT_SECRET_KEY, {               //jwt sign ile token olusturduk.
        expiresIn: JWT_EXPIRE
    });
    return token;
};


// Bu fonksiyon ile kullanici girdigi passwordun hashlenmesi saglandi.
UserSchema.methods.getResetPasswordTokenFromUser = function() {      //reset password token olusturmak icin fonksiyon tanimladik.
    const randomHexString = crypto.randomBytes(15).toString("hex");  //random hexadecimal string olusturduk. (15 byte)  (crypto modulu ile)  (toString ile hexadecimal stringe cevirdik).
    const { RESET_PASSWORD_EXPIRE } = process.env;                   //env dosyasindan reset password expire degerini aldik.

    const resetPasswordToken = crypto
        .createHash("SHA256")
        .update(randomHexString)
        .digest("hex");                                             //digest ile hexadecimal stringe cevirdik.

    this.resetPasswordToken = resetPasswordToken;                   //resetPasswordToken degiskenini user modeline ekledik.
    this.resetPasswordExpire = Date.now() + parseInt(RESET_PASSWORD_EXPIRE);         //1 saat sonra tokenin gecerliligi sona erecek.

    return resetPasswordToken;
};

// Pre Hooks


// Bu fonksiyon ile passwordun hashlenmesi saglandi.
UserSchema.pre("save", function (next) {

    //Parola değismemis sadece user update islemleri yapildiysa
    if(!this.isModified("password")) {
        next();
    }

    const user = this;
    bcrypt.genSalt(10, (err, salt) => {
        if(err) next(err);                                          //hata yakalama fonksiyonu kullanildi.
        bcrypt.hash(user.password, salt, (err, hash) => {
            if(err) next(err);
            user.password = hash;
            next();
        });
    });
});

module.exports = mongoose.model("User", UserSchema);