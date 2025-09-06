//FUNCIONES
$(document).ready(function() {
	try {
		vistaVenta();
	}catch (err) {
		desbloquea();
		message=(err.response)?err.response.data.error:err;
		mensajeError(message);
	}
});

async function vistaVenta(){
	bloquea();
	let tabla="venta";
	let idVenta;
	let totalVenta=0;
	let lista;
	let ventas;
	let resp;
	let resp2;
	const busca =  await axios.get('/api/'+tabla+'/buscar/0/'+verSesion(),{ 
		headers:{authorization: `Bearer ${verToken()}`} 
	});

	if(busca.data.valor.info!==undefined){
		idVenta=busca.data.valor.info.ID_VENTA;
		totalVenta=(busca.data.valor.info.TOTAL===null)?0:busca.data.valor.info.TOTAL;

		lista= await axios.get('/api/'+tabla+'/detalle/listar/'+idVenta+'/'+verSesion(),{
			headers: 
			{ 
				authorization: `Bearer ${verToken()}`
			} 
		});
		resp=lista.data.valor.info;
	}else{
		idVenta=0;
		ventas= await axios.get('/api/'+tabla+'/inicio/listar/'+verSesion()+"/reporteVentasPorFecha",{
			headers: 
			{ 
				authorization: `Bearer ${verToken()}`
			}
		});
		resp2=ventas.data.valor.info;
	}
	desbloquea();

	let listado=`
	<div class="row row-sm mg-t-10">
		<div class="col-lg-12">
			<div class="card card-primary">
				<div class="card-body">
					<form id="${tabla}" class="needs-validation" novalidate>
						<span class='oculto muestraId'>${ idVenta}</span>
						<span class='oculto muestraNombre'></span>
						<div class="card-header tx-medium bd-0 tx-white bg-primary-gradient"><i class="las la-coins"></i> VENTA</div>
							<form class="row pt-3">`;
								if(idVenta==0){
					  listado+=`<div class="col-md-12 pt-1">
									<button type='Registrar' name='btnRegistrar' class="w-100 btn mb-1 btn-primary btn-lg registrar"><i class="las la-dolly"></i> NUEVA VENTA</button>
								</div>
								<div class="row">
									<div class="col-12">
										<div class="card-content collapse show">
											<div class="card-body card-dashboard">
												<div class="table-responsive">
													<table id="${tabla}Tabla" class="pt-3 table table-striped text-center">
														<thead>
															<tr>
																<th>Tipo documento</th>
																<th>Serie</th>
																<th>Numero documento</th>
																<th>Fecha venta</th>
																<th>cliente</th>
																<th>Sub total</th>
																<th>Impuesto</th>
																<th>Total</th>
																<th>Usuario</th>
																<th class="nosort nosearch">Acciones</th>
															</tr>
														</thead>
														<tbody>`;
															for(var i=0;i<resp2.length;i++){
												listado+=`<tr id="${ resp2[i].ID_VENTA }">
																<td>
																	<div class="tipoDocumento">${ resp2[i].TIPO_DOCUMENTO}</div>
																</td>
																<td>
																	<div class="serie">${ resp2[i].SERIE }</div>
																</td>
																<td>
																	<div class="numero">${resp2[i].NUMERO_DOCUMENTO}</div>
																</td>
																<td>
																	<div class="fechaVenta">${ moment(resp2[i].FECHA_VENTA).format('DD/MM/YYYY') }</div>
																</td>
																<td>
																	<div class="cliente">${ resp2[i].CLIENTE}</div>
																</td>
																<td>
																	<div class="subtotal">${ parseFloat(resp2[i].SUBTOTAL).toFixed(2) }</div>
																</td>
																<td>
																	<div class="impuesto">${ parseFloat(resp2[i].IMPUESTO).toFixed(2) }</div>
																</td>
																<td>
																	<div class="total">${ parseFloat(resp2[i].TOTAL).toFixed(2) }</div>
																</td>
																<td>
																	<div class="usuario">${ resp2[i].USUARIO}</div>
																</td>
																<td>
																	${detalle()}
																</td>
															</tr>`;
															}
											listado+=`</tbody>
													</table>
												</div>
											</div>
										</div>
									</div>
								</div>`;
								}else{
				  listado+=`<div class="row">
								<div class="col-12">
									<div  id="${tabla}Info" class="pb-0 pt-2 pr-3 pl-3">
										<div class="text-right d-flex justify-content-between">
											<h4>TOTAL: S/. <span class="totalVenta">${parseFloat(totalVenta).toFixed(2)}</span></h4>
											<span>${borrar()+venta()}</span>
										</div>
										
										<div class="row">
										<div class="form-group col-md-12">
												<label>Producto (Lote - Stock)</label>
												<input id="autocompletaProd" name="autocompletaProd" autocomplete="off" maxlength="10" type="tel" class="form-control p-1" placeholder="Busque el producto">
												<input type="hidden" name="idProductoSucursal" id="idProductoSucursal">
											</div>
										</div>
									</div>
									<div class="card-content collapse show">
										<div class="card-body card-dashboard">
											<div class="table-responsive">
												<table id="${tabla}Tabla" class="pt-3 table table-striped text-center">
													<thead>
														<tr>
															<th>Código</th>
															<th>Producto</th>
															<th>P. Venta</th>
															<th>Cantidad</th>
															<th>Total</th>
															<th class="nosort nosearch">Acciones</th>
														</tr>
													</thead>
													<tbody>`;
														for(var i=0;i<resp.length;i++){
											listado+=`<tr id="${ resp[i].ID_DETALLE }">
															<td>
																<div class="codigo">${ (resp[i].CODIGO_PRODUCTO===null)?'':resp[i].CODIGO_PRODUCTO}</div>
															</td>
															<td>
																<div class="nombre muestraMensaje">${ resp[i].NOMBRE }</div>
															</td>
															<td>
																<div class="precio">${ parseFloat(resp[i].PRECIO_VENTA).toFixed(2) }</div>
															</td>
															<td>
																<div class="cantidad">${ resp[i].CANTIDAD}</div>
															</td>
															<td>
																<div class="total">${ parseFloat(resp[i].MONTO_TOTAL).toFixed(2) }</div>
															</td>
															<td>
																${modifica()+elimina()}
															</td>
														</tr>`;
														}
										listado+=`</tbody>
												</table>
											</div>
										</div>
									</div>
								</div>
							</div>`;
							}
				listado+=`</form>
					</div>
				</div>
			</div>
		</div>
		`;
		
	$("#cuerpoPrincipal").html(listado);
	$('#'+tabla+'Tabla').DataTable(valoresTabla);
	if(idVenta>0){
		$('[data-toggle="tooltip"]').tooltip();
		$(".select2").select2({
			placeholder:'Select...',
			dropdownAutoWidth: true,
			width: '100%'
		});
		$('.datepicker').datepicker({
			language: 'es',
			changeMonth: true,
			changeYear: true,
			todayHighlight: true
		}).on('changeDate', function(e){
			$(this).datepicker('hide');
		});

		let objeto={
			tabla:tabla,
			idVenta:$('#'+tabla+' span.muestraId').text()
		}
		eventosVenta(objeto);
	}else{
		$('#'+tabla+' div').off( 'click');
		$('#'+tabla+' div').on( 'click', 'button[name=btnRegistrar]', function () {
			let idVenta=$('#'+tabla).find('span.muestraId').text();
			crearVenta({idVenta:idVenta,tabla:tabla,accion:'crea'});
		});

		$('#'+tabla+'Tabla tbody').on( 'click','td a.detalle',function(){//detalle
			let evento=$(this).parents("tr")
			let id=evento.attr('id');
			let nombre=evento.find("td div.tipoDocumento").text()+": "+evento.find("td div.serie").text()+" - "+evento.find("td div.numero").text();
			let objeto={
				tabla:tabla,
				id:id,
				nombreEdit:nombre,
			}
			ventaDetalle(objeto);
		});
	}
}


