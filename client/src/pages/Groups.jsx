import React, { memo, useEffect, useState,Suspense,lazy } from 'react'
import {Box, Drawer, Grid, IconButton, Tooltip,Stack, Typography, Icon, TextField, ButtonGroup, Button, Backdrop} from '@mui/material'
import {Add as AddIcon,Delete as DeleteIcon,KeyboardBackspace as KeyBoardBackSpaceIcon , Menu as MenuIcon, Edit as EditIcon, Done as DoneIcon, Delete, Add} from '@mui/icons-material'
import {useNavigate,useSearchParams} from 'react-router-dom';
import {Link} from '../components/styles/styledComponents'
import AvatarCard from '../components/shared/AvatarCard'
import {sampleUsers, samplechats} from '../constants/sampleData'
import UserItem from '../components/shared/UserItem';
const ConfirmDeleteDialog=lazy(()=>import("../components/dialogs/ConfirmDeleteDialog"))
const AddMemberDialog=lazy(()=>import("../components/dialogs/AddMemberDialog"))

const isAddMember=false;

const Groups = () => {
  const navigate=useNavigate();
  const navigateBack=()=>{
    navigate("/");
  }
  const chatId=useSearchParams()[0].get("group");
  const [isMobileMenuOpen,setIsMobileMenuOpen] = useState("")
  const [isEdit,setIsEdit]=useState(false);
  const [groupName,setGroupName]=useState("");
  const [groupNameUpdatedValue,setgroupNameUpdatedValue]=useState("");
  const [confirmDeleteDialog,setconfirmDeleteDialog]=useState(false)

   const handleMobile=()=>{setIsMobileMenuOpen((prev)=> !prev)};
   const handleMobileClose=()=>{setIsMobileMenuOpen(false)}
  const deleteHandler=()=>{
    console.log("delete handler");
    closeConfirmDeleteHandler();
  }
  const updateGroupName=()=>{
  setIsEdit(false);

  }
 
  const removeMemberHandler=(id)=>{
    console.log("remove member,id");
  }
  useEffect(()=>{
    if(chatId){
      setGroupName(`Group Name ${chatId}`);
    setgroupNameUpdatedValue(`Group Name ${chatId}`);
    }

    return()=>{
      setGroupName("");
      setgroupNameUpdatedValue("");
      setIsEdit(false);
    }
  
  },[chatId])

const openconfirmDeleteHandler=()=>{
  setconfirmDeleteDialog(true);
  console.log("delete grp")
}

const closeConfirmDeleteHandler=()=>{
  setconfirmDeleteDialog(false)
}
const openAddMemberHandler=()=>{}

const ButtonGroup=<Stack direction={{sm:"row",xs:"column-reverse"}} spacing={"1rem"} p={{sm:"1rem",xs:0,md:"1rem 4rem"}}>
  <Button size="large" color='error' startIcon={<DeleteIcon />} onClick={openconfirmDeleteHandler}>Delete Group</Button>
  <Button  size="large" variant='contained' startIcon={<AddIcon/>} onClick={openAddMemberHandler}>Add Member</Button>
</Stack>


   const GroupName=<Stack direction={"row"} spacing={"1rem"} padding={"3rem"} alignItems={"center"} justifyContent={"center"} >
{
  isEdit? <>
  <TextField value={groupNameUpdatedValue} onChange={(e)=>setgroupNameUpdatedValue(e.target.value)} />
  <IconButton onClick={updateGroupName} > <DoneIcon /></IconButton>
  </> : <>
  <Typography>{groupName}</Typography>
  <IconButton onClick={()=>setIsEdit(true)}> <EditIcon/></IconButton>

  </>
}
    </Stack>


  return <Grid container height={"100vh"}>
    <Grid item sx={{display:{xs:"none",sm:"block"}}} sm={4} bgcolor={"bisque"}><GroupsList myGroups={samplechats} chatId={chatId} /></Grid>
    <Grid item xs={12} sm={8} sx={{display:"flex",flexDirection:"column",alignItems:"center",position:"relative",padding:"1rem 3rem",}}>
      <>
      <Box sx={{display:{xs:"block",sm:"none", position:"fixed" , right:"1rem", top:"1rem"}}}>
      <IconButton onClick={handleMobile}>
        <MenuIcon />
      </IconButton>
      </Box>
      <Tooltip title="back">
        <IconButton sx={{position:"absolute",top:"2rem",left:"2rem",bgcolor:"rgba(0,0,0,0.5)", color:"white",":hover":{bgcolor:"rgba(0,0,0,0.7)"}}} onClick={navigateBack}>
          <KeyBoardBackSpaceIcon />
        </IconButton>
      </Tooltip>

      {
       groupName && <>
       
      {GroupName}
      <Typography margin={"2rem"} alignSelf={"flex-start"} variant='body1'>Members</Typography>
      <Stack maxWidth={"45rem"} width={"100%"} boxSizing={"border-box"} padding={{sm:"1rem",xs:"0",md:"1rem 4rem"}} spacing={"2rem"} height={"50vh"} overflow={"auto"}>
        {sampleUsers.map((i)=>(
          <UserItem user={i} key={i._id} isAdded styling={{boxShadow:"0 0 0.5rem rgba(0,0,0,0.2)",padding:"1rem 2rem", borderRadius:"1rem"}} handler={removeMemberHandler} />
        ))}
      </Stack>
      {ButtonGroup}
       </>
      }
      </>
    </Grid>

{isAddMember && <Suspense fallback={<Backdrop />}><AddMemberDialog /></Suspense>}

    {confirmDeleteDialog && (<Suspense fallback={<Backdrop open/>}>
      <ConfirmDeleteDialog open={confirmDeleteDialog} handleClose={closeConfirmDeleteHandler} deleteHandler={deleteHandler}/></Suspense>)}
    <Drawer sx={{display:{xs:"block",sm:"none"}}} open={isMobileMenuOpen} onClose={handleMobileClose} deleteHandler={deleteHandler}><GroupsList myGroups={samplechats} chatId={chatId} width={"50vw"}/></Drawer>
  </Grid>
}

const GroupsList=({w="100%",myGroups=[],chatId})=>(
  <Stack width={w} sx={{height:"100vh",overflow:"auto"}}>
    {
      myGroups.length >0 ? myGroups.map((group)=><GroupListItem group={group} chatId={chatId} key={group._id} />) : <Typography textAlign={"center"} padding="1rem">No Group</Typography>
    }
  </Stack>
)

const GroupListItem=memo(({group})=>{
  const {name,avatar,_id}=group;

  return <Link to={`?group=${_id}`} onClick={(e)=>{if(chatId === _id) e.preventDefault();}}>
  
<Stack direction={"row"} spacing={"1rem"} alignItems={"center"} >
<AvatarCard avator={avatar}/>
<Typography>{name}</Typography>
  </Stack> 
   </Link>
})



export default Groups