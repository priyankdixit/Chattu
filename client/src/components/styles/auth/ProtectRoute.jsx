import React from 'react';
import {Navigate, Outlet} from "react-router-dom";


const ProtectRoute = ({childern,user,redirect="/login"}) => { //here children refers to any component written in <ProtectRoute></ProtectRoute>
    if(!user) return <Navigate to={redirect} />;
    return childern? children : <Outlet />;
  
}

export default ProtectRoute;