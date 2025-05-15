import { Schema, model, Types } from 'mongoose'

//token for reset password
const resetPasswordTokenSchema = new Schema(
  {
    userId: {
      type: Types.ObjectId,
      ref: 'User',
      required: true
    },
    token: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: '1h' // Token will expire after 1 hour
    }
  },
  { timestamps: true }
)

const ResetPasswordTokenModel = model('ResetPasswordToken', resetPasswordTokenSchema)

export default ResetPasswordTokenModel
