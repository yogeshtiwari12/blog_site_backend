import express from 'express';
const route = express.Router();
import { signup, login,logout, getmyprofile, getalladmins, getalladminanduser} from '../methods/method.js';
import { isadmin, verifytoken } from '../auth_token/auth.js';

route.put('/signup',signup);
route.post('/login',login);
route.post('/logout',verifytoken,logout);
route.get('/getmyprofile',verifytoken,getmyprofile)
route.get('/getalladmin',getalladmins)
route.get('/getalladminanduser',verifytoken,isadmin("admin"),getalladminanduser)

export default route;