import { Model, Schema, model } from 'mongoose'
import { IUser } from '~/interfaces/models/users.interface.js'

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
      required: true
    },
    status: {
      type: String,
      enum: ['active', 'pending', 'suspended', 'deactivated'],
      required: true
    },
    suspensionReason: String
  },
  {
    timestamps: true
  }
)

const UserModel: Model<IUser> = model<IUser>('User', UserSchema)

export default UserModel
