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
 *  2017/06/02, ikarus512. Enable CORS.
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
// RESTAPI POST   /app1/api/polls/:id/options {title} - create new option with title
//     (authorized only)
// RESTAPI PUT    /app1/api/polls/:id/options/:oid/vote - vote for poll option

var
    express = require('express'),
    router = express.Router(),
    greet = require('../../utils/greet.js'),
    shareit = require('../../utils/shareit.js'),
    createUnauthorizedUser = require('../../middleware/create-unauthorized-user.js'),
    Promise = require('bluebird'),
    myErrorLog = require('../../utils/my-error-log.js'),
    myEnableCORS = require('../../middleware/my-enable-cors.js'),

    Poll = require('../../models/app1-polls.js'),
    User = require('../../models/users.js');

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

        .then(function(poll) {
            // istanbul ignore if
            if (!poll) { // if found, add to req
                throw new Error('Poll not found.');
            } else { // if found, add to req
                req.pollTitle = poll.title;
                return next();
            }
        })

        // In case of error
        .catch(function(err) { // eslint-disable-line handle-callback-err
            req.pollTitle = '';
            return next(err);
        });

    },
    function(err, req, res, next) { // Error handler
        var message = 'Internal error e0000014.';
        myErrorLog(req, err, message);
        return res.status(404).json({
            error: 'Not Found',
            message: message
        });
    },
    function(req, res, next) {
        res.render('app1_poll', greet(
            req,
            {pollId: req.params.id},
            shareit({
                title: req.pollTitle + ' (DynApps Poll)',
                text: req.pollTitle + ' (DynApps Poll)',
                img: req.protocol + '://' + req.headers.host + 'img/pixabay_com_world.jpg',
                url: req.protocol + '://' + req.headers.host + req.originalUrl
            })
        ));
    }
);

////////////////////////////////////////////////////////////////////////////////////////////////////

// Enable CORS on selected REST API
router.all('/api/polls', myEnableCORS);
router.all('/api/polls/:id', myEnableCORS);
router.all('/api/polls/:id/options', myEnableCORS);
router.all('/api/polls/:id/options/:oid/vote', myEnableCORS);

/**
 * @apiDefine UnauthorizedError
 *
 * @apiError (Error 401) {Object} Unauthorized
 *      User has not logged in.
 *
 * @apiErrorExample {json} Error response example:
 *     HTTP/1.1 401 Unauthorized
 *     {
 *       "error": "Unauthorized",
 *       "message": "Error: User has not logged in."
 *     }
 */

/**
 * @apiDefine NotFoundError
 *
 * @apiError (Error 404) {Object} NotFound
 *      Resource not found.
 *
 * @apiErrorExample {json} Error response example:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "Not Found",
 *       "message": "Error: Resource not found."
 *     }
 */

/**
 * @api {get} /app1/api/polls
 *              Get polls
 * @apiName getPolls
 * @apiGroup app1Polls
 *
 * @apiSuccess {Poll[]}   results               Array of polls
 * @apiSuccess {String}   results.title         Poll title
 * @apiSuccess {Option[]} results.options       Poll options
 * @apiSuccess {String}   results.options.title Poll option title
 * @apiSuccess {Vote[]}   results.options.votes Poll option votes
 *
 * @apiSuccessExample Success response example:
 *    curl -X GET https://ikarus512-fcc1.herokuapp.com/app1/api/polls
 *    HTTP/1.1 200 OK
 *    [ { "title": "Poll 1",
 *        "options": [
 *          { "title": "Option 1", "votes": ["598e02799a3b760d309f9137"] },
 *          { "title": "Option 2", "votes": [] } ] },
 *      { "title": "Poll 2",
 *        "options": [
 *          {"title": "Option 1", "votes": ["598e02799a3b760d309f9137","598e02799a3b760d309f9136"]},
 *          {"title": "Option 2", "votes": ["598e02779a3b760d309f9134"] } ] } ]
 *
 * @apiUse NotFoundError
 */
// RESTAPI GET    /app1/api/polls - get polls
router.get('/api/polls', function(req, res, next) {

    // Find all polls
    Poll.find({}).exec()

    // Respond all polls
    .then(function(polls) {
        res.status(200).json(polls);
    })

    // Catch all errors and respond with error message
    .catch(/*istanbul ignore next*/ function(err) {
        return res.status(404).json({
            error: 'Not Found',
            message: err.toString()
        });
    });

});

/**
 * @api {post} /app1/api/polls
 *              Create new poll with given title, authorized only
 * @apiName postPolls
 * @apiGroup app1Polls
 *
 * @apiParam (Body Params) {String} title New poll title.
 *
 * @apiParamExample {json} Parameter example:
 *    {
 *      "title": "New poll title"
 *    }
 *
 * @apiSuccess {Poll} results   Poll
 *
 * @apiSuccessExample Success response example:
 *    curl -X POST -c ../cookies.jar -d 'username=a&password=a' \
 *        https://ikarus512-fcc1.herokuapp.com/auth/api/local
 *    curl -X POST -b ../cookies.jar -d 'title="New poll title"' \
 *        https://ikarus512-fcc1.herokuapp.com/app1/api/polls
 *    HTTP/1.1 200 OK
 *    {
 *      "_id": "598f72c73b0962106839617a",
 *      "title": "NewPollTitle",
 *      "options": []
 *    }
 *
 * @apiUse UnauthorizedError
 * @apiUse NotFoundError
 */