function eventosVenta(objeto){
	$('#autocompletaProd').autocomplete({
		source: async function(request, response){
			$.ajax({
				url:"/autocompleta/producto",
				type: "POST",
				dataType: "json",
				data:{
					producto:request.term,
					tipo:'autocompletaventa',
					sesId:verSesion(),
					token:verToken()
				},
				success: function(data){
					let datos=data.valor.info;
					response( $.map( datos, function( item ){
						return {
							idVenta:objeto.idVenta,
							idProductoSucursal:	item.ID_PRODUCTO_SUCURSAL,
							codigo:	item.CODIGO_PRODUCTO,
							nombre:	item.NOMBRE,
							idLote: item.ID_PRODUCTO_DETALLE,
							precioVenta: item.PRECIO_VENTA,
							precioCompra: item.PRECIO_COMPRA,
							cantidad:1,
							tabla:objeto.tabla,
							label: item.NOMBRE+" ("+item.LOTE+" - "+item.STOCK+")",
							value: item.NOMBRE+" ("+item.LOTE+" - "+item.STOCK+")"
						}
					}));
				},
			});
		},
		minLength:3,
		select:function(event,ui){
			agregaVenta(ui.item);
			$(this).val(''); 
			return false;
		}	
	});

	$('#'+objeto.tabla+' div').off( 'keyup');
    $('#'+objeto.tabla+' div').on( 'keyup','input[type=text]',function(){
		let name=$(this).attr('name');
		let elemento=$("#"+objeto.tabla+" input[name="+name+"]");
		if(name=='comentario'){
			comentarioRegex(elemento);
		}
	});

	$('#'+objeto.tabla+' div').on( 'keyup','input[type=tel]',function(){
		let name=$(this).attr('name');
		let elemento=$("#"+objeto.tabla+" input[name="+name+"]");
		if(name=='cantidad'){
			numeroRegexSinCero(elemento);
			validaVacio(elemento);
		}
	});

	$('#'+objeto.tabla+' div').off( 'change');
	$('#'+objeto.tabla+' div').on( 'change','input[type=fecha]',function(){
		let name=$(this).attr('name');
		let elemento=$("#"+objeto.tabla+" input[name="+name+"]");
		if(name=='fechaVenta'){
			validaVacio(elemento);
		}
	});

    $('#'+objeto.tabla+' div').on( 'change','select',function(){
		let name=$(this).attr('name');
		let elemento=$("#"+objeto.tabla+" select[name="+name+"]");
		validaVacioSelect(elemento);
	});

	$('#'+objeto.tabla+'Info').off( 'click');
	$('#'+objeto.tabla+'Info').on( 'click','button[name=btnVenta]',function(){//venta
		objeto.id= $("#"+objeto.tabla+" span.muestraId").text();
		objeto.total= $("#"+objeto.tabla+"Info .totalVenta").text();
		if(objeto.total>0){
			procesaFormularioPago(objeto);
		}else{
			mensajeSistema('¡No hay productos para cerrar la venta!')
		}
	});

	$('#'+objeto.tabla+'Info').on( 'click','button[name=btnBorrar]',function(){//borra venta
		objeto.id= $("#"+objeto.tabla+" span.muestraId").text();
		ventaElimina(objeto);
	});

	$('#'+objeto.tabla+'Tabla tbody').off( 'click');
	$('#'+objeto.tabla+'Tabla tbody').on( 'click','td a.edita',function(){//edita
		let evento=$(this).parents("tr")
    	let id=evento.attr('id');
		let nombre=evento.find("td div.nombre").text();
		objeto.id=id;
		objeto.nombreEdit=nombre;
		ventaEdita(objeto);
	});

	$('#'+objeto.tabla+'Tabla tbody').on( 'click','td a.elimina',function(){//elimina
		let evento=$(this).parents("tr")
    	let id=evento.attr('id');
		let nombre=evento.find("td div.nombre ").text();
		ventaEliminaDetalle({id:id,nombre:nombre,tabla:objeto.tabla});
	});

}


