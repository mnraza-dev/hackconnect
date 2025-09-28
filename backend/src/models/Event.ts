import mongoose, { Document, Schema } from 'mongoose';

export interface IEvent extends Document {
  title: string;
  description: string;
  date: Date;
  endDate?: Date;
  mode: 'online' | 'offline';
  location?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  organizer: mongoose.Types.ObjectId;
  maxParticipants?: number;
  currentParticipants: number;
  skillsRequired: string[];
  tags: string[];
  isActive: boolean;
  registrationDeadline?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema = new Schema<IEvent>({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  endDate: { type: Date },
  mode: { type: String, enum: ['online', 'offline'], required: true },
  location: { type: String },
  coordinates: {
    lat: { type: Number },
    lng: { type: Number }
  },
  organizer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  maxParticipants: { type: Number },
  currentParticipants: { type: Number, default: 0 },
  skillsRequired: [{ type: String, trim: true }],
  tags: [{ type: String, trim: true }],
  isActive: { type: Boolean, default: true },
  registrationDeadline: { type: Date }
}, {
  timestamps: true
});

export default mongoose.model<IEvent>('Event', EventSchema);
