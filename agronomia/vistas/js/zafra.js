function aperturar(){
  //PRIVILEGIO: abrir
  if(UI.elementos.maestro.lista.obtenerSeleccionado().atributos.codigo_estado === 'A'){
    UI.crearMensaje({
      nombre_tipo: 'ADVERTENCIA',
      titulo: 'Zafra ya aperturada',
      cuerpo: 'No se puede aperturar una zafra que ya se encuentra aperturada'
    });
  }else {
    if(sesion.privilegioActivo.buscarOperacion('abrir')){
      var mensaje = {
        titulo: 'Aperturar',
        cuerpo: 'Realmente desea aperturar la zafra '+
                UI.elementos.maestro.forma.formulario.buscarCampo('nombre').captarValor()
      };
      UI.crearVerificacion(mensaje,function(){
        var formulario = UI.elementos.maestro.forma.formulario;
        var peticion = UI.juntarObjetos({
           modulo: "agronomia",
           entidad: "zafra",
           operacion: "aperturar",
           estado: 'A'
        },formulario.captarValores());

        var cuadro = {
          contenedor : UI.elementos.modalWindow.buscarUltimaCapaContenido().partes.cuerpo.nodo,
          cuadro: {
            nombre: 'Apertura',
            mensaje: 'Aperturando Zafra '+formulario.buscarCampo('nombre').captarValor()
          }
        };
        torque.manejarOperacion(peticion,cuadro,function(res){
          UI.elementos.modalWindow.buscarUltimaCapaContenido().convertirEnMensaje(res.mensaje);
          UI.elementos.maestro.lista.recargar();
        });
      });
    }else{
      UI.crearMensaje({
        nombre_tipo: 'ERROR',
        titulo: 'Error privilegios',
        cuerpo: 'Usted no posee privilegios para realizar esta operacion.<br>'+
                ' Para mas información comuniquese con el Administrador del sistema.'
      });
    }
  }
}
