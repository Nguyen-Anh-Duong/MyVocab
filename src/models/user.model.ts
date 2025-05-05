import { Schema, model } from 'mongoose'

const UserSchema: Schema<IUser> = new Schema(
  {
    username: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    passwordHash: {
      type: Buffer,
      required: true
    },
    role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user',
      required: true
    },
    status: {
      type: String,
      enum: ['active', 'pending', 'suspended', 'deactivated'],
      default: 'pending',
      required: true
    },
    suspensionReason: String
  },
  {
    timestamps: true
  }
)

const UserModel = model<IUser>('User', UserSchema)

export default UserModel
