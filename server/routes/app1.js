/* file: app1.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 *
 * DESCRIPTION: App1 Routes
 * AUTHOR: ikarus512
 * CREATED: 2017/03/13
 *
 * MODIFICATION HISTORY
 *  2017/04/04, ikarus512. Added copyright header.
 *
 */

/*jshint node: true*/
'use strict';

// GET /app1 - redirected to /app1/polls
// GET /app1/polls - view polls
// GET /app1/polls/:id - view poll details

// RESTAPI GET    /app1/api/polls - get polls
// RESTAPI POST   /app1/api/polls {title} - create new poll with title (authorized only)
// RESTAPI DELETE /app1/api/polls/:id - remove poll (authorized only)

// RESTAPI GET    /app1/api/polls/:id - get poll
// RESTAPI POST   /app1/api/polls/:id/options {title} - create new option with title (authorized only)
// RESTAPI PUT    /app1/api/polls/:id/options/:oid/vote - vote for poll option


var express = require('express'),
  router = express.Router(),
  path = require('path'),
  greet = require(path.join(__dirname, '../utils/greet.js')),
  shareit = require(path.join(__dirname, '../utils/shareit.js')),
  createUnauthorizedUser = require('./../middleware/create-unauthorized-user.js'),
  Promise = require('bluebird');

var User = require('../models/users.js');
var Poll = require('../models/app1-polls.js');




// GET /app1 - redirected to /app1/polls
router.get('/', function(req, res) {
  res.redirect('/app1/polls');
});

// GET /app1/polls - view polls
router.get('/polls', function(req, res) {
  res.render('app1_polls', greet(req));
});

// GET /app1/polls/:id - view poll details
router.get('/polls/:id',
  function pollTitleMiddleware(req, res, next) {
    // Find poll title (needed for sharing)
    Poll.findOne({_id:req.params.id}).exec()

    .then( function(poll) {
      if (!poll) { // if found, add to req
        throw new Error('Poll not found.');
      } else { // if found, add to req
        req.poll_title = poll.title;
        next();
      }
    })

    // In case of error
    .catch( function(err) {
      req.pol_title = '';
      next();
    });

  },
  function(req, res, next) {
    res.render('app1_poll', greet(
      req,
      {poll_id: req.params.id},
      shareit({
        title: req.poll_title + ' (DynApps Poll)',
        text: req.poll_title + ' (DynApps Poll)',
        img: req.protocol+'://'+req.headers.host+'img/pixabay_com_world.jpg',
        url: req.protocol+'://'+req.headers.host+req.originalUrl,
      })
    ));
  }
);


// RESTAPI GET    /app1/api/polls - get polls
router.get('/api/polls', function(req, res, next) {

  // Find all polls
  Poll.find({}).exec()

  // Respond all polls
  .then( function(polls) {
    res.status(200).json(polls);
  })

  // Catch all errors and respond with error message
  .catch( function(err) {
    return res.status(400).json({message:err.toString()});
  });

});

// RESTAPI POST   /app1/api/polls {title} - create new poll with title (authorized only)
router.post('/api/polls', function(req, res, next) {

  if (!req.isAuthenticated()) {
    return res.status(401).json({message:'Error: Only authorized person can create new poll.'});
  }

  // Find poll with same title
  Poll.findOne({title:req.body.title}).exec()

  .then( function(foundPoll) {
    if (foundPoll) { // if found
      throw new Error('Poll with this title alredy exists.');
    } else { // if not found, create
      var poll = new Poll();
      poll.title = req.body.title;
      poll.createdBy = req.user._id;
      return poll;
    }
  })

  // Save the new poll
  .then( function(poll) {
    return poll.save();
  })

  // Send the response back
  .then( function(poll) {
    return res.status(200).json(poll);
  })

  // Catch all errors and respond with error message
  .catch( function(err) {
    return res.status(400).json({message:err.toString()});
  });

});

