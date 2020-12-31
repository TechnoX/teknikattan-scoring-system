var db = require('./db');
let jwt = require('jsonwebtoken');
const config = require('./config.js');

let checkToken = (req, res, next) => {

    // Dessa sidor ska inte vara lösenordsskyddade och kommer igenom oavsett!!
    if(req.get('Referrer').endsWith("/projector") || req.get('Referrer').endsWith("/competitors") || req.get('Referrer').endsWith("/counter") || req.get('Referrer').includes("/answers/")){
        return next();
    }
    let token = req.headers['x-access-token'] || req.headers['authorization']; // Express headers are auto converted to lowercase
    if (token) {
        if (token.startsWith('Bearer ')) {
            // Remove Bearer from string
            token = token.slice(7, token.length);
        }

        jwt.verify(token, config.secret, (err, decoded) => {
            if (err) {
                return res.status(401).json({
                    success: false,
                    message: 'Token is not valid'
                });
            } else {
                req.decoded = decoded;
                next();
            }
        });
    } else {
        return res.status(401).json({
            success: false,
            message: 'Auth token is not supplied'
        });
    }
};

let login = (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    if (username && password) {
        db.check_user(username, password, function(err, user){
            if(err || !user){// If error or no matching user
                console.error("Wrong credentials", username, password, err);
                return res.status(403).json({
                    success: false,
                    message: 'Incorrect username or password'
                });
            }
            user._id += "";// Get rid of ObjectID from json object
            let token = jwt.sign(user,
                                 config.secret,
                                 { expiresIn: '48h' // expires in 48 hours
                                 }
                                );
            // return the JWT token for the future API calls
            return res.json({
                success: true,
                message: 'Authentication successful!',
                token: token
            });
        });
    } else {
        res.status(400).json({
            success: false,
            message: 'Authentication failed! Please check the request'
        });
    }
};


module.exports = {
    checkToken: checkToken,
    login: login
}
