import express from 'express';
import { allusers, allusertodo, login, logout, signup, valid_user } from '../methods/user.js';
import { isadmin, verifytoken } from '../auth/auth.js';
import { usertodos } from '../methods/todo.js';


const routes = express.Router();
routes.put('/signup',signup)
routes.post('/login',login)
routes.post('/logout',logout)
routes.get('/getauthuser',verifytoken,valid_user)
routes.get('/allusertodo/:id',verifytoken,isadmin("admin"),allusertodo)
routes.get('/allusers',verifytoken,isadmin("admin"),allusers)


export default routes;