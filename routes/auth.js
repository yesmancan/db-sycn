const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { registerValidation, loginValidation } = require('../modules/validation');
const { generateAccessToken, controlPass } = require('../modules/verifyToken');

router.post('/register', async (req, res) => {

    //VALIDATION THE DATA BEFORE WE A USER
    const { error } = registerValidation(req.body);
    if (error)
        return res.status(400).send(error.details[0].message);

    //Cheking if the user is already in the database
    const emailExist = await User.findOne({ email: req.body.email });
    if (emailExist) return res.status(400).send('Email already exists');

    //Hash password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    //Create a new user
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashPassword
    });
    try {
        const savedUser = await user.save();
        res.send({ user: user._id });
    } catch (err) {
        res.status(400).send(err);
    }
});

router.delete('/logout', (req, res) => {
    refreshTokens = refreshTokens.filter(token => token !== req.body.token);
    res.sendStatus(204);
})

router.post('/login', async (req, res) => {
    //Lets validate the data before we a user
    const { error } = loginValidation(req.body);
    if (error)
        return res.status(400).send(error.details[0].message);

    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send({ 'data': 'Email is not found' });

    //Password is correct
    const validPass = await controlPass(req.body.password, user.password);
    if (!validPass) return res.status(400).send({ 'data': 'Invalid password' });

    const token = generateAccessToken(user);
    res.status(200)
        .header('auth-token', token)
        .send({
            accessToken: token
        });
});

let refreshTokens = [];

router.post('/token', async (req, res) => {
    const refreshToken = req.body.token;
    if (refreshToken == null) return res.sendStatus(401);
    if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);

    jwt.verify(refreshToken, process.env.TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        const accessToken = generateAccessToken({ id: user._id });
        res.json({ accessToken: accessToken });
    })
});
module.exports = router;