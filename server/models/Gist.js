'use strict';
import mongoose, { Schema } from 'mongoose';

const GistSchema = new Schema({
  githubId: String,
  isPublic: String,
  created_at: String,
  url: String,
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
