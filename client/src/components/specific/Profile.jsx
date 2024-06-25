import { Avatar, Stack, Typography } from '@mui/material'
import React from 'react'
import moment from "moment"
import {Face as FaceIcon, AlternateEmail as UserNameIcon, CalendarMonth as CalendarIcon} from '@mui/icons-material'

const Profile = () => {
  return (
    <Stack spacing={"2rem"} direction={"column"} alignItems={"center"}>
      <Avatar sx={{width:200,height:200,objectFit:"contain", marginBottom:"1rem", border:"5px solid white"}}/> 
        <ProfileCard heading={"Bio"} text={"helkdsjdsdnjsdbsn dbd"} />
        <ProfileCard heading={"Username"} text={"@dixitpriyank"} Icon={<UserNameIcon />} />
        <ProfileCard heading={"Name"} text={"Priyank dixit"} Icon={<FaceIcon />}/>
        <ProfileCard heading={"Joined"} text={moment('2024-04-04T00:00:00.000Z').fromNow()} Icon={<CalendarIcon />}/>
        </Stack>
  )
}

const ProfileCard=({text,Icon,heading})=>(
<Stack direction={"row"} alignItems={"center"} spacing={"1rem"} color={"white"} textAlign={"center"}>
   {Icon && Icon}
   <Stack>
    <Typography variant="body1">{text}</Typography>
    <Typography color={"grey"} variant="caption">{heading}</Typography>
   </Stack>


</Stack>);


export default Profile


