import { TryCatch } from "../middlewares/error.js";
import { ErrorHandler } from "../utils/utility.js";
import {Chat} from "../models/chat.js"
import {deleteFilesFromCloudinary, emitEvent} from "../utils/features.js"
import {ALERT, NEW_ATTACHMENT, NEW_MESSAGE_ALERT, REFETCH_CHATS} from "../constants/events.js"
import { getOtherMember } from "../lib/helper.js";
import { User } from "../models/user.js";
import {Message} from "../models/message.js"

const newGroupChat=TryCatch(async (req,res,next)=>{
    const {name,members}=req.body;

    if(members.length<2) 
        return next(new ErrorHandler("Group chat must have atleast 3 members", 400));
    
    const allMembers=[...members,req.user];
  
    await Chat.create({
        name,
        groupChat:true,
        creator:req.user,
        members:allMembers,
    })

    emitEvent(req,ALERT,allMembers,`Welcome to ${name} group`)
    emitEvent(req,REFETCH_CHATS,members);

    return res.status(201).json({
        success:true,
        message:"Group created"
    })
})


const getMyChats=TryCatch(async (req,res,next)=>{
    const chats= await Chat.find({members:req.user}).populate(
        "members",
        "name avatar"
    )
    
    const transformedChats=chats.map(({_id,name,members,groupChat})=>{
        const otherMember=getOtherMember(members,req.user)
        return{
            _id,
            groupChat,
            avatar:groupChat?members.slice(0,3).map(({avatar})=>avatar.url) :[otherMember.avatar.url],// here if we had given avatar in model only for chats then this wasnt requrired
            name:groupChat?name:otherMember.name,
            members:members.reduce((prev,curr)=>{
                if(curr._id.toString()!==req.user.toString()){
                    prev.push(curr._id);
                }
                return prev
            },[])
        }
    })

    return res.status(200).json({
        success:true,
        transformedChats
    })
})

const getMyGroups=TryCatch(async(req,res,next)=>{
    const chats=await Chat.find({
        members:req.user,
        groupChat:true,
        creator:req.user,
    }).populate("members","name avatar");

    const groups=chats.map(({members,_id,groupChat,name})=>({
        _id,
        groupChat,
        name,
        avatar:members.slice(0,3).map(({avatar})=>avatar.url)
    }));
    return res.status(200).json({
        success:true,
        groups
    });
})

const addMembers=TryCatch(async(req,res,next)=>{
    const {chatId,members}=req.body;
   

    const chat=await Chat.findById(chatId);

    if(!chat) return next(new ErrorHandler("Chat not found",404));
    if(!chat.groupChat) return next(new ErrorHandler("Not a grooup chat",404));
    
    if(chat.creator.toString()!==req.user.toString())
        return next(new ErrorHandler("You are not allowed to add members",403));

    
    const allNewMembersPromise = members.map((i)=> User.findById(i,"name"));
    const allNewMembers=await Promise.all(allNewMembersPromise);

    const uniqueMembers=allNewMembers.filter((i)=>{!chat.members.includes(i._id,toString())})

    chat.members.push(...uniqueMembers.map((i)=>i._id));

    if(chat.members.length>100)
        return next(new ErrorHandler("Group memebrs limit reacher",400));

    await chat.save();

    const allUsersName=allNewMembers.map((i)=>i.name).join(",");

    emitEvent(
        req,
        ALERT,
        chat.members,
        `${allUsersName} has been added in the group`
    )
    emitEvent(req,REFETCH_CHATS,chat.members);

    return res.status(200).json({
        success:true,
        message:"members added successfully"
    });
})

const removeMembers=TryCatch(async(req,res,next)=>{
    const {userId,chatId}=req.body;
    const [chat,userThatWillbeRemoved]=await Promise.all([Chat.findById(chatId),User.findById(userId,"name")]);

    if(!chat) return next(new ErrorHandler("Chat not found",404))
      
    if(!chat.groupChat) return next(new ErrorHandler("Not a grooup chat",404));
    
    if(chat.creator.toString()!==req.user.toString())
        return next(new ErrorHandler("You are not allowed to add members",403));
    
    if(chat.members.length<=3)
        return next(new ErrorHandler("Group must habve at least 3 members",400));

    chat.members=chat.members.filter((member)=> member.toString()!==userId.toString())
     await chat.save();

     emitEvent(req,ALERT,chat.members,`${userThatWillbeRemoved.name} has been removed from group`);
     emitEvent(req,REFETCH_CHATS,chat.members);

     return res.status(200).json({
        success:"true",
        message:"Member removed succesfully"
     })
})

const leaveGroup=TryCatch(async(req,res,next)=>{
    const chatId=req.params.id;

   const chat=await Chat.findById(chatId);

    if(!chat) return next(new ErrorHandler("Chat not found",404))
      
    if(!chat.groupChat)
        return next(new ErrorHandler("This is not a group chat",400));

    const remainingMembers=chat.members.filter((member)=>member.toString()!==req.user.toString())

    if(remainingMembers.length<3)
        return next(new ErrorHandler("Group must have atleast three members",400))

    if(chat.creator.toString()===req.user.toString()){
        const newCreator=remainingMembers[0];
        chat.creator=newCreator;
    }
    chat.members=remainingMembers;

   const [user] =await Promise.all([User.findById(req.user,"name"),chat.save()])


     emitEvent(req,ALERT,chat.members,`$ User {user.name} has left the group`);
     emitEvent(req,REFETCH_CHATS,chat.members);

     return res.status(200).json({
        success:"true",
        message:"Member removed succesfully"
     })
})

