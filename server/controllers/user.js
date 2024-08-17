import { compare } from 'bcrypt';
import {User} from '../models/user.js';
import {Chat} from '../models/chat.js'
import { cookieOptions, emitEvent, sendToken } from '../utils/features.js';
import {TryCatch} from "../middlewares/error.js"
import {Request} from "../models/request.js"
import { ErrorHandler } from '../utils/utility.js';
import { NEW_REQUEST, REFETCH_CHATS } from '../constants/events.js';
import mongoose from 'mongoose';
import {getOtherMember} from '../lib/helper.js'

// Create a new user and save it to the database and save token in cookie
const newUser=TryCatch(async(req,res,next)=>{

  const {name,username,password,bio}=req.body;
  
  const file=req.file;
  if(!file) return next(new ErrorHandler("Please upload avatar"))
  
  const avatar={
      public_id:"sjndns",
      url:"ajbds",
  }
 const user= await User.create({
      name,
      bio,
      username,
      password,
      avatar});


 sendToken(res,user,201,"User created")
})

const login=async(req,res,next)=>{
    const {username,password} =req.body;

    const user =await User.findOne({username}).select("+password");
    if(!user) return next(new Error("Invalid Username"));
    


    const isMatch=await compare(password,user.password);

    if(!isMatch) return next(new Error("Invalid Password"));
    
    sendToken(res,user,200,`Welcome back, ${user.name}`);
}


const getMyProfile=TryCatch(async(req,res)=>{
   //here req.user is id
   const user=await User.findById(req.user);
    res.status(200).json({
        success:true,
        user
    })
})

const logout=TryCatch(async(req,res)=>{
    //here req.user is id
   
     res.status(200).cookie("chattu-token","",{...cookieOptions,maxAge:0}).json({
         success:true,
         message:"Logged out successfully"
     })
 })

 const searchUser=TryCatch(async(req,res)=>{
   const {name}=req.query;
  
   const myChats=await Chat.find({groupChat:false,members:req.user})//find all chats
//extract all users from my chats means friends or people i have chatted with
   const allUsersFromMyChats=myChats.flatMap((chat)=> chat.members);

   const allUsersExceptMeAndFriends=await User.find({
    _id:{$nin: allUsersFromMyChats},
    name:{$regex:name, $options:"i"},
   })

   const users=allUsersExceptMeAndFriends.map(({_id,name,avatar})=>({
   _id,
   name,
    avatar:avatar.url,
}))

     res.status(200).json({
         success:true,
         users
     })  
 })


 const sendFriendRequest=TryCatch(async(req,res,next)=>{
   const {userId}= req.body; //receiver's id
   
   const request=await Request.findOne({
$or:[
    {sender:req.user, receiver:userId},
    {sender:userId, receiver:req.user},
]
   })
  

   if(request) return next(new ErrorHandler("Request already sent",400));

   await Request.create({
    sender: req.user,
    receiver:userId
   })

   emitEvent(req,NEW_REQUEST,[userId]);

   
     res.status(200).json({
         success:true,
         message:"Friend Request Sent"
     })
 })

 const acceptFriendRequest=TryCatch(async(req,res,next)=>{
    const {requestId,accept}= req.body; //receiver's id
    if (!mongoose.Types.ObjectId.isValid(requestId)) {
        return next(new ErrorHandler("Invalid Request ID", 400));
    }

   const request=await Request.findById(requestId)
   .populate("sender","name")
   .populate("receiver","name");
   
   console.log(request);
 
    if(!request) return next(new ErrorHandler("Request not found",404));

    if(request.receiver._id.toString()!== req.user.toString())
        return next(new ErrorHandler("You are not authorized to accept this reuest",401))

    if(!accept){
        await request.deleteOne();

        return res.status(200).json({
            success:true,
            message:"Friend Request Rejected"
        });
    }

    const members=[request.sender._id,request.receiver._id];

    await Promise.all([
        Chat.create({
            members,
            name:`${request.sender.name}-${request.receiver.name}`,

        }),
        request.deleteOne(),
    ])

    emitEvent(req,REFETCH_CHATS,members);

      res.status(200).json({
          success:true,
          message:"Friend Request Accepted",
          senderId:request.sender._id,
      })
  })

  const getMyNotifications=TryCatch(async(req,res,next)=>{
     const requests=await Request.find({receiver:req.user}).populate("sender","name avatar")

     const allRequests=requests.map(({_id,sender})=>({
        _id,
        sender:{
            _id:sender._id,
            name:sender.name,
            avatar:sender.avatar.url,
        }
     }))

     return res.status(200).json({
        success:true,
        allRequests
     })
  })

  const getMyFriends = TryCatch(async (req, res) => {
    const chatId = req.query.chatId;
   
    const chats = await Chat.find({
      members: req.user,
      groupChat: false,
    }).populate("members", "name avatar");
   
  
    const friends = chats.map(({ members }) => {
      
      const otherUser = getOtherMember(members, req.user);
      
      return {
        _id: otherUser._id,
        name: otherUser.name,
        avatar: otherUser.avatar.url,
      };
    });
  
    if (chatId) {
      const chat = await Chat.findById(chatId);
  
      const availableFriends = friends.filter(
        (friend) => !chat.members.includes(friend._id)
      );
  
      return res.status(200).json({
        success: true,
        friends: availableFriends,
      });
    } else {
      return res.status(200).json({
        success: true,
        friends,
      });
    }
  });

export {login,newUser,getMyProfile,logout,searchUser,sendFriendRequest,acceptFriendRequest,getMyNotifications,getMyFriends}