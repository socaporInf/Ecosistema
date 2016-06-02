/*----------------------------------------------------------------------------------------------------*/
/*------------------------------Objeto Sesion----------------------------------------------------------*/
/*----------------------------------------------------------------------------------------------------*/
var Sesion = function(){

	this.estado = 'cerrada';
	this.nombre = '';
	this.privilegios = null;
	this.arbol = null;

	this.obtenerSesion = function(){
		conexionAcc=crearXMLHttpRequest();
		var sesionActiva=this;
		conexionAcc.onreadystatechange = function(){
			if (conexionAcc.readyState == 4 && conexionAcc.status == 200){
				var respuesta=JSON.parse(conexionAcc.responseText);
				if(respuesta.success==1){
					sesionActiva.estado='activa';
					sesionActiva.nombre=respuesta.sesion.Nombre;
					sesionActiva.armarPrivilegios(respuesta.sesion.privilegios[0]);
				}else{
					location.href='index.html';
				}
		    }
		};
		conexionAcc.open('POST','../controladores/cor_validar.php', true);
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
					location.href='index.html';
				}
		  }
		};
		conexionAcc.open('POST','../controladores/cor_Validar.php', true);
		conexionAcc.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
		var envio="Operacion="+encodeURIComponent("cerrarSesion");
		conexionAcc.send(envio);
	};
	this.mostrarSesion = function(){
		console.log('Sesion Activa:');
		console.log('Nombre de Usuario: '+this.nombre);
		console.log('Estado de la Sesion: '+this.estado);
	};
	this.armarPrivilegios =function(privilegios){
		//rellenar la variable this.privilegios
		var arbol = {};
		for(var x = 0; x < privilegios.length; x++ ){
			if(privilegios[x].codigo==0){
				arbol = privilegios[x];
				privilegios.splice(x,1);
				this.privilegios = privilegios;
			}
		}
		arbol.hijos = this.buscarHijos(arbol.codigo);
		this.arbol = arbol;
	};
	this.buscarHijos = function(codigoPadre){
		var hijos = [];
		for(var x = 0; x < this.privilegios.length; x++){
			if(this.privilegios[x].padre==codigoPadre){
				this.privilegios[x].hijos=this.buscarHijos(this.privilegios[x].codigo);
				hijos.push(this.privilegios[x]);
			}
		}
		return hijos;
	}
};
/*----------------------------------------------------------------------------------------------------*/
/*------------------------------Objeto Motor----------------------------------------------------------*/
/*----------------------------------------------------------------------------------------------------*/
var Motor = function(entidadActiva){

	this.estado='apagado';
	//entidad activa es decir la entidad que inicio el motor o la que esta en uso en el momento
	this.entidadActiva=entidadActiva;
	//todos los registros que tiene la entidad activa entidad activa
	this.registrosEntAct = null;
	//resultado busqueda
	this.resultadoBusqueda;

	//funcion de arranque del objeto
	this.ignition = function(){
		if((this.entidadActiva!='acceso')&&(typeof(this.entidadActiva)!=='undefined')){
			this.buscarRegistros(this.entidadActiva,function(respuesta){
				if(respuesta.success===1){
					torque.registrosEntAct=respuesta.registros;
				}else{
					UI.crearMensaje(respuesta.tipo,respuesta.mensaje);
					UI.elementos.cuadroCarga.terminarCarga();
				}
			});
		}
	};

	//busqueda en bd
	this.buscarRegistros =function(entidad,callback){
		var conexionBuscar=crearXMLHttpRequest();
		conexionBuscar.onreadystatechange = function(){
			if (conexionBuscar.readyState == 4){
		        callback(JSON.parse(conexionBuscar.responseText));
		    }
		};
		conexionBuscar.open('POST','../controladores/cor_Motor.php', true);
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
		conexionBusqueda.open('POST','../controladores/cor_Motor.php', true);
		conexionBusqueda.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
		var envio="operacion="+encodeURIComponent(info.operacion)+'&entidad='+encodeURIComponent(info.entidad);
		envio+="&codigo="+encodeURIComponent(info.codigo);
		conexionBusqueda.send(envio);
	};
	this.Operacion = function(peticion,callback){

		//si no se le paso el valor de la entidad a afectar en la peticion el tomara por defecto a
		//la entidad que se encuentra activa en el momento de la misma
		peticion.entidad = peticion.entidad || this.entidadActiva;

		//lo mismo sucede con el codigo si no se le pasa en el objeto el tomara por defecto el codigo
		//del registro que esta activo en el formulario
		peticion.codigo = peticion.codigo || UI.elementos.formulario.ventanaForm.registroId;

		//si no recive el parametro de manejarCarga toma por defecto el valor de falso
		peticion.manejarOperacion = peticion.manejarOperacion || false;
		var conexionMotor=crearXMLHttpRequest();
		conexionMotor.onreadystatechange = function(){
			if (conexionMotor.readyState == 4){
				//si el manejar carga es verdadero culmino la carga
				if(peticion.manejarOperacion === true){
					UI.elementos.cuadroCarga.terminarCarga();
					let respuesta = JSON.parse(conexionMotor.responseText);
					callback(respuesta);
				}else{
					let respuesta = JSON.parse(conexionMotor.responseText);
					if(respuesta.success === 1){
		            	callback(respuesta);
					}else{
						UI.crearMensaje('error',respuesta.mensaje);
						UI.elementos.formulario.ventanaForm.destruirNodo();
					}
				}
		    }
		};
		conexionMotor.open('POST','../controladores/cor_Motor.php', true);
		conexionMotor.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
		var envio='';
		for(var llave in peticion){
			envio+=llave.toLowerCase()+'='+encodeURIComponent(peticion[llave])+'&';
		}
		conexionMotor.send(envio);
	};
	this.manejarOperacion = function(peticion,cuadroCarga,callback){
		//------------Cuadro Carga-------------------------------
			cuadroCarga.nodo.innerHTML='';
			var cuadroDeCarga = UI.crearCuadroDeCarga(cuadroCarga.cuadro,cuadroCarga.nodo);
			cuadroDeCarga.style.marginTop = '80px';
		//-----------------------------------------------------------

		//le digo que la peticion fue por manejarOperacion
		peticion.manejarOperacion = true;
		this.Operacion(peticion,callback);
	}
	this.guardar = function(entidad,info,callback){
		var conexionMotor=crearXMLHttpRequest();
		conexionMotor.onreadystatechange = function(){
			if (conexionMotor.readyState == 4){
		        let respuesta = JSON.parse(conexionMotor.responseText);
				if(respuesta.success === 1){
	            	callback(respuesta);
				}else{
					UI.crearMensaje('error',respuesta.mensaje);
					UI.elementos.formulario.ventanaForm.destruirNodo();
				}
		    }
		};
		conexionMotor.open('POST','../controladores/cor_Motor.php', true);
		conexionMotor.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
		var envio="operacion="+encodeURIComponent('guardar')+'&entidad='+encodeURIComponent(entidad)+'&';
		for(var x=0;x<info.length;x++){
			envio+=info[x].nombre.toLowerCase()+'='+encodeURIComponent(info[x].valor)+'&';
		}
		conexionMotor.send(envio);
	};
	//funcion de arranque
	this.ignition();
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