//PAGOS
async function procesaFormularioPago(objeto){
	bloquea();
	try {
		const busca =  await axios.get('/api/venta/buscar/0/'+verSesion(),{ 
			headers:{authorization: `Bearer ${verToken()}`} 
		});

		const cliente =  await axios.get("/api/cliente/listar/0/"+verSesion(),{ 
			headers:{
				authorization: `Bearer ${verToken()}`
		} 
		});
		const tipoPago =  await axios.get("/api/parametro/detalle/listar/47/"+verSesion(),{ 
			headers:{
				authorization: `Bearer ${verToken()}`
		} 
		});

		const comprobante =  await axios.get("/api/comprobante/listar/pago/2545/"+verSesion(),{ 
			headers:{
				authorization: `Bearer ${verToken()}`
		} 
		});

		desbloquea();
		const resp=busca.data.valor.info;
		const resp2=cliente.data.valor.info;
		const resp3=tipoPago.data.valor.info;
		const resp4=comprobante.data.valor.info;
		let listado=`
		<form id="pago">
			<h4>TOTAL: S/. <span class="totalVenta">${parseFloat(resp.TOTAL).toFixed(2)}</span></h4>
			<div class="row">
				<div class="form-group col-md-6">
					<label>Cliente (*)</label>
					<select name="cliente" class="form-control select2 muestraMensaje">
						<option value="">Select...</option>`;
						for(var i=0;i<resp2.length;i++){
							if(resp2[i].ES_VIGENTE==1){
						listado+=`<option value="${resp2[i].ID_CLIENTE}">${resp2[i].APELLIDO_PATERNO+" "+resp2[i].APELLIDO_MATERNO+" "+resp2[i].NOMBRE}</option>`;
							}
						}
			listado+=`</select>
					<div class="vacio oculto">¡Campo obligatorio!</div>
				</div>
				<div class="form-group col-md-6">
					<label>Tipo pago (*)</label>
					<select name="tipoPago" class="form-control select2">
						<option value="">Select...</option>`;
						for(var i=0;i<resp3.length;i++){
							if(resp3[i].ES_VIGENTE==1){
						listado+=`<option value="${resp3[i].ID_PARAMETRO_DETALLE}">${resp3[i].DESCRIPCIONDETALLE}</option>`;
							}
						}
			listado+=`</select>
					<div class="vacio oculto">¡Campo obligatorio!</div>
				</div>
			</div>
			<div class="row">
				<div class="form-group col-md-6">
					<label>Comprobante (*)</label>
					<select name="comprobante" class="form-control select2">
						<option value="">Select...</option>`;
						for(var i=0;i<resp4.length;i++){
							if(resp4[i].ES_VIGENTE==1){
						listado+=`<option value="${resp4[i].ID_COMPROBANTE}">${resp4[i].TIPO_DOCUMENTO}</option>`;
							}
						}
			listado+=`</select>
					<div class="vacio oculto">¡Campo obligatorio!</div>
				</div>
				<div class="form-group col-md-3">
					<label>Serie (*)</label>
					<input readonly name="serie" maxlength="10" autocomplete="off" type="text" class="form-control" placeholder="Ingrese la serie">
					<div class="vacio oculto">¡Campo obligatorio!</div>
				</div>
				<div class="form-group col-md-3">
					<label>Número (*)</label>
					<input readonly name="numero" maxlength="10" autocomplete="off" type="text" class="form-control" placeholder="Ingrese el numero">
					<div class="vacio oculto">¡Campo obligatorio!</div>
				</div>
			</div>
			<div class="row">
				<div class="form-group col-md-12">
					<label>Comentario</label>
					<input name="comentario" autocomplete="off" maxlength="255" type="text" class="form-control p-1" placeholder="Ingrese un comentario">
				</div>
			</div>
			<div class="form-section p-0"></div>
			<div class="col-md-12 pl-0 pr-0 text-center">
				${cancela()+guarda()}
			</div>
			<div class="h8 text-center pt-2">(*) Los campos con asteriso son obligatorios.</div>
		</form>`;
		mostrar_general1({titulo:'DETALLE PAGO',nombre:objeto.nombreMsg,msg:listado,ancho:600});
		$(".select2").select2({
			dropdownAutoWidth: true,
			width: '100%',
			placeholder: "Select...",
			dropdownParent: $('#general1')
		});

		let objeto2={
			cliente:$('#pago select[name=cliente]'),
			tipoPago:$('#pago select[name=tipoPago]'),
			comprobante:$('#pago select[name=comprobante]'),
			comentario:$('#pago input[name=comentario]'),
			tabla:'pago',
			id:objeto.id
		}

		eventosPago(objeto2);
	}catch (err) {
		desbloquea();
		message=(err.response)?err.response.data.error:err;
		mensajeError(message);
	}
}

