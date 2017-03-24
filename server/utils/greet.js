var extend = require('extend');

function greet(req,o2,o3){
  var o={};

  if(req.user) {
    extend(o,{
      //greeting : 'Hi, '+req.user[req.user.type].username+' ('+req.user.type+')!',
      username : req.user[req.user.type].username,
      logintype: req.user.type,
    });
  } else {
    //o.greeting='(Not logged in.)';
  }

  extend(o,o2,o3);

  return o;
}

module.exports = greet;
