import mongoose from "mongoose";
import express from "express";
import allroutes from './routes/route.js';
import blogroute from './routes/blogroutes.js';
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import cloudinary from 'cloudinary';
import cors from 'cors';

const app = express();

mongoose.connect("mongodb://localhost:27017/blog", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log("Connected to MongoDB", mongoose.connection.db.databaseName);
  })
  .catch(err => {
    console.log("Error connecting to MongoDB", err.message);
  });

app.use(cookieParser());

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: '/tmp/'
}));

cloudinary.config({
  cloud_name: 'da4yjfao6',
  api_key: '425893122783979',
  api_secret: '0NzDAxq8evq_IcRSd3butcKQBG4'
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/routes", allroutes);
app.use("/blogroute", blogroute);

app.listen(4000, () => {
  console.log('Server is running on port 4000');
});
