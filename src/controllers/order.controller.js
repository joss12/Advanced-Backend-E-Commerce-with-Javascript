import { Order } from "./../models/Order.js";
import { Product } from './../models/Product.js';
import ErrorCatch from "../utils/error.js"

const orderController = {
  async CreateOrder(req, res, next) {
    try {
        const {
            shippingInfo,
            orderItems,
            paymentMethod,
            paymentInfo,
            itemsPrice,
            taxPrice,
            shippingCharges,
            totalAmount,
          } = req.body;

          await Order.create({
            user: req.user._id,
            shippingInfo,
            orderItems,
            paymentMethod,
            paymentInfo,
            itemsPrice,
            taxPrice,
            shippingCharges,
            totalAmount,
          });

          for (let i = 0; i < orderItems.length; i++) {
            const product = await Product.findById(orderItems[i].product);
            product.stock -= orderItems[i].quantity;
            await product.save();
          }
          res.status(201).json({
            success: true,
            message: "Order Placed Successfully",
          }); 

    } catch (error) {
        next(error);
    }
  },

  async getOrders(req, res, next){
    const orders = await Order.find({user: req.user._id});

    res.status(200).json({
        success: true,
        orders,
    })
  },
  async getAdminOrders(req, res, next){
    const orders = await Order.find({});

    res.status(200).json({
        success: true,
        orders,
    })
  },


  async getOrdersDetails(req, res, next){
    const order = await Order.findById(req.params.id);
    if(!order) return next(new ErrorCatch("Order Not Found", 404));

    res.status(200).json({
        success: true,
        order,
    })
  },


  async processOrders(req, res, next){
   try {
    const order = await Order.findById(req.params.id);
    if(!order) return next(new ErrorCatch("Order Not Found", 404));

    if(order.orderStatus === "Preparing") order.orderStatus = "Shipped";
    else if(order.orderStatus === "Shipped"){
        order.orderStatus = "Delivered";
        order.deliveredAt = new Date(Date.now());
    }
    else return next(new ErrorCatch("Order Already Delivered", 404));

    await order.save();

    res.status(200).json({
        success: true,
        message: "Order Processed Successfully",
    });
   } catch (error) {
    next(error)
   }
  }
};

export default orderController;
