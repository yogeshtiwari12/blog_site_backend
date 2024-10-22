    import mongoose from "mongoose";

    const userSchema = mongoose.Schema({
        name:{
            type:String,
            required:true
        },
        email:{
            type:String,
            required:true,
            unique:true
        },
        phone:{
            type:String,
            required:true,
            unique:true
        },
        photo:{
            public_id:{

                type:String,
                required:true,
            },
            url:{
                type:String,
                required:true,
            }
        },

        education:{
            type:String,
            required:true
        }
        ,
        role:{
            type:String,
            required:true,
            enum:['admin','user']
        
        },
        password:{
            type:String,
            required:true
        },
        
        createdAt:{
            type:Date,
            default:Date.now
        }

    })
    export const User = mongoose.model('blog',userSchema);
    export default User;