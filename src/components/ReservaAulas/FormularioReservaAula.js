import React, { useContext, useEffect, useState } from 'react'
import './estilosFormularioReserva.css'

import { controlarCampoNomDocente, controlarCampoApeDocente, controlarCampoCantidad, controlarCampoPeriodo, validarCamposVaciosSolicitud, validarCamposLlenosSolicitud } from '../../helpers/validarForms';
import { useForm } from '../../hooks/useForm';
import { useModal } from '../../hooks/useModal';
import { ModalGenerico } from '../Modal/ModalGenerico';
import { AdvertenciaFormVacio } from '../Modal/Contenidos/AdvertenciaFormVacio';
import { Confirmacion } from '../Modal/Contenidos/Confirmacion';
import { Hecho } from '../Modal/Contenidos/Hecho';
import { ErrorGuardarDatos } from '../Modal/Contenidos/ErrorGuardarDatos';
import { MateriasDocente } from './MateriasDocente'
import { getMateria } from '../../service/apiMateria';
import { GruposDocente } from './GruposDocente';
import { getGrupoMateria } from '../../service/apiGrupoMaterias';

//Importacion de las APIs para la solicitud
import { getSolicitud, createSolicitud, updateSolicitudId } from '../../service/apiSolicitudAulas';
import { useNavigate } from 'react-router-dom';
import { Calendar } from 'primereact/calendar';
import { addLocale } from 'primereact/api';
import { AuthContext } from '../../auth/authContext';
import { obtenerGrupos, obtenerMaterias } from '../../helpers/metodosDeFormularioReserva';




