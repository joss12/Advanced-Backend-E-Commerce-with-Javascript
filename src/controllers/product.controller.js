import { Product } from "../models/Product.js";
import ErrorCatch from "./../utils/error.js";
import { sendToken, cookieOptions, getDataUri } from "../utils/token.js";
import cloudinary from "cloudinary";

const productController = {
  //@desc Create New Product
  async CreateProduct(req, res, next) {
    try {
      const { name, description, category, price, stock } = req.body;

      if (!req.file) {
        return next(new ErrorCatch("Please add image", 404));
      }
      const file = getDataUri(req.file); 
      const myCloud = await cloudinary.v2.uploader.upload(file.content);
      const image = {
        public_id: myCloud.public_id,
        url: myCloud.secure_site,
      };

      await Product.create({
        name,
        description,
        category,
        price,
        stock,
        images: [image],
      });

      res.status(200).json({
        success: true,
        message: "Products Created successfully",
      });
    } catch (error) {
      next(error);
    }
  },

  //@desc Search & Category query
  async getAllProduct(req, res, next) {

    try {
      const { keyword, category } = req.query;
      const products = await Product.find({
        name: {
          $regex: keyword ? keyword : "",
          $options: "i",
        },
        category: category ? category : undefined,
      });
    
      res.status(200).json({
        success: true,
        products,
      });
    } catch (error) {
      next(error);
    }
  },

  //@desc Get Single Product by Id and products Details
  async getOneProduct(req, res, next) {
    try {
      const products = await Product.findById(req.params.id);
      if (!products) {
        return next(new ErrorCatch("Product not found", 404));
      }
      res.status(200).json({
        success: true,
        products,
      });
    } catch (error) {
      next(error);
    }
  },
  async updateProduct(req, res, next) {
    try {
      const { name, description, category, price, stock } = req.body;
      const product = await Product.findById(req.params.id);
      if (!product) {
        return next(new ErrorCatch("Product not found", 404));
      }

      if (name) product.name = name;
      if (description) product.description = description;
      if (category) product.category = category;
      if (price) product.price = price;
      if (stock) product.stock = stock;

      await product.save();

      res.status(200).json({
        success: true,
        message: "Products Updated successfully",
      });
    } catch (error) {
      next(error);
    }
  },

  async addProductImage(req, res, next) {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) {
        return next(new ErrorCatch("Product not found", 404));
      }

      if (!req.file) {
        return next(new ErrorCatch("Please add image", 404));
      }
      const file = getDataUri(req.file);
      const myCloud = await cloudinary.v2.uploader.upload(file.content);
      const image = {
        public_id: myCloud.public_id,
        url: myCloud.secure_site,
      };

      product.images.push(image);
      await product.save();

      res.status(200).json({
        success: true,
        message: "Images added successfully",
      });
    } catch (error) {
      next(error);
    }
  },

  async deleteProduct(req, res, next) {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) {
        return next(new ErrorCatch("Product not found", 404));
      }

      const id = req.query.id;
      if (!id) {
        return next(new ErrorCatch("Please Image id", 404));
      }

      let isExist = -1;

      product.images.forEach((item, index) => {
        if (item._id.toString() === id.toString()) isExist = index;
      });

      if (isExist < 0) return next(new ErrorCatch("Image does not exist", 400));
      await cloudinary.v2.uploader.destroy(product.images[isExist].public_id);

      product.images.splice(isExist, 1);

      await product.save();

      res.status(200).json({
        success: true,
        message: "Product Deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  },
  async deleteProductById(req, res, next) {
    try {
      const product = await Product.findById(req.params.id).populate("category");
      if (!product) return next(new ErrorHandler("Product not found", 404));

      for (let index = 0; index < product.images.length; index++) {
        await cloudinary.v2.uploader.destroy(product.images[index].public_id);
      }
      await product.deleteOne();
      res.status(200).json({
        success: true,
        message: "Product Deleted Successfully",
      });
    } catch (error) {
      next(error);
    }
  },

    //@desc Search & Category query
    async getAdminProduct(req, res, next) {
      try {
        const products = await Product.find({}).populate("category");
        res.status(200).json({
          success: true,
          products,
        });
      } catch (error) {
        next(error);
      }
    },
};


export default productController;
