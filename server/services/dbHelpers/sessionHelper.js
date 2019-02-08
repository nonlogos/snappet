import MongooseDBHelper from './dbBase';
import '../../models/Session';
import { randomBytes } from 'crypto';

class SessionDBHelper extends MongooseDBHelper {
  constructor(model) {
    super(model);
  }

  async get(sessionId) {
    try {
      const session = await super.get({ sessionId }, 'findOne', null, { lean: true }, '_user');
      return session;
    } catch (error) {
      console.log(`SessionDBHelper.get: ${error}`);
      throw new Error(error);
    }
  }

  // * [TODO] may not need to check for existing session
  async findOneOrCreateNew(accessToken, userId) {
    try {
      if (!accessToken || !userId) throw 'requires accessToken and userId';
      let result;
      let existedSession = await super.get({ accessToken }, 'findOne');
      if (existedSession) result = existedSession;
      else {
        const sessionId = await this._createSessionId();
        const sessionObj = {
          sessionId,
          accessToken,
          _user: userId,
        };
        result = await super.addNew(sessionObj);
      }
      return result.sessionId;
    } catch (error) {
      console.log(`SessionDBHelper.findOneOrCreateNew: ${error}`);
      throw new Error(error);
    }
  }

  async _createSessionId() {
    try {
      return new Promise((resolve, reject) => {
        randomBytes(48, function(err, buffer) {
          if (err) reject(err);
          resolve(buffer.toString('hex'));
        });
      });
    } catch (error) {
      console.log(`SessionDBHelper._createSessionId: ${error}`);
      throw new Error(error);
    }
  }
}

export default SessionDBHelper;
