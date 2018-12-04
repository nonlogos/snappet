'use strict';
import express from 'express';
import expressGraphQL from 'express-graphql';
import mongoose from 'mongoose';
import passport from 'passport';
import session from 'express-session';
import AuthRoutes from './routes/authRoutes';
import APIRoutes from './routes/apiRoutes';
import { isAuthenticated } from './middlewares/auth';
const MongoStore = require('connect-mongo')(session);

require('dotenv').config();
import './services/passport';
import './models/User';
import GraphQLSchema from './schema/schema';

// Declare an app from express
const app = express();

// setup MLab(mongoDB) connection
// Mongoose's built in promise library is deprecated, replace it with ES2015 Promise
mongoose.Promise = global.Promise;

// Connect to the mongoDB instance and log a message
// on success or failure
mongoose.connect(
  process.env.DB_CONN,
  {
    useNewUrlParser: true,
  }
);
mongoose.connection
  .once('open', () => console.log('Connected to MongoLab instance.'))
  .on('error', error => console.log('Error connecting to MongoLab:', error));

app.use(
  session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
);
// initialize passport
app.use(passport.initialize());
app.use(passport.session());

AuthRoutes(app);
app.use('/api', isAuthenticated, APIRoutes);

app.use(
  '/graphql',
  isAuthenticated,
  expressGraphQL({
    schema: GraphQLSchema,
    graphiql: true,
  })
);
app.get('/login', (req, res) => {
  res.sendFile('public/login.html', { root: __dirname });
});

app.use(function(err, req, res, next) {
  if (!err.message) res.status(500).send({ error: err });
  else if (!err.status) res.status(500).send({ error: err.message });
  else res.status(err.status).send({ error: err.message });
});

// catch all
app.all('*', (req, res) => {
  res.json({ ok: true });
});

export default app;