function eventosPago(objeto){
	$('#'+objeto.tabla+' div').off( 'change');
    $('#'+objeto.tabla+' div').on( 'change','select',function(){
		let name=$(this).attr('name');
		let elemento=$("#"+objeto.tabla+" select[name="+name+"]");
		if(name=='comprobante'){
			let idDocumento=$(this).val();
			muestraDocumentoVenta({idDocumento:idDocumento, tabla:objeto.tabla})
		}else{
			validaVacioSelect(elemento);
		}
		
	});

	$('#'+objeto.tabla+' div').off( 'keyup');
    $('#'+objeto.tabla+' div').on( 'keyup','input[type=text]',function(){
		let name=$(this).attr('name');
		let elemento=$("#"+objeto.tabla+" input[name="+name+"]");
		if(name=='comentario'){
			comentarioRegex(elemento);
		}
	});


	$('#'+objeto.tabla).off( 'click');
	$('#'+objeto.tabla).on( 'click','button[name=btnGuarda]',function(){//pago
		validaFormularioPago(objeto);
	});
}

function validaFormularioPago(objeto){	
	validaVacioSelect(objeto.cliente);
	validaVacioSelect(objeto.tipoPago);
	validaVacioSelect(objeto.comprobante);

	if(objeto.cliente.val()=="" || objeto.tipoPago.val()=="" || objeto.comprobante.val()==""){
		return false;
	}else{
		enviaFormularioPago(objeto);
	}
}

