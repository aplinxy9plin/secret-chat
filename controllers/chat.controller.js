import Chat from '../models/chat.model';
import logger from '../core/logger';

const controller = {};

controller.createChat = async (socket, data) => {
  if (data.userId1 == null || data.userId2 == null) {
    logger.error('Error in create chat- One of user Id\'s is null');
    socket.emit('error_emit', {
      type: 'error with createChat',
    });
  }

  const chatToCreate = Chat({
    messages: [],
    users: [data.userId1, data.userId2],
  });

  try {
    const createdChat = await Chat.createChat(chatToCreate);
    logger.info('Creating chat...');
    socket.emit('newChat', {
      type: 'success',
      result: createdChat,
    });
  } catch (err) {
    logger.error(`Error in create chat- ${err}`);
    socket.emit('error_emit', {
      type: 'error with createChat',
    });
  }
};

export default controller;
