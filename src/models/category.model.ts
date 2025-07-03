import { Schema, model, Types } from 'mongoose'

const CategorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    color: {
      type: String,
      default: '#000000' // Default color if not provided
    },
    createdBy: {
      type: Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  { timestamps: true }
)

export const CategoryModel = model('Category', CategorySchema)
