import React, { useState } from 'react';
import {Avatar, Button ,Container,IconButton,Paper, TextField, Typography, Stack} from '@mui/material'
import {CameraAlt   as CameraAltIcon} from '@mui/icons-material'
import { VisuallyHiddenInput } from '../components/styles/styledComponents';
import {useFileHandler, useInputValidation} from '6pp';
import { usernameValidator } from '../utils/validators';

const Login = () => {
  const [isLogin,setIsLogin]=useState(true);

  const name = useInputValidation("");
  const bio = useInputValidation("");
  const username = useInputValidation("",usernameValidator);
  const password = useInputValidation(""); //useStrongPassword can be used instead from 6pp

  const avatar = useFileHandler("single");

  const handleLogin=(e)=>{
    e.preventDefault();
  };

  const handleSignUp=(e)=>{
    e.preventDefault();
  };


  return (
    <div>
    <Container 
    component={"main"} 
    maxWidth="xs" 
    sx={{
      height:"100vh",
      display:"flex",
      justifyContent:"center",
      alignItems:"center"}}>
      <Paper 
      elevation={3}
      sx={{
        padding:4,
        display:"flex",
        flexDirection:"column",
        alignItems:"center",
      }}>
    {isLogin ?(
    <>
    <Typography variant='h5'>Login</Typography>
    <form style={{
      width: "100%",
      marginTop: "1rem",
    }}
    onSubmit={handleLogin}
    >
      <TextField 
      required 
      fullWidth
      label="Username"
      margin='normal'
      variant='outlined'
      value={username.value}
      onChange={username.changeHandler}
      />

     <TextField 
      required 
      fullWidth
      label="Password"
      type='password'
      margin='normal'
      variant='outlined'
      value={password.value}
      onChange={password.changeHandler} />
      
      <Button sx={{marginTop:"1rem"}}
       variant='contained'
       color="primary" 
       type='submit'
       fullWidth
       >Login</Button>

     <Typography textAlign={'center'} m={'1rem'}>OR</Typography>
   
     <Button 
       fullWidth
       variant='text'
       color="primary" 
       onClick={()=> setIsLogin(false)}>Sign up instead</Button>

      </form></>
    ):(
      <>
    <Typography variant='h5'>Sign up</Typography>
    <form style={{
      width: "100%",
      marginTop: "1rem",
    }}
    onSubmit={handleSignUp}
    >
    <Stack position={"relative"} width={"10rem"} margin={"auto"}>
    <Avatar 
    sx={{
      width: "10rem",
      height: "10rem",
      objectFit: "contain"
    }}
    src={avatar.preview}
    />

{
      avatar.error && (
        <Typography 
        color="error" 
        width={"fit-content"}
        variant="caption"
        display={'block'}
        >
          {avatar.error}
        </Typography>
      )
    }
    <IconButton 
    sx={{
      position:"absolute",
      bottom:"0",
      right:"0",
      color:"white", 
      bgcolor: "rgba(0,0,0,0.5)",
      ":hover":{
        bgcolor:"rgba(0,0,0,0.7)"
      }
    }}
    component="label"
    >
      <>
      <CameraAltIcon />
      <VisuallyHiddenInput type="file"  onChange={avatar.changeHandler}/>
      </>
    </IconButton>
    </Stack>

    <TextField 
      required 
      fullWidth
      label="Name"
      margin='normal'
      variant='outlined'
      value={name.value}
      onChange={name.changeHandler}
      />

      <TextField 
      required 
      fullWidth
      label="Username"
      margin='normal'
      variant='outlined'
      value={username.value}
      onChange={username.changeHandler}
      />

    {
      username.error && (
        <Typography color="error" variant="caption">
          {username.error}
        </Typography>
      )
    }

     <TextField 
      required 
      fullWidth
      label="Password"
      type='password'
      margin='normal'
      variant='outlined' 
      value={password.value}
      onChange={password.changeHandler}
      />

    <TextField 
      required 
      fullWidth
      label="Bio"
      margin='normal'
      variant='outlined'
      value={bio.value}
      onChange={bio.changeHandler} />
      
      <Button sx={{marginTop:"1rem"}}
       variant='contained'
       color="primary" 
       type='submit'
       fullWidth
       >Sign Up</Button>

     <Typography textAlign={'center'} m={'1rem'}>OR</Typography>
   
     <Button 
       fullWidth
       variant='text'
       color="primary" 
       onClick={()=> setIsLogin(true)}>Login</Button>

      </form></>
    )}
      </Paper>
    </Container>
    </div>
  )
}

export default Login