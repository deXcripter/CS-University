"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signup = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const app_error_1 = __importDefault(require("../utils/app-error"));
const user_model_1 = __importDefault(require("../models/user-model"));
// functions
const singToken = (payload) => {
    jsonwebtoken_1.default.sign({ payload }, process.env.SECRET_KEY, {
        expiresIn: process.env.TOKEN_EXPIRATION,
    });
};
// controllers
const signup = async (req, res, next) => {
    try {
        const { email, password, passwordConfirm } = req.body;
        if (!email || !password || !passwordConfirm) {
            // console.log(email, password, passwordConfirm);
            return next(new app_error_1.default('Incomplete credentials', 400));
        }
        const body = {
            email,
            password,
            passwordConfirm,
        };
        // creating the new user
        console.log(body);
        try {
            const user = await user_model_1.default.create(body);
        }
        catch (err) {
            return next(err);
        }
        // sign and issue the token
        const token = singToken(email);
        res.status(200).json({ status: 'success', message: 'user created', token });
    }
    catch (err) {
        return next(err);
    }
};
exports.signup = signup;