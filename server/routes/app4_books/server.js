'mode strict';

var express = require('express'),
  router = express.Router(),
  path = require('path'),
  greet = require(path.join(__dirname, '../../utils/greet.js'));


// /app4
router.get('/', function(req, res){
  res.render('app4_books', greet(req));
});


// *
router.all('*', function (req, res) {
  res.json({error: "Cannot "+req.method+" "+req.url});
});

module.exports = router;
