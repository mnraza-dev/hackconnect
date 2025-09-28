import mongoose, { Document, Schema } from 'mongoose';

export interface ITeamRequest extends Document {
  team: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  status: 'pending' | 'accepted' | 'rejected';
  message?: string;
  createdAt: Date;
  updatedAt: Date;
}

const TeamRequestSchema = new Schema<ITeamRequest>({
  team: { type: Schema.Types.ObjectId, ref: 'Team', required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  status: { 
    type: String, 
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending'
  },
  message: { type: String, maxlength: 500 }
}, {
  timestamps: true
});

export default mongoose.model<ITeamRequest>('TeamRequest', TeamRequestSchema);
