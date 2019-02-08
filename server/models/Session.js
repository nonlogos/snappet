'use strict';
import mongoose, { Schema } from 'mongoose';

const SessionSchema = new Schema({
  sessionId: { type: String, required: true, index: { unique: true } },
  _user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  accessToken: { type: String, required: true, index: { unique: true } },
});

mongoose.model('Session', SessionSchema);
