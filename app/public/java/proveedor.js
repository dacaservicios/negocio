//FUNCIONES
$(document).ready(async function() {
	bloquea();
	let tabla="proveedor";
	try {
		const boton= await axios.get('/api/acceso/privilegio/68/'+verSesion(),{
			headers: 
			{ 
				authorization: `Bearer ${verToken()}`
			} 
		});
		const lista= await axios.get('/api/'+tabla+'/listar/0/'+verSesion(),{
            headers: 
            { 
                authorization: `Bearer ${verToken()}`
            } 
        });
		desbloquea();
		const resp=boton.data.valor.botones;
		const resp2=lista.data.valor.info;

		const crea=(resp.includes('Nuevo'))?`
			<button type='Crea' name='btnNuevo' class='btn btn-primary btn-md'>
				<i class='las la-plus-circle'></i>
				<span class='p-1'>Crear Proveedor</span>
			</button>`:'';
		const estado=(resp.includes('Estado'))?`
			<a type='Estado' class="crud estado cursor" data-toggle="tooltip" data-placement="top" title="Estado">
				<i class='las la-check-circle la-2x'></i>
			</a>`:'';
		const modifica=(resp.includes('Modifica'))?`
			<a type='Edita' class="crud edita cursor" data-toggle="tooltip" data-placement="top" title="Editar">
				<i class='las la-edit la-2x'></i>
			</a>`:'';
		const elimina=(resp.includes('Elimina'))?`
			<a type='Elimina' class="crud elimina cursor" data-toggle="tooltip" data-placement="top" title="Eliminar">
				<i class='las la-trash la-2x'></i>
			</a>`:'';
		
		let listado=`
		<div class="row">
			<div class="col-12">
				<div class="card">
					<div class="h4 card-header form-section pl-3 pr-3 pt-2 text-left"><i class="las la-hard-hat"></i> PROVEEDOR</div>
					<div  id="${tabla}Info" class="pb-0 text-right pt-2 pr-3">
						<span class='oculto muestraSubmenu'>68</span>
						<span class='oculto muestraModulo'>${tabla}</span>
						${crea}
					</div>
					<div class="card-content collapse show">
						<div class="card-body card-dashboard">
							<div class="table-responsive">
								<table id="${tabla}Tabla" class="pt-3 table table-striped text-center">
									<thead>
										<tr>
											<th>Razon Social</th>
											<th>Dirección</th>
											<th>Ruc</th>
											<th>Estado</th>
											<th class="nosort nosearch">Acciones</th>
										</tr>
									</thead>
									<tbody>`;
										let mestado;
										let badge;
										for(var i=0;i<resp2.length;i++){
											if(resp2[i].ES_VIGENTE==1){
												mestado='ACTIVO';
												badge="primary"; 
											}else{
												mestado='INACTIVO';
												badge="danger";
											}
										
							listado+=`<tr id="${ resp2[i].ID_PROVEEDOR }">
											<td class="razon muestraMensaje">
												${ resp2[i].RAZON_SOCIAL }
											</td>
											<td class="direccion">
												${ (resp2[i].DIRECCION===null)?'':resp2[i].DIRECCION }
											</td>
											<td class="ruc">
												${ resp2[i].RUC }
											</td>
											<td class="cambiaEstado">
												<span class="estado badge badge-${ badge}">${ mestado}</span> 
											</td>
											<td>
												${estado+modifica+elimina}
											</td>
										</tr>`;
										}
						listado+=`</tbody>
								</table>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>`;
		$("#cuerpoPrincipal").html(listado);
		$('[data-toggle="tooltip"]').tooltip();
		$('#'+tabla+'Tabla').DataTable(valoresTabla);

		$('#'+tabla+'Info').off( 'click');
		$('#'+tabla+'Info').on( 'click', 'button', function () {
			let accion=$(this).attr('type');
			let idSubMenu=$(this).siblings('span.muestraSubmenu').text();
			let nombreSubmenu=$(this).siblings('span.muestraModulo').text();
			modalLinkProveedor({id:0,nombre:0,nombreSubmenu:nombreSubmenu,idSubMenu:idSubMenu,tabla:tabla,accion:accion,orden:0,ancho:600,titulo:'NUEVO PROVEEDOR',resp:resp});
		});
		
		$('#'+tabla+'Tabla tbody').off( 'click');
		$('#'+tabla+'Tabla tbody').on( 'click', rutaElemento, function () {
			let accion=$(this).attr('type');
			let evento=$(this).parents("tr")
			let id=evento.attr('id');
			let nombre=evento.find("td.muestraMensaje").text();
			let nombreSubmenu=$('#'+tabla+'Info span.muestraModulo').text();
			let idSubMenu=$('#'+tabla+'Info span.muestraSubmenu').text();

			if($(this).hasClass('elimina')){
				verificaSesion('O', idSubMenu,3,function( ){//ELIMINA
					eliminaProveedor({id:id,nombre:nombre,nombreSubmenu:nombreSubmenu,orden:id,tabla:tabla,accion:accion,resp:resp});
				});
			}else if($(this).hasClass('edita')){
				verificaSesion('O', idSubMenu,2,function( ){//EDITA
					modalLinkProveedor({id:id,nombre:nombre,nombreSubmenu:nombreSubmenu,idSubMenu:idSubMenu,tabla:tabla,accion:accion,orden:id,ancho:600,titulo:'EDITAR PROVEEDOR',resp:resp});
				});
			}else if($(this).hasClass('estado')){
				verificaSesion('O', idSubMenu,6,function( ){//ESTADO	
					estadoProveedor({id:id,nombre:nombre,nombreSubmenu:nombreSubmenu,tabla:tabla,accion:accion,orden:id,ancho:600,titulo:'ESTADO '+tabla.toUpperCase(),resp:resp});
				});
			}
		});
	}catch (err) {
		desbloquea();
		message=(err.response)?err.response.data.error:err;
		mensajeError(message);
	}
});

