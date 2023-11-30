

import mongoose from "mongoose";

const schema = new mongoose.Schema({
    category:{
        type:String,
        required:[true, "Please Enter a Category"]
    }
});


export const Category = mongoose.model('Category', schema)