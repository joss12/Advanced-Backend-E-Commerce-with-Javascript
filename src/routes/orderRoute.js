//@desc Category Router
import express from 'express';
import { isAdmin, isAuthenticated } from './../middlewares/auth.middlewares.js';
import { asyncError } from '../middlewares/err.handler.js';
import orderController from '../controllers/order.controller.js';
const router = express.Router();

router.post("/new", isAuthenticated, asyncError(orderController.CreateOrder));
router.get("/getOrders",isAuthenticated, asyncError(orderController.getOrders));
router.get("/getAdminOrders",isAuthenticated, isAdmin, asyncError(orderController.getOrders));
router.route('/single/:id').get(isAuthenticated, asyncError(orderController.getOrdersDetails)).put(asyncError(orderController.processOrders));

export default router;