function enviaFormularioPago(objeto){
	var fd = new FormData(document.getElementById(objeto.tabla));
	fd.append("id", objeto.id);
	fd.append("sesId", verSesion());
	
	confirm("¡Se cerrará la venta!",function(){
		return false;
	},async function(){
		bloquea();
		let body=fd;
		try {
			let edita = await axios.put("/api/venta/editar/"+objeto.id,body,{ 
				headers:{
					authorization: `Bearer ${verToken()}`
				} 
			});

			desbloquea();
			$("#general1").modal("hide");
			resp=edita.data.valor;
			if(resp.resultado){
				vistaVenta();
				//success("Modificado","¡Se ha modificado el registro: "+dato+"!");
			}else{
				mensajeSistema(resp.mensaje);
			}	
		}catch (err) {
			desbloquea();
			message=(err.response)?err.response.data.error:err;
			mensajeError(message);
		}
    });
}

//MUESTRA NUMERO DE DOCUMENTO
async function muestraDocumentoVenta(objeto){
	bloquea();
	try{
		const buscar =  await axios.get("/api/venta/muestra/documento/"+objeto.idDocumento+"/"+verSesion(),{ 
            headers:{
				authorization: `Bearer ${verToken()}`
			} 
        });
		const resp=buscar.data.valor;
		desbloquea();
		$('#'+objeto.tabla+' div input[name=serie]').val(resp.info.SERIE);
		$('#'+objeto.tabla+' div input[name=numero]').val(resp.info.NRO_DOCUMENTO);
	}catch (err) {
		desbloquea();
		message=(err.response)?err.response.data.error:err;
		mensajeError(message);
	}
}

//VENTA
async function crearVenta(objeto){
	bloquea();
	let body={
		idVenta:objeto.idVenta,
		sesId:verSesion()
	}
	try {
		crea = await axios.post("/api/"+objeto.tabla+"/crear",body,{ 
			headers:{
				authorization: `Bearer ${verToken()}`
			} 
		});
		const resp=crea.data.valor;
		desbloquea();
		if(resp.resultado){
			vistaVenta();
		}else{
			mensajeSistema(resp.mensaje);
		}
	}catch (err) {
		desbloquea();
		message=(err.response)?err.response.data.error:err;
		mensajeError(message);
	}
}

