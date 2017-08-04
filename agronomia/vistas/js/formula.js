function construirUI(){
  UI.maestro = {};
  maestro = UI.maestro;
  maestro.lista = UI.agregarLista({
    nombre:"formulas",
    titulo: 'Formulas',
    clases:["formulario"],
    campo_nombre: 'nombre',
    carga: {
      uso:true,
      peticion: {
         modulo: torque.moduloActivo,
         entidad: torque.entidadActiva,
         operacion: "buscar",
      },
      espera:{
        cuadro:{
          nombre: 'buscar'+torque.entidadActiva,
          mensaje: 'Buscando '+torque.entidadActiva
        }
      },
      respuesta: function(lista){
        lista.Slots.forEach(function(slot){
          var i = document.createElement('i');
          ["material-icons","icons","mat-indigo500","white","basura"].forEach(function(clase){
            i.classList.add(clase);
          });
          i.textContent = "info_outline";
          slot.nodo.appendChild(i);
        });
      }
    },
    onclickSlot: function(slot){
      var modal = UI.elementos.modalWindow;
      if(!modal){
           modal = crearModal();
      }else{
        if(!modal.capas.lenght){
          modal = crearModal();
        }else{
          modal = modal.buscarUltimaCapaContenido();
        }
      }
      modificarRegistro(slot.atributos,modal);
    }
  },document.querySelector('div[contenedor]'));

  var ventana = UI.agregarVentana({
    nombre:'formulario',
    tipo: '',
    titulo: {
      tipo:'basico o inverso',
      html:'contenido'
    },
    sectores:[sectores]
  });
}
var guardarCambios = function(){
  var modal = UI.elementos.modalWindow.buscarUltimaCapaContenido();
  var formulario = modal.partes.cuerpo.formulario;
  if(!formulario.validar()){
      UI.agregarToasts({
        texto: 'Llene los campos por favor',
        tipo: 'web-arriba-derecha-alto'
      });
  }else{
    var peticion = UI.juntarObjetos({
       "modulo": "pruebas",
       "entidad": "m01_formula",
       "operacion": "modificar"
    },formulario.captarValores());
    var cuadro = {
      "contenedor": modal.partes.cuerpo.nodo,
      "cuadro":{
        "nombre": 'guardarCambios',
        "mensaje": 'Guardando Cambios'
      }
    };
    torque.manejarOperacion(peticion,cuadro)
      .then(function(resultado){
        /*UI.elementos.modalWindow.eliminarUltimaCapa();
        UI.buscarVentana('formulas').recargar();*/
        UI.agregarToasts({
          texto: 'cambio realizado exitosamente',
          tipo: 'web-arriba-derecha-alto'
        });
        modificarRegistro(resultado.registro,modal);
      });
  }
};
var modificarRegistro = function(registro,modal){
  modal.partes.cuerpo.agregarFormulario({
    tipo:'modificar',
    formulario: UI.buscarConstructor('m01_formula'),
    registro:registro
  });
  modal.partes.pie.nodo.innerHTML = '<button type="button" nombre = "editar" class="icon material-icons md-24 green500"> edit_mode</button>'+
          '<button type="button" nombre = "cancelar" class="icon icon-cerrar-rojo-32"> </button>';
  modal.partes.pie.detectarBotones();
  var botonEditar = modal.partes.pie.buscarBoton('editar');
  botonEditar.nodo.onclick= function(){
    botonEditar.nodo.classList.remove('green500');
    botonEditar.nodo.classList.add('indigo500');
    botonEditar.nodo.innerHTML = "save";
    modal.partes.cuerpo.formulario.habilitar();
    botonEditar.nodo.onclick = guardarCambios;
  };
  var botonCancelar = modal.partes.pie.buscarBoton('cancelar');
    botonCancelar.nodo.onclick= function(){
      UI.elementos.modalWindow.eliminarUltimaCapa();
  };
};
var crearModal = function(){
  var modal =  UI.crearVentanaModal({
    contenido: 'ancho',
    cabecera:{
      html: 'Modificar '+UI.buscarConstructor('m01_formula').titulo
    },
    cuerpo:{
     html: ""
    },
    pie:{
        clases:['botonera']
    }
  });
  return modal;
};

var nuevo = function(boton){
  var modal = crearModal();
  modal.partes.cuerpo.agregarFormulario({
    tipo:'nuevo',
    formulario: UI.buscarConstructor('m01_formula')
  });
  modal.partes.pie.nodo.innerHTML = '<button type="button" nombre = "guardar" class="icon material-icons md-24 blue500"> save</button>'+
            '<button type="button" nombre = "cancelar" class="icon icon-cerrar-rojo-32"> </button>';
  modal.partes.pie.detectarBotones();
  var botonGuardar = modal.partes.pie.buscarBoton('guardar');
  botonGuardar.nodo.onclick= guardar;

  var botonCancelar = modal.partes.pie.buscarBoton('cancelar');
    botonCancelar.nodo.onclick= function(){
      UI.elementos.modalWindow.eliminarUltimaCapa();
  };
};

var guardar = function(){
  var modal = UI.elementos.modalWindow.buscarUltimaCapaContenido();
  var formulario = modal.partes.cuerpo.formulario;
    if (!formulario.validar()){
        UI.agregarToasts({
          texto: 'Llene los Campos para poder continuar',
          tipo: 'web-arriba-derecha-alto'
        });
    }else{
      var peticion = UI.juntarObjetos({
         "modulo": "pruebas",
         "entidad": "m01_formula",
         "operacion": "guardar"
      },formulario.captarValores());
      var cuadro = {
        "contenedor": modal.partes.cuerpo.nodo,
        "cuadro":{
          "nombre": 'guardaregistro',
          "mensaje": 'Guardando Registro'
        }
      };
      torque.manejarOperacion(peticion,cuadro)
        .then(function(resultado){
          /*UI.elementos.modalWindow.eliminarUltimaCapa();
          UI.buscarVentana('formulas').recargar();*/
          modal.convertirEnMensaje(resultado.mensaje);
          UI.buscarVentana('formulas').recargar();
        });
    }

};
