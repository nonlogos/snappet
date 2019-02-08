'use strict';
import mongoose, { Schema } from 'mongoose';

const UserSchema = new Schema({
  githubId: { type: String, required: true, index: { unique: true } },
  email: { type: String, required: true, index: { unique: true } },
  avatar_url: { type: String, required: true, index: { unique: true } },
  gists_url: { type: String, required: true, index: { unique: true } },
  nickName: String,
  name: String,
  node_id: String,
});

mongoose.model('User', UserSchema);