async function agregaVenta(objeto){
	bloquea();
	try{
		let body={
			idProductoSucursal: objeto.idProductoSucursal,
			codigo: objeto.codigo,
			nombre: objeto.nombre,
			precioVenta: objeto.precioVenta,
			cantidad: objeto.cantidad,
			tabla: objeto.tabla,
			idVenta: objeto.idVenta,
			idLote:objeto.idLote,
			sesId: verSesion()
		}
		crea = await axios.post("/api/"+objeto.tabla+"/detalle/crear",body,{ 
			headers:{
				authorization: `Bearer ${verToken()}`
			} 
		});
		desbloquea();
		resp=crea.data.valor;

		let t = $('#'+objeto.tabla+'Tabla').DataTable();
		let rowNode =t.row.add( [
			`<div class="estadoTachado codigo">${resp.info.CODIGO}</div>`,
			`<div class="estadoTachado nombre muestraMensaje">${resp.info.PRODUCTO}</div>`,
			`<div class="estadoTachado precio">${parseFloat(resp.info.PRECIO_VENTA).toFixed(2)}</div>`,
			`<div class="estadoTachado cantidad">${resp.info.CANTIDAD}</div>`,
			`<div class="estadoTachado total">${parseFloat(resp.info.MONTO_TOTAL).toFixed(2)}</div>`,
			modifica()+elimina()
		] ).draw( false ).node();
		$( rowNode ).attr('id',resp.info.ID_DETALLE);
		$("#"+objeto.tabla+"Info .totalVenta").text(parseFloat(resp.info.TOTAL).toFixed(2));
	}catch (err) {
		desbloquea();
		message=(err.response)?err.response.data.error:err;
		mensajeError(message);
	}
}

async function ventaEdita(objeto){
	bloquea();
	try {
		const producto= await axios.get("/api/venta/detalle/buscar/"+objeto.id+"/"+verSesion(),{ 
			headers:{
				authorization: `Bearer ${verToken()}`
			} 
		});
		desbloquea();
		const resp=producto.data.valor.info;
		let listado=`
		<form id="${objeto.tabla}">
			<div class="row">
				<div class="form-group col-md-6">
					<label>P. Venta (*)</label>
					<input name="precioVenta" autocomplete="off" maxlength="10" type="tel" class="form-control p-1 focus" placeholder="Ingrese el precio venta" value="${parseFloat(resp.PRECIO_VENTA).toFixed(2)}">
					<div class="vacio oculto">¡Campo obligatorio!</div>
				</div>
				<div class="form-group col-md-6">
					<label>Cantidad (*)</label>
					<input name="cantidad" autocomplete="off" maxlength="10" type="tel" class="form-control p-1 focus" placeholder="Ingrese cantidad" value="${resp.CANTIDAD}">
					<div class="vacio oculto">¡Campo obligatorio!</div>
				</div>
			</div>
			<div class="row">
				<div class="form-group col-md-12">
					<label>Comentario</label>
					<textarea  rows="3" autocomplete="off" class="form-control p-1" maxlength="500" name="comentario" placeholder="Ingrese el comentario">${(resp.OBSERVACION===null)?'':resp.OBSERVACION}</textarea>
				</div>
			</div>
			<div class="form-section p-0"></div>
			<div class="col-md-12 pl-0 pr-0 text-center">
				${cancela()+edita()}
			</div>
			<div class="h8 text-center pt-2">(*) Los campos con asteriso son obligatorios.</div>
		</form>`;
		mostrar_general1({titulo:'DETALLE DE PRODUCTO',nombre:objeto.nombreEdit,msg:listado,ancho:600});
		focusInput();
		procesaDetalleVenta(objeto);
	}catch (err) {
		desbloquea();
		message=(err.response)?err.response.data.error:err;
		mensajeError(message);
	}
}

function procesaDetalleVenta(objeto){
	let precioVenta=$('#'+objeto.tabla+' input[name=precioVenta]');
	let cantidad=$('#'+objeto.tabla+' input[name=cantidad]');
	let comentario=$('#'+objeto.tabla+' input[name=comentario]');

	let elementos={
		precioVenta:precioVenta,
		cantidad:cantidad,
		comentario:comentario,
		tabla:objeto.tabla,
		id:objeto.id,
		nombreMsg:objeto.nombreEdit
	}

	eventoDetalleVenta(elementos);
}

