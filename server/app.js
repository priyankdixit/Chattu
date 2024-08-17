import express from "express";
import { connectDB } from "./utils/features.js";
import dotenv from "dotenv";
import { errorMiddleware } from "./middlewares/error.js";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";
import { createServer } from "http";
import { v4 as uuid } from "uuid";

import { v2 as cloudinary } from "cloudinary";
import {
  NEW_MESSAGE,
  NEW_MESSAGE_ALERT,
} from "./constants/events.js";
import userRoute from "./routes/user.js";
import chatRoute from "./routes/chat.js";
import adminRoute from "./routes/admin.js";
import { userSocketIDs } from "./utils/utility.js";
import { getSockets } from "./lib/helper.js";
import { Message } from "./models/message.js";


dotenv.config({
    path:"./.env",
})
const mongoURI=process.env.MONGO_URI;
const port=process.env.PORT || 3000;



connectDB(mongoURI);



const app=express();
const server=createServer(app);
const io=new Server(server,{
    cors: {
        origin: "*", // Adjust origin as needed for CORS
        methods: ["GET", "POST"]
    }
});
//Using Middlewares here
app.use(express.json()); // middleware to acess req.body to parse incoming request body
app.use(cookieParser());

//userSocketIDs I have kept in utility folder as there was circular dependency refernce error coming by keeping it here 
//userSockets are all connected users currently

app.use("/user",userRoute);
app.use("/chat",chatRoute);
app.use('/admin',adminRoute);

app.get("/",(req,res)=>{
    res.send("hello wowrld");
})

app.use(errorMiddleware);

io.use((socket,next)=>{})

io.on("connection",(socket)=>{
    console.log("a user connected",socket.id)

    const user={
        _id:"sjsjsn",
        name:"namewadi"
    }

    userSocketIDs.set(user._id.toString(),socket._id);

    socket.on(NEW_MESSAGE,async({chatId,members,message})=>{
       
       const messageForRealTime={
        content:message,
        _id:uuid(),
        sender:{
            _id:user._id,
            name:user.name
        },
        chat:chatId,
        createdAt:new Date().toISOString()
       }

       const messageForDB={
        content:message,
        sender:user._id,
        chat:chatId
       }

       const membersSocket= getSockets(members);  // users whom this msg need to be sent
       io.to(membersSocket).emit(NEW_MESSAGE,{
        chatId,
        message:messageForRealTime,
       
       });
       io.to(membersSocket).emit(NEW_MESSAGE_ALERT,{chatId})
       
       try {
        await Message.create(messageForDB);
      } catch (error) {
        throw new Error(error);
      }
    

    })

    socket.on("disconnect",()=>{
        console.log("user disconnected")
        userSocketIDs.delete(user._id.toString());
    })
})

server.listen(port,()=>{
    console.log(`Server is running on port ${port} in ${process.env.NODE_ENV} MODE`);
})
