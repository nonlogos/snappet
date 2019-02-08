import express from 'express';
import { GithubGistAPI } from '../services/restApi';
import { userFindById } from '../services/dbHelpers/userHelper';
import { gistFindAndUpdate } from '../services/dbHelpers/gistHelper';
import isAuthenticated from '../middlewares/auth';

const apis = express.Router();
apis.get('/getGists', isAuthenticated, async (req, res, next) => {
  try {
    if (req.user) {
      const user = await userFindById(req.user);
      if (user) {
        const { api_token, gists_url, id } = user;
        const query = new GithubGistAPI(api_token);
        const queryResult = await query.getAllGists(gists_url);
        let updatedDBGists = [];
        if (queryResult.length) {
          const pArray = queryResult.map(async gist => {
            const updatedGist = await gistFindAndUpdate(gist, id).catch(error => {
              throw new Error(error);
            });
            return updatedGist;
          });
          updatedDBGists = await Promise.all(pArray);
        }
        res.status(200).send(JSON.stringify(updatedDBGists));
      } else res.status(401).send('user needs to login');
    }
  } catch (error) {
    console.log('initiateGists', error);
    next(error);
  }
});

export default apis;
