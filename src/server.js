import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import userRoute from './routes/userRoute.js'
import productRoute from './routes/productRoute.js'
import categoryRouter from './routes/categoryRoute.js'
import orderRoute from './routes/orderRoute.js'
import { ErrorHandler } from './middlewares/err.handler.js';
const app = express();

app.use(express.json())
app.use(bodyParser.urlencoded({extended:true}));
app.use(cookieParser());
app.use(morgan('dev'));


app.use('/api/auth', userRoute);
app.use('/api/product', productRoute);
app.use('/api/category', categoryRouter);
app.use('/api/order', orderRoute)
//Error Handler
app.use(ErrorHandler);

export default app;