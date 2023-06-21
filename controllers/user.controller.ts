import { NextFunction, Request, Response } from "express";
import User from "../models/user.model";

export const signup = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            passwordHash: req.body.password
        });
        const result = await user.save();
        res.status(201).send(result);
    } catch (error) {
        if (error.name === "ValidationError") {
            next({
                status: 400,
                message: error.message,
            });
        }
    }
}

