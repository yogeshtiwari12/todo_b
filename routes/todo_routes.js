import express from 'express';
import {  addtodo, alltodos, deletetodo, updatetodo, usertodos } from '../methods/todo.js';
import { verifytoken } from '../auth/auth.js';
const routes2 = express.Router();

routes2.post('/addtodo',verifytoken,addtodo);
routes2.delete('/deletetodo/:id',deletetodo);
routes2.put('/updatetodo/:id',updatetodo)
routes2.post('/alltodo',alltodos)
routes2.get('/userstodo/:id',verifytoken,usertodos)



export default routes2