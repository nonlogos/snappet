'use strict';
import passport from 'passport-restify';
import { Router } from 'restify-router';
import Cookies from 'cookies';

const authRouter = new Router();

authRouter.get('/auth/github', passport.authenticate('github', { scope: ['user', 'gist'] }));

authRouter.get(
  '/auth/github/callback',
  passport.authenticate('github', {
    failureRedirect: '/',
    failureFlash: true,
  }),
  (req, res, next) => {
    req.session = req._passport.session;
    res.send(302, null, {
      Location: '/',
      'Set-Cookie': `session=${req._passport.session.user} Domain=https://127.0.0.1`,
    });
    return next();
    // req.session = req._passport.session;
    // res.setCookie('session', req.session.user, { maxAge: 365 * 24 * 60 * 60 * 1000, signed: true, secure: true });
    // res.redirect('/', next);
  }
);

// authRouter.get('/auth/github/callback', function(req, res, next) {
//   passport.authenticate('github', function(err, user, req) {
//     if (err) {
//       return next(err);
//     }
//     // Technically, the user should exist at this point, but if not, check
//     if (!user) {
//       return next(new restify.InvalidCredentialsError('Please check your details and try again.'));
//     }
//     // Log the user in!
//     req.logIn(user, function(err) {
//       if (err) {
//         return next(err);
//       }
//       console.log(req.isAuthenticated());
//       req.session.user_id = req.user.id;
//       res.redirect('/', next);
//     });
//   })(req, res, next);
// });

authRouter.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

authRouter.get('/current_user', (req, res, next) => {
  res.send(req.user);
  return next();
});

export default authRouter;
