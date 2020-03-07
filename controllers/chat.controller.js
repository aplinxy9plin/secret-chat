import Chat from '../models/chat.model';
import User from '../models/user.model';
import logger from '../core/logger';

const controller = {};

controller.createChat = async (socket, data) => {
  if (!data.userId1 || !data.userId2 || data.userId1 === data.userId2) {
    logger.error('Error in create chat- One of user Id\'s is null or equal');
    socket.emit('error_emit', {
      type: 'error with createChat',
    });
  } else {
    const chatToCreate = Chat({
      messages: [],
      users: [data.userId1, data.userId2],
    });
    try {
      const user = await User.getUser(data.userId1);
      if (user) {
        const createdChat = await Chat.createChat(chatToCreate);
        logger.info('Creating chat...');
        socket.emit('newChat', {
          type: 'success',
          result: createdChat,
        });
      } else {
        logger.error('Error in create chat, userId is undefined');
        socket.emit('error_emit', {
          type: 'error with createChat',
        });
      }
    } catch (err) {
      logger.error(`Error in create chat- ${err}`);
      socket.emit('error_emit', {
        type: 'error with createChat',
      });
    }
  }
};

export default controller;
