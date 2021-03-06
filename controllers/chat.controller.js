import Chat, { SOCKET_ID_NULL } from '../models/chat.model';
import User from '../models/user.model';
import ChatArchive from '../models/chatArchive.model';
import logger from '../core/logger';

const controller = {};

const messageTypes = ['text', 'document'];

const messagesToArchiveType = (messages) => {
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
};

controller.createChat = async (socket, data, emitName) => {
  if (!data.vk_user_id1 || !data.vk_user_id2 || data.vk_user_id1 === data.vk_user_id2) {
    logger.error('Error in create chat- One of user Id\'s is null or equal');
    socket.emit(emitName, {
      type: 'error with createChat',
    });
  } else {
    const chatToCreate = Chat({
      messages: [],
      users: [
        {
          userId: data.vk_user_id1,
          socketId: socket.id,
        },
        {
          userId: data.vk_user_id2,
          socketId: SOCKET_ID_NULL,
        }],
    });
    try {
      const user1 = await User.getUser(data.vk_user_id1);
      if (user1) {
        const createdChat = await Chat.createChat(chatToCreate);
        logger.info('Creating chat...');
        socket.emit('newChat', {
          type: 'success',
          result: createdChat,
        });

        const user2 = await User.getUser(data.vk_user_id2);
        if (!user2) {
          const userToAdd = User({
            userId: data.vk_user_id2,
            chatList: [{ chatId: createdChat._id, companion: data.vk_user_id1 }],
          });
          const savedUser = await User.addUser(userToAdd);
          logger.info('Adding user...');
          socket.emit('newUser', {
            type: 'success',
            result: savedUser,
          });
        } else {
          const user2ToUpdate = await User.update(
            { _id: user2._id }, { $push: { chatList: { chatId: createdChat._id, companion: data.vk_user_id1 } } },
          );
          logger.info('Updating user2 chat list...');
          socket.emit('updateUser', {
            type: 'success',
            result: user2ToUpdate,
          });
        }
        const user1ToUpdate = await User.update(
          { _id: user1._id }, { $push: { chatList: { chatId: createdChat._id, companion: data.vk_user_id2 } } },
        );
        logger.info('Updating user1 chat list...');
        socket.emit('updateUser', {
          type: 'success',
          result: user1ToUpdate,
        });
      } else {
        logger.error('Error in create chat, vk_user_id1 is undefined');
        socket.emit(emitName, {
          type: 'error with createChat',
        });
      }
    } catch (err) {
      logger.error(`Error in create chat- ${err}`);
      socket.emit(emitName, {
        type: 'error with createChat',
      });
    }
  }
};

