import mongoose from 'mongoose';

const UserSchema = mongoose.Schema({
  userId: { type: Number, required: true, unique: true },
  chatList: { type: Array, required: true },
}, { collection: 'users' });

const UserModel = mongoose.model('users', UserSchema);

UserModel.addUser = (userToAdd) => userToAdd.save();

UserModel.getChats = (userId) => UserModel.findOne({ userId }, { _id: 0, chatList: 1 });

export default UserModel;
