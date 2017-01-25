function aperturar(){
  var registro = UI.elementos.maestro.lista.obtenerSeleccionado().atributos;
  if(registro.estado==='A'){
    UI.agregarToasts({
      texto: 'Calculo ya se encuentra activo',
      tipo: 'web-arriba-derecha-alto'
    });
  }else{

      ejecutarPeticion('aperturar');
  }
}
function generar(){
  var registro = UI.elementos.maestro.lista.obtenerSeleccionado().atributos;
  if(registro.estado!=='A'){
    UI.agregarToasts({
      texto: 'Debe Activar el Calculo para poder generar Liquidaciones',
      tipo: 'web-arriba-derecha-alto'
    });
  }else{

      ejecutarPeticion('generar');
  }
}
function cerrar(){
  var registro = UI.elementos.maestro.lista.obtenerSeleccionado().atributos;
  if(registro.estado==='C'){
    UI.agregarToasts({
      texto: 'Calculo ya se encuentra cerrado',
      tipo: 'web-arriba-derecha-alto'
    });
  }else{
    ejecutarPeticion('cerrar');
  }
}
function ejecutarPeticion(op){
  var registro = UI.elementos.maestro.lista.obtenerSeleccionado().atributos;
  var modal = UI.crearVentanaModal({
    cuerpo:{
      html:''
    }
  });
  var peticion = {
     modulo: "agronomia",
     entidad: "calculoLiquidacion",
     operacion: op,
     codigo_calculo: registro.codigo,
     codigo_tipo_liquidacion: registro.codigo_tipo_liquidacion
  };
  var cuadro={
    contenedor: modal.partes.cuerpo.nodo,
    cuadro:{
      nombre: op,
      mensaje: 'Realizando Operacion'
    }
  };
  return torque.manejarOperacion(peticion,cuadro)
    .then(function(respuesta){
      modal.convertirEnMensaje(respuesta.mensaje);
    })
    .then(function(){
      return UI.elementos.maestro.lista.recargar();
    })
    .then(function(){
      UI.elementos.maestro.lista.buscarSlot(registro).nodo.click();
    });
}
