const Message = require('../models/Message');

exports.getMessagesWithUser = async (req, res) => {
  const { withUserId } = req.params;
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.userId, receiver: withUserId },
        { sender: withUserId, receiver: req.userId }
      ]
    }).sort('timestamp');

    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching messages');
  }
};
