var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required!'],
        minlength: [3, 'Name must be at least 3 characters long!'],
        maxlength: [50, 'Name must be at most 50 characters long!'],
    },
    email: {
        type: String,
        required: [true, 'Email is required!'],
        unique: true,
        validate: {
            validator: function (v) {
                return /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(v);
            },
            message: (props) => `${props.value} is not a valid email!`,
        },
    },
    password: {
        type: String,
        required: [true, 'Password is required!'],
    },
}, {
    timestamps: true,
});
userSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!this.isModified('password')) {
            return next();
        }
        const hash = yield bcrypt.hash(this.password, 10);
        this.password = hash;
        next();
    });
});
userSchema.methods.isValidPassword = function (password) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcrypt.compare(password, this.password);
    });
};
const User = mongoose.model('User', userSchema);
export default User;
//# sourceMappingURL=user.model.js.map