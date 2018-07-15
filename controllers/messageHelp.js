const User = require('../models/user');
const Message = require('../models/message');

var filter = (res, messages) => {
    var filterMsg = [];
    User.find({isActive: 1}, function(err, users) {
      messages.forEach((msg) => {
        users.forEach((user) => {
          if(msg.author === user.username)
            filterMsg.push(msg);
        })
      });
      return res.status(200).send(filterMsg);
    })
}
module.exports = { 
    filter
};