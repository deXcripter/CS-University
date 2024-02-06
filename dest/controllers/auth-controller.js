"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.protection = exports.login = exports.signup = void 0;
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
        let user;
        try {
            user = await user_model_1.default.create(body);
        }
        catch (err) {
            return next(err);
        }
        // sign and issue the token
        const token = singToken(user._id);
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
    const user = await user_model_1.default.findOne({ email })
        .select('password')
        .maxTimeMS(15000);
    if (!user || !(await user.comparePasswords(password, user.password)))
        return next(new app_error_1.default('Invalid credientials', 400));
    const token = singToken(user._id.toString());
    res
        .status(200)
        .json({ status: 'success', message: 'logged in', data: user, token });
};
exports.login = login;
const protection = async (req, res, next) => {
    var _a, _b;
    console.log('running protection middleware');
    if (!req.headers.authorization)
        return next(new app_error_1.default(' login to access this route', 403));
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ').at(1);
    const Bearer = (_b = req.headers.authorization) === null || _b === void 0 ? void 0 : _b.split(' ').at(0);
    if (!(Bearer === null || Bearer === void 0 ? void 0 : Bearer.startsWith('Bearer')) || !token) {
        return next(new app_error_1.default(' login to access this route', 403));
    }
    // change this any type later
    const decoded = jsonwebtoken_1.default.verify(token, process.env.SECRET_KEY);
    // finding the user
    const user = await user_model_1.default.findById(decoded.id);
    if (!user)
        return next(new app_error_1.default('This user does not exists', 403));
    console.log(user);
    next();
};
exports.protection = protection;
