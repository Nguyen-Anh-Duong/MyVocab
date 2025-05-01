import { Model, Schema, model, Document } from 'mongoose'

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
      type: String,
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
