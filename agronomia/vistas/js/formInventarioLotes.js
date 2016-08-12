var agregarListado = function(ventana,peticion){
  var contList = ventana.agregarSector({
    nombre:'listado de ' + peticion.entidad,
  });
  var lista = UI.agregarLista({
    titulo: 'listado de '+ peticion.entidad,
    clases: ['embebida'],
    campo_nombre: UI.buscarConstructor(peticion.entidad).campo_nombre,
    carga: {
      uso:true,
      peticion: peticion,
      espera:{
        cuadro:{
          nombre: 'carga' + peticion.entidad,
          mensaje: 'Cargando ' + peticion.entidad
        }
      },
      respuesta: function(){
        var lista = UI.buscarVentana('listado de ' + peticion.entidad );
        var Slots = lista.Slots;
        Slots.forEach(function(each){
          each.nodo.onclick = function(){
            modificar(each.atributos,peticion.entidad);
          };
        });
      }
    },
    paginacion: {
      uso:false
    }
  },contList.nodo);
};
function agregarNuevo(entidad) {
  var formulario = {
    plano: UI.buscarConstructor(entidad),
    tipo: 'nuevo'
  };
  var secBotonera = {
    nombre:'botonera '+entidad,
    html: '<section botonera>'+
        '<button type="button" class="icon icon-guardar-blanco-32 mat-indigo500"></button>'+
        '<button type="button" class="icon icon-cerrar-blanco-32 mat-red500"></button>'+
      '</section>'
  };
  var secForm = UI.buscarVentana("editarProductor").buscarSector('botonera '+entidad);
  agregarFormulario(formulario,secBotonera,entidad);

  var cons = UI.buscarConstructor(entidad);
  var codigo = UI.buscarVentana("editarProductor").buscarSector('form'+cons.entidad_padre).formulario.buscarCampo(cons.campo_padre).captarValor();
  secForm.formulario.buscarCampo(cons.campo_padre).asignarValor(codigo_productor);
  secForm.formulario.buscarCampo(cons.campo_padre).deshabilitar();

  var botonera =UI.buscarVentana("editarProductor").buscarSector('botonera '+entidad);
  var btnGuardar = botonera.nodo.querySelector("button.icon-guardar-blanco-32");
  btnGuardar.onclick = function(){
    var peticion = {
       modulo: UI.buscarConstructor(entidad).modulo,
       entidad: entidad,
       operacion: "guardar"
    };
    guardarCambios(peticion);
  };
}
function modificar(registro,entidad){
  if(!UI.buscarVentana("editarProductor").buscarSector('form'+entidad)){
    var formulario = {
      nombre: 'form'+entidad, //puede ser lo que sea
      formulario: UI.buscarConstructor(entidad),
      tipo: 'modificar',
      registro: registro,
    };
    var secBotonera = {
      nombre:'botonera '+entidad,
      html: '<section botonera>'+
          '<button type="button" class="icon icon-editar-blanco-32 mat-green500"></button>'+
          '<button type="button" class="icon icon-cerrar-blanco-32 mat-red500"></button>'+
          '<button type="button" class="icon icon-green-add"></button>'+
        '</section>'
    };
    agregarFormulario(formulario,secBotonera,entidad);
    var pet ={
       modulo: "agronomia",
       entidad: UI.buscarConstructor(entidad).entidad_hijo,
       operacion: "buscarHijos"
    };
    pet[UI.buscarConstructor(entidad).campo_codigo] = registro[UI.buscarConstructor(entidad).campo_codigo];
    var ventana = UI.buscarVentana("editarProductor");
    if(UI.buscarConstructor(entidad).entidad_hijo){      
      agregarListado(ventana,pet);
    }
    var secForm = ventana.buscarSector('form'+entidad);
    var botonera = ventana.buscarSector('botonera '+entidad);
    var btnEditar = botonera.nodo.querySelector("button.icon-editar-blanco-32");
    btnEditar.onclick = function(){
      //cambios de formulario
      secForm.formulario.habilitar();
      //secForm.formulario.buscarCampo('codigo_productor').deshabilitar();
      //cambios de boton
      this.classList.remove('icon-editar-blanco-32');
      this.classList.remove('mat-green500');
      this.classList.add('icon-guardar-blanco-32');
      this.classList.add('mat-indigo500');
      this.onclick = function(){
        UI.quitarVentana('listado de '+entidad);
        var peticion = {
           modulo: UI.buscarConstructor(entidad).modulo,
           entidad: entidad,
           operacion: "modificar"
        };
        peticion[UI.buscarConstructor.campo_codigo] = secForm.formulario.registroAct.codigo;
        guardarCambios(peticion);
      };
      var btnNueva = botonera.nodo.querySelector("button");
      btnNueva.onclick = function(){
        var secForm = ventana.buscarSector('botonera '+entidad);
        secForm.nodo.classList.add('desaparecer');
        secForm.nodo.querySelector('section[botonera]').classList.add('desaparecer');
        setTimeout(agregarNuevo, 310);
      };
    };
  }else{
    UI.agregarToasts({
      texto: 'cierre el formulario antes de continuar',
      tipo: 'web-arriba-derecha-alto'
    });
  }
}
function guardarCambios(pet){
  var secForm = UI.buscarVentana("editarProductor").buscarSector('form'+pet.entidad);
  var formulario = secForm.formulario;
  if(formulario.validar()){
    var registro = formulario.captarValores();
    var peticion = UI.juntarObjetos(pet,registro);
    var cuadro = {
      contenedor: secForm.nodo,
      cuadro : {
        nombre: 'guardando'+pet.entidad,
        mensaje: 'Guardando Cambios'
      }
    };
    torque.manejarOperacion(peticion,cuadro,function(respuesta){
      if(respuesta.success){
        var ventana = UI.buscarVentana("editarProductor");
        cerrarFormulario(respuesta.entidad);
        var codigo = respuesta.registro[UI.buscarConstructor(respuesta.entidad).campo_padre];
        agregarListado(codigo,ventana,respuesta.entidad);
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
function agregarFormulario(formulario,secBotonera,entidad){
  console.log('formulario creado: '+entidad);
  var secForm;
  secForm = UI.buscarVentana("editarProductor").agregarSector(formulario);
  secForm.nodo.style.height = UI.buscarConstructor(entidad).altura+'px';
  var botonera = UI.buscarVentana("editarProductor").agregarSector(secBotonera);
  botonera.nodo.querySelector('button.icon-cerrar-blanco-32').onclick = function(){
    cerrarFormulario(entidad);
  };
}
function cerrarFormulario(entidad){
  var ventanaEditar = UI.buscarVentana("editarProductor");
  var secForm = ventanaEditar.buscarSector('form'+entidad);
  secForm.nodo.classList.add('desaparecer');
  ventanaEditar.buscarSector('botonera '+entidad).nodo.classList.add('desaparecer');
  ventanaEditar.buscarSector('listado de '+UI.buscarConstructor(entidad).entidad_hijo).nodo.classList.add('desaparecer');
  setTimeout(function () {
    ventanaEditar.quitarSector('form'+entidad);
    ventanaEditar.quitarSector('botonera '+entidad);
    ventanaEditar.quitarSector('listado de '+UI.buscarConstructor(entidad).entidad_hijo);
  }, 310);
}
construirBotonera = function(contenedor,nombre){
  var botonera = contenedor.agregarSector({
    nombre:'botonera '+nombre,
    html: '<section botonera>'+
      '<button type="button" class="icon icon-green-add"></button>'+
      '</section>'
  });
  return botonera;
};
