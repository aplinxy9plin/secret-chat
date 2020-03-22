import Chat from '../models/chat.model';
import User from '../models/user.model';
import ChatArchive from '../models/chatArchive.model';
import logger from '../core/logger';

const controller = {};

const messageTypes = ['text', 'document'];

function messagesToArchiveType(messages) {
  const archiveMessages = [];
  messages.forEach((message) => {
    const mainSender = messages[0].sender;
    archiveMessages.push({
      type: message.type,
      text: message.text,
      date: message.date,
      documents: message.documents,
      sender: message.sender === mainSender ? '1' : '2',
    });
  });
  return archiveMessages;
}

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
    || !data.message.date || !data.message.type || !messageTypes.includes(data.message.type)) {
    logger.error('Error in send message- One of required message fields is null');
    socket.emit('error_emit', {
      type: 'error with sendMessage',
    });
  } else if (!messageTypes.includes(data.message.type)) {
    logger.error('Error in send message- unexpected message type');
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
    } catch (err) {
      logger.error(`Error in user left chat- ${err}`);
      socket.emit('error_emit', {
        type: 'error with userLeftChat',
      });
    }
    try {
      const usersState = await Chat.getUsersState(data.chatId);
      let isUsersDisconnected = true;
      usersState.users.forEach((userInfo) => {
        if (userInfo.isInChat) {
          isUsersDisconnected = false;
        }
      });
      let messages = await Chat.getMessages(data.chatId);
      messages = messages.messages;
      let isAllMessagesNotVisible = true;
      for (let i = 0; i < messages.length; i += 1) {
        if (messages[i].visible === true) {
          isAllMessagesNotVisible = false;
        }
      }

      if (isUsersDisconnected && isAllMessagesNotVisible) {
        if (messages.length !== 0) {
          const messagesToAdd = messagesToArchiveType(messages);
          const chatArchiveToCreate = ChatArchive({
            messages: messagesToAdd,
          });
          const createdChatArchive = await ChatArchive.createArchiveChat(chatArchiveToCreate);
          logger.info('Create archive chat...');
          socket.emit('createArchiveChat', {
            type: 'success',
            result: createdChatArchive,
          });
        }
      }
    } catch (err) {
      logger.error(`Error in create atchive chat- ${err}`);
      socket.emit('error_emit', {
        type: 'error with createArchiveChat',
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
