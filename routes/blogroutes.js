import express from 'express';
const route = express.Router();
import { createblog, delete1, getallblogs, getmyblogs, singleblog, update, getsomedata } from '../methods/blog_method.js';
import { isadmin, verifytoken } from '../auth_token/auth.js';

route.post('/createblog', verifytoken, isadmin("admin"), createblog)
route.delete('/delete/:id', verifytoken, isadmin("admin"), delete1)

route.get('/getallblogs', getallblogs)
route.get('/getsingleblog/:id', singleblog)
route.get('/getmyblogs', verifytoken, isadmin("admin"), getmyblogs)
route.get('/getsomedata/:id',verifytoken, getsomedata)
route.put('/update/:id', verifytoken, isadmin("admin"), update)


export default route;