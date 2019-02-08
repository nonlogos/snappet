import { Router } from 'restify-router';

import GithubOauth from '../services/oauth/oauth2';
import { GithubGistAPI } from '../services/restApi';
import UserDBHelper from '../services/dbHelpers/userHelper';
import SessionDBHelper from '../services/dbHelpers/sessionHelper';

const authRouter = new Router();
const github = new GithubOauth();

authRouter.get('/auth/github', (req, res, next) => {
  github.authenticate(res, next, ['user', 'gist']);
});

authRouter.get('/auth/github/callback', async (req, res, next) => {
  try {
    // get accessToken and use it to get github user profile
    const accessToken = await github.getOauthAccessToken(req.query.code);
    const query = new GithubGistAPI(accessToken);
    const queryResult = await query.getUser('https://api.github.com/user');
    // save or update user record in MongoDB based on github profile
    const userObj = { ...queryResult.data };
    const userHelper = new UserDBHelper('User');
    const dbUserResult = await userHelper.addOrUpdateUser(userObj);
    if (dbUserResult) {
      // create and save SessionId in DB or retrieve existing one from DB
      const sessionHelper = new SessionDBHelper('Session');
      const dbSessionId = await sessionHelper.findOneOrCreateNew(accessToken, dbUserResult._id);
      // set sessionId cookie and redirect to home page
      res.header('Set-Cookie', `sessionId=${dbSessionId}; HttpOnly; Path=/`);
      res.redirect(
        {
          pathname: 'https://127.0.0.1:3000',
          query: {
            session: dbSessionId,
          },
        },
        next
      );
    } else throw 'DB cannot save/update user';
  } catch (error) {
    console.log('auth/github/callback error', error.message);
    res.send(403, { Error: error.message });
    return next();
  }
});

authRouter.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

authRouter.get('/current_user', (req, res, next) => {
  res.send(req.user);
  return next();
});

export default authRouter;
