import { NextFunction, Request, Response } from 'express'
import User, { IUser } from '../models/user.model'
import { IToken, createToken } from '../utils/token'

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    })
    const result = await user.save()
    res.status(201).send(result)
  } catch (error) {
    if (error.name === 'ValidationError') {
      next({
        status: 400,
        message: error.message,
      })
    }
  }
}

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body

    const user: IUser = await User.findOne({ email })

    if (!user) {
      throw new Error('User not found')
    }

    const isValid = await user.isValidPassword(password)

    if (!isValid) {
      throw new Error('Invalid password')
    }

    const token = createToken(user)

    return res.status(200).json({
      token,
    })
  } catch (error) {
    if (
      error.message === 'User not found' ||
      error.message === 'Invalid password'
    ) {
      next({
        status: 401,
        message: error.message,
      })
    } else {
      next({
        status: 500,
        message: error.message,
      })
    }
  }
}

export const me = async (
  req: Request & { user: IToken },
  res: Response,
  next: NextFunction
) => {
  try {
    console.log(req.user)
    const user = await User.findById(req.user.id).select(
      '-password -__v -_id -createdAt -updatedAt'
    )
    res.status(200).json(user)
  } catch (error) {
    next({
      status: 500,
      message: error.message,
    })
  }
}
