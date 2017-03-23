'mode strict';

var express = require('express'),
  router = express.Router(),
  path = require('path'),
  greet = require(path.join(__dirname, '../../utils/greet.js'));
  shareit = require(path.join(__dirname, '../../utils/shareit.js'));


// /app1
router.get('/', function(req, res){
  res.render('app1_voting', greet(
    req,
    shareit({
      title: 'tweet test',
      text: 'tweet test',
      img: req.protocol+'://'+req.hostname+'img/pixabay_com_world.jpg',
      url: req.protocol+'://'+req.hostname+req.originalUrl,
    })
  ));
});


// *
router.all('*', function (req, res) {
  res.json({error: "Cannot "+req.method+" "+req.url});
});

module.exports = router;
