let rutaElemento="td a.crud";
let ancho;


$(document).ready(function() {
    atrazNO();
    init();
    actualizaDashboard();
    menu();
    datosUsuario();
    //popup();
    tooltip();
        
    $('#salir').off( 'click');
    $('#salir').on( 'click',function () {
        salir();
        $('.main-profile-menu').removeClass('show')
    });
    
    $('#miPerfil').off( 'click');
    $('#miPerfil').on( 'click',function () {
        miPerfil();
        $('.main-profile-menu').removeClass('show')
    });

    $('#verMembresia').off( 'click');
    $('#verMembresia').on( 'click',function () {
        verMembresia();
        $('.main-profile-menu').removeClass('show')
    });

    $('#cambiaPassword').off( 'click');
    $('#cambiaPassword').on( 'click',function () {
        vistaCambiaPassword();
        $('.main-profile-menu').removeClass('show')
    });

    /*$('#actualizaDashboard').off( 'click');
    $('#actualizaDashboard').on( 'click',function () {
        actualizaDashboard();
    });

    $('#actualizaDashboardProd').off( 'click');
    $('#actualizaDashboardProd').on( 'click',function () {
        actualizaDashboardProd();
    });*/
});

function tooltip(){
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    tooltipTriggerList.forEach(el => {
        new bootstrap.Tooltip(el);
    });
}

function popup(){
    if(localStorage.getItem("popup")){
        return true;
    }else{
        success('Ya puedes probar la nueva funcionalidad de mensajería masiva a clientes!!!','"NUEVA FUNCIONALIDAD"');
        localStorage.setItem("popup",true);
    }
}

async function actualizaDashboard(){
    bloquea('Se está actualizando el dashboard');
    try {
        const recarga= await axios.get("/api/inicio/dashboard/"+verSesion()+"/"+'cron');
        if(recarga.data.valor.resultado){
            dashboard()
        }
        desbloquea();
        
    }catch (err) {
        desbloquea();	
        message=err.response.data.error.message;
        errno=err.response.data.error.errno;
        mensajeError(err.response.data.error);
    }
}


async function actualizaDashboardProd(){
    bloquea('Se está actualizando el dashboard');
    try {
        const recarga= await axios.get("/api/inicio/dashboardProd/"+verSesion()+"/"+'cron');
        if(recarga.data.valor.resultado){
            dashboardProd()
        }
        desbloquea();
        
    }catch (err) {
        desbloquea();	
        message=err.response.data.error.message;
        errno=err.response.data.error.errno;
        mensajeError(err.response.data.error);
    }
}

function atrazNO(){
    if(history.forward(1)){
        location.replace(history.forward(1))
    }
}

function init() {
    var mover= false;
        $("body").off( 'mousemove');
        $("body").on('mousemove',function(){
            mover = true;
        });

        setInterval (function() {
            if (!mover) {
                cerrarSesion();
            } else {
                mover=false;
            }
        },  1800000); // Cada 30 minutos, pon el valor que quieras.
        //}, 5000);
        //1000 = 1s, 60000 = 1m, 
 }

function dashboard(){
    try{
		$('#jsPropio').html("<script src='/java/dashboard.js?"+moment().format('DDMMYYYYHHmmss')+"'></script>");
    }catch (err) {	
		message=err.response.data.error.message;
		errno=err.response.data.error.errno;
		mensajeSistema(message);
	}
}

function dashboardProd(){
    try{
		$('#jsPropio').html("<script src='/java/dashboardProd.js?"+moment().format('DDMMYYYYHHmmss')+"'></script>");
    }catch (err) {	
		message=err.response.data.error.message;
		errno=err.response.data.error.errno;
		mensajeSistema(message);
	}
}

function salir(){
	confirm("¿Está seguro de salir de su sesión?",function(){
		return false;
	},async function(){
        bloquea();
        let body={

        }
        try{
            const salir = await axios.put("/api/acceso/logout/"+verSesion(),body,{ 
                headers:{
                    authorization: `Bearer ${verToken() }`
                } 
            });
            const resp=salir.data.valor.info;
            localStorage.removeItem('popup');
            desbloquea();
            location.reload();  
        }catch (err) {
            desbloquea();	
            message=err.response.data.error.message;
            errno=err.response.data.error.errno;
            mensajeSistema(message);
        }
	});
}


