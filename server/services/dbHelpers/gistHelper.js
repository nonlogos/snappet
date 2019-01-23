'use strict';
import mongoose from 'mongoose';
import '../../models/Gist';

const Gist = mongoose.model('Gist');

export const getGistsByUser = async userId => {
  try {
    if (!userId) throw 'require a userId';
    const gists = await Gist.find({ _user: userId });
    return gists;
  } catch (error) {
    console.log('getGistsByUser: ', error);
    throw error;
  }
};
export const gistFindAndUpdate = async (gist, userId) => {
  try {
    if (!gist || typeof gist !== 'object') throw 'require a gist object';
    if (!gist.id) throw 'gist object needs to have an id';
    const gistMap = _mapGistObj(gist, userId);
    const updatedGist = await Gist.findOneAndUpdate({ githubId: gist.id }, gistMap, { new: true, upsert: true });
    return updatedGist;
  } catch (error) {
    console.log('gistFindOrUpdate: ', error);
    throw error;
  }
};

const _mapGistObj = (gist, userId) => {
  const {
    id,
    created_at,
    url,
    forks_url,
    comments_url,
    node_id,
    git_pull_url,
    git_push_url,
    html_url,
    updated_at,
    description,
    commits_url,
    files,
  } = gist;
  const mappedObj = {
    githubId: id,
    isPublic: gist.public,
    created_at,
    url,
    forks_url,
    commits_url,
    node_id,
    git_pull_url,
    git_push_url,
    html_url,
    updated_at,
    description,
    comments_url,
    files,
  };
  if (userId) mappedObj._user = userId;
  return mappedObj;
};
