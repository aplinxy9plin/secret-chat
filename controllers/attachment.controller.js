import Attachment from '../models/attachment.model';
import logger from '../core/logger';

const controller = {};

controller.addAttachment = async (socket, data, emitName) => {
  if (!data.attachmentData || !data.type) {
    logger.error('Error in add attachment- attachment data or type is null or type was wrong');
    socket.emit(emitName, {
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
      socket.emit(emitName, {
        type: 'error with addAttachment',
      });
    }
  }
};

controller.getAttachment = async (socket, data, emitName) => {
  if (!data.attachmentId) {
    logger.error('Error in get attachment- attachment id or message id is null');
    socket.emit(emitName, {
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
      socket.emit(emitName, {
        type: 'error with getAttachment',
      });
    }
  }
};
export default controller;
