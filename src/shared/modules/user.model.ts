import { Schema, Document, model } from 'mongoose';
import { User } from '../types/index.js';

export interface UserDocument extends User, Document {
  createdAt: Date,
  updatedAt: Date,
}

const userSchema = new Schema<UserDocument>({
  name: {
    type: String,
    required: true,
    minlength: [2, 'Min length for name is 2']
  },
  email: {
    type: String,
    unique: true,
    match: [/^([\w-\\.]+@([\w-]+\.)+[\w-]{2,4})?$/, 'Email is incorrect'],
    required: true,
  },
  avatarPath: {
    type: String,
    minlength: [5, 'Min length for avatar path is 5'],
  },
  password: {
    type: String,
    required: true,
    minlength: [6, 'Min length for password is 6'],
  },
  userType: {
    type: String,
    enum: ['standart', 'pro'],
    default: 'standart',
    required: true,
  }
}, { timestamps: true });

export const UserModel = model<UserDocument>('User', userSchema);
