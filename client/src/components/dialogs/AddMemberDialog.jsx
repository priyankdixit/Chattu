import { Button, Dialog, DialogTitle, Stack, Typography } from '@mui/material'
import React from 'react'
import {sampleUsers} from '../../constants/sampleData'
import UserItem from '../shared/UserItem'
import { useState } from 'react'

const AddMemberDialog = ({addMember,isoadingAddMember,chatId}) => {


const [members,setMembers]=useState(sampleUsers);
const [selectedMembers,setSelectedMembers]=useState([]);

  const selectMemberHandler=(id)=>{
    setSelectedMembers(prev=>prev.includes(id)? prev.filter((currElement)=>currElement!=id) : [...prev,id])
  };

  const  closeHandler=()=>{
    setSelectedMembers([]);
    setMembers([]);
  }

  const isLoadingAddMember=()=>{}

  const addMemberSubmitHandler=()=>{
    closeHandler();
  };
  return <Dialog open onClose={closeHandler}>
    <Stack p={"2rem"} width={"20rem"} spacing={"2rem"} >
        <DialogTitle>Add Member</DialogTitle>
        <Stack spacing={"1rem"}>
{
   members.length>0? (members.map(i=>(
        <UserItem key={i.id} user={i} handler={selectMemberHandler} isAdded={selectedMembers.includes(i._id)}/>
    ))):(<Typography textAlign={"center"}>No friends</Typography>)
}
        </Stack>
        <Stack direction={"row"} alignItems={"center"} justifyContent={"space-evenly"} >
        <Button color='error' onClick={closeHandler}>Cancel</Button>
        <Button onClick={addMemberSubmitHandler} variant='contained' disabled={isLoadingAddMember}>Submit changes</Button>

        </Stack>
        
    </Stack>
  </Dialog>
}

export default AddMemberDialog