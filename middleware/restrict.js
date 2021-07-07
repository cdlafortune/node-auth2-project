const jwt = require('jsonwebtoken');
const { joinRaw } = require('../database/config');

function restrict(role){
    const roles = ['basic', 'admin', 'super-admin'];

    return async (req, res, next) => {
        const authError = {
            message: "Invalid credentials."
        };

        try {
            const token = res.cookies.token;

            if (!token) {
                return res.status(401).json(authError);
            } 

            jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
                if (err) {
                    return res.status(401).json(authError)
                }

                if (role && roles.indexOf(decoded.userRole) < roles.indexOf(role)) {
                    return res.status(403).json({
                        message: 'You are not authorized to access this page.'
                    });
                }
                req.token = decoded;

                next();
            })
    
       } catch (err) {
            next(err)
       }
    }    
};

module.exports = restrict;