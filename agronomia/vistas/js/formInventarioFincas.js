//-----------------------------------Fincas---------------------------
var agregarListadoFincas = function(codigo_productor,ventana){
  var contList = ventana.agregarSector({
    nombre:'listado',
  });
  var listaFincas = UI.agregarLista({
    titulo: 'Listado fincas',
    clases: ['embebida'],
    campo_nombre: UI.buscarConstructor('finca').campo_nombre,
    carga: {
      uso:true,
      peticion:{
         modulo: "agronomia",
         entidad: "finca",
         operacion: "buscarFincasPorProductor",
         codigo_productor: codigo_productor
      },
      espera:{
        cuadro:{
          nombre: 'cargaFincas',
          mensaje: 'Cargando Fincas'
        }
      },
      respuesta: function(){
        var lista = UI.buscarVentana('Listado fincas');
        var Slots = lista.Slots;
        Slots.forEach(function(each){
          each.nodo.onclick = function(){
            modificarFinca(each.atributos);
          };
        });
      }
    },
    paginacion: {
      uso:false
    }
  },contList.nodo);
};
function agregarNuevaFinca() {
  var formulario = {
    plano: UI.buscarConstructor('finca'),
    tipo: 'nuevo'
  };
  var secBotonera = {
    nombre:'botonera fincas',
    html: '<section botonera>'+
        '<button type="button" class="icon icon-guardar-blanco-32 mat-indigo500"></button>'+
        '<button type="button" class="icon icon-cerrar-blanco-32 mat-red500"></button>'+
      '</section>'
  };
  var secForm = UI.buscarVentana("editarProductor").buscarSector('botonera fincas');
  agregarFormularioFincas(formulario,secBotonera);
  var codigo_productor = UI.buscarVentana("editarProductor").buscarSector('formulario').formulario.buscarCampo('codigo_productor').captarValor();
  secForm.formulario.buscarCampo('codigo_productor').asignarValor(codigo_productor);
  secForm.formulario.buscarCampo('codigo_productor').deshabilitar();
  var botonera =UI.buscarVentana("editarProductor").buscarSector('botonera fincas');
  var btnGuardar = botonera.nodo.querySelector("button.icon-guardar-blanco-32");
  btnGuardar.onclick = function(){
    guardarCambiosFinca({
       modulo: "agronomia",
       entidad: "finca",
       operacion: "guardar"
    });
  };
}
function modificarFinca(finca){
  if(!UI.buscarVentana("editarProductor").buscarSector('formFinca')){
    var formulario = {
      plano: UI.buscarConstructor('finca'),
      tipo: 'modificar',
      registroAct: finca
    };
    var secBotonera = {
      nombre:'botonera fincas',
      html: '<section botonera>'+
          '<button type="button" class="icon icon-editar-blanco-32 mat-green500"></button>'+
          '<button type="button" class="icon icon-cerrar-blanco-32 mat-red500"></button>'+
        '</section>'
    };
    agregarFormularioFincas(formulario,secBotonera);
    var secForm = UI.buscarVentana("editarProductor").buscarSector('formFinca');
    var botonera = UI.buscarVentana("editarProductor").buscarSector('botonera fincas');
    var btnEditar = botonera.nodo.querySelector("button.icon-editar-blanco-32");
    btnEditar.onclick = function(){
      this.classList.remove('icon-editar-blanco-32');
      this.classList.remove('mat-green500');
      this.classList.add('icon-guardar-blanco-32');
      this.classList.add('mat-indigo500');
      this.onclick = function(){
        guardarCambiosFinca({
           modulo: "agronomia",
           entidad: "finca",
           operacion: "modificar",
           id_finca: secForm.formulario.registroAct.codigo
        });
      };
    };
  }else{
    UI.agregarToasts({
      texto: 'cierre el formulario antes de continuar',
      tipo: 'web-arriba-derecha-alto'
    });
  }
}
function guardarCambiosFinca(pet){
  var secForm = UI.buscarVentana("editarProductor").buscarSector('formFinca');
  var formulario = secForm.formulario;
  if(formulario.validar()){
    var registro = formulario.captarValores();
    var peticion = UI.juntarObjetos(pet,registro);
    var cuadro = {
      contenedor: secForm.nodo,
      cuadro : {
        nombre: 'guardandofinca',
        mensaje: 'Guardando Cambios'
      }
    };
    torque.manejarOperacion(peticion,cuadro,function(respuesta){
      if(respuesta.success){
        var ventana = UI.buscarVentana("editarProductor");
        cerrarFormulariofincas();
        var codigo_productor = ventana.buscarSector('formulario').formulario.buscarCampo('codigo_productor').captarValor();
        agregarListadoFincas(codigo_productor,ventana);
      }else{
        UI.agregarToasts({
          texto: respuesta.mensaje.titulo,
          tipo: 'web-arriba-derecha-alto'
        });
      }
    });
  }else {
    UI.agregarToasts({
      texto: 'debe llenar los campos para poder guardar',
      tipo: 'web-arriba-derecha-alto'
    });
  }
}

function agregarFormularioFincas(formulario,secBotonera){
  var secForm = UI.buscarVentana("editarProductor").buscarSector('botonera fincas');
  secForm.atributos.nombre = 'formFinca';
  secForm.nodo.innerHTML = "";
  secForm.agregarFormulario(formulario);
  secForm.nodo.classList.remove('desaparecer');
  secForm.nodo.style.height = UI.buscarConstructor('finca').altura+'px';
  var botonera = UI.buscarVentana("editarProductor").agregarSector(secBotonera);
  botonera.nodo.querySelector('button.icon-cerrar-blanco-32').onclick = function(){
    cerrarFormulariofincas();
  };
}
function cerrarFormulariofincas(){
  var ventanaEditar = UI.buscarVentana("editarProductor");
  var secForm = ventanaEditar.buscarSector('formFinca');
  secForm.nodo.classList.add('desaparecer');
  ventanaEditar.buscarSector('botonera fincas').nodo.classList.add('desaparecer');
  setTimeout(function () {
    ventanaEditar.quitarSector('formFinca');
    ventanaEditar.quitarSector('botonera fincas');
    var botonera = crearBotoneraFincas(ventanaEditar);
  }, 310);
}
function crearBotoneraFincas(ventana){
  var botonera = crearBotonera(ventana,'fincas');
  var btnNuevaFinca = botonera.nodo.querySelector("button");
  btnNuevaFinca.onclick = function(){
    var secForm = UI.buscarVentana("editarProductor").buscarSector('botonera fincas');
    secForm.nodo.classList.add('desaparecer');
    secForm.nodo.querySelector('section[botonera]').classList.add('desaparecer');
    setTimeout(agregarNuevaFinca, 310);
  };
}
