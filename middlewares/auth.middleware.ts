import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { IToken } from '../utils/token'

export const protect = (
  req: Request & { user: jwt.JwtPayload },
  res: Response,
  next: NextFunction
) => {
  const bearer: string = req.headers.authorization

  if (!bearer) {
    res.status(401).json({ message: 'not authorized' })
    return
  }

  const [, token] = bearer.split(' ')

  if (!token) {
    res.status(401).json({ message: 'not valid token' })
    return
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET)
    req.user = user as IToken
    next()
  } catch (e) {
    console.error(e)
    res.status(401).json({ message: 'not valid token' })
    return
  }
}
