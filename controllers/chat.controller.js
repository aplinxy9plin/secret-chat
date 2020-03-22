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
      users: [{ userId: data.userId1, isInChat: true }, { userId: data.userId2, isInChat: false }],
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
    logger.error('Error in get messages- chat id is null');
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
      type: 'error with removeMessage',
    });
  } else {
    try {
      const removeMessage = await Chat.removeMessage(data.chatId, data.messageId);
      logger.info('Message removed...');
      socket.emit('removeMessage', {
        type: 'success',
        result: removeMessage,
      });
    } catch (err) {
      logger.error(`Error in send message- ${err}`);
      socket.emit('error_emit', {
        type: 'error with removeMessage',
      });
    }
  }
};

controller.removeUserMessages = async (socket, data) => {
  if (!data.chatId || !data.userId) {
    logger.error('Error in remove user messages- chat id or user id is null');
    socket.emit('error_emit', {
      type: 'error with removeUserMessages',
    });
  } else {
    try {
      const removeUserMessages = await Chat.removeUserMessages(data.chatId, data.userId);
      logger.info('Messages removed...');
      socket.emit('removeUserMessages', {
        type: 'success',
        result: removeUserMessages,
      });
    } catch (err) {
      logger.error(`Error in send message- ${err}`);
      socket.emit('error_emit', {
        type: 'error with removeUserMessages',
      });
    }
  }
};

controller.userLeftChat = async (socket, data) => {
  if (!data.chatId || !data.userId) {
    logger.error('Error in user left chat- chat id or user id is null');
    socket.emit('error_emit', {
      type: 'error with userLeftChat',
    });
  } else {
    try {
      const userLeftChatResult = await Chat.userLeftChat(data.chatId, data.userId);
      logger.info('Messages set visible false...');
      socket.emit('userLeftChat', {
        type: 'success',
        result: userLeftChatResult,
      });
      const usersState = await Chat.getUsersState(data.chatId);
      let isChatOnDelete = true;
      usersState.users.forEach((userInfo) => {
        if (userInfo.isInChat) {
          isChatOnDelete = false;
        }
      });
      if (isChatOnDelete) {
        socket.emit('chatOnDelete', {
          type: 'success',
          result: isChatOnDelete,
        });
      }
    } catch (err) {
      logger.error(`Error in user left chat- ${err}`);
      socket.emit('error_emit', {
        type: 'error with userLeftChat',
      });
    }
  }
};

controller.userConnectedToChat = async (socket, data) => {
  if (!data.chatId || !data.userId) {
    logger.error('Error in user left chat- chat id or user id is null');
    socket.emit('error_emit', {
      type: 'error with userConnectedToChat',
    });
  } else {
    try {
      const userConnectedResult = await Chat.userConnectedToChat(data.chatId, data.userId);
      logger.info('Messages set visible false...');
      socket.emit('userConnectedToChat', {
        type: 'success',
        result: userConnectedResult,
      });
    } catch (err) {
      logger.error(`Error in send message- ${err}`);
      socket.emit('error_emit', {
        type: 'error with userConnectedToChat',
      });
    }
  }
};

controller.getUsersState = async (socket, data) => {
  if (!data.chatId) {
    logger.error('Error in users state- chat id is null');
    socket.emit('error_emit', {
      type: 'error with getUsersState',
    });
  } else {
    try {
      const usersInfo = await Chat.getUsersState(data.chatId);
      logger.info('Getting users state...');
      socket.emit('getUsersState', {
        type: 'success',
        result: usersInfo,
      });
    } catch (err) {
      logger.error(`Error in get users state- ${err}`);
      socket.emit('error_emit', {
        type: 'error with getUsersState',
      });
    }
  }
};

export default controller;
