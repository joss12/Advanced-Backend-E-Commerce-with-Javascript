//@desc Category Router
import express from 'express';
import { isAuthenticated, isAdmin } from '../middlewares/auth.middlewares.js';
import { asyncError } from '../middlewares/err.handler.js';
import categoryController from '../controllers/category.controller.js';


const router = express.Router();

router.post("/createCategory", isAuthenticated, isAdmin, asyncError(categoryController.addCategory));
router.get("/getCategories", asyncError(categoryController.getAllCategories));
router.delete("/deleteCategory/:id", isAuthenticated, isAdmin, asyncError(categoryController.deleteCategory));

export default router