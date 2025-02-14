import express from 'express';
import {  addtodo, alltodos, deletetodo, updatetodo, usertodos } from '../methods/todo.js';
import { isadmin, verifytoken } from '../auth/auth.js';
import { usertodos } from '../methods/todo.js';


const routes = express.Router();
routes.put('/signup',signup)
routes.post('/login',login)
routes.post('/logout',logout)
routes.get('/getauthuser',verifytoken,valid_user)
routes.get('/allusertodo/:id',verifytoken,allusertodo)
routes.get('/allusers',verifytoken,isadmin("admin"),allusers)

