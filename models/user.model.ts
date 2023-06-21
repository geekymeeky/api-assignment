import mongoose from "mongoose";
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required!"],
        minlength: [3, "Name must be at least 3 characters long!"],
        maxlength: [50, "Name must be at most 50 characters long!"]
    },
    email: {
        type: String,
        required: [true, "Email is required!"],
        unique: true,
        validate: {
            validator: function (v: any) {
                return /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(v);
            },
            message: (props: any) => `${props.value} is not a valid email!`
        }
    },
    password: {
        type: String,
        required: [true, "Password is required!"],
    },
}, {
    timestamps: true
});


interface IUser extends mongoose.Document {
    name: string;
    email: string;
    password: string;
}

userSchema.pre<IUser>('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }

    const hash = await bcrypt.hash(this.password, 10);

    this.password = hash;

    next();
});


userSchema.methods.isValidPassword = async function (
    password: string
): Promise<Error | boolean> {
    return await bcrypt.compare(password, this.password);
};


const User = mongoose.model("User", userSchema);


export default User;
