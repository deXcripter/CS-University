"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsers = void 0;
const user_model_1 = __importDefault(require("../models/user-model"));
const getUsers = async (req, res, next) => {
    const users = await user_model_1.default.find();
    console.log(users);
    res.status(200).json({ message: 'sucess', data: users });
};
exports.getUsers = getUsers;
