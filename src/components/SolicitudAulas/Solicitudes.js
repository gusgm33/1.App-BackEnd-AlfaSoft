import React, { useEffect, useState }  from 'react'
import { NavLink } from 'react-router-dom'
import { useModal } from '../../hooks/useModal';
import { ModalGenerico } from '../Modal/ModalGenerico';
//import {FormularioReservaAula} from '../ReservaAulas/FormularioReservaAula';
import { RegSolicitud } from './RegistroSol/RegSolicitud';
//modal rechazo
import  {ModalRechazo}  from '../Modal/ModalRechazo';


import './estilos-ver-soli.css'


export const Solicitudes = ({data=[]}) => {
    const [isSorted, setIsSorted] = useState({
        sortData:data,
        dir:"asc",
    });

    const [values, setValues] = useState({
        nombreDocenteSolicitud:'',
        apellidoDocenteSolicitud:'',
        numeroEstudiantesSolicitud: '',
        motivoSolicitud:'',
        fechaSolicitud:'',
        horaInicioSolicitud:'',
        periodoSolicitud:'',
        estadoSolicitud:'',
        materia_id:''

    });

    const { nombreDocenteSolicitud,apellidoDocenteSolicitud,
        numeroEstudiantesSolicitud,motivoSolicitud,fechaSolicitud,
        horaInicioSolicitud,periodoSolicitud,estadoSolicitud,materia_id,soliID} = values;
    const [ isOpen, openModalEdicion, closeModalEdicion ] = useModal(false);
    //modal rechazo
    const[openModalRechazo,setOpenModalRechazo,closeModalRechazo]=useState(false);
 


    const actualizar = (item) => {
        setValues({
            nombreDocenteSolicitud: item.id,
            apellidoDocenteSolicitud: item.apellidoDocenteSolicitud,
            numeroEstudiantesSolicitud: item.numeroEstudiantesSolicitud,
            motivoSolicitud: item.motivoSolicitud,
            fechaSolicitud: item.fechaSolicitud,
            horaInicioSolicitud: item.horaInicioSolicitud,
            periodoSolicitud: item.periodoSolicitud,
            estadoDolicitud: item.estadoSolicitud,
            materia_id: item.materia_id,
            soliID:item.id
        });
        openModalEdicion();
    }
    const enviarModalRechazo=(item)=>{
        setValues({
            nombreDocenteSolicitud: item.nombreDocenteSolicitud,
            apellidoDocenteSolicitud: item.apellidoDocenteSolicitud,
            numeroEstudiantesSolicitud: item.numeroEstudiantesSolicitud,
            motivoSolicitud: item.motivoSolicitud,
            fechaSolicitud: item.fechaSolicitud,
            horaInicioSolicitud: item.horaInicioSolicitud,
            // horaFinSolicitud: item.horaFinSolicitud,

            periodoSolicitud: item.periodoSolicitud,
            estadoSolicitud: item.estadoSolicitud,
            materia_id: item.materia_id,
            soliID:item.id

        });
        setOpenModalRechazo(true);

    }

    

    function handleSort(){
        let sortedData=[];
        if(isSorted.dir==="asc"){
            sortedData=isSorted.sortData.sort((a,b)=>{
                return new Date(b.fechaSolicitud) - new Date(a.fechaSolicitud);
            });
            // isSorted.dir="desc"
            setIsSorted({sortData:[...sortedData],dir:"desc"})
        }else {
            sortedData=isSorted.sortData.sort((a,b)=>{
                return new Date(a.fechaSolicitud) - new Date(b.fechaSolicitud);
            });
            
            setIsSorted({sortData:[...sortedData],dir:"asc"})
            // isSorted.dir="asc"
        }  
    }
    

    return (
            <>
            <div className='contenedor-tabla-soli'>
                
                <table className='table'>
                    <thead>
                        <tr className='titulo-tabla-soli'>
                            <th>#</th>
                            <th>Nombre </th>
                            <th>Apellido</th>
                            <th>Cantidad</th>
                            <th>Motivo</th>
                            <th onClick={handleSort}>Fecha</th>
                            <th>Hora</th>
                            <th>Estado</th>
                            <th>Opciones</th>
                        </tr>
                    </thead>               
                    <tbody className='animate__animated animate__fadeIn'>
                        {
                            isSorted.sortData.map((item, i) => (
                                <tr key={item.id}>
                                    <td> { i+1 } </td>
                                    <td> { item.nombreDocenteSolicitud } </td>
                                    <td> { item.apellidoDocenteSolicitud } </td>
                                    <td> { item.numeroEstudiantesSolicitud } </td>
                                    <td> { item.motivoSolicitud } </td>
                                    <td> { item.fechaSolicitud } </td>
                                    <td> { item.horaInicioSolicitud } </td>
                                    <td> { item.estadoSolicitud } </td>
                                    <td className='td-btns-soli'>
                                        <section className='caja-btns-soli'>
                                            <button 
                                                className='btn-editar editar-soli'
                                                onClick={ () => {actualizar(item)} }
                                            >
                                                Detalles
                                            </button>
                                            <button 
                                                className='btn-editar rechazar-mat'
                                                onClick={ ()=>{ 
                                                    enviarModalRechazo(item)
                                                } }
                                            ><i class="bi bi-trash3-fill"></i>
                                                    Rechazar
                                            </button>
                                            
                                        </section>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>  
                </table>
            </div>
            {
                isOpen &&
                <ModalGenerico isOpen={ isOpen } closeModal={closeModalEdicion}>
                    <RegSolicitud 
                    nombre_doc ={nombreDocenteSolicitud} 
                    ape_doc ={apellidoDocenteSolicitud} 
                    nro_est ={numeroEstudiantesSolicitud} 
                    motivo ={motivoSolicitud}
                    fecha_res ={fechaSolicitud}
                    hora_res ={horaInicioSolicitud}
                    periodo ={periodoSolicitud}
                    estado ={estadoSolicitud}
                    closeModal={closeModalEdicion} 
                    titulo='Detalles' 
                    materia_id={materia_id}
                    
                    />
                </ModalGenerico>
            }
            {openModalRechazo && 
            <ModalGenerico  isOpen={openModalRechazo} closeModal={closeModalRechazo}>
              <ModalRechazo 
              nombre_doc ={nombreDocenteSolicitud} 
              ape_doc ={apellidoDocenteSolicitud} 
              motivoRechazo=""
              nro_est ={numeroEstudiantesSolicitud} 
              motivo ={motivoSolicitud}
              fecha_res ={fechaSolicitud}
              hora_res ={horaInicioSolicitud}

              periodo ={periodoSolicitud}
              estado ="Solicitud Rechazada"
              materiaId={materia_id}
              solicitudId={soliID}
              
              closeModal={setOpenModalRechazo}/> 
            </ModalGenerico>
            }
            </>
    )
}
