const Message = require('../models/message');

var recall = (req, res, next) => {
  var id = req.body.id;
  Message.find({_id:id}).remove().exec();
  res.status(200).send({message: 'remove private successful'});
}
module.exports = { 
    recall
};