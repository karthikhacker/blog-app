import mongoose from 'mongoose';

const BlogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
    description: {
        type: String,
        required: true,
    },
    blogImage: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    createAt: {
        type: Date,
        default: Date.now
    }
})

export default mongoose.model('Blog', BlogSchema);