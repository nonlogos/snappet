'use strict';
import passport from 'passport';
import { Strategy } from 'passport-github2';
import mongoose from 'mongoose';

import { userFindOrUpdate, createNewUser } from './dbHelpers/userHelper';

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  done(null, id);
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
        if (existingUser) return done(null, existingUser);

        const newUser = await createNewUser(user, accessToken, refreshToken);
        return done(null, newUser);
      } catch (err) {
        done(err, null);
      }
    }
  )
);
