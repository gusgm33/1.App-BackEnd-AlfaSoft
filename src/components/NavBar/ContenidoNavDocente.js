import React, { useContext } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { AuthContext } from '../../auth/authContext'
import { types } from '../../types/types';

export const ContenidoNavDocente = () => {
    
    const { user, dispatch } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch({ type: types.logout });

        navigate('login', {
            replace: true
        })
    }
    
    return (
        <>
            <div className="navbar-collapse">
                <div >
                    <Link 
                        to='/docente/home' 
                        className="navbar-brand"
                    >
                        Reserva de Aulas
                    </Link>
                
                    <div className='nav-container' >

                    <NavLink
                        exact='true'
                        to='/docente/listarsolicitudes'
                        className={({ isActive }) => 'nav-item nav-link ' + ( isActive ? 'active' : 'no-active' )}
                        >
                        Solicitudes pendientes
                    </NavLink>
                    <NavLink
                        exact='true'
                        to='/docente/veraprobados'
                        className={({ isActive }) => 'nav-item nav-link ' + ( isActive ? 'active' : 'no-active' )}
                        >
                        Solicitudes aprobadas
                    </NavLink>
                    </div>
                </div>
            </div>
            
                                
            <div className="navbar-collapse collapse w-300 order-3 dual-collapse2 d-flex justify-content-end">
                <ul className="navbar-nav">
                    <span className='nav-item nav-link text-info icon-home'>
                        <i className="bi bi-person icon-user"></i> { user.name } - { user.rol }
                    </span>
                    <button
                        className='nav-item nav-link btn-logout'
                        onClick={ handleLogout }
                    >
                        <i className="bi bi-box-arrow-right icon-logout"></i>
                    </button>
                </ul>
            </div>
        </>
    )
}
