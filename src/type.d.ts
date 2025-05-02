import * as Mongoose from 'mongoose'

declare global {
  type UserRole = 'admin' | 'user'
  type UserStatus = 'active' | 'pending' | 'suspended' | 'deactivated'
  type CustomErrorContent = {
    message: string
    context?: { [key: string]: any }
  }
  namespace Express {
    interface Request {
      user?: UserPayload
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

  //payload use in jwt
  interface UserPayload {
    email: string
    username: string
    role: UserRole
    userId: string
  }
}
