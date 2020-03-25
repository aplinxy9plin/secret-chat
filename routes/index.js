import userController from '../controllers/user.controller';
import chatController from '../controllers/chat.controller';
import attachmentController from '../controllers/attachment.controller';

const routes = (socket, data) => {
  const result = data.data[1];
  switch (data.data[0]) {
    case 'newUser':
      userController.addUser(socket, result, data.data[0]);
      break;
    case 'getChats':
      userController.getChats(socket, result, data.data[0]);
      break;
    case 'createChat':
      chatController.createChat(socket, result, data.data[0]);
      break;
    case 'sendMessage':
      chatController.sendMessage(socket, result, data.data[0]);
      break;
    case 'getMessages':
      chatController.getMessages(socket, result, data.data[0]);
      break;
    case 'removeUserMessages':
      chatController.removeUserMessages(socket, result, data.data[0]);
      break;
    case 'removeMessage':
      chatController.removeMessage(socket, result, data.data[0]);
      break;
    case 'userLeftChat':
      chatController.userLeftChat(socket, result, data.data[0]);
      break;
    case 'userConnectedToChat':
      chatController.userConnectedToChat(socket, result, data.data[0]);
      break;
    case 'getUsersState':
      chatController.getUsersState(socket, result, data.data[0]);
      break;
    case 'addAttachment':
      attachmentController.addAttachment(socket, result, data.data[0]);
      break;
    case 'getAttachment':
      attachmentController.getAttachment(socket, result, data.data[0]);
      break;
    default:
      break;
  }
};

export default routes;
