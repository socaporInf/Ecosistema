
function manejarProductor(){
  var modal = UI.crearVentanaModal({
    contenido: 'ancho',
    cabecera:{
      html: 'Verificacion de Rif',
      clases:['verificacion']
    },
    cuerpo:{
      tipo:'nuevo',
      formulario: {
        campos:[UI.buscarConstructor('productor').campos[0]]
      },
    },
    pie:{
        html:'<button type="button" class="mat-text-but" ver>Verificar</button>'+
            '<button type="button" class="mat-text-but" reg>Registrar sin Rif</button>',
        clases:['operaciones']
    }
  });
  modal.nodo.querySelector('button[reg]').onclick = function(){
    registrar();
  };
  modal.nodo.querySelector('button[ver]').onclick = function(){
    verificar();
  };
}
function verificar() {
  var modal = UI.elementos.modalWindow.buscarUltimaCapaContenido();
  var rif =  modal.partes.cuerpo.formulario.buscarCampo('rif').captarValor();
  if(rif){
    var peticion = {
       modulo: "global",
       entidad: "organizacion",
       operacion: "buscarRegistro",
       codigo: rif
    };
    var cuadro = {
      contenedor: modal.partes.cuerpo.nodo,
      cuadro:{
        nombre: 'verificacionRif',
        mensaje: 'Verificando Rif en la Base de Datos'
      }
    };
    torque.manejarOperacion(peticion,cuadro).then(function(respuesta){
      cambiarFormularioProductor({
        tipo:'modificar',
        formulario:UI.buscarConstructor('productor')
      });
      var formulario = modal.partes.cuerpo.formulario;
      if(respuesta.success){
        formulario.asignarValores(respuesta.registros);
        formulario.deshabilitar();
        formulario.buscarCampo('codigo_productor').habilitar();
      }else{
        formulario.buscarCampo('rif').asignarValor(rif);
        formulario.buscarCampo('rif').deshabilitar();
      }

      modal.nodo.querySelector('button.icon-guardar-indigo-32').onclick = function(){
        if(modal.partes.cuerpo.formulario.validar()){
          var peticion = UI.juntarObjetos({
             modulo: "agronomia",
             entidad: "productor",
             operacion: "guardar"
          },formulario.captarValores());
          var cuadro={
            contenedor:modal.partes.cuerpo.nodo,
            cuadro:{
              nombre: 'guardarProductor',
              mensaje: 'Guardando Productor'
            }
          };
          torque.manejarOperacion(peticion,cuadro).then(function(respuesta){
            modal.convertirEnMensaje(respuesta.mensaje);
          });
        }else{
          UI.agregarToasts({
            texto: 'Rellene el campo para continuar',
            tipo: 'web-arriba-derecha'
          });
        }
      };
    });
  }else{
      UI.agregarToasts({
        texto: 'Rellene el campo para poder verificar',
        tipo: 'web-arriba-derecha-alto'
      });
  }
}
function registrar(){
    var modal = UI.elementos.modalWindow.buscarUltimaCapaContenido();

    cambiarFormularioProductor({
      tipo:'nuevo',
      formulario:{
        campos: [UI.buscarConstructor('productor').campos[1]]
      }
    });
    modal.nodo.querySelector('button.icon-guardar-indigo-32').onclick = function(){
      if(modal.partes.cuerpo.formulario.validar()){
        var peticion = {
           modulo: "agronomia",
           entidad: "productor",
           operacion: "guardarSinRif",
           codigo_productor: modal.partes.cuerpo.formulario.buscarCampo('codigo_productor').captarValor()
        };
        var cuadro={
          contenedor:modal.partes.cuerpo.nodo,
          cuadro:{
            nombre: 'guardarProductor',
            mensaje: 'Guardando Productor'
          }
        };
        torque.manejarOperacion(peticion,cuadro).then(function(respuesta){
          modal.convertirEnMensaje(respuesta.mensaje);
        });
      }else{
        UI.agregarToasts({
          texto: 'Rellene el campo para continuar',
          tipo: 'web-arriba-derecha'
        });
      }
    };
}
function cambiarFormularioProductor(cuerpo){
  var modal = UI.elementos.modalWindow.buscarUltimaCapaContenido();
  //cambios cabecera
  modal.partes.cabecera.nodo.classList.remove('verificacion');
  modal.partes.cabecera.nodo.innerHTML='Registrar Productor';

  //cambios cuerpo
  modal.partes.cuerpo.nodo.innerHTML="";
  modal.partes.cuerpo.agregarFormulario(cuerpo);

  //cambio pie
  modal.partes.pie.nodo.classList.remove('operaciones');
  modal.partes.pie.nodo.classList.add('botonera');
  modal.partes.pie.nodo.innerHTML='<button type="button" class="icon icon-guardar-indigo-32"> </button>'+
        '<button type="button" class="icon icon-cerrar-rojo-32"> </button>';

  //funcionamiento botones
  modal.nodo.querySelector('button.icon-cerrar-rojo-32').onclick = function(){
    UI.elementos.modalWindow.eliminarUltimaCapa();
  };
}
