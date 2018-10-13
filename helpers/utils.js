const jwt = require("jsonwebtoken");

const createSignedToken = cleanedUser => jwt.sign(cleanedUser, process.env.SECRET_KEY, {
    expiresIn: 86400
});

module.exports = {
    createSignedToken: createSignedToken
}