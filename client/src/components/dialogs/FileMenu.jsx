import { Menu } from '@mui/material'
import React from 'react'

const FileMenu = ({anchorEl}) => {
  return (<Menu anchorEl={anchorEl} open={false}>
    <div style={{width:"10rem"}}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Adipisci temporibus mollitia facilis dolorum beatae unde, ab tenetur sit voluptatum atque quia eius? Ab, fugiat autem tempora necessitatibus facilis nam non.</div>
  </Menu>);
};

export default FileMenu;