import mongoose from 'mongoose';

const blogScheme = new mongoose.Schema({
    title: {type: String, required: true},
    subTitle: {type: String},
    description: {type: String, required: true},
    category: {type: String, required: true},
    image: {type: String, required: true},
    isPublished: {type: Boolean, default: false},
}, {timestamps: true});

const Blog = mongoose.model('Blog', blogScheme);

export default Blog;