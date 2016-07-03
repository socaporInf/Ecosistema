tablaVirtual = {
  nombre:'tablaVirtual',
  nuevo:{
    titulo: 'Tabla Virtual',
    altura: 300,
    campos:[
      {
        tipo : 'campoDeTexto',
        parametros : {requerido:true,titulo:'Nombre',nombre:'nombre',tipo:'simple',eslabon:'simple',usaToolTip:true}
      },{
        tipo : 'campoDeTexto',
        parametros : {requerido:true,titulo:'Campo Relacion',nombre:'campo_relacion',tipo:'simple',eslabon:'simple',usaToolTip:false}
      },{
        tipo : 'campoDeTexto',
        parametros : {requerido:true,titulo:'Funcion',nombre:'funcion',tipo:'area',eslabon:'area',usaToolTip:true}
      }
    ]
  },
  modificar:{
    altura: 300,
    campos: [
      {
        tipo : 'campoEdicion',
        parametros : {nombre:'campo_relacion',titulo:'Campo Relacion'}
      },{
        tipo : 'campoEdicion',
        parametros : {nombre:'funcion',titulo:'Funcion',tipo:'area'}
      }
    ],
    botones: [
      {
        tipo:'detalle',
        click: function(boton){
          abrirFormTabla();
        }
      }
    ]
  },
};
/*----------------------------------------Fin tablas ------------------------------------------------*/
/*----------------------------------------Registros Virtuales----------------------------------------*/
registroVirtual = {
  nombre:'registroVirtual',
  nuevo:{
    titulo: '',
    altura: 200,
    campos:[
      {
        tipo : 'campoDeTexto',
        parametros : {requerido:true,titulo:'Nombre',nombre:'nombre',tipo:'simple',eslabon:'simple',usaToolTip:true}
      },{
        tipo : 'campoDeTexto',
        parametros : {requerido:true,titulo:'Descripcion',nombre:'Descripcion',tipo:'area',eslabon:'area',usaToolTip:false}
      }
    ]
  },
  modificar:{
    altura: 200,
    campos: [
      {
        tipo : 'campoEdicion',
        parametros : {nombre:'nombre',titulo:'Nombre',tipo:'titulo'}
      },{
        tipo : 'campoEdicion',
        parametros : {nombre:'descripcion',titulo:'Descripcion',tipo:'area'}
      }
    ]
  },
};
/*----------------------------------------Fin Registros----------------------------------------------*/

/*----------------------------------------Detalle Tabla Virtual----------------------------------------------*/
function abrirFormTabla(){
  UI.buscarConstructor('registroVirtual').nuevo.titulo = UI.elementos.formulario.ventanaForm.registroAct.nombre;
  //monto venta modal
  var ventTabla = UI.crearVentanaModal({
    contenido: 'ancho',
    cuerpo:{
      html: '',
      clase: 'lista'
    },
    pie: {
      html: '<section modalButtons>'+
            '<button type="button" class="icon-nuevo-azul-claro-32"> </button>'+
            '<button type="button" class="icon-cerrar-rojo-32"> </button>'+
          '</section>'
    }
  });
  ventTabla.partes.pie.nodo.querySelector('button.icon-nuevo-azul-claro-32').onclick = abrirFormTabNuevo;
  ventTabla.partes.pie.nodo.querySelector('button.icon-cerrar-rojo-32').onclick = function(){UI.elementos.modalWindow.eliminarUltimaCapa();};
  //agrego la lista a la ventanaModal
  var lista = UI.agregarLista({
    titulo: UI.buscarConstructor('registroVirtual').nuevo.titulo,
    nombre: UI.buscarConstructor('registroVirtual').nuevo.titulo,
    clase: 'lista',
    carga: {
      uso:true,
      peticion:{
        entidad: 'tablaVirtual',
        operacion: 'listarRegistros',
        codigo: UI.elementos.formulario.ventanaForm.registroId
      },
      espera:{
        cuadro:{nombre: 'listarRegistros',mensaje: 'Cargando Registros'}
      }
    },
    paginacion: {
      uso:false
    },
    onclickSlot: editarRegistro
  },ventTabla.partes.cuerpo.nodo);
}

