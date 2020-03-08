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

controller.addMessage = async (socket, data) => {
  if (!data.chatId || !data.message) {
    logger.error('Error in add message- chat id or message is null');
    socket.emit('error_emit', {
      type: 'error with addMessage',
    });
  } else if (!data.message.sender || !data.message.visible
    || !data.message.date || !data.message.type) {
    logger.error('Error in add message- One of required message fields is null');
    socket.emit('error_emit', {
      type: 'error with addMessage',
    });
  } else {
    try {
      const newMessage = await Chat.addMessage(data.chatId, data.message);
      logger.info('Adding message...');
      socket.emit('addMessage', {
        type: 'success',
        result: newMessage,
      });
    } catch (err) {
      logger.error(`Error in add message- ${err}`);
      socket.emit('error_emit', {
        type: 'error with addMessage',
      });
    }
  }
};

controller.getMessages = async (socket, data) => {
  if (!data.chatId) {
    logger.error('Error in get messaget- chat id is null');
    socket.emit('error_emit', {
      type: 'error with getMessages',
    });
  } else {
    try {
      const messages = await Chat.getMessages(data.chatId);
      logger.info('Getting messages...');
      socket.emit('getMessages', {
        type: 'success',
        result: messages,
      });
    } catch (err) {
      logger.error(`Error in get messages- ${err}`);
      socket.emit('error_emit', {
        type: 'error with getMessages',
      });
    }
  }
};
export default controller;
