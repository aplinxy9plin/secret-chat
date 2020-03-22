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
        socket.emit('createChat', {
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

controller.sendMessage = async (socket, data) => {
  if (!data.chatId || !data.message) {
    logger.error('Error in send message- chat id or message is null');
    socket.emit('error_emit', {
      type: 'error with sendMessage',
    });
  } else if (!data.message.sender || !data.message.visible
    || !data.message.date || !data.message.type) {
    logger.error('Error in send message- One of required message fields is null');
    socket.emit('error_emit', {
      type: 'error with sendMessage',
    });
  } else {
    try {
      const newMessage = await Chat.sendMessage(data.chatId, data.message);
      logger.info('Sending message...');
      socket.emit('sendMessage', {
        type: 'success',
        result: newMessage,
      });
    } catch (err) {
      logger.error(`Error in send message- ${err}`);
      socket.emit('error_emit', {
        type: 'error with sendMessage',
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

controller.removeMessage = async (socket, data) => {
  if (!data.chatId || !data.messageId) {
    logger.error('Error in remove message- chat id or message is null');
    socket.emit('error_emit', {
      type: 'error with visible',
    });
  } else {
    try {
      const removeMessage = await Chat.removeMessage(data.chatId, data.messageId);
      logger.info('Message set visible false...');
      socket.emit('removeMessage', {
        type: 'success',
        result: removeMessage,
      });
    } catch (err) {
      logger.error(`Error in send message- ${err}`);
      socket.emit('error_emit', {
        type: 'error with visible',
      });
    }
  }
};

controller.removeUserMessages = async (socket, data) => {
  if (!data.chatId || !data.userId) {
    logger.error('Error in remove user messages- chat id or user id is null');
    socket.emit('error_emit', {
      type: 'error with visible',
    });
  } else {
    try {
      const removeUserMessages = await Chat.removeUserMessages(data.chatId, data.userId);
      logger.info('Messages set visible false...');
      socket.emit('removeUserMessages', {
        type: 'success',
        result: removeUserMessages,
      });
    } catch (err) {
      logger.error(`Error in send message- ${err}`);
      socket.emit('error_emit', {
        type: 'error with visible',
      });
    }
  }
};

export default controller;
