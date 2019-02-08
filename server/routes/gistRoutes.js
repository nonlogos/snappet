import { Router } from 'restify-router';

import isAuthenticated from '../middlewares/auth';
import SessionDBHelper from '../services/dbHelpers/sessionHelper';

const gistRouter = new Router();

gistRouter.use(async (req, res, next) => {
  try {
    const { sessionId } = req.cookies;
    const sessionHelper = new SessionDBHelper('Session');
    const session = await sessionHelper.get(sessionId, 'findOne', null, { lean: true });
    if (session) {
      req.session = session;
      req.user = session._user;
      return next();
    }
    res.send(401, { Error: 'user is not signed in' });
    return next();
  } catch (error) {
    console.log(`isAuthenticated Middleware: ${error}`);
    res.send(401, { Error: 'user is not signed in' });
  }
});

gistRouter.post('/gists', (req, res, next) => {});

gistRouter.get('/gists', (req, res, next) => {
  console.log('req.query', req.query);
  console.log('req.user', req.user);
  res.send('200', { status: 'ok' });
  return next();
});

gistRouter.get('/gists/:id', (req, res, next) => {});

gistRouter.del('/gists/:id', (req, res, next) => {});

export default gistRouter;
