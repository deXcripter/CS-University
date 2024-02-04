"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalError = void 0;
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
// MAIN GLOBAL ERROR HANDLER
const globalError = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'fail';
    if (process.env.NODE_ENV === 'development') {
        handleDevelopmentErrors(err, req, res);
    }
    if (process.env.NODE_ENV === 'production') {
    }
};
exports.globalError = globalError;
