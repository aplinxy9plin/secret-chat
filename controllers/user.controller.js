import User from '../models/user.model';
import logger from '../core/logger';

const controller = {};

controller.addUser = async (socket, data, emitName) => {
  const userToAdd = User({
    userId: data.vk_user_id,
    chatList: [],
  });
  try {
    const user = await User.getUser(data.vk_user_id);
    if (!user) {
      const savedUser = await User.addUser(userToAdd);
      logger.info('Adding user...');
      socket.emit('newUser', {
        type: 'success',
        result: savedUser,
      });
    }
  } catch (err) {
    logger.error(`Error in save user- ${err}`);
    socket.emit(emitName, {
      type: 'error with addUser',
    });
  }
};

controller.getChats = async (socket, data, emitName) => {
  try {
    const chats = await User.getChats(data.vk_user_id);
    logger.info('Getting chats...');
    socket.emit('getChats', {
      type: 'success',
      result: chats,
    });
  } catch (err) {
    logger.error(`Error in save user- ${err}`);
    socket.emit(emitName, {
      type: 'error with getChats',
    });
  }
};

export default controller;