const sendAttachments=TryCatch(async(req,res,next)=>{
    
    const {chatId} =req.body;

    const files=req.files || [];
    if(files.length<1) return next(new ErrorHandler("Please provide atachments",400));

    if(files.length>5) return next (new ErrorHandler("Files cant be more than 5"),400);

    const [chats,me]=await Promise.all([ Chat.findById(chatId),User.findById(req.user, "name avatar")]);



    if(!chats) return next(new ErrorHandler("Chat not found",404));

   

    const attachments=[];

    const messageForRealTime={
        content:"",
        attachments,
        sender:{
            _id:me._id,
            name:me.name
        },
         chat:chatId}; // this as we want to show name of sender in real time but in below one for db where only sender's id is necessry and not name for storing in db

    const messageForDB={content:"",attachments,sender:me._id,chat:chatId}

   const message=await Message.create(messageForDB)

    emitEvent(req,NEW_ATTACHMENT,chats.members,{
        message:messageForRealTime,
        chat:chatId
    })

    emitEvent(req,NEW_MESSAGE_ALERT,chats.members,{chatId})

    return res.status(200).json({
        success:true,
        message
    });
})

const getChatDetails=TryCatch(async(req,res,next)=>{

    if(req.query.populate==="true"){//here populate is a query and not a function like ?populate=true
      const chat=await Chat.findById(req.params.id).populate("members","name avatar").lean(); //using lean, this no longer is a mongodb object but a classy javascript object
      
      if(!chat) return next(new ErrorHandler("Chat not found",404));

      chat.members=chat.members.map(({_id,name,avatar})=>({
        _id,
        name,
        avatar: avatar.url,
      }))
      
      return res.status(200).json({
        success:true,
        chat
      })
    }

        else{
        const chat= await Chat.findById(req.params.id)
        if(!chat) return next(new ErrorHandler("Chat not found",404));
        return res.status(200).json({
            success:true,
            chat
        })
        }
    
})

const renameGroup=TryCatch(async(req,res,next)=>{

    const chatId=req.params.id;
    const {name}=req.body;
    
    const chat=await Chat.findById(chatId);

    if(!chat) return next(new ErrorHandler("Chat not found",404));

    if(!chat.groupChat) return next(new ErrorHandler("Not a group chat",400));

    if(chat.creator.toString()!==req.user.toString())
        return next(new ErrorHandler("You are not allowed to rename the group",403));

    chat.name=name;

    await chat.save();

    emitEvent(req,REFETCH_CHATS,chat.members);

    return res.status(200).json({
        success:true,
        message:"Group renamed Successfully",
    })

})

const deleteChat=TryCatch(async(req,res,next)=>{
    const chatId=req.params.id;
  
    
    const chat=await Chat.findById(chatId);

    if(!chat) return next(new ErrorHandler("Chat not found",404));

    const members=chat.members;

   if(chat.groupChat && chat.creator.toString()!==req.user.toString())
    return next(new ErrorHandler("You are nto allowed to delete the group",403));

   if(!chat.groupChat && !chat.members.includes(req.user.toString()))
   return next(new ErrorHandler("you are n ot allowed to dleete the chat",403));

   //here we have to delete all messages as well as attachemnts or files from cloudinary

   const messagesWithAttachments=await Message.find({
    chat:chatId,
    attachments:{$exists:true , $ne:[]}
   })

   const public_ids=[];

   messagesWithAttachments.forEach(({attachments})=>{
    attachments.forEach(({public_id})=>{
        public_ids.push(public_id);
    })
   })

   await Promise.all([
    //deletefiles from cloudinary
    deleteFilesFromCloudinary(public_ids),
    chat.deleteOne(),
    Message.deleteMany({chat:chatId}),
   ]);

   emitEvent(req,REFETCH_CHATS,members);

   return res.status(200).json({
    success:true,
    message:"Chat added successfully",

   })

})

const getMessages=TryCatch(async(req,res,next)=>{
    const chatId=req.params.id;
    const {page=1}= req.query;
    const resultPerPage=20;
    const skip=(page-1)*resultPerPage;

    const [messages,totalMessagesCount]= await Promise.all([
        Message.find({chat:chatId})
        .sort({createdAt:-1})
        .skip(skip)
        .limit(resultPerPage)
        .populate("sender","name")
        .lean(),
        Message.countDocuments({chat:chatId}),
    ]);
    const totalPages=Math.ceil(totalMessagesCount/resultPerPage) || 0;

    return res.status(200).json({
        success:true,
        messages:messages.reverse(),
        totalPages,  
    })
})




export {newGroupChat,getMyChats,getMyGroups,addMembers,removeMembers,leaveGroup,sendAttachments,getChatDetails,renameGroup,deleteChat,getMessages};