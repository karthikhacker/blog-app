import Category from '../models/categories.js';
import AppError from '../utils/appError.js';

export const createCategory = async (req, res) => {
    try {
        const category = new Category({
            name: req.body.name,
            user: req.user._id
        });
        const savedCategory = await category.save();
        res.status(200).json({ mesage: 'Category created.', data: savedCategory })
    } catch (error) {
        res.status(500).json(error)
    }
}

export const listCategories = async (req, res) => {
    try {
        const categoies = await Category.find().populate('user', '-__v -role -email -photo');
        res.status(200).json({ data: categoies });
    } catch (error) {
        res.status(500).json(error);
    }
}

export const listCategory = async (req, res, next) => {
    try {
        const category = await Category.findById({ _id: req.params.id }).populate('blogs', '-__v -category');
        if (!category) return next(new AppError('Not found', 404));
        res.status(200).json({ data: category });
    } catch (error) {
        res.status(500).json(error);
    }
}