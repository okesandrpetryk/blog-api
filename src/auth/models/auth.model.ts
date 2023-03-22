import { model, Schema, Types } from 'mongoose';

interface ISession {
  userId: Types.ObjectId;
  refreshToken: string;
}

const sessionSchema = new Schema<ISession>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  refreshToken: String,
});

export const Session = model<ISession>('Session', sessionSchema);
