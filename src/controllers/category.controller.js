import { Category } from "../models/Category.js"
import ErrorCatch from "../utils/error.js"
import { Product } from './../models/Product.js';

const categoryController = {

    //@desc Add Category
    //@Route Private
    async addCategory(req, res, next){
        try {
           const {category} = req.body;
           await Category.create({category});

           res.status(201).json({
            success:true,
            message: "Category Added successfully"
           });
        } catch (error) {
            next(error)
        }
    },

    //@desc Get All Categories
    //@Route Public
    async getAllCategories(req, res, next){
        try {
           const categories = await Category.find({});
           res.status(201).json({
            success: true,
            categories
           })
        } catch (error) {
             next(error)
        }
    },

    //@desc Delete Categories By ID
    //@Route Public
    async deleteCategory(req, res, next){
        try {
            const category = await Category.findById(req.params.id);
            if(!category) return next (new ErrorCatch("Category Not Found", 404));
            const products = await Product.find({category: category._id});

            for (let i = 0; i < products.length; index++) {
                const product = products[i];
                product.category = undefined;
                await product.save();
            }

            await category.deleteOne();
            res.status(200).json({
                success: true,
                message: "Category deleted successfully"
            })

        } catch (error) {
            next(error)
        }
    }
}

export default categoryController