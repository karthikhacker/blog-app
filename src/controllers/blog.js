import Blog from "../models/blog.js";
import Category from '../models/categories.js';
import APIFeature from "../utils/apiFeatures.js";
import AppError from "../utils/appError.js";

export const createBlog = async (req, res, next) => {
    const { title, description, blogImage, author } = req.body;
    try {
        const category = await Category.findOne({ _id: req.params.catId });
        const blog = new Blog({
            title,
            category: category._id,
            description,
            blogImage,
            author: req.user._id
        })
        const savedBlog = await blog.save();
        category.blogs.push(savedBlog._id);
        await category.save();
        res.status(201).json({ message: 'Blog Created.', data: savedBlog });
    } catch (error) {
        next(error)
    }
}

export const blogImageUpload = (req, res) => {
    try {
        let results = [];
        req.files?.map(file => {
            results.push({ fileName: file.originalname, loc: file.location });
        })
        res.status(200).json({ data: results })
    } catch (error) {
        res.status(400).json(error)
    }
}

export const blogs = async (req, res, next) => {
    try {
        const findQuery = Blog.find().populate('author', '-__v -role -email -photo')
        const feature = new APIFeature(findQuery, req.query)
            .filter()
            .paginate()
        const blogs = await feature.query;
        res.status(200).json({ results: blogs.length, data: blogs })
    } catch (error) {
        res.status(400).json(error)
    }
}

export const blog = async (req, res, next) => {
    try {
        const blog = await Blog.findById({ _id: req.params.id })
            .populate('category', '-_id -__v -blogs')
            .populate('user', '-__v -role -email -photo')
        if (!blog) {
            return next(new AppError('Not found', 404))
        }
        res.status(200).json({ data: blog });
    } catch (error) {
        next(error)
    }
}

export const updateBlog = async (req, res, next) => {
    try {
        const { title, description, blogImage, author } = req.body;
        const blogData = {
            title,
            description,
            blogImage,
            author
        }
        const findBlog = await Blog.findById(req.params.id);
        if (!findBlog) return next(new AppError('Blog not found', 404));
        const updatedBlog = await Blog.findByIdAndUpdate({ _id: req.params.id }, blogData, { new: true });
        res.status(200).json({ Message: 'Blog updated', data: updatedBlog });
    } catch (error) {
        res.status(500).json(error)
    }

}
export const deleteBlog = async (req, res) => {
    try {
        const findBlog = await Blog.findById(req.params.id);
        if (!findBlog) return next(new AppError('Blog not found', 404));
        await Blog.findByIdAndDelete({ _id: req.params.id });
        res.status(200).json({ message: 'Blog deleted' });
    } catch (error) {
        res.status(500).json(error);
    }
}