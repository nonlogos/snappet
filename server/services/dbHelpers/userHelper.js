'use strict';
import mongoose from 'mongoose';

import '../../models/User';

const User = mongoose.model('User');

export const userFindOrUpdate = async (user, accessToken, refreshToken) => {
  try {
    if (!user || typeof user !== 'object') throw 'require a user object';
    if (!user.id) throw 'user object needs to have an id';
    const userMap = mapUserObj(user, accessToken, refreshToken);
    const updatedUser = await User.findOneAndUpdate({ githubId: user.id }, userMap, { new: true });
    return updatedUser;
  } catch (error) {
    console.log('userFindOrUpdate error: ', error);
    throw error;
  }
};

export const userFindById = async id => {
  try {
    const user = await User.findById(id);
    return user;
  } catch (error) {
    console.log('userFindById: ', error);
    throw error;
  }
};

export const createNewUser = async (user, accessToken, refreshToken) => {
  try {
    if (!user || typeof user !== 'object') throw 'require a user object';
    if (!user.id) throw 'user object needs to have an id';
    const userMap = mapUserObj(user, accessToken, refreshToken);
    const newUser = await new User(userMap).save();
    return newUser;
  } catch (error) {
    console.log('createNewUser: ', error);
    throw error;
  }
};

const mapUserObj = (user, accessToken, refreshToken) => {
  try {
    if (!user || typeof user !== 'object') throw 'require a user object';
    if (!user.id) throw 'user object needs to have an id';
    return {
      githubId: user.id,
      email: user.email,
      avatar_url: user.avatar_url,
      gists_url: user.gists_url,
      nickName: user.login,
      name: user.name,
      api_token: accessToken,
      api_refresh_token: refreshToken,
      node_id: user.node_id,
    };
  } catch (error) {
    console.log('mapUserObj: ', error);
    throw error;
  }
};