function eventoDetalleVenta(objeto){
	$('#'+objeto.tabla+' div').off( 'keyup');
    $('#'+objeto.tabla+' div').on( 'keyup','input[type=tel]',function(){
		let name=$(this).attr('name');
		let elemento=$("#"+objeto.tabla+" input[name="+name+"]");
		if(name=='precioVenta'){
			decimalRegex(elemento);
			validaVacio(elemento);
		}else if(name=='cantidad'){
			numeroRegex(elemento);
			validaVacio(elemento);
		}
	});

    $('#'+objeto.tabla+' div').on( 'keyup','textarea',function(){
		let name=$(this).attr('name');
		let elemento=$("#"+objeto.tabla+" textarea[name="+name+"]");
		if(name=='comentario'){
			comentarioRegex(elemento);
		}
	});

	$('#'+objeto.tabla+' div').on( 'click','button[name=btnGuarda]',function(){//guarda
		validaFormularioDetalleVenta(objeto)
	});
}

function validaFormularioDetalleVenta(objeto){	
	validaVacio(objeto.precioVenta);
	validaVacio(objeto.cantidad);

	if(objeto.precioVenta.val()=="" || objeto.cantidad.val()==""){
		return false;
	}else{
		enviaFormularioDetalleVenta(objeto);
	}
}

function enviaFormularioDetalleVenta(objeto){
	var fd = new FormData(document.getElementById(objeto.tabla));
	fd.append("id", objeto.id);
	fd.append("sesId", verSesion());
	
	confirm("¡Se modificará el producto: "+objeto.nombreMsg+"!",function(){
		return false;
	},async function(){
		bloquea();
		let body=fd;
		try {
			let edita = await axios.put("/api/"+objeto.tabla+"/detalle/editar/"+objeto.id,body,{ 
				headers:{
					authorization: `Bearer ${verToken()}`
				} 
			});

			desbloquea();
			$("#general1").modal("hide");
			resp=edita.data.valor;
			if(resp.resultado){
				$("#"+objeto.tabla+"Tabla #"+objeto.id+" .precio").text(parseFloat(resp.info.PRECIO_VENTA).toFixed(2));
				$("#"+objeto.tabla+"Tabla #"+objeto.id+" .cantidad").text(resp.info.CANTIDAD);
				$("#"+objeto.tabla+"Tabla #"+objeto.id+" .total").text(parseFloat(resp.info.MONTO_TOTAL).toFixed(2));
				$("#"+objeto.tabla+"Info .totalVenta").text(parseFloat(resp.info.TOTAL).toFixed(2));
					
					//success("Modificado","¡Se ha modificado el registro: "+dato+"!");
			}else{
				mensajeSistema(resp.mensaje);
			}	
		}catch (err) {
			desbloquea();
			message=(err.response)?err.response.data.error:err;
			mensajeError(message);
		}
    });
}

function ventaEliminaDetalle(objeto){
	confirm("¡Eliminará el registro: "+objeto.nombre+"!",function(){
		return false;
	},async function(){
        bloquea();
		try {
			const eliminar = await axios.delete("/api/"+objeto.tabla+"/detalle/eliminar/"+objeto.id,{ 
				headers:{authorization: `Bearer ${verToken()}`} 
			});
			
			desbloquea();
			resp=eliminar.data.valor;
			if(resp.resultado){
				let  elimina=$('#'+objeto.tabla+'Tabla').DataTable();
				$('#'+objeto.tabla+'Tabla #'+objeto.id).closest('tr');
				elimina.row($('#'+objeto.tabla+'Tabla #'+objeto.id)).remove().draw(false);
				let total=(resp.info.TOTAL===null)?0:resp.info.TOTAL;
				$("#"+objeto.tabla+"Info .totalVenta").text(parseFloat(total).toFixed(2));
				$('#autocompletaProd').val(''); 
				//success("Eliminado","¡Se ha eliminado el registro: "+objeto.nombre+"¡");
			}else{
				mensajeSistema(resp.mensaje);
			}
		}catch (err) {
			desbloquea();
			message=(err.response)?err.response.data.error:err;
			mensajeError(message);
		}
	});
}

