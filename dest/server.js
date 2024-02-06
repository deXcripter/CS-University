"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// core modules
const http_1 = __importDefault(require("http"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const mongoose_1 = __importDefault(require("mongoose"));
// dependencies & 3rd-parties
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../config.env') });
const app_1 = __importDefault(require("./app"));
mongoose_1.default
    .connect(process.env.LOCAL_DATABASE)
    .then((data) => console.log('DB Connected'));
const server = http_1.default.createServer(app_1.default);
// running the server
const port = process.env.PORT;
server.listen(port, () => {
    console.log(`Server is currently running on port ${port}`);
});
