import Document from '../models/document.model';
import logger from '../core/logger';

const controller = {};

controller.addDocument = async (socket, data) => {
  const documentToAdd = Document({
    data: data.documentData,
    type: data.type,
  });

  try {
    const addDocument = await Document.addDocument(documentToAdd);
    logger.info('Adding document...');
    socket.emit('addDocument', {
      type: 'success',
      result: addDocument,
    });
  } catch (err) {
    logger.error(`Error in add document- ${err}`);
    socket.emit('error_emit', {
      type: 'error with addDocument',
    });
  }
};

export default controller;