async function modalLinkProveedor(objeto){
    bloquea();
	const cancela=(objeto.resp.includes('Cancela'))?`
		<button type='Cancela' name='btnCancela' class='mr-1 btn btn-secondary btn-md cancela'>
			<i class='la la-times'></i>
			<span class='p-1'>Cancelar</span>
		</button>`:'';
	const crea=(objeto.resp.includes('Crea'))?`
		<button type='Crea' name='btnGuarda' class='crud btn btn-primary btn-md crea'>
			<i class='la la-save'></i>
			<span class='p-1'>Guardar</span>
		</button>`:'';
	const edita=(objeto.resp.includes('Edita'))?`
		<button type='Edita' name='btnGuarda' class='crud btn btn-primary btn-md edita'>
			<i class='la la-save'></i>
			<span class='p-1'>Guardar</span>
		</button>`:'';
	try {
		const busca= await axios.get('/api/'+objeto.tabla+'/buscar/'+objeto.id+'/'+verSesion(),{ 
			headers:{
				authorization: `Bearer ${verToken()}`
			}
		});
		const resp=busca.data.valor.info;

		desbloquea();
		let msg=`
		<form id="${objeto.tabla}">
			<div class="row">
				<div class="form-group col-md-12">
					<label>Razón Social (*)</label>
					<input name="razon" autocomplete="off" maxlength="200" type="text" class="form-control p-1 muestraMensaje" placeholder="Ingrese la razón social" value="${(objeto.id==0)?'':resp.RAZON_SOCIAL}">
					<div class="h8 validacion">¡Campo obligatorio!</div>
				</div>
			</div>
			<div class="row">
				<div class="form-group col-md-12">
					<label>Dirección</label>
					<input name="direccion" autocomplete="off" maxlength="250" type="text" class="form-control p-1" placeholder="Ingrese la dirección" value="${(objeto.id==0)?'':(resp.DIRECCION===null)?'':resp.DIRECCION}">
				</div> 
			</div>
			<div class="row">
				<div class="form-group col-md-6">
					<label>Fijo</label>
					<input name="fijo" autocomplete="off" maxlength="7" type="tel" class="form-control p-1" placeholder="Ingrese el fijo" value="${(objeto.id==0)?'':resp.NRO_FIJO}">
				</div> 
				<div class="form-group col-md-6">
					<label>Celular</label>
					<input name="celular" autocomplete="off" maxlength="9" type="tel" class="form-control p-1" placeholder="Ingrese el celular" value="${(objeto.id==0)?'':resp.NRO_CELULAR}">
				</div>
			</div>
			<div class="row">
				<div class="form-group col-md-8">
					<label>Ruc (*)</label>
					<input name="ruc" autocomplete="off" maxlength="11" type="tel" class="form-control p-1" placeholder="Ingrese el ruc" value="${(objeto.id==0)?'':resp.RUC}">
					<div class="h8 validacion">¡Campo obligatorio!</div>
				</div>
				<div class="form-group col-md-4">
					<div><label class="normal font-weight-bold white">.</label></div>
					<div><button type="Busca" name="btnGuarda" class="btn btn-primary btn-md busca">
						<i class='la la-save'></i>
						<span class="p-1">Buscar</span>
					</button></div>
				</div>
			</div>
			<div class="row">
				<div class="form-group col-md-12">
					<label>Email</label>
					<input name="email" autocomplete="off" maxlength="100" type="text" class="form-control p-1" placeholder="Ingrese el email" value="${(objeto.id==0)?'':(resp.EMAIL===null)?'':resp.EMAIL}">
					<div class="h8 validacion">¡Campo obligatorio!</div>
				</div>
			</div>
			<div class="form-section p-0"></div>
			<div class="col-md-12 pl-0 pr-0 text-center">
				${cancela}${(objeto.id==0)?crea:edita}
			</div>
			<div class="h8 text-center pt-2">(*) Los campos con asteriso son obligatorios.</div>
		</form>
		`;
		mostrar_general1({titulo:objeto.titulo,msg:msg,ancho:objeto.ancho});
    	procesaFormularioProveedor(objeto);
	}catch (err) {
		desbloquea();
		message=(err.response)?err.response.data.error:err;
		mensajeError(message);
	}
}

