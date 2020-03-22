import Attachment from '../models/attachment.model';
import logger from '../core/logger';

const controller = {};
const attachmentTypes = ['Image', 'Doc', 'Video'];

controller.addAttachment = async (socket, data) => {
  if (!data.attachmentData || !data.type || !attachmentTypes.includes(data.type)) {
    logger.error('Error in add attachment- attachment data or type is null or type was wrong');
    socket.emit('error_emit', {
      type: 'error with addAttachment',
    });
  } else if (!attachmentTypes.includes(data.type)) {
    logger.error('Error in send message- unexpected attachment type');
    socket.emit('error_emit', {
      type: 'error with addAttachment',
    });
  } else {
    const attachmentToAdd = Attachment({
      data: data.attachmentData,
      type: data.type,
    });

    try {
      const addAttachment = await Attachment.addAttachment(attachmentToAdd);
      logger.info('Adding document...');
      socket.emit('addAttachment', {
        type: 'success',
        result: addAttachment,
      });
    } catch (err) {
      logger.error(`Error in add attachment- ${err}`);
      socket.emit('error_emit', {
        type: 'error with addAttachment',
      });
    }
  }
};

controller.getAttachment = async (socket, data) => {
  if (!data.attachmentId || !data.messageId) {
    logger.error('Error in get attachment- attachment id or message id is null');
    socket.emit('error_emit', {
      type: 'error with getAttachment',
    });
  } else {
    try {
      const attachment = await Attachment.getAttachment(data.attachmentId);
      logger.info('Getting attachment...');
      socket.emit('getAttachment', {
        type: 'success',
        result: attachment,
      });
    } catch (err) {
      logger.error(`Error in save user- ${err}`);
      socket.emit('error_emit', {
        type: 'error with getAttachment',
      });
    }
  }
};
export default controller;
