"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("../controllers/auth-controller");
const Router = express_1.default.Router();
// auth
Router.post('/signup', auth_controller_1.signup);
// normal controllers
Router.route('/').get().post().patch().delete();
exports.default = Router;
