"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signup = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const app_error_1 = __importDefault(require("../utils/app-error"));
// functions
const singToken = (payload) => {
    jsonwebtoken_1.default.sign({ payload }, process.env.SECRET_KEY, {
        expiresIn: process.env.TOKEN_EXPIRATION,
    });
};
// controllers
const signup = (req, res, next) => {
    try {
        console.log(req.body);
        const { email, password, confirmPassword } = req.body;
        if (!email || !password || !confirmPassword) {
            return next(new app_error_1.default('Incomplete credentials', 400));
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
