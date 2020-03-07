import mongoose from 'mongoose';

const MessageSchema = mongoose.Schema({
  type: { type: String, required: true },
  text: { type: String },
  sender: { type: Number },
  date: { type: Date, required: true },
  visible: { type: Boolean, required: true },
  documents: { type: mongoose.Schema.Types.ObjectId, ref: 'documents' },
});

const ChatSchema = mongoose.Schema({
  messages: { type: [MessageSchema] },
  users: { type: Array, required: true },
}, { collection: 'chats' });

const ChatModel = mongoose.model('chats', ChatSchema);

ChatModel.createChat = (chatToCreate) => chatToCreate.save();

export default ChatModel;
