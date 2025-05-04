import * as Mongoose from 'mongoose'
import { JwtPayload } from 'jsonwebtoken'

declare global {
  type UserRole = 'admin' | 'user'
  type UserStatus = 'active' | 'pending' | 'suspended' | 'deactivated'
  type CustomErrorContent = {
    message: string
    context?: { [key: string]: any }
  }
  namespace Express {
    interface Request {
      user?: IUserRequest
    }
  }

  interface IUser extends Mongoose.Document {
    _id: string
    username: string
    email: string
    passwordHash: Buffer
    role: UserRole
    status: UserStatus
    suspensionReason?: string
    createAt: Date
    updateAt: Date
  }

  interface IUserResponse {
    userId: string
    email: string
    username: string
    role: UserRole
    status: UserStatus
    suspensionReason?: string
  }

  interface CustomErrorContent {
    message: string
    context?: { [key: string]: any }
  }

  interface IUserRequest extends JwtPayload {
    userId: string
    role: UserRole
  }
}