function procesaFormularioProveedor(objeto){
	let razon=$("#"+objeto.tabla+" input[name=razon]");
	let descripcion=$("#"+objeto.tabla+" input[name=descripcion]");
	let fijo=$("#"+objeto.tabla+" input[name=fijo]");
	let celular=$("#"+objeto.tabla+" input[name=celular]");
	let ruc=$("#"+objeto.tabla+" input[name=ruc]");
	let email=$("#"+objeto.tabla+" input[name=email]");
	let session=$("#session");
	let elementos={
		razon:razon,
		descripcion:descripcion,
		fijo:fijo,
		celular:celular,
		ruc:ruc,
		email:email,
		session:session
	}

	numeroRegex(ruc);
	textoNumeroRegex(razon);
	comentarioRegex(descripcion);
	fijoRegex(fijo);
	movilRegex(celular);
	correoRegex(email);

	verificaElementoProveedor({objeto:objeto,elementos:elementos});
}

function verificaElementoProveedor(objeto){
	$('#'+objeto.objeto.tabla).off( 'keyup');
    $('#'+objeto.objeto.tabla).on( 'keyup','input[type=text]',function(){
		let name=$(this).attr("name");
		let tipo='text';
		enviaEventoProveedor({tabla:objeto.objeto.tabla,tipo:tipo,name:name,elementos:objeto.elementos});
	});

    $('#'+objeto.objeto.tabla).on( 'keyup','input[type=tel]',function(){
		let name=$(this).attr("name");
		let tipo='tel';
		enviaEventoProveedor({tabla:objeto.objeto.tabla,tipo:tipo,name:name,elementos:objeto.elementos});
	});

	$('#'+objeto.objeto.tabla).off( 'click');
	$('#'+objeto.objeto.tabla).on( 'click','button.crud',function () {
		let idOpcion=(objeto.objeto.accion=='Crea')?4:5;
		verificaSesion('O', objeto.objeto.idSubMenu,idOpcion,function( ){//CREA  O MODIFICA
			validaFormularioProveedor(objeto);
		});
	});

	$('#'+objeto.objeto.tabla).on( 'click','button.busca',function () {
		let longitud=objeto.elementos.ruc.val().length;
		if(objeto.elementos.ruc.val()==''){
			errores(objeto.elementos.ruc)
			info('¡Debe indicar el ruc!');
		}else{
			if(longitud==11){
				$('#'+objeto.objeto.tabla+' input[name=razon]').val('');
				$('#'+objeto.objeto.tabla+' input[name=direccion]').val('SIN DIRECCIÓN');
				$('#'+objeto.objeto.tabla+' input[name=fijo]').val('');
				$('#'+objeto.objeto.tabla+' input[name=celular]').val('');
				$('#'+objeto.objeto.tabla+' input[name=email]').val('');
				let tipo='ruc';
				buscaRuc({tabla:objeto.objeto.tabla,documento:objeto.elementos.ruc.val(),tipo:tipo});
			}else{
				errores(objeto.elementos.ruc)
				info('¡El documento debe tener 11 digitos (RUC)!');
			}
			
		}
	});
}

