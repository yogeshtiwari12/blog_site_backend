import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    title:{
        type:String,
        required:true
    },
   

    blogimage:{
        public_id:{

            type:String,
            required:true,
        },
        url:{
            type:String,
            required:true,
        }
    },

    category:{
        type:String,
        required:true
    }
    ,
    about:{
        type:String,
        required:true,
       
    },
    adminname:{
        type:String,
        // required:true
    },
    adminphoto:{
        type:String,
        // required:true
    },
    createdBy:{
        type:mongoose.Schema.ObjectId,
        ref:"blog"
    }

})
export const Blog = mongoose.model('blog2',userSchema);
export default Blog;