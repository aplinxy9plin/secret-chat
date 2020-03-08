import User from '../models/user.model';
import logger from '../core/logger';

const controller = {};

controller.addUser = async (socket, data) => {
  if (!data.vk_user_id) {
    logger.error('Error in add user- vk user id is null');
    socket.emit('error_emit', {
      type: 'error with addUser',
    });
  } else {
    const userToAdd = User({
      userId: data.vk_user_id,
      chatList: [],
    });
    try {
      const savedUser = await User.addUser(userToAdd);
      logger.info('Adding user...');
      socket.emit('newUser', {
        type: 'success',
        result: savedUser,
      });
    } catch (err) {
      logger.error(`Error in save user- ${err}`);
      socket.emit('error_emit', {
        type: 'error with addUser',
      });
    }
  }
};

controller.getChats = async (socket, data) => {
  if (!data.vk_user_id) {
    logger.error('Error in get chats- vk user id is null');
    socket.emit('error_emit', {
      type: 'error with getChats',
    });
  } else {
    try {
      const chats = await User.getChats(data.vk_user_id);
      logger.info('Getting chats...');
      socket.emit('getChats', {
        type: 'success',
        result: chats,
      });
    } catch (err) {
      logger.error(`Error in save user- ${err}`);
      socket.emit('error_emit', {
        type: 'error with getChats',
      });
    }
  }
};

export default controller;
