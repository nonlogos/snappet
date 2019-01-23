'use strict';
import path from 'path';
import passport from 'passport-restify';
import { Strategy } from 'passport-github2';
import mongoose from 'mongoose';

import { userFindOrUpdate, createNewUser } from './dbHelpers/userHelper';
require('dotenv').config({ path: path.join(__dirname, '..', '..', 'config.env') });
const User = mongoose.model('User');

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(
  new Strategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_URI,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const user = { ...profile._json };
        const existingUser = await userFindOrUpdate(user, accessToken, refreshToken);
        if (existingUser) done(null, existingUser);

        const newUser = await createNewUser(user, accessToken, refreshToken);
        return done(null, newUser);
      } catch (err) {
        done(err, null);
      }
    }
  )
);
