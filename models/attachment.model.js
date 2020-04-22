import mongoose from 'mongoose';

const AttachmentsSchema = mongoose.Schema({
  data: { type: Buffer, required: true },
  type: { type: String, required: true },
}, { collection: 'attachments' });

const AttachmentModel = mongoose.model('attachments', AttachmentsSchema);

AttachmentModel.addAttachment = (attachmentToAdd) => attachmentToAdd.save();

AttachmentModel.getAttachment = (_id) => AttachmentModel.findOne({ _id });

export default AttachmentModel;
