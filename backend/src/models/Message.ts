import mongoose, { Document, Schema } from 'mongoose';

export interface IMessage extends Document {
  sender: mongoose.Types.ObjectId;
  content: string;
  type: 'text' | 'image' | 'file' | 'system';
  team?: mongoose.Types.ObjectId;
  recipient?: mongoose.Types.ObjectId; // for direct messages
  isRead: boolean;
  createdAt: Date;
}

const MessageSchema = new Schema<IMessage>({
  sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  type: { type: String, enum: ['text', 'image', 'file', 'system'], default: 'text' },
  team: { type: Schema.Types.ObjectId, ref: 'Team' },
  recipient: { type: Schema.Types.ObjectId, ref: 'User' },
  isRead: { type: Boolean, default: false }
}, {
  timestamps: true
});

export default mongoose.model<IMessage>('Message', MessageSchema);