controller.sendMessage = async (socket, data, emitName) => {
  if (!data.chatId || !data.message) {
    logger.error('Error in send message- chat id or message is null');
    socket.emit(emitName, {
      type: 'error with sendMessage',
    });
  } else if (!data.message.sender || !data.message.visible
    || !data.message.date || !data.message.type || !messageTypes.includes(data.message.type)) {
    logger.error('Error in send message- One of required message fields is null');
    socket.emit(emitName, {
      type: 'error with sendMessage',
    });
  } else if (!messageTypes.includes(data.message.type)) {
    logger.error('Error in send message- unexpected message type');
    socket.emit(emitName, {
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
      // Получаем состояние всех юзеров, находящихся сейчас в чате по их id, которые записаны в БД
      let usersState = await Chat.getUsersState(data.chatId);
      usersState = usersState.users
        .filter((userState) => userState.socketId !== SOCKET_ID_NULL);
      // Вытаскиваем из состояния socketId
      const thisChatSocketsId = [];
      usersState.forEach((element) => {
        thisChatSocketsId.push(element.socketId);
      });
      // Отправляем сообщение всем сокетам в чате
      thisChatSocketsId.forEach((socketId) => {
        global.io.sockets.connected[socketId].emit('newMessage', {
          type: 'message',
          result: newMessage,
        });
      });
    } catch (err) {
      logger.error(`Error in send message- ${err}`);
      socket.emit(emitName, {
        type: 'error with sendMessage',
      });
    }
  }
};

controller.getMessages = async (socket, data, emitName) => {
  if (!data.chatId) {
    logger.error('Error in get messages- chat id is null');
    socket.emit(emitName, {
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
      socket.emit(emitName, {
        type: 'error with getMessages',
      });
    }
  }
};

controller.removeMessage = async (socket, data, emitName) => {
  if (!data.chatId || !data.messageId) {
    logger.error('Error in remove message- chat id or message is null');
    socket.emit(emitName, {
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
      socket.emit(emitName, {
        type: 'error with removeMessage',
      });
    }
  }
};

controller.removeUserMessages = async (socket, data, emitName) => {
  if (!data.chatId || !data.vk_user_id) {
    logger.error('Error in remove user messages- chat id or user id is null');
    socket.emit(emitName, {
      type: 'error with removeUserMessages',
    });
  } else {
    try {
      const removeUserMessages = await Chat.removeUserMessages(data.chatId, data.vk_user_id);
      logger.info('Messages removed...');
      socket.emit('removeUserMessages', {
        type: 'success',
        result: removeUserMessages,
      });
    } catch (err) {
      logger.error(`Error in send message- ${err}`);
      socket.emit(emitName, {
        type: 'error with removeUserMessages',
      });
    }
  }
};

controller.userLeftChat = async (socket, data, emitName) => {
  if (!data.chatId || !data.vk_user_id) {
    logger.error('Error in user left chat- chat id or user id is null');
    socket.emit(emitName, {
      type: 'error with userLeftChat',
    });
  } else {
    try {
      const userLeftChatResult = await Chat.userLeftChat(data.chatId, data.vk_user_id);
      socket.emit('userLeftChat', {
        type: 'success',
        result: userLeftChatResult,
      });
      // Удаление сообщений
      const usersState = await Chat.getUsersState(data.chatId);

      const companionVkId = usersState.map((userState) => {
        if (userState.userId !== data.vk_user_id) {
          return userState.userId;
        }
        return null;
      });

      if (companionVkId) {
        logger.info('Messages setting visible false...');
        await Chat.removeUserMessages(data.chatId, companionVkId);
      }
    } catch (err) {
      logger.error(`Error in user left chat- ${err}`);
      socket.emit(emitName, {
        type: 'error with userLeftChat',
      });
    }
    // Архивирование чата
    try {
      const usersState = await Chat.getUsersState(data.chatId);
      const isUsersDisconnected = !usersState.users.filter((item) => item.socketId !== SOCKET_ID_NULL).lenght > 0;
      let messages = await Chat.getMessages(data.chatId);
      messages = messages.messages;
      const isAllMessagesNotVisible = !messages.filter((item) => item.visible === true).length > 0;
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
          const deletedChat = await Chat.deleteChat(data.chatId);
          logger.info('Delete chat...');
          socket.emit('deleteChat', {
            type: 'success',
            result: deletedChat,
          });
        }
      }
    } catch (err) {
      logger.error(`Error in create archive chat- ${err}`);
      socket.emit(emitName, {
        type: 'error with createArchiveChat',
      });
    }
  }
};

controller.userConnectedToChat = async (socket, data, emitName) => {
  if (!data.chatId || !data.vk_user_id) {
    logger.error('Error in user left chat- chat id or user id is null');
    socket.emit(emitName, {
      type: 'error with userConnectedToChat',
    });
  } else {
    try {
      const userConnectedResult = await Chat.userConnectedToChat(data.chatId, data.vk_user_id, socket.id);

      socket.emit('userConnectedToChat', {
        type: 'success',
        result: userConnectedResult,
      });
    } catch (err) {
      logger.error(`Error in send message- ${err}`);
      socket.emit(emitName, {
        type: 'error with userConnectedToChat',
      });
    }
  }
};

controller.getUsersState = async (socket, data, emitName) => {
  if (!data.chatId) {
    logger.error('Error in users state- chat id is null');
    socket.emit(emitName, {
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
      socket.emit(emitName, {
        type: 'error with getUsersState',
      });
    }
  }
};

export default controller;