function vistaCambiaPassword(){
    try{
		$('#jsPropio').html("<script src='/java/cambiaPassword.js?"+moment().format('DDMMYYYYHHmmss')+"'></script>");
    }catch (err) {
		desbloquea();	
		message=err.response.data.error.message;
		errno=err.response.data.error.errno;
		mensajeSistema(message);
	}
}

function miPerfil(){
    try{
		$('#jsPropio').html("<script src='/java/usuarioPerfil.js?"+moment().format('DDMMYYYYHHmmss')+"'></script>");
    }catch (err) {
		desbloquea();	
		message=err.response.data.error.message;
		errno=err.response.data.error.errno;
		mensajeSistema(message);
	}
}

function verMembresia(){
    try{
		$('#jsPropio').html("<script src='/java/pagos.js?"+moment().format('DDMMYYYYHHmmss')+"'></script>");
    }catch (err) {
		desbloquea();	
		message=err.response.data.error.message;
		errno=err.response.data.error.errno;
		mensajeSistema(message);
	}
}

async function datosUsuario(){
    bloquea('Cargando datos de usuario...');
    try {
        const datosUsuario=await axios.get('/api/inicio/datos/'+verSesion(),{ 
            headers: 
            { 
                authorization: 'Bearer '+verToken()
            } 
        });
        let resp=datosUsuario.data.valor;
        desbloquea();

        if(resp.resultado){
            $("#userNivel").val(resp.info.ID_NIVEL);
            $("#userSucursal").val(resp.info.ID_SUCURSAL);
            $("span#nivelMenu, span#nivelMenu2").text(resp.info.NOMB_NIVEL);
            $("h4#usuarioMenu,h6#usuarioMenu2").html(resp.info.NOMBRE+" "+resp.info.APELLIDO_PATERNO);
            if(resp.info.IMAGEN_EMPRESA=='' || resp.info.IMAGEN_EMPRESA===null){
                $("img.imagenSucursalInicio").attr('src','/imagenes/vacio.jpg');
            }else{
                $("img.imagenSucursalInicio").attr('src','/imagenes/sucursal/LOGO_'+resp.info.ID_EMPRESA+'_'+resp.info.IMAGEN_EMPRESA);
            }
            if(resp.info.IMAGEN=='' || resp.info.IMAGEN===null){
                $("img.imagenUsuarioInicio").attr('src','/imagenes/vacio.jpg');
            }else{
                $("img.imagenUsuarioInicio").attr('src','/imagenes/usuario/USU_'+resp.info.ID_USUARIO+'_'+resp.info.IMAGEN); 
            }

            $("#sucursalVentas").text(resp.info.NOMB_SUCURSAL);
            
            socket.emit('joinUsuario',{
                usuario : "U"+$("#userSesion").val()
            });

            socket.emit('joinNivel',{
                nivel : "N"+$("#userNivel").val()
            });

            socket.emit('joinSucursal',{
                sucursal: 'S'+$('#userSucursal').val()
            });
        }else{
            mensajeSistema(resp.info.mensaje);
        }
    }catch (err) {
        desbloquea();	
        message=err.response.data.error.message;
        errno=err.response.data.error.errno;
        mensajeError(err.response.data.error);
    }
}
async function menu(){
    bloquea('Cargando el menú...');
    try {
        const menuNivel= await axios.get('/api/inicio/menu/'+verSesion()+'/menuNivel/submenuNivel',{
            headers: 
            { 
                authorization: 'Bearer '+verToken()
            } 
        });
        let resp=menuNivel.data.valor;
        desbloquea();
        if(resp.resultado){
            $("#menuSubMenu").html(resp.info);
            menuClick();
            $('.inicioServicio').off( 'click');
            $('.inicioServicio').on( 'click',function () {
                actualizaDashboard();
            });
            $('.inicioProducto').off( 'click');
            $('.inicioProducto').on( 'click',function () {
                actualizaDashboardProd();
            });
            eventoSubMenu();
        }else{
            mensajeSistema(resp.info.mensaje);
        }
    }catch (err) {
        desbloquea();	
        message=err.response.data.error.message;
        errno=err.response.data.error.errno;
        mensajeError(err.response.data.error);
    }
}

