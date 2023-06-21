import { IUser } from '../models/user.model'
import jwt from 'jsonwebtoken'

export interface IToken {
  id: string
}

export const createToken = (user: IUser): string => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET as jwt.Secret, {
    expiresIn: '1d',
  })
}

export const verifyToken = async (
  token: string
): Promise<jwt.VerifyErrors | IToken> => {
  return new Promise((resolve, reject) => {
    jwt.verify(
      token,
      process.env.JWT_SECRET as jwt.Secret,
      (err: any, payload: any) => {
        if (err) return reject(err)

        resolve(payload as IToken)
      }
    )
  })
}

export default { createToken, verifyToken }