function ventaElimina(objeto){
	confirm("¡Eliminará toda la venta!",function(){
		return false;
	},async function(){
        bloquea();
		try {
			const eliminar = await axios.delete("/api/"+objeto.tabla+"/eliminar/"+objeto.id,{ 
				headers:{authorization: `Bearer ${verToken()}`} 
			});
			
			desbloquea();
			resp=eliminar.data.valor;
			if(resp.resultado){
				vistaVenta();
			}else{
				mensajeSistema(resp.mensaje);
			}
		}catch (err) {
			desbloquea();
			message=(err.response)?err.response.data.error:err;
			mensajeError(message);
		}
	});
}

async function ventaDetalle(objeto){
	bloquea();
	try {
		lista= await axios.get('/api/'+objeto.tabla+'/detalle/listar/'+objeto.id+'/'+verSesion(),{
			headers: 
			{ 
				authorization: `Bearer ${verToken()}`
			} 
		});
		lista2= await axios.get('/api/'+objeto.tabla+'/buscar/totales/'+objeto.id+'/'+verSesion(),{
			headers: 
			{ 
				authorization: `Bearer ${verToken()}`
			} 
		});
		resp=lista.data.valor.info;
		resp2=lista2.data.valor.info;
		desbloquea();
		let listado=`
			<div class="row">
				<div class="col-12">
					<div class="card-content collapse show">
						<div class="card-body card-dashboard">
							<div class="table-responsive">
								<table id='detalleTablaVenta' class="pt-3 table table-striped text-center">
									<thead>
										<tr>
											<th>Código</th>
											<th>Producto</th>
											<th>P. Venta</th>
											<th>Cantidad</th>
											<th>Total</th>
										</tr>
									</thead>
									<tbody>`;
										for(var i=0;i<resp.length;i++){
								listado+=`<tr id="${ resp[i].ID_DETALLE }">
											<td>
												<div class="codigo">${ (resp[i].CODIGO_PRODUCTO===null)?'':resp[i].CODIGO_PRODUCTO}</div>
											</td>
											<td>
												<div class="nombre muestraMensaje">${ resp[i].NOMBRE }</div>
											</td>
											<td>
												<div class="precio">${ parseFloat(resp[i].PRECIO_VENTA).toFixed(2) }</div>
											</td>
											<td>
												<div class="cantidad">${ parseFloat(resp[i].CANTIDAD).toFixed(2) }</div>
											</td>
											<td>
												<div class="total">${ parseFloat(resp[i].MONTO_TOTAL).toFixed(2) }</div>
											</td>
										</tr>`;
										}
						listado+=`
										<tr>
											<td colspan='3'></td>
											<td><strong>SUBTOTAL</strong></td>
											<td>
												<div class="subtotal">${parseFloat(resp2.SUBTOTAL).toFixed(2)}</div>
											</td>
										</tr>
										<tr>
											<td colspan='3'></td>
											<td><strong>DESCUENTO</strong></td>
											<td>
												<div class="descuento">${parseFloat(resp2.DESCUENTO).toFixed(2)}</div>
											</td>
										</tr>
										<tr>
											<td colspan='3'></td>
											<td><strong>IGV ${resp2.IGV*100+'%'}</strong></td>
											<td>
												<div class="igv">${parseFloat(resp2.IMPUESTO).toFixed(2)}</div>
											</td>
										</tr>
										<tr>
											<td colspan='3'></td>
											<td><strong>TOTAL</strong></td>
											<td>
												<div class="total">${parseFloat(resp2.TOTAL).toFixed(2)}</div>
											</td>
										</tr>
									</tbody>
								</table>
							</div>
						</div>
					</div>
				</div>
			</div>`;
		mostrar_general1({titulo:'DETALLE DE VENTA',nombre:objeto.nombreEdit,msg:listado,ancho:600});
	}catch (err) {
		desbloquea();
		message=(err.response)?err.response.data.error:err;
		mensajeError(message);
	}
}

