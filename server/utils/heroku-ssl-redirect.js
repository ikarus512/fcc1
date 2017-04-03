/**
* Force load with https on production environment
* https://devcenter.heroku.com/articles/http-routing#heroku-headers
*/

module.exports = function() {
  return function(req, res, next) {
    if (req.headers['x-forwarded-proto'] !== 'https') {
      if (req.method === 'GET') {
        res.redirect('https://' + req.hostname + req.originalUrl);
      } else {
        res.status(400).json({message: "Error: cannot "+req.method+" "+
          req.protocol+'://'+req.headers.host+req.originalUrl+". Use https."
        });
      }
    } else {
      next();
    }
  };
};
