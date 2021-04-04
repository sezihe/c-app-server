const koa = require('koa');
const bcrypt = require('bcrypt');
const koaJwt = require('koa-jwt');

const usersModel = require('../models/usersdb');

require('dotenv').config();

const saltRounds = 10;
exports.signup = async ctx => {
    // set content type
    ctx.contentType = "application/json";

    try {
        // hash password
        const hash = await bcrypt.hash(ctx.request.body.password, saltRounds);

        if (hash) {
            // check if user exists already
            const userExists = await usersModel.findOne({ email: ctx.request.body.email });
            if (userExists) {
                ctx.response.status = 403;
                return ctx.response.body = {
                    errId: "USR_EXISTS",
                    error: "User Already Exists",
                }
            }

            // replace regular password with the hash
            ctx.request.body.password = hash;

            try {
                // save user data to db
                const user = new usersModel(ctx.request.body);
                const saved = await user.save();

                if (saved) {
                    const { _id, fname, lname, email, password, createdAt } = user;
                    ctx.response.status = 200;
                    return ctx.response.body = {
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
                    }
                }
            } catch (savingError) {
                ctx.response.status = 403;
                return ctx.response.body = {
                    errId: "DB_SAVE_ERR",
                    errorMessage: "An error occured while saving data",
                    error: savingError,
                }
            }
        }
    } catch (hashingError) {
        ctx.response.status = 501;
        return ctx.response.body = {
            errId: "HASH_ERROR",
            errorMessage: "An error occured while hashing password",
            error: hashingError,
        }
    }
}
