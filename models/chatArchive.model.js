import mongoose from 'mongoose';

const ChatArchiveSchema = mongoose.Schema({
  messages: [{
    type: { type: String, enum: ['text', 'document'], required: true },
    text: { type: String },
    sender: { type: Number, enum: ['1', '2'], required: true },
    date: { type: Date, required: true },
    documents: { type: mongoose.Schema.Types.ObjectId, ref: 'documents' },
  }],
}, { collection: 'chatArchives' });

const ChatArchiveModel = mongoose.model('chatArchives', ChatArchiveSchema);

ChatArchiveModel.createArchiveChat = (chatArchiveToCreate) => chatArchiveToCreate.save();

export default ChatArchiveModel;
