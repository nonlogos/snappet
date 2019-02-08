'use strict';
import mongoose, { Schema } from 'mongoose';

const GistSchema = new Schema({
  githubId: { type: String, required: true, index: { unique: true } },
  isPublic: String,
  created_at: String,
  url: { type: String, required: true },
  forks_url: String,
  commits_url: String,
  node_id: String,
  git_pull_url: String,
  git_push_url: String,
  html_url: String,
  files: Schema.Types.Mixed,
  updated_at: String,
  description: String,
  comments_url: String,
  _user: { type: Schema.Types.ObjectId, ref: 'User' },
  _tags: [{ type: Schema.Types.ObjectId, ref: 'Tag' }],
});

mongoose.model('Gist', GistSchema);
