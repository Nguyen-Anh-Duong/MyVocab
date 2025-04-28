import mongoose, { Schema, Document } from 'mongoose'

const userSchema: Schema = new mongoose.Schema({
  username: String,
  email: {
    type: String,
    required: true
  },
  passwordHash: String,
  role: {
    type: String,
    enum: ['admin', 'user'],
    required: true
  },
  createAt: Date,
  status: {
    type: String,
    enum: ['active', 'pending', 'suspended', 'deactivated']
  }
})

const User = mongoose.model('User', userSchema)

export default User
