import mongoose from 'mongoose';

const ChatSchema = mongoose.Schema({
  messages: [{
    type: { type: String, required: true },
    text: { type: String },
    sender: { type: String },
    date: { type: Date, required: true },
    visible: { type: Boolean, required: true },
    documents: { type: mongoose.Schema.Types.ObjectId, ref: 'documents' },
  }],
  users: { type: Array, required: true },
}, { collection: 'chats' });

const ChatModel = mongoose.model('chats', ChatSchema);

ChatModel.createChat = (chatToCreate) => chatToCreate.save();

ChatModel.sendMessage = (_id, message) => ChatModel.update(
  { _id }, { $push: { messages: message } },
);

ChatModel.getMessages = (_id) => ChatModel.findOne({ _id }, '-users -_id');

ChatModel.sendMessage = (_id, message) => ChatModel.update(
  { _id }, { $push: { messages: message } },
);

ChatModel.removeMessage = (_id, _messageid) => ChatModel.updateOne(
  { _id, 'messages._id': _messageid }, {
    $set: { 'messages.$.visible': false },
  },
);

export default ChatModel;
