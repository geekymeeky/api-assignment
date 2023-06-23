var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import User from '../models/user.model';
import { createToken } from '../utils/token';
export const signup = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = new User({
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
export const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield User.findOne({ email });
        if (!user) {
            throw new Error('User not found');
        }
        const isValid = yield user.isValidPassword(password);
        if (!isValid) {
            throw new Error('Invalid password');
        }
        const token = createToken(user);
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
export const me = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User.findById(req.user.id).select('-password -__v -_id -createdAt -updatedAt');
        res.status(200).json(user);
    }
    catch (error) {
        next({
            status: 500,
            message: error.message,
        });
    }
});
//# sourceMappingURL=user.controller.js.map