/*----------------------------------------Edicion Registro Virtual----------------------------------------------*/
editarRegistro = function(slot){
  UI.elementos.modalWindow.eliminarUltimaCapa();
  setTimeout(function motarFormularioNuevo(){
    var formTabla = UI.crearVentanaModal({
      contenido: 'ancho',
      cuerpo:{
        clase: 'lista',
        alto: UI.buscarConstructor('registroVirtual').modificar.altura,
        campos: UI.buscarConstructor('registroVirtual').modificar.campos
      },
      pie:{
        html: '<section modalButtons>'+
              '<button type="button" class="icon-cerrar-rojo-32"> </button>'+
            '</section>'
      }
    });
    UI.asignarValores(slot.atributos,formTabla.partes.cuerpo);
    formTabla.partes.cuerpo.registroId = slot.atributos.codigo;
    formTabla.partes.pie.nodo.querySelector('button.icon-cerrar-rojo-32').onclick = function(){
      UI.elementos.modalWindow.eliminarUltimaCapa();
      setTimeout(abrirFormTabla,1000);
    };
    formTabla.partes.cuerpo.nodo.querySelector('article[update]').onclick = activarEdicion;
  },1000)
};
var activarEdicion = function(){
  var formTabla = UI.elementos.modalWindow.buscarUltimaCapaContenido();
  formTabla.partes.cuerpo.registro = UI.modificar(formTabla.partes.cuerpo);
  this.onclick = finalizarEdicion;
}
var finalizarEdicion = function(){  
  var formTabla = UI.elementos.modalWindow.buscarUltimaCapaContenido();
  var nuevoRegistro = UI.modificar(formTabla.partes.cuerpo);
  var cambios = validarCambios(nuevoRegistro,formTabla.partes.cuerpo.registro);
  if(!cambios.length){
    this.onclick = activarEdicion;
  }else{
    nuevoRegistro.push({nombre:'codigo',valor:formTabla.partes.cuerpo.registroId});
    enviarCambios(nuevoRegistro,formTabla.partes.cuerpo.nodo);
  }
}
var validarCambios = function(newReg,oldReg){
  var cambios = [];
  for (var i = 0; i < newReg.length; i++) {
    for (var x = 0; x < oldReg.length; x++) {
      if(newReg[i].nombre === oldReg[x].nombre){
        if(newReg[i].valor != oldReg[x].valor){
          cambios.push(newReg[i]);
        }
        break;
      }
    }
  }
  return cambios;
}
var enviarCambios = function(cambios,contenedor){
  //armo la peticion
  var peticion = {
    entidad: 'tablaVirtual',
    operacion: 'modificarRegistro'
  }
  for (var i = 0; i < cambios.length; i++) {
    peticion[cambios[i].nombre] = cambios[i].valor;
  }
  //luego el cuadro
  var infoCuadro = {
    contenedor: contenedor,
    cuadro:{
      nombre: 'guardando cambios',
      mensaje: 'Guardando cambios'
    }
  }
  torque.manejarOperacion(peticion,infoCuadro,function guardarCambios(respuesta){
    if(respuesta.success){        
      UI.elementos.modalWindow.eliminarUltimaCapa();
      setTimeout(abrirFormTabla,1000);
    }else{
      UI.elementos.modalWindow.buscarUltimaCapaContenido().convertirEnMensaje(respuesta.mensaje);
    }
  });
} 
/*----------------------------------------Nuevo Registro Virtual----------------------------------------------*/
var abrirFormTabNuevo = function(){
  UI.elementos.modalWindow.eliminarUltimaCapa();
  setTimeout(function motarFormularioNuevo(){
    var formTabla = UI.crearVentanaModal({
      contenido: 'ancho',
      cabecera: 'Nuevo '+UI.buscarConstructor('registroVirtual').nuevo.titulo,
      cuerpo:{
        alto: UI.buscarConstructor('registroVirtual').nuevo.altura,
        campos: UI.buscarConstructor('registroVirtual').nuevo.campos
      },
      pie:{
        html: '<section modalButtons>'+
              '<button type="button" class="icon-guardar-indigo-32"> </button>'+
              '<button type="button" class="icon-cerrar-rojo-32"> </button>'+
            '</section>'
      }
    });
    formTabla.partes.pie.nodo.querySelector('button.icon-cerrar-rojo-32').onclick = function(){UI.elementos.modalWindow.eliminarUltimaCapa();};
    formTabla.partes.pie.nodo.querySelector('button.icon-guardar-indigo-32').onclick = guardarRegistro;
  },1000);
};
var guardarRegistro = function(){
  //guardo el valor del formulario validado en la variable, en caso de que no este validado retorna false
  //por lo tanto no guardara
  var peticion = validar(UI.elementos.modalWindow.buscarUltimaCapaContenido().partes.cuerpo);
  if(peticion){
    peticion.codigo_tabla = UI.elementos.formulario.ventanaForm.registroId;
    peticion.entidad = 'tablaVirtual';
    peticion.operacion = 'guardarRegistro';
    console.log(peticion);
    var InfoCuadro = {
      contenedor: UI.elementos.modalWindow.buscarUltimaCapaContenido().partes.cuerpo.nodo,
      cuadro:{
        nombre: 'guardando ' + UI.elementos.formulario.ventanaForm.registroAct.nombre,
        mensaje: 'Guardando Registro'
      }
    }
    torque.manejarOperacion(peticion,InfoCuadro,function guardar(respuesta){
      if(respuesta.success){        
        UI.elementos.modalWindow.eliminarUltimaCapa();
        setTimeout(abrirFormTabla,1000);
      }else{
        UI.elementos.modalWindow.buscarUltimaCapaContenido().convertirEnMensaje(respuesta.mensaje);
      }
    });
  }else{
    UI.agregarToasts({
      texto:'debe llenar el formulario',
      tipo: 'web-arriba-derecha'
    });
  }
}
var validar = function(contenedor){
  var data = {};
  var campos = contenedor.campos;
  for (var i = 0; i < campos.length; i++) {
    //valido el campo
    if((campos[i].captarRequerido())&&(!campos[i].captarValor())){
      return false;
    }
    if(campos[i].captarValor()){
      data[campos[i].captarNombre()]=campos[i].captarValor();
    }
  }
  return data;
}