async function buscaRuc(objeto){
	bloquea();
	try {
		const rucSunat = await axios.get("api/cliente/documento/"+objeto.tipo+"/"+objeto.documento,{ 
            headers:{
				authorization: `Bearer ${verToken()}`
			} 
        });
		
		desbloquea();
		resp=rucSunat.data.valor;
		if(typeof resp != "undefined"){
			quitaValidacion($('#'+objeto.tabla+' input[name=razon]'));
			
			comentarioRegex($("#"+objeto.tabla+" input[name=razon]"));
			$('#'+objeto.tabla+' input[name=razon]').val(resp.razonSocial);
			if(resp.ubigeo!=null){
				$('#'+objeto.tabla+' input[name=direccion]').val(resp.direccion);
			}
			
		}else{
			mensajeSistema('¡Hubo un error al buscar el documento!');
		}
	}catch (err) {
		desbloquea();
		message=(err.response)?err.response.data.error:err;
		mensajeError(message);
	}
}

function enviaEventoProveedor(objeto){
	if(objeto.tipo=='text'){
		if(objeto.name=='razon'){
			let elementoInput=$("#"+objeto.tabla+" input[name="+objeto.name+"]");
			validaVacio(elementoInput);
		}else if(objeto.name=='email'){
			let elementoInput=$("#"+objeto.tabla+" input[name="+objeto.name+"]");
			validaCorreoNo(elementoInput);
		}
	}else if(objeto.tipo=='tel'){
		let elementoInput=$("#"+objeto.tabla+" input[name="+objeto.name+"]");
		if(objeto.name=='fijo'){
			validaFijo(elementoInput);
		}else if(objeto.name=='celular'){
			validaCelularNo(elementoInput);
		}else if(objeto.name=='ruc'){
			validaRuc(elementoInput);
		}
	}
}

function validaFormularioProveedor(objeto){
	validaVacio(objeto.elementos.razon);
	validaVacio(objeto.elementos.ruc);

	if(objeto.elementos.razon.val()=="" || objeto.elementos.ruc.val()==""){
		mensajeSistema(0);
	}else if(validaFijo(objeto.elementos.fijo)==false){
		mensajeSistema(4);
	}else if(validaCelularNo(objeto.elementos.celular)==false){
		mensajeSistema(5);
	}else if(validaRuc(objeto.elementos.ruc)==false){
		mensajeSistema(6);
	}else{
		enviaFormularioProveedor(objeto);
	}
}


