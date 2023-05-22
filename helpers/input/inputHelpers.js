const bcrypt = require("bcrypt");

// bu fonksiyon ile kullanici girdigi email ve password bilgilerinin bos olup olmadigini kontrol ediyoruz.

const validateUserInput = (email, password) => {

    return email && password;
};

const comparePassword = (password, hashedPassword) => {

    return bcrypt.compareSync(password, hashedPassword);

}

module.exports = { validateUserInput, comparePassword }