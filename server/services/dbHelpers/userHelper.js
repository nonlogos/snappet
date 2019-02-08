import MongooseDBHelper from './dbBase';
import '../../models/User';

class UserDBHelper extends MongooseDBHelper {
  constructor(model) {
    super(model);
  }

  async addOrUpdateUser(user) {
    try {
      const mappedUserObj = this.mapUserObj(user);
      let result = await super.updateOrDelete({ githubId: user.id }, mappedUserObj, 'findOneAndUpdate');
      if (!result) result = await super.addNew(mappedUserObj);
      return result;
    } catch (error) {
      console.log(`UserDBHelper: ${error}`);
      throw new Error(error);
    }
  }

  mapUserObj(user) {
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
        node_id: user.node_id,
      };
    } catch (error) {
      console.log('mapUserObj: ', error);
      throw error;
    }
  }
}

export default UserDBHelper;
