import mongoose from 'mongoose';

const UserSchema = mongoose.Schema({
  userId: { type: Number, required: true, unique: true },
  chatList: { type: Array, required: true },
}, { collection: 'users' });

const UserModel = mongoose.model('users', UserSchema);

UserModel.addUser = (userToAdd) => userToAdd.save();

export default UserModel;
