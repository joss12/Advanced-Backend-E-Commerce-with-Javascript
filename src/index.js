
import app from "./server.js";
import cloudinary from "cloudinary"
import * as dotenv from 'dotenv';
dotenv.config();
import colors from 'colors';

import { connectDB } from "./config/db.js";

cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    secret: process.env.CLOUDINARY_API_SECRET,
    secure_site:process.env.CLOUDINARY_URL
})


const port = process.env.PORT;

app.listen(port, ()=>{
    if(process.env.NODE_ENV = "development"){
        console.log(`->Serve started on http://localhost:${port}, in ${process.env.NODE_ENV} MODE`.yellow.underline)
    }else if(process.env.NODE_ENV_PROD = "production"){
        console.log(`->Serve started on http://localhost:${port}, in ${process.env.NODE_ENV_PROD} MODE`.yellow.underline)
    }
    connectDB();
});