function eventoSubMenu(){
    $('.eventoSubmenu').on( 'click', 'a', function () {
        let idSubMenu =$(this).attr("id");
        let ruta=$(this).attr("ruta");
		vistaMenuSubMenu({ruta:ruta.toLowerCase(),idSubMenu:idSubMenu});
    });
}

function vistaMenuSubMenu(objeto){
    try{
        $('#jsPropio').html("<script src='/java/"+objeto.ruta+".js?"+moment().format('DDMMYYYYHHmmss')+"'></script>");
    }catch (err) {
        desbloquea();	
        message=err.response.data.error.message;
        errno=err.response.data.error.errno;
        mensajeSistema(message);
    }
}


function subMenuAccesoDirecto(objeto){
    eventoSubMenu();
    $('#menuSubMenu li.menu a.active').removeClass("active");
    $('#menuSubMenu li.subMenu a.active').removeClass("active");
    let activaMenu=$('#menuSubMenu').find('li.menu'+objeto.idMenu);
    activaMenu.addClass("menu-open");
    activaMenu.find('a.menu').addClass("active");
    activaMenu.find('li.subMenu'+objeto.idSubMenu).find('a.subMenu').addClass("active");
    
}


function crearPdf(objeto){
    bloquea();
    $.ajax({
		type: "POST",
		url: '/'+objeto.tabla+"/"+objeto.accion.toLowerCase(),
		data:{
            id:objeto.id,
            idP:objeto.idP,
            tabla:objeto.tabla,
            nombre:objeto.nombre
        },
		success: function(msg) {
            desbloquea(); 
		},
		error: function(msg) {
			desbloquea();
            resp=msg.responseJSON.error;
            mensajeError(resp);
		}
	});
}

function muestraPdf(objeto){
    /*bloquea();
    $.ajax({
		type: "POST",
		url: '/'+objeto.tabla+"/"+objeto.accion.toLowerCase(),
		data:{
            id:objeto.id,
            idP:objeto.idP
        },
		success: function(msg) {
            desbloquea();
            resp=msg; */
            
            let url='/'+objeto.tabla+"/"+objeto.accion.toLowerCase()+"/"+objeto.accion.toLowerCase()+objeto.id+".pdf";
            let a = document.createElement('a');
            a.href=url;
            a.target='_blank'
            //a.download = objeto.nombre;
            a.click();
            window.URL.revokeObjectURL(url);	
		/*},
		error: function(msg) {
			desbloquea();
            resp=msg.responseJSON.error;
            mensajeError(resp);
		}
	});*/
}

function descargaArchivo(objeto){
    let url='/general/descarga/'+objeto.tabla+'/'+objeto.nombre;
	let a = document.createElement('a');
	a.href = url;
	a.download = objeto.nombre;
	a.click();
}

function descargaExpediente(objeto){
    let url='/general/expediente/'+objeto.tabla+'/'+objeto.nombre;
	let a = document.createElement('a');
	a.href = url;
	a.download = objeto.nombre;
	a.click();
}

function excel(objeto){
    mostrar_confirmacion("¿Está seguro de descargar el archivo excel de "+objeto.nombreSubmenu+"?",function(){
		return false;
	},function(){
        $.ajax({
            type: "POST",
            url: "./excel/xls_"+objeto.tabla+objeto.accion+".php",
            data:{},
            success: function(msg) {
                let url="./documentos/excel/"+objeto.tabla+objeto.accion+".xlsx";
                let a = document.createElement('a');
                a.href = url;
                a.download = objeto.nombre;
                a.click();
                window.URL.revokeObjectURL(url);
            },
            error: function() {
                console.log("No se ha podido obtener la información");
            }
        });
    });	
}


