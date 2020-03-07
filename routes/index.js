import userController from '../controllers/user.controller';
import chatController from '../controllers/chat.controller';

const routes = (socket, data) => {
  const result = JSON.parse(data.data[1]);
  switch (data.data[0]) {
    case 'newUser':
      userController.addUser(socket, result);
      break;
    case 'getChats':
      userController.getChats(socket, result);
      break;
    case 'createChat':
      //Проверка есть ли такие _id в Users
      chatController.createChat(socket, result);
      break;
    default:
      break;
  }
};

export default routes;
