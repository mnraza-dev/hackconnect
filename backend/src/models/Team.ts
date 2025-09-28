import mongoose, { Document, Schema } from 'mongoose';

export interface ITeam extends Document {
  name: string;
  description: string;
  event: mongoose.Types.ObjectId;
  leader: mongoose.Types.ObjectId;
  members: mongoose.Types.ObjectId[];
  maxMembers: number;
  skillsNeeded: string[];
  isOpen: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TeamSchema = new Schema<ITeam>({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  event: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
  leader: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  maxMembers: { type: Number, default: 5 },
  skillsNeeded: [{ type: String, trim: true }],
  isOpen: { type: Boolean, default: true }
}, {
  timestamps: true
});

export default mongoose.model<ITeam>('Team', TeamSchema);
