// CustomError fonksiyonu ile hata mesajlarini ve hata kodlarini belirledik.
// CustomError class i özel bir hata mesaji olusturmak icin kullanilir.

class CustomError extends Error {
    constructor(message, status) {
        super(message);
        this.status = status;
    }
}


module.exports = CustomError;