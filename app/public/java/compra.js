//FUNCIONES
$(document).ready(function() {
	try {
		vistaCompra();
	}catch (err) {
		desbloquea();
		message=(err.response)?err.response.data.error:err;
		mensajeError(message);
	}
});

async function vistaCompra(){
	bloquea();
	let tabla="compra";
	let idCompra;
	let totalCompra=0;
	let lista;
	let compras;
	let proveedor;
	let resp;
	let resp2;
	const busca =  await axios.get('/api/'+tabla+'/buscar/0/'+verSesion(),{ 
		headers:{authorization: `Bearer ${verToken()}`} 
	});

	if(busca.data.valor.info!==undefined){
		idCompra=busca.data.valor.info.ID_COMPRA;
		totalCompra=(busca.data.valor.info.TOTAL===null)?0:busca.data.valor.info.TOTAL;

		lista= await axios.get('/api/'+tabla+'/detalle/listar/'+idCompra+'/'+verSesion(),{
			headers: 
			{ 
				authorization: `Bearer ${verToken()}`
			} 
		});

		proveedor =  await axios.get("/api/proveedor/listar/0/"+verSesion(),{ 
			headers:{
				authorization: `Bearer ${verToken()}`
			} 
		});


		resp=lista.data.valor.info;
		resp2=proveedor.data.valor.info;
		
	}else{
		idCompra=0;
		compras= await axios.get('/api/'+tabla+'/inicio/listar/'+verSesion()+"/reporteComprasPorFecha",{
			headers: 
			{ 
				authorization: `Bearer ${verToken()}`
			} 
		});
		resp2=compras.data.valor.info;
	}
	desbloquea();


	let listado=`
	<div class="row row-sm mg-t-10">
		<div class="col-lg-12">
			<div class="card card-primary">
				<div class="card-body">
					<form id="${tabla}" class="needs-validation" novalidate>
						<span class='oculto muestraId'>${ idCompra}</span>
						<span class='oculto muestraNombre'></span>
						<div class="card-header tx-medium bd-0 tx-white bg-primary-gradient"><i class="las la-coins"></i> COMPRA</div>
							<form class="row pt-3">`;
								if(idCompra==0){
						listado+=`<div class="col-md-12 pt-1">
									<button type='Registrar' name='btnRegistrar' class="w-100 btn mb-1 btn-primary btn-lg registrar"><i class="las la-dolly"></i> NUEVA COMPRA</button>
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
																<th>Fecha compra</th>
																<th>Sub total</th>
																<th>Impuesto</th>
																<th>Total</th>
																<th>Usuario</th>
																<th class="nosort nosearch">Acciones</th>
															</tr>
														</thead>
														<tbody>`;
															for(var i=0;i<resp2.length;i++){
												listado+=`<tr id="${ resp2[i].ID_COMPRA }">
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
																	<div class="fechaCompra">${ moment(resp2[i].FECHA_COMPRA).format('DD/MM/YYYY') }</div>
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
											<h4>TOTAL: S/. <span class="totalCompra">${parseFloat(totalCompra).toFixed(2)}</span></h4>
											<span>${borrar()+compra()}</span>
										</div>
										
										<div class="row">
											<div class="form-group col-md-6">
												<label>Proveedor</label>
												<select name="proveedor" class="form-control select2">
													<option value="">Select...</option>`;
													for(var i=0;i<resp2.length;i++){
														if(resp2[i].ES_VIGENTE==1){
													listado+=`<option value="${resp2[i].ID_PROVEEDOR}">${resp2[i].RAZON_PROVEEDOR+" - "+resp2[i].RUC}</option>`;
														}
													}
										listado+=`</select>
								<div class="vacio oculto">¡Campo obligatorio!</div>
											</div>
											<div class="form-group col-md-6">
												<label>Producto</label>
												<input id="autocompletaProd" disabled name="autocompletaProd" autocomplete="off" maxlength="10" type="tel" class="form-control p-1" placeholder="Busque el producto">
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
															<th>P. Compra</th>
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
																<div class="precioCompra">${ parseFloat(resp[i].PRECIO_COMPRA).toFixed(2) }</div>
															</td>
															<td>
																<div class="precioVenta">${ parseFloat(resp[i].PRECIO_VENTA).toFixed(2) }</div>
															</td>
															<td>
																<div class="cantidad">${ resp[i].CANTIDAD }</div>
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
	if(idCompra>0){
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

		//$("#"+tabla+" span#botonGuardar").text('Crear');
		let objeto={
			tabla:tabla,
			idCompra:$('#'+tabla+' span.muestraId').text()
		}
		eventosCompra(objeto);
	}else{
		$('#'+tabla).off( 'click');
		$('#'+tabla).on( 'click', 'button[name=btnRegistrar]', function () {
			let idCompra=$('#'+tabla).find('span.muestraId').text();
			crearCompra({idCompra:idCompra,tabla:tabla,accion:'crea'});
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
			compraDetalle(objeto);
		});
	}
}


function eventosCompra(objeto){
	$('#autocompletaProd').autocomplete({
		source: async function(request, response){
			let idProveedor=$('#'+objeto.tabla+' select[name=proveedor]').val();
			$.ajax({
				url:"/autocompleta/producto",
				type: "POST",
				dataType: "json",
				data:{
					producto:request.term,
					idProveedor:idProveedor,
					tipo:'autocompletaCompra',
					sesId:verSesion(),
					token:verToken()
				},
				success: function(data){
					let datos=data.valor.info;
					response( $.map( datos, function( item ){
						return objeto={
							idCompra:objeto.idCompra,
							idProductoSucursal:	item.ID_PRODUCTO_SUCURSAL,
							codigo:	item.CODIGO_PRODUCTO,
							nombre:	item.NOMBRE,
							precioVenta: item.PRECIO_VENTA,
							precioCompra: item.PRECIO_COMPRA,
							cantidad:1,
							tabla:objeto.tabla,
							label: item.NOMBRE+" ("+item.STOCK+")",
							value: item.NOMBRE+" ("+item.STOCK+")"
						}
					}));
				},
			});
		},
		minLength:3,
		select:function(event,ui){
			agregaCompra(ui.item);
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
		if(name=='fechaCompra'){
			validaVacio(elemento);
		}
	});

    $('#'+objeto.tabla+' div').on( 'change','select',function(){
		let name=$(this).attr('name');
		let elemento=$("#"+objeto.tabla+" select[name="+name+"]");
		validaVacioSelect(elemento);
		if(name=='proveedor'){
			$('#autocompletaProd').val('').attr('disabled',false);
			$('#idProductoSucursal').val('');
		}
	});

	$('#'+objeto.tabla+'Info').off( 'click');
	$('#'+objeto.tabla+'Info').on( 'click','button[name=btnCompra]',function(){//compra
		objeto.id= $("#"+objeto.tabla+" span.muestraId").text();
		objeto.total= $("#"+objeto.tabla+"Info .totalCompra").text();
		if(objeto.total>0){
			procesaFormularioPago(objeto);
		}else{
			mensajeSistema('¡No hay productos para cerrar la compra!')
		}
	});

	$('#'+objeto.tabla+'Info').on( 'click','button[name=btnBorrar]',function(){//borra compra
		objeto.id= $("#"+objeto.tabla+" span.muestraId").text();
		compraElimina(objeto);
	});

	$('#'+objeto.tabla+'Tabla tbody').off( 'click');
	$('#'+objeto.tabla+'Tabla tbody').on( 'click','td a.edita',function(){//edita
		let evento=$(this).parents("tr")
    	let id=evento.attr('id');
		let nombre=evento.find("td div.nombre").text();
		objeto.id=id;
		objeto.nombreEdit=nombre;
		compraEdita(objeto);
	});

	$('#'+objeto.tabla+'Tabla tbody').on( 'click','td a.elimina',function(){//elimina
		let evento=$(this).parents("tr")
    	let id=evento.attr('id');
		let nombre=evento.find("td div.nombre ").text();
		compraEliminaDetalle({id:id,nombre:nombre,tabla:objeto.tabla});
	});

}


//PAGOS
async function procesaFormularioPago(objeto){
	bloquea();
	try {
		const busca =  await axios.get('/api/compra/buscar/0/'+verSesion(),{ 
			headers:{authorization: `Bearer ${verToken()}`} 
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
		const resp3=tipoPago.data.valor.info;
		const resp4=comprobante.data.valor.info;
		let listado=`
		<form id="pago">
			<h4>TOTAL: S/. <span class="totalCompra">${parseFloat(resp.TOTAL).toFixed(2)}</span></h4>
			<div class="row">
				<div class="form-group col-md-12">
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
					<input name="serie" maxlength="10" autocomplete="off" type="text" class="form-control" placeholder="Ingrese la serie">
					<div class="vacio oculto">¡Campo obligatorio!</div>
				</div>
				<div class="form-group col-md-3">
					<label>Número (*)</label>
					<input name="numero" maxlength="10" autocomplete="off" type="text" class="form-control" placeholder="Ingrese el numero">
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
			tipoPago:$('#pago select[name=tipoPago]'),
			comprobante:$('#pago select[name=comprobante]'),
			serie:$('#pago input[name=serie]'),
			numero:$('#pago input[name=numero]'),
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
			validaVacioSelect(elemento);
		}
		
	});

	$('#'+objeto.tabla+' div').off( 'keyup');
    $('#'+objeto.tabla+' div').on( 'keyup','input[type=text]',function(){
		let name=$(this).attr('name');
		let elemento=$("#"+objeto.tabla+" input[name="+name+"]");
		if(name=='comentario'){
			comentarioRegex(elemento);
		}else if(name=='serie' || name=='numero'){
			validaVacio(elemento);
		}
	});


	$('#'+objeto.tabla).off( 'click');
	$('#'+objeto.tabla).on( 'click','button[name=btnGuarda]',function(){//pago
		validaFormularioPago(objeto);
	});
}

