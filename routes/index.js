import userController from '../controllers/user.controller';

const routes = (socket, data) => {
  const result = JSON.parse(data.data[1]);
  switch (data.data[0]) {
    case 'newUser':
      userController.addUser(socket, result);
      break;
    case 'getChats':
      userController.getChats(socket, result);
      break;
    default:
      break;
  }
};

export default routes;
