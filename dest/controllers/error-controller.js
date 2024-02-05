"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalError = void 0;
const app_error_1 = __importDefault(require("../utils/app-error"));
// FUNCTIONS
// -- HANDLE DEVELOPMENT ERRORS HERE
const handleDevelopmentErrors = (err, req, res) => {
    return res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack,
    });
};
// -- HANDLE PRODUCTION ERRORS HERE
const handleOperationalErrors = (err, req, res) => {
    console.log('handling operational error`');
    console.log(err);
    return res.status(err.statusCode).json({ message: err.message });
};
const handleError11000 = (err, req, res) => {
    const key = Object.keys(err.keyValue);
    const message = `${key} is already in use. Please choose another`;
    return new app_error_1.default(message, 400);
};
// MAIN GLOBAL ERROR HANDLER
const globalError = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'fail';
    if (process.env.NODE_ENV === 'development') {
        handleDevelopmentErrors(err, req, res);
    }
    if (process.env.NODE_ENV === 'production') {
        if (err.code === 11000)
            err = handleError11000(err, req, res);
        // finally
        err.isOperational && handleOperationalErrors(err, req, res);
    }
};
exports.globalError = globalError;
