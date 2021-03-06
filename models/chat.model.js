import mongoose from 'mongoose';

const ChatSchema = mongoose.Schema({
  messages: [{
    type: { type: String, enum: ['text', 'document'], required: true },
    text: { type: String },
    sender: { type: Number },
    date: { type: Date, required: true },
    visible: { type: Boolean, required: true },
    documents: { type: mongoose.Schema.Types.ObjectId, ref: 'documents' },
  }],
  users: [{
    userId: { type: Number, required: true },
    socketId: { type: String, required: true },
  }],
}, { collection: 'chats' });

const SOCKET_ID_NULL = 'null';

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

ChatModel.removeUserMessages = (_id, userId) => ChatModel.update(
  { _id },
  { $set: { 'messages.$[i].visible': false } }, { arrayFilters: [{ 'i.sender': userId }] },
);

ChatModel.userLeftChat = (_id, userId) => ChatModel.update(
  { _id }, { $set: { 'users.$[i].socketId': SOCKET_ID_NULL } }, { arrayFilters: [{ 'i.userId': userId }] },
);

ChatModel.userConnectedToChat = (_id, userId, socketId) => ChatModel.update(
  { _id }, { $set: { 'users.$[i].socketId': socketId } }, { arrayFilters: [{ 'i.userId': userId }] },
);

ChatModel.deleteChat = (_id) => ChatModel.deleteOne({ _id });

ChatModel.getUsersState = (_id) => ChatModel.findOne({ _id }, '-messages -_id');

export default ChatModel;
export { SOCKET_ID_NULL };