function validaFormularioPago(objeto){	
	validaVacioSelect(objeto.tipoPago);
	validaVacioSelect(objeto.comprobante);
	validaVacio(objeto.serie);
	validaVacio(objeto.numero);

	if(objeto.tipoPago.val()=="" || objeto.comprobante.val()=="" || objeto.serie.val()=="" || objeto.numero.val()==""){
		return false;
	}else{
		enviaFormularioPago(objeto);
	}
}

function enviaFormularioPago(objeto){
	var fd = new FormData(document.getElementById(objeto.tabla));
	fd.append("id", objeto.id);
	fd.append("sesId", verSesion());
	
	confirm("¡Se cerrará la compra!",function(){
		return false;
	},async function(){
		bloquea();
		let body=fd;
		try {
			let edita = await axios.put("/api/compra/editar/"+objeto.id,body,{ 
				headers:{
					authorization: `Bearer ${verToken()}`
				} 
			});

			desbloquea();
			$("#general1").modal("hide");
			resp=edita.data.valor;
			if(resp.resultado){
				vistaCompra();
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

//COMPRA
async function crearCompra(objeto){
	bloquea();
	let body={
		idCompra:objeto.idCompra,
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
			vistaCompra();
		}else{
			mensajeSistema(resp.mensaje);
		}
	}catch (err) {
		desbloquea();
		message=(err.response)?err.response.data.error:err;
		mensajeError(message);
	}
}

async function agregaCompra(objeto){
	bloquea();
	try{
		let body={
			idProductoSucursal: objeto.idProductoSucursal,
			codigo: objeto.codigo,
			nombre: objeto.nombre,
			precioVenta: objeto.precioVenta,
			precioCompra: objeto.precioCompra,
			cantidad: objeto.cantidad,
			tabla: objeto.tabla,
			idCompra: objeto.idCompra,
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
			`<div class="estadoTachado precioCompra">${parseFloat(resp.info.PRECIO_COMPRA).toFixed(2)}</div>`,
			`<div class="estadoTachado precioVenta">${parseFloat(resp.info.PRECIO_VENTA).toFixed(2)}</div>`,
			`<div class="estadoTachado cantidad">${resp.info.CANTIDAD}</div>`,
			`<div class="estadoTachado total">${parseFloat(resp.info.MONTO_TOTAL).toFixed(2)}</div>`,
			modifica()+elimina()
		] ).draw( false ).node();
		$( rowNode ).attr('id',resp.info.ID_DETALLE);
		$("#"+objeto.tabla+"Info .totalCompra").text(parseFloat(resp.info.TOTAL).toFixed(2));
	}catch (err) {
		desbloquea();
		message=(err.response)?err.response.data.error:err;
		mensajeError(message);
	}
}

async function compraEdita(objeto){
	bloquea();
	try {
		const producto= await axios.get("/api/compra/detalle/buscar/"+objeto.id+"/"+verSesion(),{ 
			headers:{
				authorization: `Bearer ${verToken()}`
			} 
		});
		desbloquea();
		const resp=producto.data.valor.info;
		let listado=`
		<form id="${objeto.tabla}">
			<div class="row">
				<div class="form-group col-md-4">
					<label>P. Compra (*)</label>
					<input name="precioCompra" autocomplete="off" maxlength="10" type="tel" class="form-control p-1 focus" placeholder="Ingrese el precio compra" value="${parseFloat(resp.PRECIO_COMPRA).toFixed(2)}">
					<div class="vacio oculto">¡Campo obligatorio!</div>
				</div>
				<div class="form-group col-md-4">
					<label>P. Venta (*)</label>
					<input name="precioVenta" autocomplete="off" maxlength="10" type="tel" class="form-control p-1 focus" placeholder="Ingrese el precio venta" value="${parseFloat(resp.PRECIO_VENTA).toFixed(2)}">
					<div class="vacio oculto">¡Campo obligatorio!</div>
				</div>
				<div class="form-group col-md-4">
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
		procesaDetalleCompra(objeto);
	}catch (err) {
		desbloquea();
		message=(err.response)?err.response.data.error:err;
		mensajeError(message);
	}
}

function procesaDetalleCompra(objeto){
	let precioCompra=$('#'+objeto.tabla+' input[name=precioCompra]');
	let precioVenta=$('#'+objeto.tabla+' input[name=precioVenta]');
	let cantidad=$('#'+objeto.tabla+' input[name=cantidad]');
	let comentario=$('#'+objeto.tabla+' input[name=comentario]');

	let elementos={
		precioCompra:precioCompra,
		precioVenta:precioVenta,
		cantidad:cantidad,
		comentario:comentario,
		tabla:objeto.tabla,
		id:objeto.id,
		nombreMsg:objeto.nombreEdit
	}

	eventoDetalleCompra(elementos);
}

function eventoDetalleCompra(objeto){
	$('#'+objeto.tabla+' div').off( 'keyup');
    $('#'+objeto.tabla+' div').on( 'keyup','input[type=tel]',function(){
		let name=$(this).attr('name');
		let elemento=$("#"+objeto.tabla+" input[name="+name+"]");
		if(name=='precioCompra' || name=='precioVenta'){
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
		validaFormularioDetalleCompra(objeto)
	});
}

function validaFormularioDetalleCompra(objeto){	
	validaVacio(objeto.precioCompra);
	validaVacio(objeto.precioVenta);
	validaVacio(objeto.cantidad);

	if(objeto.precioCompra.val()=="" || objeto.precioVenta.val()=="" || objeto.cantidad.val()==""){
		return false;
	}else{
		enviaFormularioDetalleCompra(objeto);
	}
}

function enviaFormularioDetalleCompra(objeto){
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
				$("#"+objeto.tabla+"Tabla #"+objeto.id+" .precioCompra").text(parseFloat(resp.info.PRECIO_COMPRA).toFixed(2));
				$("#"+objeto.tabla+"Tabla #"+objeto.id+" .precioVenta").text(parseFloat(resp.info.PRECIO_VENTA).toFixed(2));
				$("#"+objeto.tabla+"Tabla #"+objeto.id+" .cantidad").text(resp.info.CANTIDAD);
				$("#"+objeto.tabla+"Tabla #"+objeto.id+" .total").text(parseFloat(resp.info.MONTO_TOTAL).toFixed(2));
				$("#"+objeto.tabla+"Info .totalCompra").text(parseFloat(resp.info.TOTAL).toFixed(2));
					
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

function compraEliminaDetalle(objeto){
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
				$("#"+objeto.tabla+"Info .totalCompra").text(parseFloat(total).toFixed(2));
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

function compraElimina(objeto){
	confirm("¡Eliminará toda la compra!",function(){
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
				vistaCompra();
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

async function compraDetalle(objeto){
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
								<table id='detalleTablaCompra' class="pt-3 table table-striped text-center">
									<thead>
										<tr>
											<th>Código</th>
											<th>Producto</th>
											<th>P. Compra</th>
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
												<div class="precio">${ parseFloat(resp[i].PRECIO_COMPRA).toFixed(2) }</div>
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
		mostrar_general1({titulo:'DETALLE DE COMPRA',nombre:objeto.nombreEdit,msg:listado,ancho:600});
	}catch (err) {
		desbloquea();
		message=(err.response)?err.response.data.error:err;
		mensajeError(message);
	}
}

