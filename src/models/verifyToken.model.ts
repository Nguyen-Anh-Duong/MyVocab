import { Schema, model, Types } from 'mongoose'

//token for email verification
const verifyTokenSchema = new Schema(
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

const VerifyTokenModel = model('VerifyToken', verifyTokenSchema)

export default VerifyTokenModel
