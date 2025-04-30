import { Document } from 'mongoose'

export interface IUser extends Document {
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
