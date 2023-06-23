"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.me = exports.login = exports.signup = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const token_1 = require("../utils/token");
const signup = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = new user_model_1.default({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
        });
        const result = yield user.save();
        res.status(201).send(result);
    }
    catch (error) {
        if (error.name === 'ValidationError') {
            next({
                status: 400,
                message: error.message,
            });
        }
    }
});
exports.signup = signup;
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield user_model_1.default.findOne({ email });
        if (!user) {
            throw new Error('User not found');
        }
        const isValid = yield user.isValidPassword(password);
        if (!isValid) {
            throw new Error('Invalid password');
        }
        const token = (0, token_1.createToken)(user);
        return res.status(200).json({
            token,
        });
    }
    catch (error) {
        if (error.message === 'User not found' ||
            error.message === 'Invalid password') {
            next({
                status: 401,
                message: error.message,
            });
        }
        else {
            next({
                status: 500,
                message: error.message,
            });
        }
    }
});
exports.login = login;
const me = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_model_1.default.findById(req.user.id).select('-password -__v -_id -createdAt -updatedAt');
        res.status(200).json(user);
    }
    catch (error) {
        next({
            status: 500,
            message: error.message,
        });
    }
});
exports.me = me;
