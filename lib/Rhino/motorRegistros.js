/*----------------------------------------------------------------------------------------------------*/
/*------------------------------Objeto Sesion----------------------------------------------------------*/
/*----------------------------------------------------------------------------------------------------*/
var Sesion = function(){

	this.estado = 'cerrada';
	this.nombre = '';
	this.privilegios = [];
	this.arbol = null;
	this.llavesAcceso = [];
	this.privilegioActivo = null;

	this.obtenerSesion = function(){
		conexionAcc=crearXMLHttpRequest();
		var sesionActiva=this;
		conexionAcc.onreadystatechange = function(){
			if (conexionAcc.readyState == 4 && conexionAcc.status == 200){
				var respuesta=JSON.parse(conexionAcc.responseText);
				if(respuesta.success===1){
					sesionActiva.estado='activa';
					sesionActiva.nombre=respuesta.sesion.Nombre;
					sesionActiva.empresa=respuesta.sesion.Empresa.codigo;
					sesionActiva.nombre_empresa=respuesta.sesion.Empresa.nombre;
					sesionActiva.armarPrivilegios(respuesta.sesion.privilegios[0]);
					sesionActiva.verificarPermisos();
					if(UI){
						if(UI.elementos.cabecera){
							UI.elementos.cabecera.cambiarTexto(respuesta.sesion.Empresa.nombre);
						}
					}
				}else{
					location.href='../../index.html';
				}
		  }
		};
		conexionAcc.open('POST','../../seguridad/controladores/cor_validar.php', true);
		conexionAcc.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
		var envio="Operacion="+encodeURIComponent("obtenerSesion");
		conexionAcc.send(envio);
	};
	this.cerrarSesion = function(){
		conexionAcc=crearXMLHttpRequest();
		conexionAcc.onreadystatechange = function(){
			if (conexionAcc.readyState == 4 && conexionAcc.status == 200){
				var respuesta=JSON.parse(conexionAcc.responseText);
				if(respuesta.success==1){
					location.href='../../index.html';
				}
		  }
		};
		conexionAcc.open('POST','../../seguridad/controladores/cor_validar.php', true);
		conexionAcc.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
		var envio="Operacion="+encodeURIComponent("cerrarSesion");
		conexionAcc.send(envio);
	};
	this.mostrarSesion = function(){
		console.log('Sesion Activa:');
		console.log('Nombre de Usuario: '+this.nombre);
		console.log('Empresa Actual Codigo: '+this.empresa);
		console.log('Empresa Actual: '+this.nombre_empresa);
		console.log('Estado de la Sesion: '+this.estado);
	};
	this.obtenerLlaves = function(){
		conexionAcc=crearXMLHttpRequest();
		conexionAcc.onreadystatechange = function(){
			if (conexionAcc.readyState == 4 && conexionAcc.status == 200){
				var respuesta=JSON.parse(conexionAcc.responseText);
				this.llavesAcceso = respuesta.llaves;
				console.log(respuesta);
		  }
		};
		conexionAcc.open('POST','../../seguridad/controladores/cor_validar.php', true);
		conexionAcc.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
		var envio="Operacion="+encodeURIComponent("obtenerLlaves");
		conexionAcc.send(envio);
	};
	this.verificarArranque = function(funcionArranque){
		var ID = setInterval(function(){
			if(sesion.estado==='activa'){
				clearInterval(ID);
				funcionArranque();
			}
		},20);
	};
	/*------------------------------Manejo Privilegios--------------------------*/
	/*-------------------Objeto Privilegio-------*/
	var Privilegio = function(atributos){
		//Atributos
		this.codigo = atributos.codigo;
		this.URL = atributos.URL;
		this.URLSecundario = atributos.URLSecundario;
		this.llave_acceso = atributos.llave_acceso;
		this.padre = atributos.padre;
		this.titulo = atributos.titulo;
		this.operaciones = atributos.operacion;

		this.buscarOperacion = function(nombre){
			nombre = nombre.toUpperCase();
			for (var i = 0; i < this.operaciones.length; i++) {
				if(this.operaciones[i].nombre_operacion === nombre){
					return this.operaciones[i];
				}
			}
		};
	};
	/*-------------------Objeto Privilegio-------*/
	this.armarPrivilegios =function(privilegios){
		//rellenar la variable this.privilegios
		var arbol = {};
		var newPrivilegio;
		for(var x = 0; x < privilegios.length; x++ ){
			if(privilegios[x].codigo===0){
				arbol = privilegios[x];
				privilegios.splice(x,1);
			}
			newPrivilegio = new Privilegio(privilegios[x]);
			this.privilegios.push(newPrivilegio);
		}
		arbol.hijos = this.buscarHijos(arbol.codigo,this.privilegios);
		this.arbol = arbol;
	};
	this.buscarHijos = function(codigoPadre,privilegios){
		var hijos = [];
		for(var x = 0; x < privilegios.length; x++){
			if(privilegios[x].padre==codigoPadre){
				privilegios[x].hijos=this.buscarHijos(privilegios[x].codigo,privilegios);
				hijos.push(privilegios[x]);
			}
		}
		return hijos;
	};
	this.verificarPermisos = function(){
		this.verificarAccesoAComponente();
	};
	this.verificarAccesoAComponente = function(){
		var cont = 0;
		for (var i = 0; i < this.privilegios.length; i++) {
			if(this.privilegios[i].URLSecundario){
				if(UI.elementos.url.obtenerArchivodeURl(this.privilegios[i].URLSecundario) == UI.elementos.url.actual()){
					this.privilegioActivo = this.privilegios[i];
					cont++;
				}
			}
			if(UI.elementos.url.obtenerArchivodeURl(this.privilegios[i].URL) == UI.elementos.url.actual()){
				this.privilegioActivo = this.privilegios[i];
				cont++;
			}
		}
		if(!cont){
			this.cerrarSesion();
		}
	};
	this.buscarPrivilegio = function(titulo){
		for (var i = 0; i < this.privilegios.length; i++) {
			if(this.privilegios[i].titulo.toLowerCase() === titulo.toLowerCase()){
				return this.privilegios[i];
			}
		}
		return false;
	};
};
/*----------------------------------------------------------------------------------------------------*/
/*------------------------------Objeto Motor----------------------------------------------------------*/
/*----------------------------------------------------------------------------------------------------*/
var Motor = function(moduloActivo,entidadActiva){

	this.estado='apagado';

	//modulo activo es decir el modulo que inicio el motor o la que esta en uso en el momento
	this.moduloActivo=moduloActivo;
	//entidad activa es decir la entidad que inicio el motor o la que esta en uso en el momento
	this.entidadActiva=entidadActiva;
	//todos los registros que tiene la entidad activa entidad activa
	this.registrosEntAct = null;

	//funcion de arranque del objeto
	this.ignition = function(){
		if((this.entidadActiva!='acceso')&&(typeof(this.entidadActiva)!=='undefined')){
			this.buscarRegistros(this.moduloActivo,this.entidadActiva,function(respuesta){
				if(respuesta.success===1){
					torque.registrosEntAct=respuesta.registros;
				}else{
					UI.crearMensaje(respuesta.mensaje);
					if(UI.buscarCuadroCarga('iniciarSession')){
						UI.buscarCuadroCarga('iniciarSession').terminarCarga();
					}
				}
			});
		}
	};

	//busqueda en bd
	this.buscarRegistros = function(modulo,entidad,callback){
		var conexionBuscar=crearXMLHttpRequest();
		conexionBuscar.onreadystatechange = function(){
			if (conexionBuscar.readyState == 4){
		        callback(JSON.parse(conexionBuscar.responseText));
		    }
		};
		conexionBuscar.open('POST','../../'+modulo+'/controladores/cor_Motor.php', true);
		conexionBuscar.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
		var envio="operacion="+encodeURIComponent("buscar")+'&entidad='+encodeURIComponent(entidad);
		conexionBuscar.send(envio);
	};

	this.Busqueda = function(info,callback){
		var conexionBusqueda=crearXMLHttpRequest();
		conexionBusqueda.onreadystatechange = function(){
			if (conexionBusqueda.readyState == 4){
		            callback(JSON.parse(conexionBusqueda.responseText));
		    }
		};
		conexionBusqueda.open('POST','../../'+info.modulo+'/controladores/cor_Motor.php', true);
		conexionBusqueda.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
		var envio="operacion="+encodeURIComponent(info.operacion)+'&entidad='+encodeURIComponent(info.entidad);
		envio+="&codigo="+encodeURIComponent(info.codigo);
		conexionBusqueda.send(envio);
	};

	this.Operacion = function(peticion,callback){
		//si no se le paso el valor de la entidad a afectar en la peticion el tomara por defecto a
		//la entidad que se encuentra activa en el momento de la misma
		peticion.modulo = peticion.modulo || moduloActivo;

		//si no se le paso el valor de la entidad a afectar en la peticion el tomara por defecto a
		//la entidad que se encuentra activa en el momento de la misma
		peticion.entidad = peticion.entidad || this.entidadActiva;

		//si no recive el parametro de manejarCarga toma por defecto el valor de falso
		peticion.manejarOperacion = peticion.manejarOperacion || false;
		var conexionMotor=crearXMLHttpRequest();
		conexionMotor.onreadystatechange = function(){
			if (conexionMotor.readyState == 4){
				var respuesta;
				//si el manejar carga es verdadero culmino la carga
				respuesta = safelyParseJSON(conexionMotor.responseText);
				if(peticion.manejarOperacion === true){
					UI.buscarCuadroCarga(peticion.nombreCuadro).terminarCarga();
					if(UI.elementos.modalWindow){
						if(UI.elementos.modalWindow.buscarUltimaCapaContenido()){
							if(respuesta.success){
								callback(respuesta);
							}else{
								if(respuesta.mensaje){
									UI.elementos.modalWindow.buscarUltimaCapaContenido().convertirEnMensaje(respuesta.mensaje);
								}
							}
						}else{
							callback(respuesta);
						}
					}else{
						callback(respuesta);
					}
				}else{
					if(respuesta.success === 1){
		        callback(respuesta);
					}else{
						if(respuesta.mensaje){
							UI.crearMensaje(respuesta.mensaje);
						}
						callback(respuesta);
					}
				}
		  }
		};
		conexionMotor.open('POST','../../'+peticion.modulo+'/controladores/cor_Motor.php', true);
		conexionMotor.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
		var envio='';
		for(var llave in peticion){
			envio+=llave.toLowerCase()+'='+encodeURIComponent(peticion[llave])+'&';
		}
		conexionMotor.send(envio);
	};

	this.manejarOperacion = function(peticion,cuadroCarga,callback){
		//------------Cuadro Carga-------------------------------
			cuadroCarga.contenedor.innerHTML='';
			var cuadroDeCarga = UI.crearCuadroDeCarga(cuadroCarga.cuadro,cuadroCarga.contenedor);
			cuadroDeCarga.style.marginTop = '80px';
		//-----------------------------------------------------------
		//le digo que la peticion fue por manejarOperacion
		peticion.manejarOperacion = true;
		peticion.nombreCuadro = cuadroCarga.cuadro.nombre;
		this.Operacion(peticion,callback);
	};
	this.guardar = function(modulo,entidad,info,callback){
		var conexionMotor=crearXMLHttpRequest();
		conexionMotor.onreadystatechange = function(){
			if (conexionMotor.readyState == 4){
		        var respuesta = JSON.parse(conexionMotor.responseText);
				if(respuesta.success === 1){
	            	callback(respuesta);
				}else{
					if(respuesta.mensaje){
						UI.crearMensaje(respuesta.mensaje);
					}
				}
		  }
		};
		conexionMotor.open('POST','../../'+modulo+'/controladores/cor_Motor.php', true);
		conexionMotor.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
		var envio="operacion="+encodeURIComponent('guardar')+'&entidad='+encodeURIComponent(entidad)+'&';
		for(var x=0;x<info.length;x++){
			envio+=info[x].nombre.toLowerCase()+'='+encodeURIComponent(info[x].valor)+'&';
		}
		conexionMotor.send(envio);
	};
	//----------------------------jsReport request-------------------------------
	this.pedirReportePDF = function(reporte,data,done,error){
		var repData = {
			"template":reporte,
			"data":data
		};
		//var conexionMotor = createCORSRequest('POST','http://'+document.domain+':5488/api/report');
		var conexionMotor = createCORSRequest('POST','http://192.168.88.14:5488/api/report');
		conexionMotor.setRequestHeader("Content-Type","application/json");
		conexionMotor.onreadystatechange = function(){
			if (conexionMotor.readyState == 4){
				if(conexionMotor.status === 500){
					error();
				}else{
					var blob = new Blob([conexionMotor.response],{type: 'application/pdf'});
					done(blob);
				}
		  }
		};
    conexionMotor.responseType = 'blob';
		conexionMotor.send(JSON.stringify(repData));
	};
};

