import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  bio?: string;
  skills: string[];
  college?: string;
  company?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  availability: 'looking-for-team' | 'open-to-join' | 'not-available';
  avatar?: string;
  isEmailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, minlength: 6 },
  bio: { type: String, maxlength: 500 },
  skills: [{ type: String, trim: true }],
  college: { type: String, trim: true },
  company: { type: String, trim: true },
  githubUrl: { type: String },
  linkedinUrl: { type: String },
  availability: { 
    type: String, 
    enum: ['looking-for-team', 'open-to-join', 'not-available'],
    default: 'open-to-join'
  },
  avatar: { type: String },
  isEmailVerified: { type: Boolean, default: false }
}, {
  timestamps: true
});

export default mongoose.model<IUser>('User', UserSchema);
