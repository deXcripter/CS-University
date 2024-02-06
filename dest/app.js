"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// cores
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
// 3rd
const version_one_1 = __importDefault(require("./Versions/version-one"));
const error_controller_1 = require("./controllers/error-controller");
const app_error_1 = __importDefault(require("./utils/app-error"));
// app
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, morgan_1.default)('dev'));
// middlewares
console.log(process.env.NODE_ENV);
app.use('/api/v1/', version_one_1.default);
app.use('*', (req, res, next) => {
    return next(new app_error_1.default('This route does not exist', 404));
});
app.use(error_controller_1.globalError);
exports.default = app;
