const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Users = require('./users-model');

const restrict = require('../middleware/restrict');
const validateUser = require('../middleware/validateUser');

router.get('/users', restrict('admin'), async (req, res, next) => {
    try {
        res.json(await Users.find())
    } catch (err) {
        next(err)
    }
});

router.post('/register', async (req, res, next) => {
    try {
        const {username, password} = req.body;

        const user = await Users.findBy({username}).first();

        if (user) {
            return res.status(409).json({message: 'User already exists.'});
        }

        const newUser = await Users.add({
            username, 
            password: await bcrypt.hash(password, 14),
            department: req.body.department
        });

        res.status(201).json(newUser);
    } catch(err){
        next(err);
    };
});

router.post('/login', validateUser, async (req, res, next) => {
    try {
        const {username, password} = req.body;

        const user = await Users.findBy({username}).first();

        if (!user) {
            return res.status(401).json({message: 'Invalid credentials.'});
        }

        const passwordValid = await bcrypt.compare(password, user.password);

        if (!passwordValid) {
            return res.status(401).json({message: 'Invalid credentials.'});
        }

        //successful log in
        const token = jwt.sign({
            userID: user.id,
            userRole: user.department
        }, process.env.JWT_SECRET);

        res.cookie('token', token);

        res.json({message: `Welcome, ${user.username}`});
    } catch(err) {
        next(err);
    };
});

router.get('/logout', async (req, res, next) => {
    try {
        req.session.destroy((err) => {
            if (err) {
                next(err)
            } else {
                res.status(204).end();
            }
        });
    } catch(err) {
        next(err);
    }
});

module.exports = router;