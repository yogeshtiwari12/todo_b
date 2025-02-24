import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import routes from "./routes/routes.js";
import todos_routes from "./routes/todo_routes.js";
import cookieParser from "cookie-parser";



const app = express();
mongoose.connect('mongodb+srv://yt781703:snsn97GLA@cluster0.h60dd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',{
    
}).then(()=>{
    console.log('Connected to MongoDB');
}).catch((error)=>{
    console.log('Error connecting to MongoDB', error.message);
});

app.use(cookieParser())
app.use(express.json());

app.use(cors({

    origin: 'https://todo-2f-yogeshtiwari12s-projects.vercel.app',
    credentials: true,
  }));


  app.use('/userroute21',routes)
app.use('/todosroute',todos_routes)

  app.listen(4000, () => {
    console.log('Server is running on port 4000');
});
