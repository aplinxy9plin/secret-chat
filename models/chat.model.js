import mongoose from 'mongoose';

const ChatSchema = mongoose.Schema({
  messages: [{
    type: { type: String, required: true },
    text: { type: String },
    sender: { type: Number },
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

ChatModel.sendMessage = (_id, _messageid) => ChatModel.update(
  { _id }, { messages: { $pop: _messageid } },
);

export default ChatModel;
