const jwt = require('jsonwebtoken');

const _auth = (req, res, next) => {
    const token = req.header('auth-token');
    if (!token) return res.status(401).send('Access Denied');

    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = verified;
        next();
    } catch (error) {
        res.status(400).send('Invalid Token');
    }
}

const _generateAccessToken = (user) => {
    return jwt.sign({ id: user._id }, process.env.TOKEN_SECRET, {
        expiresIn: '24h'
    })
}

module.exports.verify = _auth;
module.exports.generateAccessToken = _generateAccessToken;