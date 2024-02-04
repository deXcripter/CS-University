"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const validator_1 = __importDefault(require("validator"));
const userSchema = new mongoose_1.default.Schema({
    username: {
        type: String,
    },
    email: {
        type: String,
        validate: validator_1.default.isEmail,
        required: [true, 'An email must be present'],
    },
    password: {
        type: String,
        required: true,
    },
    passwordConfirm: {
        type: String,
        required: true,
        validate: function (val) {
            return this.password === val;
        },
    },
    Coverphoto: {
        type: String,
    },
});
const User = mongoose_1.default.model('User', userSchema);
module.exports = User;
