const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const usersModel = require('../models/usersdb');

require('dotenv').config();

const saltRounds = 10;
exports.signup = async (req, res) => {

    // hash password
    bcrypt.hash(req.body.password, saltRounds, async (err, hash) => {

        // check for error hashing error
        if (err) {
            return res.status(501).json({
                errId: "HASH_ERROR",
                errorMessage: "An error occured while hashing password",
                error: err,
            });
        }

        // check if user exists already
        const userExists = await usersModel.findOne({ email: req.body.email });
        if (userExists) {
            return res.status(403).json({
                errId: "USR_EXISTS",
                error: "User Already Exists",
            });
        }

        // replace regular password with the hash
        req.body.password = hash;

        // save user to db
        const user = new usersModel(req.body);
        user.save().then(result => {
            const { _id, fname, lname, email, password, createdAt } = user;
            return res.status(200).json({
                messageId: "REG_SUC",
                message: "Registration Successful",
                user: {
                    _id,
                    fname,
                    lname,
                    email,
                    password,
                    createdAt,
                },
            });
        }).catch(error => {
            return res.status(403).json({
                errId: "DB_SAVE_ERR",
                errorMessage: "An error occured while saving data",
                error,
            });
        })
    });

}

exports.signin = async (req, res) => {
    const { email, password } = req.body;

    // find user with that email first
    usersModel.findOne({ email }, (err, user) => {
        if (err || !user) {
            return res.status(401).json({
                errID: "LOGIN_ERR",
                errMessage: "Wrong login details. Please try again later",
            });
        }

        // compare password with hashed password in db and validate
        bcrypt.compare(password, user.password).then(result => {
            if (result !== true) {
                return res.status(401).json({
                    errID: "LOGIN_ERR",
                    errMessage: "Wrong login details. Please try again later",
                });
            } else if (result === true) {
                // create jwt
                jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' }, (err, token) => {
                    // check for error
                    if(err) return console.log("mError: ", err);

                    // store jwt as a cookie
                    res.cookie("tk", token, { expire: new Date() + 9999 });

                    const { _id, fname, lname, email } = user;
                    return res.status(200).json({
                        message: "Login Successful",
                        token,
                        user: {
                            _id,
                            fname,
                            lname,
                            email,
                        },
                    });

                });
            }

        }).catch(error => {
            return res.status(401).json({
                errID: "LOGIN_ERR",
                errMessage: "Wrong loginn details. Please try again later",
            });
        })
    });
}
