import cloudinary from 'cloudinary';
import Blog from '../model/blogmodel.js';
import mongoose from 'mongoose';


export const createblog = async (req, res) => {
  const { blogimage } = req.files;
  if (!req.files || !req.files.blogimage) {
    return res.status(400).json({ message: "No photo found" });
  }


  const allowedFormats = ["jpg", "png", "avif"];
  const fileFormat = blogimage.name.split('.').pop();

  if (!allowedFormats.includes(fileFormat)) {
    return res.status(400).json({ message: "Invalid photo format" });
  }

  const { title, category, about } = req.body;

  try {
    if (!title || !category || !about) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const adminname = req?.user?.name;
    const adminphoto = req?.user?.photo.url;
    const createdBy = req?.user?._id;


    const uploadResponse = await cloudinary.v2.uploader.upload(blogimage.tempFilePath);

    const blogdata = new Blog({
      title,
      about,
      category,
      adminname,
      adminphoto,
      createdBy,

      blogimage: {
        public_id: uploadResponse.public_id,
        url: uploadResponse.secure_url
      }
    });

    await blogdata.save();
    res.status(201).json({ message: "Blog Created", id: blogdata.id, blogdata: blogdata });

  } catch (error) {
    return res.send("User registration failed : " + error.message)
  }
};


export const delete1 = async (req, res) => {
  const blogId = req.params.id;
  try {

    const blogdata = await Blog.findById(blogId);
    if (!blogdata) {
      return res.status(404).json({ message: "Blog not found" });
    }

    await blogdata.deleteOne();

    res.status(200).json({ message: "Blog deleted successfully" });

  } catch (error) {

  }
}


export const getallblogs = async (req, res) => {
  try {
    const blogdata = await Blog.find({});
    if (!blogdata) {
      return res.status(404).json({ message: "No blog found" });
    }
    res.status(200).json(blogdata);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving blog data", error: error.message });
  }
}

export const singleblog = async (req, res) => {
  try {
    const blogId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(blogId)) {
      return res.status(404).json({ message: "Id is not valid" });
    }

    const blogdata = await Blog.findById(blogId)
    if (!blogdata) {
      return res.status(404).json({ message: "No blog found" });
    }
    res.status(200).json(blogdata);

  } catch (error) {
    res.status(500).json({ message: "Error retrieving blog data", error: error.message });
  }
}



export const getmyblogs = async (req, res) => {
  try {
    const createdBy = req.user._id;
    const blogdata = await Blog.find({ createdBy }) //ye current user k vlogs honge  jo ki token verify hone k baad  _id milegi 
    if (!blogdata) {
      return res.status(200).json({ message: "No blogs found for this user" });
    }

    res.status(200).json(blogdata);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving blog data", error: error.message });
  }
};


export const update = async (req, res) => {
const {title,category,about} = req.body;
  const blogid = req.params.id;
  try {
    if (!mongoose.Types.ObjectId.isValid(blogid)) {
      return res.status(404).json({ message: "Id is not valid" });
    }
    const updateblog = await Blog.findByIdAndUpdate(blogid, {title,category,about}, { new: true });
    if (!updateblog) {
      return res.status(404).json({ message: "No blog found" });
    }

    res.status(200).json({ message: "blog updated succesfully", updateblog });
  }

  catch (error) {
    return res.status(500).json({ message: "something went wrong", "err": error.message });

  }
}



export const getsomedata = async (req, res) => {
  try {
    const blogData = await Blog.findById(req.params.id)
      .populate('createdBy');
    
    if (!blogData) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.status(200).json(blogData);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving blog data", error: error.message });
  }
};


