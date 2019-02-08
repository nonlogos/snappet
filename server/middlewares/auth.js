import SessionDBHelper from '../services/dbHelpers/sessionHelper';

export const isAuthenticated = async (req, res, next) => {
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
};
