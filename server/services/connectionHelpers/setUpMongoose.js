import mongoose from 'mongoose';

class MongoConnect {
  static connect(url) {
    const opts = {
      promiseLibrary: global.Promise,
      auto_reconnect: true,
      reconnectTries: Number.MAX_VALUE,
      reconnectInterval: 1000,
      useNewUrlParser: true,
    };

    mongoose.Promise = opts.promiseLibrary;
    mongoose.set('useFindAndModify', false);
    mongoose.connect(
      process.env.DB_CONN,
      opts
    );
    const db = mongoose.connection;
    db.on('error', err => {
      if (err.message.code === 'ETIMEDOUT') {
        console.log(`mongoose connection error: ${err}`);
        mongoose.connect(
          url,
          opts
        );
      }
    });
    db.once('open', () => {
      console.log('Connected to MongoLab Instance');
    });
  }
}

export default MongoConnect;
