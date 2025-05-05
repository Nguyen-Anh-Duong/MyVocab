import { Schema, model, Types } from 'mongoose'

const CategorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    userId: {
      type: Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  { timestamps: true }
)

export const CategoryModel = model('Category', CategorySchema)
