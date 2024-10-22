import express from 'express';
const route = express.Router();
import { signup, login,logout, getmyprofile, getalladmins} from '../methods/method.js';
import { verifytoken } from '../auth_token/auth.js';
route.post('/signup',signup);
route.post('/login',login);
route.post('/logout',verifytoken,logout);
route.get('/getmyprofile',verifytoken,getmyprofile)
route.get('/getalladmin',getalladmins)

export default route;