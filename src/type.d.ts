import * as Mongoose from 'mongoose'

declare global {
  type UserRole = 'admin' | 'user'
  type UserStatus = 'active' | 'pending' | 'suspended' | 'deactivated'
  namespace Express {
    interface Request {
      user?: UserPayload
    }
  }

  interface IUser extends Mongoose.Document {
    _id: string
    username: string
    email: string
    passwordHash: string
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
