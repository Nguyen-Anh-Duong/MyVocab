import { Document } from 'mongoose'

type UserRole = 'admin' | 'user'
type UserStatus = 'active' | 'pending' | 'suspended' | 'deactivated'

export interface IUser extends Document {
  username: string
  email: string
  passwordHash: string
  role: UserRole
  status: UserStatus
  suspensionReason?: string
}
