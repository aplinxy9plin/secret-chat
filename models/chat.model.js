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

ChatModel.addMessage = (_id, message) => ChatModel.update(
  { _id }, { $push: { messages: message } },
);

ChatModel.getMessages = (_id) => ChatModel.findOne({ _id }, '-users -_id');


export default ChatModel;
