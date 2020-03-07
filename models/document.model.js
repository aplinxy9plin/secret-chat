import mongoose from 'mongoose';

const DocumentsSchema = mongoose.Schema({
  data: { type: Buffer },
  type: { type: String, enum: ['Image', 'Doc', 'Video'], required: true },
}, { collection: 'documents' });

const DocumentModel = mongoose.model('documents', DocumentsSchema);

DocumentModel.addDocument = (documentToAdd) => documentToAdd.save();

export default DocumentModel;