// RESTAPI POST   /app1/api/polls {title} - create new poll with title (authorized only)
router.post('/api/polls', function(req, res, next) {

    if (!req.isAuthenticated()) {
        return res.status(401).json({
            error: 'Unauthorized',
            message: 'Error: Only authorized person can create new poll.'
        });
    }

    // Find poll with same title
    Poll.findOne({title:req.body.title}).exec()

    .then(function(foundPoll) {
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
    .then(function(poll) {
        return poll.save();
    })

    // Send the response back
    .then(function(poll) {
        return res.status(200).json(poll);
    })

    // Catch all errors and respond with error message
    .catch(function(err) {
        return res.status(404).json({
            error: 'Not Found',
            message: err.toString()
        });
    });

});

/**
 * @api {delete} /app1/api/polls/:id
 *                  Delete poll by id, authorized only
 * @apiName deletePolls
 * @apiGroup app1Polls
 *
 * @apiParam (Url Path Params) {String} id Poll id.
 *
 * @apiSuccess {Poll} results   Poll
 *
 * @apiSuccessExample Success response example:
 *    curl -X POST -c ../cookies.jar -d 'username=a&password=a' \
 *      https://ikarus512-fcc1.herokuapp.com/auth/api/local
 *    curl -X DELETE -b ../cookies.jar \
 *      https://ikarus512-fcc1.herokuapp.com/app1/api/polls/598f72c73b0962106839617a
 *    HTTP/1.1 200 OK
 *    {
 *    }
 *
 * @apiUse UnauthorizedError
 * @apiUse NotFoundError
 */
// RESTAPI DELETE /app1/api/polls/:id - remove poll (authorized only)
router.delete('/api/polls/:id', function(req, res, next) {

    if (!req.isAuthenticated()) {
        return res.status(401).json({
            error: 'Unauthorized',
            message: 'Error: Only authorized person can delete the poll.'
        });
    }

    // Find poll by id
    Poll.findOne({_id:req.params.id}).exec()

    .then(function(poll) {
        // istanbul ignore else
        if (poll) { // if found
            return poll;
        } else { // if not found, report error
            throw new Error('No poll with _id=' + req.params.id + '.');
        }
    })

    // Remove the new poll
    .then(function(poll) {
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
    .then(function(poll) {
        return res.status(200).json();
    })

    // Catch all errors and respond with error message
    .catch(function(err) {
        return res.status(404).json({
            error: 'Not Found',
            message: err.toString()
        });
    });

});

/**
 * @api {get} /app1/api/polls/:id
 *              Get poll by id
 * @apiName getPoll
 * @apiGroup app1Polls
 *
 * @apiParam (Url Path Params) {String} id Poll id.
 *
 * @apiSuccess {Poll}     results               Poll
 * @apiSuccess {String}   results.title         Poll title
 * @apiSuccess {Option[]} results.options       Poll options
 * @apiSuccess {String}   results.options.title Poll option title
 * @apiSuccess {Vote[]}   results.options.votes Poll option votes
 *
 * @apiSuccessExample Success response example:
 *    curl -X GET https://ikarus512-fcc1.herokuapp.com/app1/api/polls/598f72c73b0962106839617a
 *    HTTP/1.1 200 OK
 *    { "title": "Poll 1",
 *      "options": [
 *        { "title": "Option 1", "votes": ["598e02799a3b760d309f9137"] },
 *        { "title": "Option 2", "votes": [] } ]
 *    }
 *
 * @apiUse NotFoundError
 */
// RESTAPI GET    /app1/api/polls/:id - get poll
router.get('/api/polls/:id', function(req, res, next) {
    // Find poll by id
    Poll.findOne({_id:req.params.id}).exec()

    .then(function(poll) {
        // istanbul ignore else
        if (poll) { // if found
            return poll;
        } else { // if not found, report error
            throw new Error('No poll with _id=' + req.params.id + '.');
        }
    })

    // Send the response back
    .then(function(poll) {
        return res.status(200).json(poll);
    })

    // Catch all errors and respond with error message
    .catch(function(err) {
        return res.status(404).json({
            error: 'Not Found',
            message: err.toString()
        });
    });

});

/**
 * @api {post} /app1/api/polls/:id/options
 *              Create new option for poll with given id, authorized only
 * @apiName postPollOption
 * @apiGroup app1PollsOptions
 *
 * @apiParam (Url Path Params) {String} id Poll id.
 * @apiParam (Body Params) {String} title New option title.
 *
 * @apiParamExample {json} Parameter example:
 *    {
 *      "title": "New option title"
 *    }
 *
 * @apiSuccess {Poll}     results               Poll with new option
 * @apiSuccess {String}   results.title         Poll title
 * @apiSuccess {Option[]} results.options       Poll options
 * @apiSuccess {String}   results.options.title Poll option title
 * @apiSuccess {Vote[]}   results.options.votes Poll option votes
 *
 * @apiSuccessExample Success response example:
 *    curl -X POST -c ../cookies.jar -d 'username=a&password=a' \
 *      https://ikarus512-fcc1.herokuapp.com/auth/api/local
 *    curl -X POST -b ../cookies.jar -d 'title="New option title"' \
 *      https://ikarus512-fcc1.herokuapp.com/app1/api/polls/598f72c73b0962106839617a/options
 *    HTTP/1.1 200 OK
 *    { "title": "Poll 1",
 *      "options": [
 *        { "title": "New option title", "votes": [] }
 *      ]
 *    }
 *
 * @apiUse UnauthorizedError
 * @apiUse NotFoundError
 */
// RESTAPI POST   /app1/api/polls/:id/options {title} - create new option with title
//     (authorized only)
router.post('/api/polls/:id/options', function(req, res, next) {

    if (!req.isAuthenticated()) {
        return res.status(401).json({
            error: 'Unauthorized',
            message: 'Error: Only authorized person can add poll options.'
        });
    }

    // Find poll by id
    Poll.findOne({_id:req.params.id}).exec()

    .then(function(poll) {
        // istanbul ignore else
        if (poll) { // if found
            return poll;
        } else { // if not found, report error
            throw new Error('No poll with _id=' + req.params.id + '.');
        }
    })

    // If poll option does not exist, add it to poll
    .then(function(poll) {
        if (poll.options.some(function(el) {return el.title === req.body.title;})) {
            throw new Error('Option with this title already exists.');
        }
        poll.options.push({title: req.body.title});
        return poll.save();
    })

    // Send the response back
    .then(function(poll) {
        return res.status(200).json(poll);
    })

    // Catch all errors and respond with error message
    .catch(function(err) {
        return res.status(404).json({
            error: 'Not Found',
            message: err.toString()
        });
    });

});

/**
 * @api {post} /app1/api/polls/:id/options/:oid/vote
 *              Vote for poll option, id is poll id, oid is option id
 * @apiName postPollOptionVote
 * @apiGroup app1PollsOptions
 *
 * @apiParam (Url Path Params) {String} id Poll id.
 * @apiParam (Url Path Params) {String} oid Poll option id.
 *
 * @apiSuccess {Poll}     results               Poll with new option
 * @apiSuccess {String}   results.title         Poll title
 * @apiSuccess {Option[]} results.options       Poll options
 * @apiSuccess {String}   results.options.title Poll option title
 * @apiSuccess {Vote[]}   results.options.votes Poll option votes
 *
 * @apiSuccessExample Success response example:
 *    curl -X POST \
 *      https://ikarus512-fcc1.herokuapp.com/app1/api/polls/ \
 *      598f72c73b0962106839617a/options/598f72c73b0962106839617b/vote
 *    HTTP/1.1 200 OK
 *    { "title": "Poll 1",
 *      "options": [
 *        { "title": "Option 1", "votes": ["598e02799a3b760d309f9137"] },
 *        { "title": "Option 2", "votes": [] } ]
 *    }
 *
 * @apiUse NotFoundError
 */
// RESTAPI PUT    /app1/api/polls/:id/options/:oid/vote - vote for poll option
router.put('/api/polls/:id/options/:oid/vote',
  createUnauthorizedUser,
  function(req, res, next)
{

    // Find poll by id
    Poll.findOne({_id:req.params.id}).exec()

    .then(function(poll) {
        // istanbul ignore else
        if (poll) { // if found
            return poll;
        } else { // if not found, report error
            throw new Error('No poll with _id=' + req.params.id + '.');
        }
    })

    // Find poll option by option id, add vote for it
    .then(function(poll) {

        var userId =
          req.isAuthenticated() ? req.user._id :
          req.unauthorizedUser ? req.unauthorizedUser._id :
          // istanbul ignore next
          undefined;

        // istanbul ignore if
        if (!userId) {
            throw new Error('Problem identifying user for voting.');
        }

        // Check if user already voted in this poll
        var votedOption = {title:''};
        if (
          poll.options.some(function(option) {
            return option.votes.some(function(vote) {
                votedOption = option;
                return userId.equals(vote);
            });
        })
        )
        {
            // istanbul ignore next
            throw new Error('You already voted in this poll for ' + votedOption.title + '.');
        }

        var idx;
        // istanbul ignore if
        if (
            !poll.options.some(function(option,i) {
                idx = i; return option.id === req.params.oid;
            })
        )
        {
            throw new Error('Option with this title does not exist.');
        }

        // Vote
        poll.options[idx].votes.push(userId);
        return poll.save();
    })

    // Send the response back
    .then(function(poll) {
        return res.status(200).json(poll);
    })

    // Catch all errors and respond with error message
    .catch(function(err) {
        return res.status(404).json({
            error: 'Not Found',
            message: err.toString()
        });
    });

});

module.exports = router;
