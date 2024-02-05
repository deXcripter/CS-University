"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.signup = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const app_error_1 = __importDefault(require("../utils/app-error"));
const user_model_1 = __importDefault(require("../models/user-model"));
// functions
const singToken = (payload) => {
    return jsonwebtoken_1.default.sign({ id: payload }, process.env.SECRET_KEY, {
        expiresIn: process.env.TOKEN_EXPIRATION,
    });
};
// controllers
const signup = async (req, res, next) => {
    try {
        const { email, password, passwordConfirm } = req.body;
        if (!email || !password || !passwordConfirm) {
            return next(new app_error_1.default('Incomplete credentials', 400));
        }
        const body = {
            email,
            password,
            passwordConfirm,
        };
        // creating the new user
        try {
            await user_model_1.default.create(body);
        }
        catch (err) {
            return next(err);
        }
        // sign and issue the token
        const token = singToken(email);
        res
            .status(200)
            .json({ status: 'success', message: 'Account created', token });
    }
    catch (err) {
        return next(err);
    }
};
exports.signup = signup;
const login = async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    // User.findOne({ email })
    //   .maxTimeMS(15000)
    //   .then((doc) => (user = doc as iUser))
    //   .catch((err) => next(err));
    const user = await user_model_1.default.findOne({ email })
        .select('password')
        .maxTimeMS(15000);
    if (!user)
        return next(new app_error_1.default('Invalid credientials', 400));
    const token = singToken(user._id.toString());
    res
        .status(200)
        .json({ status: 'success', message: 'logged in', data: user, token });
};
exports.login = login;
