import passport from 'passport';

const router = app => {
  app.get('/auth/github', passport.authenticate('github', { scope: ['user', 'gist'] }));

  app.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/login' }), (req, res) => {
    res.redirect('/dashboard');
  });

  app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
  });

  app.get('/api/current_user', (req, res) => {
    res.status(200).send(req.user);
  });
};

export default router;