//--------------------------------AJAX---------------------------------------
function crearXMLHttpRequest()
{
  var xmlHttp=null;
  if (window.ActiveXObject)
    xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
  else
    if (window.XMLHttpRequest)
      xmlHttp = new XMLHttpRequest();
  return xmlHttp;
}
function safelyParseJSON (json) {
  // This function cannot be optimised, it's best to
  // keep it small!
  var parsed;

  try {
    parsed = JSON.parse(json);
  } catch (e) {
    parsed = {
			success:0,
			error: e,
			contenido:json
		};
  }

  return parsed; // Could be undefined!
}
//-----------------CORS----------------------------------
function createCORSRequest(method, url) {
  var xhr = new XMLHttpRequest();
  if ("withCredentials" in xhr) {

    // Check if the XMLHttpRequest object has a "withCredentials" property.
    // "withCredentials" only exists on XMLHTTPRequest2 objects.
    xhr.open(method, url, true);

  } else if (typeof XDomainRequest != "undefined") {

    // Otherwise, check if XDomainRequest.
    // XDomainRequest only exists in IE, and is IE's way of making CORS requests.
    xhr = new XDomainRequest();
    xhr.open(method, url);

  } else {

    // Otherwise, CORS is not supported by the browser.
    xhr = null;

  }
  return xhr;
}
