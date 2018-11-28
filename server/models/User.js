import mongoose, { Schema } from 'mongoose';

const UserSchema = new Schema({
  githubId: String,
  email: String,
  avatar_url: String,
  gists_url: String,
  nickName: String,
  name: String,
  api_token: String,
  node_id: String,
});

mongoose.model('User', UserSchema);
