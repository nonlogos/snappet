import express from 'express';
import expressGraphQL from 'express-graphql';
import mongoose from 'mongoose';
import passport from 'passport';
import session from 'express-session';
import AuthRoutes from './routes/authRoutes';
import { isAuthenticated } from './middlewares/auth';
const MongoStore = require('connect-mongo')(session);

require('dotenv').config();
import './services/passport';
import './models/User';
import GraphQLSchema from './schema/schema';

import { GithubGraphQL } from './services/restApi';
import { userFindById } from './services/dbHelper';

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

app.get('/dashboard', async (req, res) => {
  if (req.user) {
    const user = await userFindById(req.user);
    if (user) {
      const { api_token, node_id } = user;
      const query = new GithubGraphQL(api_token);
      const queryResult = await query.getNode(node_id);
      console.log('queryResult', queryResult);
      res.status(200).send(JSON.stringify(queryResult));
    }
    res.status(200).send('no user');
  }
});
// catch all
app.all('*', (req, res) => {
  res.json({ ok: true });
});

export default app;
