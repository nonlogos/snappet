'use strict';
import mongoose, { Schema } from 'mongoose';

const TagSchema = new Schema({
  name: String,
  created_at: String,
  updated_at: String,
});

mongoose.model('Tag', TagSchema);
