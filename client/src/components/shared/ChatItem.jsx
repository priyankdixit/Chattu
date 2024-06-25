import React,{memo} from 'react'
import { Link } from '../styles/styledComponents'
import { Typography, Box , Stack } from '@mui/material'
import AvatarCard from './AvatarCard'


const ChatItem = ({
    avator=[],
    name,
    _id,
    groupChat=false,
    sameSender,isOnline,
    newMessageAlert,index=0,
    handleDeleteChat
}) => {
  return <Link sx={{padding:"0"}}  to={`/chat/${_id}`} onContextMenu={(e)=> handleDeleteChat(e,_id,groupChat)}> 
    <div style={{
        display:"flex",
        gap:"1rem",
        alignItems:"center",
        padding:"1rem",
        backgroundColor:sameSender ? "black":"unset",
        color:sameSender ? "white" :"unset",
        position:"relative"
    }}>

   <AvatarCard avator={avator} />
   
   <Stack>
    <Typography>{name}</Typography>
    {newMessageAlert && (
        <Typography>{newMessageAlert.count} New Messages</Typography>
    )}
   </Stack>

   {isOnline &&(
   <Box  sx={{
    width:"10px",
    height:"10px",
    borderRadius:"50%",
    backgroundColor:"green",
    position:"absolute",
    top:"50%",
    right:"1rem",
    transform:"translateY(-50%)",
   }} />
    )
   }


    </div>
  </Link>
}

export default memo(ChatItem) /*Lets you skip re-rendering a component when its props are unchanged */