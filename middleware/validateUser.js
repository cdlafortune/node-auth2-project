const e = require("express")

function validateUser (req, res, next) {
    if (!req.body.username || !req.body.password) {
        res.status(400).json({message: 'Must include username and password.'})
    } else {
        next();
    }
};

module.exports = validateUser;