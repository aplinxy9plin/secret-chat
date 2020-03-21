import User from '../models/user.model';
import logger from '../core/logger';

const controller = {};

controller.newUser = async (socket, data) => {
  const userToAdd = User({
    userId: data.vk_user_id,
    chatList: [],
  });
  try {
    const savedUser = await User.newUser(userToAdd);
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
};

controller.getChats = async (socket, data) => {
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
};

export default controller;
