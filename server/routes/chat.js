
import { getMyProfile, login, logout, newUser, searchUser } from "../controllers/user.js";
import express from "express";
import {attachmentsMulter, singleAvatar} from "../middlewares/multer.js"

import { addMembers, deleteChat, getChatDetails, getMessages, getMyChats, getMyGroups, leaveGroup, newGroupChat, renameGroup, sendAttachments } from "../controllers/chat.js";
import { addMemberValidator,chatIdValidator, newGroupValidator, removeMemberValidator, renameGroupValidator, sendAttachmentsValidator, validateHandler } from "../lib/validators.js";
import { isAuthenticated } from "../middlewares/auth.js";

const app=express.Router();

 
//after here user must be logged in to access the routws.....also isAuthenticated will be used a smiddleware where we want to have a logged in user

app.use(isAuthenticated);

app.post("/new",newGroupValidator(),validateHandler,newGroupChat)

app.get("/my",getMyChats)

app.get("/my/groups",getMyGroups)

app.put("/addmembers",addMemberValidator(),validateHandler,addMembers);

app.put("/removemember",removeMemberValidator(),validateHandler,addMembers); 

app.delete("/leave/:id",chatIdValidator(),validateHandler,leaveGroup);

app.post("/message",attachmentsMulter,sendAttachmentsValidator(),validateHandler,sendAttachments)

app.get("/message/:id",chatIdValidator(),validateHandler,getMessages)

app.route("/:id")
.get(chatIdValidator(),validateHandler,getChatDetails)
.put(renameGroupValidator(),validateHandler,renameGroup).
delete(chatIdValidator(),validateHandler,deleteChat);  //get chat details,rename,delete();

export default app;