import mongoose from 'mongoose';

// import '../../models/User';
import '../../models/Gist';
import '../../models/Tag';
// import '../../models/Session';

class MongooseDBHelper {
  constructor(model) {
    this._model = mongoose.model(model);
  }

  async get(params, action, projection = null, options = null, populateDoc) {
    try {
      if (!params || !action) throw 'requires a params and action';
      let result;
      if (populateDoc && typeof populateDoc === 'string') {
        result = await this._model[action](params, projection, options).populate(populateDoc);
      } else result = await this._model[action](params, projection, options);

      return result;
    } catch (error) {
      console.log(`MongooseDBHelper.get: ${error}`);
      throw new Error(error);
    }
  }

  async addNew(value) {
    try {
      if (!value) throw 'requires a params and action';
      const result = await new this._model(value).save();
      return result;
    } catch (error) {
      console.log(`MongooseDBHelper.add: ${error}`);
      throw new Error(error);
    }
  }

  async updateOrDelete(params, value, action = 'findOneAndUpdate', options = { lean: true }) {
    try {
      if (!params || !value) throw 'requires a params and newObj';
      const result = await this._model[action](params, value, options);
      return result;
    } catch (error) {
      console.log(`MongooseDBHelper.updateOrDelete: ${error}`);
      throw new Error(error);
    }
  }
}

export default MongooseDBHelper;