// RESTAPI DELETE /app1/api/polls/:id - remove poll (authorized only)
router.delete('/api/polls/:id', function(req, res, next) {

  if (!req.isAuthenticated()) {
    return res.status(401).json({message:'Error: Only authorized person can delete the poll.'});
  }

  // Find poll by id
  Poll.findOne({_id:req.params.id}).exec()

  .then( function(poll) {
    if (poll) { // if found
      return poll;
    } else { // if not found, report error
      throw new Error('No poll with _id='+req.params.id+'.');
    }
  })

  // Remove the new poll
  .then( function(poll) {
    if (
      req.user && // user logged in
      (
        req.user._id.equals(poll.createdBy) ||  // poll creator
          req.user.type === 'local' &&
          req.user.name === 'admin'             // local admin
      )
    )
    {
      return poll.remove();
    } else {
      throw new Error('Only poll creator and local admin can remove the poll.');
    }
  })

  // Send the response back
  .then( function(poll) {
    return res.status(200).json();
  })

  // Catch all errors and respond with error message
  .catch( function(err) {
    return res.status(400).json({message:err.toString()});
  });

});

// RESTAPI GET    /app1/api/polls/:id - get poll
router.get('/api/polls/:id', function(req, res, next) {
  // Find poll by id
  Poll.findOne({_id:req.params.id}).exec()

  .then( function(poll) {
    if (poll) { // if found
      return poll;
    } else { // if not found, report error
      throw new Error('No poll with _id='+req.params.id+'.');
    }
  })

  // Send the response back
  .then( function(poll) {
    return res.status(200).json(poll);
  })

  // Catch all errors and respond with error message
  .catch( function(err) {
    return res.status(400).json({message:err.toString()});
  });

});

// RESTAPI POST   /app1/api/polls/:id/options {title} - create new option with title (authorized only)
router.post('/api/polls/:id/options', function(req, res, next) {

  if (!req.isAuthenticated()) {
    return res.status(401).json({message:'Error: Only authorized person can add poll options.'});
  }

  // Find poll by id
  Poll.findOne({_id:req.params.id}).exec()

  .then( function(poll) {
    if (poll) { // if found
      return poll;
    } else { // if not found, report error
      throw new Error('No poll with _id='+req.params.id+'.');
    }
  })

  // If poll option does not exist, add it to poll
  .then( function(poll) {
    if (poll.options.some( function(el) {return el.title===req.body.title;} )) {
      throw new Error('Option with this title already exists.');
    }
    poll.options.push({title: req.body.title});
    return poll.save();
  })

  // Send the response back
  .then( function(poll) {
    return res.status(200).json(poll);
  })

  // Catch all errors and respond with error message
  .catch( function(err) {
    return res.status(400).json({message:err.toString()});
  });

});

// RESTAPI PUT    /app1/api/polls/:id/options/:oid/vote - vote for poll option
router.put('/api/polls/:id/options/:oid/vote',
  createUnauthorizedUser,
  function(req, res, next)
{

  // Find poll by id
  Poll.findOne({_id:req.params.id}).exec()

  .then( function(poll) {
    if (poll) { // if found
      return poll;
    } else { // if not found, report error
      throw new Error('No poll with _id='+req.params.id+'.');
    }
  })

  // Find poll option by option id, add vote for it
  .then( function(poll) {

    var user_id =
      req.isAuthenticated() ? req.user._id :
      req.unauthorized_user ? req.unauthorized_user._id :
      undefined;

    if (!user_id) {
      throw new Error('Problem identifying user for voting.');
    }

    // Check if user already voted in this poll
    var votedOption={title:''};
    if (
      poll.options.some( function(option) {
        return option.votes.some( function(vote) {
          votedOption = option;
          return user_id.equals(vote);
        });
      })
    )
    {
      throw new Error('You already voted in this poll for '+votedOption.title+'.');
    }

    var idx;
    if (!poll.options.some( function(option,i) {idx=i; return option.id===req.params.oid;} )) {
      throw new Error('Option with this title does not exist.');
    }

    // Vote
    poll.options[idx].votes.push(user_id);
    return poll.save();
  })

  // Send the response back
  .then( function(poll) {
    return res.status(200).json(poll);
  })

  // Catch all errors and respond with error message
  .catch( function(err) {
    return res.status(400).json({message:err.toString()});
  });

});


module.exports = router;