function enviaFormularioProveedor(objeto){
	if(objeto.objeto.vista=='abastecer'){
		dato=muestraMensaje({tabla:objeto.objeto.tabla});
	}else{
		dato=(objeto.objeto.accion=='Crea')?muestraMensaje({tabla:objeto.objeto.tabla}):objeto.objeto.nombre;
	}

	let verbo=(objeto.objeto.id>0)?'Modificará':'Creará';

	var fd = new FormData(document.getElementById(objeto.objeto.tabla));
	fd.append("id", objeto.objeto.id);
	fd.append("sesId", objeto.elementos.session.val());
	
	confirm("¡"+verbo+" el registro: "+dato+"!",function(){
		return false;
	},async function(){
        bloquea();
		let body=fd;
		try {
			let creaEdita;
			if(objeto.objeto.id==0){
				creaEdita = await axios.post("/api/"+objeto.objeto.tabla+"/crear",body,{ 
					headers:{
						authorization: `Bearer ${verToken()}`
					} 
				});
			}else{
				creaEdita = await axios.put("/api/"+objeto.objeto.tabla+"/editar/"+objeto.objeto.id,body,{ 
					headers:{
						authorization: `Bearer ${verToken()}`
					} 
				});
			}
			desbloquea();
			$("#general1").modal("hide");
			resp=creaEdita.data.valor;
			if(resp.resultado){
				if(objeto.objeto.id>0){
					$("#"+objeto.objeto.tabla+"Tabla #"+objeto.objeto.orden+" .razon").text(resp.info.RAZON_SOCIAL);
					$("#"+objeto.objeto.tabla+"Tabla #"+objeto.objeto.orden+" .direccion").text((resp.info.DIRECCION===null)?'':resp.info.DIRECCION);
					$("#"+objeto.objeto.tabla+"Tabla #"+objeto.objeto.orden+" .ruc").text(resp.info.RUC);

					success("Modificado","¡Se ha modificado el registro: "+dato+"!");

					if(objeto.objeto.vista=='abastecer'){
						var data = {
							id: resp.info.ID_PROVEEDOR,
							text: resp.info.RAZON_SOCIAL+' - '+resp.info.RUC
						};
						
						var newOption = new Option(data.text, data.id, true, true);
						if(objeto.objeto.tipo=='pago'){
							$('#'+objeto.objeto.vista+'Paga select[name=proveedor]').append(newOption).trigger('change');
						}else if(objeto.objeto.tipo=='nopago'){
							$('#'+objeto.objeto.vista+' select[name=proveedor]').append(newOption).trigger('change');
						}

					}

				}else{
					let t = $('#'+objeto.objeto.tabla+'Tabla').DataTable();
					let rowNode =t.row.add( [
						resp.info.RAZON_SOCIAL,
						(resp.info.DIRECCION===null)?'':resp.info.DIRECCION,
						resp.info.RUC,
						`<span class="estado badge badge-primary">ACTIVO</span>`,
						`<a type='Estado' class="crud estado cursor" data-toggle="tooltip" data-placement="top" title="Estado">
							<i class='las la-check-circle la-2x'></i>
						</a>
						<a type='Edita' class="crud edita cursor" data-toggle="tooltip" data-placement="top" title="Editar">
							<i class='las la-edit la-2x'></i>
						</a>
						<a type='Elimina' class="crud elimina cursor" data-toggle="tooltip" data-placement="top" title="Eliminar">
							<i class='las la-trash la-2x'></i>
						</a>`
					] ).draw( false ).node();
					$( rowNode ).find('td').eq(0).addClass('razon muestraMensaje');
					$( rowNode ).find('td').eq(1).addClass('direccion');
					$( rowNode ).find('td').eq(2).addClass('ruc');
					$( rowNode ).find('td').eq(3).addClass('cambiaEstado');
					$( rowNode ).attr('id',resp.info.ID_PROVEEDOR);

					success("Creado","¡Se ha creado el registro: "+dato+"!");

					if(objeto.objeto.vista=='abastecer'){
						var data = {
							id: resp.info.ID_PROVEEDOR,
							text: resp.info.RAZON_SOCIAL+' - '+resp.info.RUC
						};
						
						var newOption = new Option(data.text, data.id, true, true);
						if(objeto.objeto.tipo=='pago'){
							$('#'+objeto.objeto.vista+'Paga select[name=proveedor]').append(newOption).trigger('change');
						}else if(objeto.objeto.tipo=='nopago'){
							$('#'+objeto.objeto.vista+' select[name=proveedor]').append(newOption).trigger('change');
						}

					}
				}
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

function eliminaProveedor(objeto){
	confirm("¡Eliminará el registro: "+objeto.nombre+"!",function(){
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
				let  elimina=$('#'+objeto.tabla+'Tabla').DataTable();
				$('#'+objeto.tabla+'Tabla #'+objeto.orden).closest('tr');
				elimina.row($('#'+objeto.tabla+'Tabla #'+objeto.orden)).remove().draw(false); 
				success("Eliminado","¡Se ha eliminado el registro: "+objeto.nombre+"¡");
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

function estadoProveedor(objeto){
	confirm("¡Cambiará el estado del registro: "+objeto.nombre+"!",function(){
		return false;
	},async function(){
		bloquea();
		let body={
		}
		try {
			const estado = await axios.put("/api/"+objeto.tabla+"/estado/"+objeto.id,body,{ 
				headers:{authorization: `Bearer ${verToken()}`} 
			});
			desbloquea();
			resp=estado.data.valor;
			if(resp.resultado){
				let estado=(resp.info.ESTADO==0)?'INACTIVO':'ACTIVO';
				let claseEstado=(resp.info.ESTADO==0)?'badge badge-danger':'badge badge-primary';

				$("#"+objeto.tabla+"Tabla #"+objeto.orden+" .cambiaEstado").children('span').text(estado);
				$("#"+objeto.tabla+"Tabla #"+objeto.orden+" .cambiaEstado").children('span').removeClass();
				$("#"+objeto.tabla+"Tabla #"+objeto.orden+" .cambiaEstado").children('span').addClass(claseEstado);

				success("Estado","¡Se ha cambiado el estado del registro: "+objeto.nombre+"!");
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