"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
function connectDB() {
    return new Promise((resolve, reject) => {
        mongoose_1.default.Promise = global.Promise;
        mongoose_1.default.connection.on('error', (err) => {
            console.log(`MongoDB connection error: ${err}`);
            reject(err);
        });
        mongoose_1.default.connection.once('open', () => {
            console.log('Connected to database');
            resolve(mongoose_1.default);
        });
        mongoose_1.default.connect(process.env.MONGO_URI || '');
    });
}
exports.default = connectDB;
