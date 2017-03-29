'use strict';

module.exports = function isAdmin(req, res, next) {
  if (
    req.isAuthenticated() &&
    req.user && req.user.local && req.user.local.username === 'admin'
  )
  {
    return next(null);
  }

  res.redirect('/')

};
