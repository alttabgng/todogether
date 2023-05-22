//Hata mesajlarini handle eder. Hata mesajlarini kendi olusturdugumuz hata mesajlari ile degistiririz.

const CustomError = require("../../helpers/error/CustomError");

const customErrorHandler = (err, req, res, next) => {
    let customError = err;

    if(err.name === "SyntaxError") {
        customError = new CustomError("Unexpected Syntax",400);
    }
    if(err.name === "ValidationError") {
        customError = new CustomError(err.message, 400);
    }

    if(err.name === "CastError") {                                          //cast error olustugunda id bilgisi yanlis girilmis demektir.
        customError = new CustomError("Please provide a valid id", 400);
    }

    if(err.code === 11000) {                                                //bu sekilde belirli hatalara göre hata mesajlari olusturulabilir.
        customError = new CustomError(
            "Duplicate Key Found: Check Your Input",
            400
        );
    }

    res.status(customError.status || 500).json({
        success: false,
        message: customError.message
    });
};


module.exports = customErrorHandler;