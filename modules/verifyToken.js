const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

let session = { login: false, token: null };
const _auth = (req, res, next) => {
    const token = req.header('auth-token');
    if (!token) res.redirect('/login');

    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = verified;
        next();
    } catch (error) {
        res.status(400).send('Invalid Token');
    }
}
const _auth_session = (req, res, next) => {
    if (req.session._user) {
        if (req.session._user.login) {
            if (req.session._user.token) {
                if (req.session._user.user) {
                    const token = res.setHeader('auth-token', req.session._user.token)
                    return next();
                }
            }
        }
    }

    res.redirect('/login');
}
const _generateAccessToken = (user) => {
    const token = jwt.sign({ id: user._id }, process.env.TOKEN_SECRET, {
        expiresIn: '24h'
    });
    session.login = true;
    session.token = token;
    return token;
}

const _controlPass = async (req_pass, user_pass) => {
    return await bcrypt.compare(req_pass, user_pass);
}

module.exports.verify = _auth;
module.exports.verifySession = _auth_session;

module.exports.generateAccessToken = _generateAccessToken;
module.exports.controlPass = _controlPass;
