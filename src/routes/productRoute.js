//@desc Product Router
import express from 'express';
import { isAuthenticated, isAdmin } from '../middlewares/auth.middlewares.js';
import { singleUpload } from '../middlewares/multer.js';
import { asyncError } from '../middlewares/err.handler.js';
import productController from './../controllers/product.controller.js';


const router = express.Router();

router.get("/admin", isAuthenticated, isAdmin, productController.getAdminProduct)

router.get("/all", asyncError(productController.getAllProduct));
router.route("/getOneProduct/:id").get(asyncError(productController.getOneProduct));
router.post('/createProduct', isAuthenticated, isAdmin, singleUpload, asyncError(productController.CreateProduct));
router.put("/updateProduct/:id", isAuthenticated, isAdmin, singleUpload, asyncError(productController.updateProduct));
router.post("/images/:id", isAuthenticated,isAdmin, singleUpload, asyncError(productController.addProductImage));
router.delete('/deleteProductImage/:id', isAuthenticated, isAdmin, singleUpload, asyncError(productController.deleteProduct))
router.delete('/deleteOneProduct/:id', isAuthenticated, isAdmin, asyncError(productController.deleteProductById));


export default router;