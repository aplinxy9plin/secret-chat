import userController from '../controllers/user.controller';
import chatController from '../controllers/chat.controller';
import attachmentController from '../controllers/attachment.controller';

const routes = (socket, data) => {
  const result = JSON.parse(data.data[1]);
  switch (data.data[0]) {
    case 'newUser':
      userController.newUser(socket, result);
      break;
    case 'getChats':
      userController.getChats(socket, result);
      break;
    case 'createChat':
      chatController.createChat(socket, result);
      break;
    case 'sendMessage':
      chatController.sendMessage(socket, result);
      break;
    case 'removeMessage':
      chatController.removeMessage(socket, result);
      break;
    case 'removeUserMessages':
      chatController.removeUserMessages(socket, result);
      break;
    case 'getMessages':
      chatController.getMessages(socket, result);
      break;
    case 'addAttachment':
      attachmentController.addAttachment(socket, result);
      break;
    case 'getAttachment':
      attachmentController.getAttachment(socket, result);
      break;
    default:
      break;
  }
};

export default routes;
