type UserRole = 'admin' | 'user'
type UserStatus = 'active' | 'pending' | 'suspended' | 'deactivated'

interface UserPayload {
  email: string
  username: string
  role: UserRole
  userId: string
}

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload
    }
  }
}
