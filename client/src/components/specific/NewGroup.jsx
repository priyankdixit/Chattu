import React, { useState } from 'react'
import {Avatar, Button, Dialog, DialogTitle, List, ListItem, ListItemText, Stack, TextField, Typography, } from '@mui/material'
import {sampleUsers} from '../../constants/sampleData'
import UserItem from '../shared/UserItem'
import { useInputValidation } from '6pp'

const NewGroup = () => {
const groupName=useInputValidation("")
const submitHandler=()=>{}

const [members,setMembers]=useState(sampleUsers);
const [selectedMembers,setSelectedMembers]=useState([]);

  const selectMemberHandler=(id)=>{
    setSelectedMembers(prev=>prev.includes(id)? prev.filter((currElement)=>currElement!=id) : [...prev,id])
  };
  console.log(selectedMembers);

  return (
    <Dialog open>
    <Stack p={{xs:"1rem", sm:"3rem"}} width={"25rem"} spacing={"2rem"}>
      <DialogTitle variant='h4' textAlign={"center"}>New Group</DialogTitle>
      <TextField label="Group Name"  value={groupName.value} onChange={groupName.changeHandler}/>
      <Typography>members</Typography>
    <Stack>
    {members.map((i)=>(
      <UserItem user={i} key={i._id} handler={selectMemberHandler} isAdded={selectedMembers.includes(i._id)} />
      ))}
    </Stack>
   <Stack direction={"row"} justifyContent={"space-evenly"}>
    <Button color='error' variant='text'  >Cancel</Button>
    <Button variant='contained' onClick={submitHandler}>Cretae</Button>
   </Stack>

    </Stack>
    </Dialog>
  )
}

export default NewGroup