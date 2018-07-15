const User = require('../models/user');
const Message = require('../models/message');
const Activity = require('../models/activity');
const Event = require('../socket/event');
var CronJob = require('cron').CronJob;
const nodemailer = require('nodemailer');
const emailNotification = require('./emailNotification');

var job = new CronJob('00 55 15 * * 0-6', function() {
  /* Runs every day at 09:30:00 AM. */
    console.log("running cron");
    var now = Date.now();
    var start = new Date(now + 1000*60*60*24);
    var end = new Date(now + 1000*60*60*24*2);
    Activity.find({startDate: {$lt: end, $gt: start}}).exec(function(err, activities) {
        if (err) throw err;
        for (var i = 0; i < activities.length; i++) {
            var activity = activities[i];
            var attendees = activity.attendees;
            for (var j = 0; j < attendees.length; j++) {
                var myusername = attendees[j];
                var content = emailNotification.generateEmailContent(activity, myusername);
                User.findOne({username: myusername}, function (err, user) {
                    if (user.email) {
                        emailNotification.sendEmail(user.email, content, activity.title);
                    }
                });

            }
        }
    });

  }, function () {
    /* This function is executed when the job stops */
  },
  false, /* Start the job right now */
  'America/New_York' /* Time zone of this job. */
);

job.start();

var getActivity = (req, res, next) => {
    Activity.find().sort('-postDate').exec(function(err, activities) {
        if (err) throw err;
        res.status(200).json(activities);
    });
}

var postActivity = (req, res, next) => {
    var activity = req.body;
    if(!activity.title || !activity.location || !activity.startDate 
        || !activity.endDate || !activity.spots || !activity.description) {
        return res.status(400).send({ message : 'data required'});
    }
    var title = activity.title.trim();
    var location = activity.location.trim();
    var startDate = activity.startDate;
    var endDate = activity.endDate;
    var spots = activity.spots;
    var description = activity.description.trim();

    // Avoid duplicate title
    Activity.findOne({title: title}).exec(function(err, activity) {
        if(activity) {
            console.log('activity exists');
            return res.status(400).send({exist: 1, message: "activity exists"});
        }
        // Create activity
        Activity.create({title: title, location: location, startDate: startDate, 
            endDate: endDate, spots: spots, description: description}, function(err, activity) {
            if(err) {return next(err);}
            var socketio = req.app.get('socketio');
            console.log("emit new activity");
            socketio.emit(Event.combine(Event.all, Event.activity), {msg: activity });
            return res.status(200).send({message: 'post activity successful'});
        });        
    });

    
}

var register = (req, res, next) => {
    var title = req.body.title;
    var email = req.body.email;
    var myusername = req.username;

    if (!title || !email) {
        return res.status(400).send({message: 'data required'});
    }

    Activity.findOne({title: title}).exec(function(err, activity) {
        User.findOne({username: myusername}, function (err, user) {
            if (user) {
                user.email = email;
                user.save();
            } else {
                return res.status(400).send({message: 'user not found'});
            }

            if(activity) {
                if (activity.spots < 1) {
                    return res.status(200).send({spot: 0, message: 'Not enough spots'});
                }
                if (activity.attendees.indexOf(myusername) != -1) {
                    return res.status(400).send({registered: 1, message: 'Already registered'});
                }
                activity.attendees.push(myusername);
                activity.spots = activity.spots - 1;
                activity.save();
                var socketio = req.app.get('socketio');
                socketio.emit(Event.combine(Event.all, Event.updateActivity), {title: title, username: myusername});
                return res.status(200).send({message: 'register success'});
            } else {
                return res.status(400).send({message: 'activity not found'});
            }
            
        });
        
    });
}

var unregister = (req, res, next) => {
    var title = req.body.title;
    var myusername = req.username;

    if (!title) {
        return res.status(400).send({message: 'data required'});
    }

    Activity.findOne({title: title}).exec(function(err, activity) {
        if(activity) {
            var index = activity.attendees.indexOf(myusername);
            if (index > -1) {
                activity.attendees.splice(index, 1);
            } else {
                return res.status(400).send({registered: 0, message: 'not registered'});
            }
            activity.spots = activity.spots + 1;
            activity.save();
            var socketio = req.app.get('socketio');
            socketio.emit(Event.combine(Event.all, Event.updateActivity), {title: title, username: myusername});
            return res.status(200).send({message: 'unregister success'});
        } else {
            return res.status(400).send({message: 'activity not found'});
        }
    });
}

module.exports = { 
    register, 
    getActivity, 
    unregister,
    postActivity
};
