import mongoose from 'mongoose';

const AttachmentsSchema = mongoose.Schema({
  data: { type: Buffer, required: true },
  type: { type: String, enum: ['Image', 'Doc', 'Video'], required: true },
}, { collection: 'attachments' });

const AttachmentModel = mongoose.model('attachment', AttachmentsSchema);

AttachmentModel.addAttachment = (attachmentToAdd) => attachmentToAdd.save();

AttachmentModel.getAttachment = (_id) => AttachmentModel.findOne({ _id });

export default AttachmentModel;