export const FormularioReservaAula = ({
        
        nomDocente          ='', 
        apeDocente          ='', 
        cantEstudiantes     ='', 
        // motRechazo          ='', 
        horSolicitud        ='',
        perSolicitud        ='',

        closeModal = () => {}, titulo='', idsolicitud='', setListaSolicitud
    }) => {

    const [formValues, handleInputChange] = useForm({
       
        nombreDocente:          nomDocente,
        apellidoDocente:        apeDocente,
        cantidadEstudiantes:    cantEstudiantes,
        // motvioRechazo:          motRechazo,
        peridoSolicitud:        perSolicitud,
        horaSolicitud:          horSolicitud,
        
    })

    const { cantidadEstudiantes, horaSolicitud, peridoSolicitud} = formValues;

    const { user } = useContext(AuthContext);

    //hooks para controlar contenidos de campos
    const [StatusInputNomDocente, setStatusInputNomDocente] = useState(false);
    const [StatusInputApeDocente, setStatusInputApeDocente] = useState(false);
    const [StatusInputCantidad, setStatusInputCantidad] = useState(false);
    const [StatusInputMotivo, setStatusInputMotivo] = useState(false);
    const [StatusInputPeriodo, setStatusInputPeriodo] = useState(false);

    //Hooks para mostrar el mensaje de error en los campos
    const [MsjErrorNomDocente, setMsjErrorNomDocente] = useState('');
    const [MsjErrorApeDocente, setMsjErrorApeDocente] = useState('');
    const [MsjErrorCantidad, setMsjErrorCantidad] = useState('');
    const [MsjErrorMotivo, setMsjErrorMotivo] = useState('');
    const [MsjErrorPeriodo, setMsjErrorPeriodo] = useState('');

    //Hooks para el estado de las peticiones de la solicitud
    const [StatePetition, setStatePetition] = useState(false);

    //Hooks para controlar modales
    const [isOpenModalConfirm, openModalConfirm, closeModalConfirm] = useModal(false);
    const [isOpenModalWarning, openModalWarning, closeModalWarning] = useModal(false);
    const [isOpenModalSuccess, openModalSuccess, closeModalSuccess] = useModal(false);
    const [isOpenModalFormVacio, openModalFormVacio, closeModalFormVacio] = useModal(false);

    //controlar estados de select
    const [selects, setSelects] = useState('Registrar materia');
    const [selectsGrupos, setSelectsGrupos] = useState('Registrar grupo');
    const [selectMotivo, setSelectMotivo] = useState('Vacio');



    useEffect(() => {
        if( cantidadEstudiantes === '' ){
            setStatusInputCantidad(false);
        }else{
            controlarCampoCantidad( cantidadEstudiantes, setStatusInputCantidad, setMsjErrorCantidad );
        }
    }, [cantidadEstudiantes])

    useEffect(() => {
        if( selectMotivo === 'Vacio' ){
            setStatusInputMotivo(true);
        }else{
            setStatusInputMotivo(false);
        }
    }, [selectMotivo])

    useEffect(() => {
        if( peridoSolicitud === ''){
            setStatusInputPeriodo(false);
        }else {
            controlarCampoPeriodo( peridoSolicitud, setStatusInputPeriodo, setMsjErrorPeriodo );
        }
    }, [peridoSolicitud])


    const validarForm = () => {
        if( validarCamposVaciosSolicitud(formValues, selectMotivo) ){
            openModalFormVacio();
        }else {
            if( validarCamposLlenosSolicitud(formValues) ){
                openModalConfirm();
            }else {
                console.log(typeof(nombreDocente));
                console.log('logrado');
            }
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
    }


    //Para editar la solicitud y actualizar la tabla
    const editarSolicitud = (nomS, apeS, canS,motR, fecS, horS, perS, matS, gruS) => {
        const arregloSolicitud = dataS;

        let contador = 0;

        arregloSolicitud.map((solicitud) => {
            if( idsolicitud === solicitud.id ){
                arregloSolicitud[contador].nombreDocenteSolicitud       = nomS;
                arregloSolicitud[contador].apellidoDocenteSolicitud     = apeS;
                arregloSolicitud[contador].numeroEstudiantesSolicitud   = canS;
                arregloSolicitud[contador].motivoSolicitud              = selectMotivo;
                arregloSolicitud[contador].motivoRechazo                = motR;
                arregloSolicitud[contador].fechaSolicitud               = fecS;
                arregloSolicitud[contador].horaInicioSolicitud          = horS;
                arregloSolicitud[contador].periodoSolicitud             = perS;
                arregloSolicitud[contador].materiaSolicitud             = matS;
                arregloSolicitud[contador].grupoSolicitud               = gruS;
            }
            contador++;
        });
        setListaSolicitud({
            stateS: true,
            dataS: arregloSolicitud
        });
    }


    //Para enviar los datos del formulario 
    const guardarDatosFormulario = () => {
        setStatePetition(true);

        if( idsolicitud === '' ) {
            createSolicitud( formValues, '1', selects, selectsGrupos, selectMotivo, JSON.stringify(fechaSolicitud).substring(1,11), 'pendiente','ninguno', '0', user.name, user.apellido, openModalSuccess, openModalWarning ); 
        }else {
            updateSolicitudId(formValues, '1', selects, selectsGrupos, selectMotivo, JSON.stringify(fechaSolicitud).substring(1,11), 'pendiente','ninguno', '0', user.name, user.apellido, openModalSuccess, openModalWarning, idsolicitud);
            editarSolicitud(user.name, user.apellido, cantidadEstudiantes, fechaSolicitud, horaSolicitud, peridoSolicitud, selects, selectsGrupos)
        }
    }

    //Hook para obtener las solicitudes
    const [ListaSolicitud, setListaSolicitudes] = useState({
        stateS: false,
        dataS: []
    });

    const {stateS, dataS} = ListaSolicitud;

    useEffect(() => {
        getSolicitud(setListaSolicitudes);
    }, [stateS]);

    
    //Lista Materias
    const [listaMateria, setListaMateria] = useState({
        state: false,
        data: []
    });

    const {state, data} = listaMateria;

    //Obtener los grupos de materias y listarlas
    const [listaGrupos, setStateData] = useState([]);

    const [listaMateriasDocente, setListaMateriasDocente] = useState([]);

    const [listaGruposDocente, setListaGruposDocente] = useState([]);

    useEffect(() => {
        getMateria(setListaMateria);
        getGrupoMateria(setStateData);
    }, []);

    useEffect(() => {
        setListaMateriasDocente(obtenerMaterias(data, listaGrupos.data, user.idDocente))  
    },[data, listaGrupos.data])

    useEffect(() => {
        setListaGruposDocente(obtenerGrupos(listaGrupos.data, data, selects, user.idDocente))
        console.log(user.idDocente, 'iddocente');
    }, [selects])


    const navegar = useNavigate();

    const volverAtrasSolicitud = () => {
        navegar(-1);
    }

    //Invalidar dias del calendario
    const [ fechaSolicitud, setfechaSolicitud ] = useState(null);

    useEffect(() => {
        console.log(JSON.stringify(fechaSolicitud).substring(1,11));
    }, [fechaSolicitud]);

        
        let today = new Date();
        let month = today.getMonth();
        let year = today.getFullYear();
        let prevMonth = (month === 0) ? 11 : month - 0;
        let prevYear = (prevMonth === 11) ? year - 1 : year;

        let minDate = new Date();
        minDate.setMonth(prevMonth);
        minDate.setFullYear(prevYear);


        let invalidDates = [today];

        addLocale('en', {
            firstDayOfWeek: 1,
            dayNames: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
            dayNamesShort: ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'],
            dayNamesMin: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá'],
            monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
            monthNamesShort: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
            today: 'Hoy',
            clear: 'Limpiar'
        });


    return (
        <div className='contenedor-reserva-aulas'>
            <h1 className="titulo-reserva-aulas">{titulo === ''? 'Solicitud de Reserva de Aula' : `${titulo} Solicitud de Reserva` }</h1>
            {
                listaMateriasDocente.length > 0 ? 
            
            <form onSubmit={ handleSubmit } >
                <div className="contenedor-reserva">
                    <div className="contenedor-elementos-reserva-aulas">
                        <div className="campos-reserva-aulas">
                            <label className="labels"> Materia: </label>
                            <div className='contenedor-inputs'>
                                <MateriasDocente data={listaMateriasDocente} selects={ selects } setSelects={ setSelects } />
                            </div>
                        </div>
                        <div>
                        </div>
                        <div className="campos-reserva-aulas">
                            <label className="labels"> Grupo(s): </label>
                            <div className='contenedor-inputs'>
                                <GruposDocente datas={listaGruposDocente} selectsGrupos={ selectsGrupos } setSelectsGrupos={ setSelectsGrupos } />
                            </div>
                        </div>
                        <div className="campos-reserva-aulas">
                            <label className="labels"> Cantidad de Estudiantes: </label>
                            <div className='contenedor-inputs'>
                                <input 
                                    name='cantidadEstudiantes'
                                    className={ StatusInputCantidad===true? "input-error" : "inputsSolicitud" }
                                    type="number"
                                    placeholder='Cantidad Minima 5'
                                    value={ cantidadEstudiantes }
                                    onChange={ handleInputChange }
                                ></input>
                                <p className={ StatusInputCantidad===true? "mensaje-error" : "mensaje-error-oculto" }>
                                    { MsjErrorCantidad }
                                </p>
                            </div>
                        </div>
                        <div className="campos-reserva-aulas">
                            <label className="labels"> Motivo de solicitud:</label>
                            <div className='contenedor-inputs'>
                                {/* <textarea name='motivoSolicitud' className={ StatusInputMotivo===true? "input-error" : "inputsSolicitud" } type="text"placeholder='Ingresar Motivo Solicitud' value={ motivoSolicitud } onChange= { handleInputChange } > */}
                                {/* </textarea> */}
                                {/* <p className={ StatusInputMotivo===true? "mensaje-error" : "mensaje-error-oculto" }> */}
                                    {/* { MsjErrorMotivo } */}
                                {/* </p> */}
                                <select 
                                    name='motivoSolicitud' 
                                    className='inputsSolicitud' 
                                    value={selectMotivo}
                                    onChange={e => setSelectMotivo(e.target.value)}
                                    selectMotivo={ selectMotivo }
                                    setSelectMotivo={ setSelectMotivo }
                                > 
                                    <option value='Vacio'> Seleccionar motivo.</option>
                                    <option > Examen Primer Parcial </option>
                                    <option > Examen Segundo Parcial </option>
                                    <option > Examen Final </option>
                                    <option > Examen Segunda Instancia </option>
                                    <option > Examen de Mesa 1ra Opción </option>
                                    <option > Examen de Mesa 2ra Opción </option>
                                </select>
                                <p className={ StatusInputMotivo ? "mensaje-error" : "mensaje-error-oculto"}>
                                    Debe seleccionar un motivo.
                                </p>
                            </div>
                        </div>
                        <div className="campos-reserva-aulas">
                            <label className="labels"> Fecha de Examen: </label>
                            <div className='contenedor-inputsFecha'>
                                {/* <input name='fechaSolicitud' className='inputsSolicitud' type="date" min={disableDates} value={ fechaSolicitud } onChange={ handleInputChange } /> */}
                                <Calendar 
                                    id="disableddays"
                                    name='fechaSolicitud'
                                    className="inputsSolicitud"
                                    placeholder='Seleccionar fecha.'
                                    dateFormat="dd/mm/yy"
                                    value={ fechaSolicitud }
                                    onChange={ (e) => setfechaSolicitud(e.value) }
                                    disabledDates={invalidDates} 
                                    disabledDays={[0]}
                                    minDate={minDate}
                                    showIcon 
                                    readOnlyInput 
                                />
                            </div>
                        </div>
                        <div className="campos-reserva-aulas">
                            <label className="labels"> Periodos:</label>
                            <div className='contenedor-inputs'>
                                <input 
                                    name='peridoSolicitud'
                                    className={ StatusInputPeriodo===true? "input-error" : "inputsSolicitud" }
                                    type="number"
                                    placeholder='Periodo minimo 1'
                                    value={ peridoSolicitud }
                                    onChange={ handleInputChange }
                                ></input>
                                <p className={ StatusInputPeriodo===true? "mensaje-error" : "mensaje-error-oculto" }>
                                    { MsjErrorPeriodo }
                                </p>
                            </div>
                        </div>
                        <div className="campos-reserva-aulas">
                            <label className="labels"> Hora de Inicio: </label>
                            <div className='contenedor-inputs'>
                                <select 
                                    name='horaSolicitud'
                                    className="inputsSolicitud"
                                    //type="time"
                                    //min="06:45:00 a.m."
                                    //max="08:15:00 p.m."
                                    value={ horaSolicitud }
                                    onChange={ handleInputChange }
                                >
                                    <option> Seleccionar hora. </option>
                                    <option> 06:45:00 </option>
                                    <option> 08:15:00 </option>
                                    <option> 09:45:00 </option>
                                    <option> 11:15:00 </option>
                                    <option> 12:45:00 </option>
                                    <option> 14:15:00 </option>
                                    <option> 15:45:00 </option>
                                    <option> 17:15:00 </option>
                                    <option> 18:45:00 </option>
                                    <option> 20:15:00 </option>
                                </select>
                            </div>
                        </div>

                        <div className="btns-reserva-aula">
                            <button 
                                className="btn boton-cancelar" 
                                type="button"
                                onClick={ nomDocente === ''? volverAtrasSolicitud : closeModal}
                            >
                                Cancelar
                            </button>
                            <button 
                                className="btn boton-aceptar" 
                                type="button"
                                onClick={ validarForm }
                            >
                                Aceptar
                            </button>
                        </div>
                    </div>
                </div>
            </form>
            : <p className='parrafoMateriasDocenteVacio'> No tienes materias asignadas para hacer una solicitud. Debes esperar que el administrador te asigne una materia. </p>
            }

            <ModalGenerico isOpen={ isOpenModalFormVacio } closeModal={ closeModalFormVacio } >
                <AdvertenciaFormVacio cerrarModal={ closeModalFormVacio } />
            </ModalGenerico>
        
            <ModalGenerico isOpen={ isOpenModalConfirm } closeModal={ closeModalConfirm }>
                <Confirmacion cerrarModal={ closeModalConfirm } funcGuardar={ guardarDatosFormulario } />
            </ModalGenerico>

            <ModalGenerico isOpen={ isOpenModalWarning } closeModal={ closeModalWarning } >
                <ErrorGuardarDatos cerrarModal={ closeModalWarning } />
            </ModalGenerico>

            <ModalGenerico isOpen={ isOpenModalSuccess } closeModal={ closeModalSuccess }>
                <Hecho cerrarModal={ closeModalSuccess } />
            </ModalGenerico>
        </div>
    )
}
