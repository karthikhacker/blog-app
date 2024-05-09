import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: [true, 'Email in use']
    },
    password: {
        type: String,
        min: [6, 'Password minimum 6 character'],
        required: [true, 'Password is required']
    },
    photo: {
        type: String
    }
})

export default mongoose.model('User', UserSchema);