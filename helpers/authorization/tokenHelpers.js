// Bu fonksiyon ile token olusturuldu ve cookie olarak gonderildi.

const sendJwtToClient = (user, res) => {
    const token = user.generateJwtFromUser();                                   //user modelinden gelen generateJwtFromUser fonksiyonu ile token olusturuldu.
    const { JWT_COOKIE, NODE_ENV } = process.env;                               //JWT_COOKIE ve NODE_ENV degiskenleri .env dosyasindan cekildi.
    return res
        .status(200)
        .cookie("access_token", token, {                                        //token cookie olarak gonderildi.
            httpOnly: true,
            expires: new Date(Date.now() + parseInt(JWT_COOKIE) * 1000 * 60),   //expires ile tokenin ne kadar sure boyunca gecerli olacagi belirlendi.(10 dakika)
            secure: NODE_ENV === "development" ? false : true,                  //secure ile cookie'nin sadece https ile gonderilecegi belirlendi.
        })
        .json({
            success: true,
            access_token: token,
            data: {
                name: user.name,
                email: user.email,
            },
        });
};

//Bu fonksiyon ile tokenin dogru formatta gonderilip gonderilmedigi kontrol edildi.
const isTokenIncluded = (req) => {
    return (
        req.headers.authorization && req.headers.authorization.startsWith("Bearer:")
    );
};


//Bu fonksiyon ile tokenin gonderildigi headerdan alindi. Yani tokenin icerisindeki access_token degiskeni alindi.
const getAccessTokenFromHeader = (req) => {
    const authorization = req.headers.authorization;
    const access_token = authorization.split(" ")[1];                                  //access_token degiskenine authorization degiskeninin 1. elemani yani Bearer Token atandi.
    return access_token;
};


module.exports = { sendJwtToClient, isTokenIncluded, getAccessTokenFromHeader};