async function guardaImpresion(impresion){
    bloquea();
    try {
        let body={
            idSucursal:$('#sucursal').val(),
			impresion:impresion,
			sesId:verSesion()
		}
        const imprime= await axios.put('/api/acceso/impresion/'+verSesion(),body,{
            headers: 
            { 
                authorization: 'Bearer '+verToken()
            } 
        });
        let resp=imprime.data.valor;
        desbloquea();
        $('#activaImpresion').val(impresion);
    }catch (err) {
        desbloquea();	message=err.response.data.error.message;
        errno=err.response.data.error.errno;
        mensajeSistema(message);
    }

}

//BOTONES
function guarda(){
    let boton=`
        <button type='Guardar' name='btnGuarda' class='crud btn btn-primary-gradient btn-md guardar'>
            <i class='la la-save'></i>
            <span id="botonGuardar" class='p-1'>Guardar</span>
        </button>`;
    return boton;
}
function crea(){
    let boton=`
        <button type='Crea' name='btnGuarda' class='crud btn btn-primary-gradient btn-md crea'>
            <i class='la la-save'></i>
            <span class='p-1'>Crear</span>
        </button>`;
    return boton;
}
function edita(){
    let boton=`
    <button type='Edita' name='btnGuarda' class='crud btn btn-primary-gradient btn-md edita'>
        <i class='la la-save'></i>
        <span class='p-1'>Modificar</span>
    </button>`;
    return boton;
}
function cancela(){
    let boton=`
    <button type='Cancela' name='btnCancela' class='mr-1 btn btn-secondary-gradient btn-md cancela'>
        <i class='la la-times'></i>
        <span class='p-1'>Cancelar</span>
    </button>`;
    return boton;
}
function limpia(){
    let boton=`
    <button type='Limpia' name='btnLimpia' class='mr-1 btn btn-info-gradient btn-md limpia'>
        <i class="las la-broom"></i>
        <span class='p-1'>Limpiar</span>
    </button>`;
    return boton;
}

function regresa(){
    let boton=`
    <button type='Regresa' name='btnRegresa' class='mr-1 btn btn-danger-gradient btn-md regresa'>
        <i class="las la-hand-point-left"></i>
        <span class='p-1'>Regresar</span>
    </button>`;
    return boton;
}

function venta(){
    let boton=`
    <button type='Venta' name='btnVenta' class='mr-1 btn btn-primary-gradient btn-md venta'>
        <i class="las la-file-invoice-dollar"></i>
        <span class='p-1'>Pagar venta</span>
    </button>`;
    return boton;
}

function atender(){
    let boton=`
    <button type='Atencion' name='btnAtencion' class='mr-1 btn btn-primary-gradient btn-md atencion'>
        <i class="las la-file-invoice-dollar"></i>
        <span class='p-1'>Pagar servicio</span>
    </button>`;
    return boton;
}


function borrar(){
    let boton=`
    <button type='Borrar' name='btnBorrar' class='mr-1 btn btn-danger-gradient btn-md borrar'>
        <i class='las la-trash'></i>
        <span class='p-1'>Eliminar todo</span>
    </button>`;
    return boton;
}

function compra(){
    let boton=`
    <button type='Compra' name='btnCompra' class='mr-1 btn btn-primary-gradient btn-md compra'>
        <i class="las la-file-invoice-dollar"></i>
        <span class='p-1'>Pagar compra</span>
    </button>`;
    return boton;
}

function buscar(){
    let boton=`
    <button type='Buscar' name='btnBuscar' class='mr-1 btn btn-primary-gradient btn-md buscar'>
        <i class="las la-search"></i>
        <span class='p-1'>Buscar</span>
    </button>`;
    return boton;
}

