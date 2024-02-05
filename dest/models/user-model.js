"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const validator_1 = __importDefault(require("validator"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const userSchema = new mongoose_1.default.Schema({
    username: {
        type: String,
    },
    email: {
        type: String,
        validate: validator_1.default.isEmail,
        required: [true, 'An email must be present'],
        unique: [true, 'Email already exist'],
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
userSchema.pre('save', async function (next) {
    if (!this.isNew || !this.isModified('password'))
        next();
    this.password = await bcryptjs_1.default.hash(this.password, 12);
    this.passwordConfirm = undefined;
    console.log('hash password');
});
const User = mongoose_1.default.model('User', userSchema);
exports.default = User;
