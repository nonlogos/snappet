import { OAuth2 } from 'oauth';

class GithubOauth {
  constructor() {
    this._clientId = process.env.GITHUB_CLIENT_ID;
    this._clientSecret = process.env.GITHUB_CLIENT_SECRET;
    (this._baseSite = 'https://github.com'), (this._authorizePath = '/login/oauth/authorize');
    this._redirectUri = process.env.GITHUB_URI;
    this._accessTokenPath = '/login/oauth/access_token';
    this._customHeader = false;
    this._oauth2 = new OAuth2(
      this._clientId,
      this._clientSecret,
      this._baseSite,
      this._authorizePath,
      this._accessTokenPath,
      null
    ); /* custom headers * */
  }

  _getAuthUrl(scope) {
    return this._oauth2.getAuthorizeUrl({
      redirect_uri: this._redirectUri,
      scope: scope || ['user'], // default scope is user
      state: 'T4Vypcp7xECZdLzVUV8r',
    });
  }

  _getAccessTokenPromise(authCode, redirect_uri) {
    return new Promise((resolve, reject) => {
      this._oauth2.getOAuthAccessToken(authCode, { redirect_uri }, (error, access_token, refresh_token, results) => {
        if (error) {
          console.log('GithubOauth.getOauthAccessToken: ', error);
          reject(error);
        } else if (results.error) {
          console.log('GithubOauth.getOauthAccessToken: ', results);
          reject(results);
        } else {
          console.log('obtained access_token', access_token);
          resolve(access_token);
        }
      });
    });
  }

  authenticate(res, next, scope) {
    if (!res || !next) throw new TypeError('GithubOauth.authenticate: requires res and next');
    const githubAuthorizeUri = this._getAuthUrl(scope);
    res.redirect(githubAuthorizeUri, next);
  }

  async getOauthAccessToken(code) {
    try {
      if (!code) throw new TypeError('GithubOauth.getOauthAccessToken: requires req and res');
      const result = await this._getAccessTokenPromise(code, this._redirectUri);
      return result;
    } catch (error) {
      console.log('getOauthAccessToken: ', error);
      throw new Error(error);
    }
  }
}

export default GithubOauth;