function descarga(){
    let boton=`
    <button type='Descarga' name='btnDescarga' class='mr-1 btn btn-secondary-gradient btn-md descarga'>
        <i class="las la-file-excel"></i>
        <span class='p-1'>Descargar</span>
    </button>`;
    return boton;
}
//ICONOS
function estado(){
    let boton=`
    <a type='Estado' class="crud estado cursor btn btn-sm btn-info-gradient" data-bs-toggle="tooltip" data-bs-placement="top" title="Estado">
        <i class='las la-check-circle'></i>
    </a>`;
    return boton;
}
function visible(){
    let boton=`
    <a type='Visible' class="crud visible cursor btn btn-sm btn-dark-gradient" data-bs-toggle="tooltip" data-bs-placement="top" title="Visible">
        <i class="las la-eye"></i></i>
    </button>`;
    return boton;
}
function modifica(){
    let boton=`
    <a type='Edita' class="crud edita cursor btn btn-sm btn-success-gradient" data-bs-toggle="tooltip" data-bs-placement="top" title="Editar">
        <i class='las la-edit'></i>
    </a>`;
    return boton;
}
function elimina(){
    let boton=`
    <a type='Elimina' class="crud elimina cursor btn btn-sm btn-danger-gradient" data-bs-toggle="tooltip" data-bs-placement="top" title="Eliminar">
        <i class='las la-trash'></i>
    </a>`;
    return boton;
}
function detalle(){
    let boton=`<a type='Detalle' class="crud detalle cursor btn btn-sm btn-secondary-gradient" data-bs-toggle="tooltip" data-bs-placement="top" title="Detalle">
        <i class="las la-list-ol"></i>
    </a>`;
    return boton;
}
function contrasena(){
    let boton=`<a type='Contrasena' class="crud contrasena cursor btn btn-sm btn-warning-gradient" data-toggle="tooltip" data-placement="top" title="Contraseña">
				<i class='las la-key'></i>
			</a>`;
    return boton;
}
function bloqueo(){
    let boton=`<a type='Bloqueo' class="crud bloqueo cursor btn btn-sm btn-light-gradient" data-toggle="tooltip" data-placement="top" title="Bloqueo">
            <i class='las la-times-circle'></i>
        </a>`;
        return boton;
}
function sucursal(){
    let boton=`<a type='Sucursal' class="crud sucursal cursor btn btn-sm btn-primary-gradient" data-toggle="tooltip" data-placement="top" title="Sucursal">
            <i class="las la-store-alt"></i>
        </a>`;
    return boton;
}
function empresa(){
    let boton=`<a type='Empresa' class="crud empresa cursor btn btn-sm btn-dark-gradient" data-toggle="tooltip" data-placement="top" title="Empresa">
            <i class="las la-clipboard-check"></i>
        </a>`;
    return boton;
}
function visita(){
    let boton=`<a type='Visita' class="crud visita cursor btn btn-sm btn-warning-gradient" data-toggle="tooltip" data-placement="top" title="Visita">
            <i class="las la-glasses"></i>
        </a>`;
    return boton;
}

function enviar(){
    let boton=`<a type='Enviar' class="crud enviar cursor btn btn-sm btn-success-gradient" data-bs-toggle="tooltip" data-bs-placement="top" title="Enviar">
            <i class="las la-envelope-open-text"></i>
        </a>`;
    return boton;
}
function ver(){
    let boton=`<a type='Ver' class="crud ver cursor btn btn-sm btn-primary-gradient" data-bs-toggle="tooltip" data-bs-placement="top" title="Ver">
                <i class="las la-eye"></i>
        </a>`;
    return boton;
}
function asignar(){
    let boton=`<a type='Asignar' class="crud asignar cursor btn btn-sm btn-success-gradient" data-bs-toggle="tooltip" data-bs-placement="top" title="Asignar">
                <i class="las la-list-alt"></i>
        </a>`;
    return boton;
}

function cambiar(){
    let boton=`
    <a type='Cambiar' class="crud cambiar cursor btn btn-sm btn-info-gradient" data-toggle="tooltip" data-placement="top" title="Cambiar">
        <i class='las la-check-circle'></i>
    </a>`;
    return boton;
}

function quitar(){
    let boton=`
    <button type='Quitar' name='btnQuitar' class='mr-1 btn btn-danger-gradient btn-md quitar'>
        <i class='las la-trash'></i>
        <span class='p-1'>Eliminar</span>
    </button>`;
    return boton;
}



