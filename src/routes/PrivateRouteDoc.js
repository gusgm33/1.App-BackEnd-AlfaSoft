import React, { useContext } from 'react'
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../auth/authContext'

export const PrivateRouteDoc = ({ children }) => {
    
    const {user} = useContext(AuthContext);

    const location = useLocation();

    localStorage.setItem('lastPath', location.pathname);

    return (user.logged && (user.rol === 'Docente' || user.rol === 'Auxiliar'))
        ? children
        : ( user.rol === 'Administrador' ) 
            ? <Navigate to='/admin/adminhome'/>
            : <Navigate to='/login'/>
}
