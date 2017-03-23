var extend = require('extend');

function greet(req,msg){
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

  extend(o,msg);

  return o;
}

module.exports = greet;
