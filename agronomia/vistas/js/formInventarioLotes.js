var agregarListado = function(ventana,peticion){
  var contList = ventana.agregarSector({
    nombre:'listado de ' + peticion.entidad,
  });
  var lista = UI.agregarLista({
    titulo: 'listado de '+ peticion.entidad,
    clases: ['embebida'],
    campo_nombre: UI.buscarConstructor(peticion.entidad).campo_nombre,
    tamano:'libre',
    selector: 'apagado',
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
        var lista = UI.buscarVentana('listado de ' + peticion.entidad);
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
function agregarNuevo(entidad){
  var cons = UI.buscarConstructor(entidad);
  var ventana = UI.buscarVentana("editarProductor");
  var secForm = ventana.buscarSector('form'+entidad);
  var listado = ventana.buscarSector("listado de "+cons.entidad_hijo);
  var botonera = ventana.buscarSector("botonera "+entidad);
  //formulario
  secForm.formulario.limpiar();
  secForm.formulario.habilitar();
  if(cons.entidad_padre){
    var formularioPadre = ventana.buscarSector('form'+cons.entidad_padre).formulario;
    var valorCampoPadre = formularioPadre.registroAct[cons.campo_padre];
    secForm.formulario.buscarCampo(cons.campo_padre).asignarValor(valorCampoPadre);
    secForm.formulario.buscarCampo(cons.campo_padre).deshabilitar();
  }
  //listado
  if(listado){
    listado.nodo.classList.add('desaparecer');
  }

  //botonera
  botonera.nodo.classList.add('desaparecer');
  setTimeout(function () {
    html = '<section botonera>'+
          '<button type="button" class="icon icon-guardar-blanco-32 mat-indigo500"></button>'+
          '<button type="button" class="icon icon-cerrar-blanco-32 mat-red500"></button>'+
        '</section>';
    botonera.nodo.innerHTML = html;
    botonera.nodo.classList.remove('desaparecer');
    botonera.nodo.querySelector("button.icon-cerrar-blanco-32").onclick = function(){
      cerrarFormulario(entidad);
    };
    var btnGuardar = botonera.nodo.querySelector("button.icon-guardar-blanco-32");
    btnGuardar.onclick = function(){
      var peticion = {
         modulo: UI.buscarConstructor(entidad).modulo,
         entidad: entidad,
         operacion: "guardar"
      };
      guardarCambios(peticion);
    };
  }, 310);
  desaparecerFormulariosHijos(entidad);
}
function modificar(registro,entidad){
  if(!UI.buscarVentana("editarProductor").buscarSector('form'+entidad)){
    var formulario = {
      nombre: 'form'+entidad, //puede ser lo que sea
      formulario: UI.buscarConstructor(entidad),
      tipo: 'modificar',
      registro: registro,
    };
    var htmlNuevo = '';
    var htmlAgregar = '';
    //PRIVILEGIO: productor; OPERACION: incluir
    if(sesion.privilegioActivo.buscarOperacion('incluir')){
      htmlNuevo = '<button type="button" class="icon icon-nuevo-blanco-32 mat-lightblue500"></button>';
      htmlAgregar = '<button type="button" class="icon icon-green-add"></button>';
    }
    //PRIVILEGIO: productor; OPERACION: modificar
    var htmlModificar = (sesion.privilegioActivo.buscarOperacion('modificar'))?'<button type="button" class="icon icon-editar-blanco-32 mat-green500"></button>':'';
    var htmlBot = '<section botonera>'+
        htmlModificar+
        '<button type="button" class="icon icon-cerrar-blanco-32 mat-red500"></button>'+
        htmlNuevo;
    if(UI.buscarConstructor(entidad).entidad_hijo){
        htmlBot += htmlAgregar;
    }
    htmlBot+='</section>';
    var secBotonera = {
      nombre:'botonera '+entidad,
      html: htmlBot
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
      if(pet[UI.buscarConstructor(entidad).campo_codigo] !== undefined){
        agregarListado(ventana,pet);
      }
    }
    var secForm = ventana.buscarSector('form'+entidad);
    var botonera = ventana.buscarSector('botonera '+entidad);
    var btnEditar = botonera.nodo.querySelector("button.icon-editar-blanco-32");
    btnEditar.onclick = function(){
      //cierro listado si lo tiene
      cerrarListado(UI.buscarConstructor(entidad).entidad_hijo);
      //cambios de formulario
      secForm.formulario.habilitar();
      secForm.formulario.buscarCampo(UI.buscarConstructor(entidad).campo_padre).deshabilitar();
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
        peticion[UI.buscarConstructor(entidad).campo_codigo] = secForm.formulario.registroAct.codigo;
        guardarCambios(peticion);
      };
    };
    botonera.nodo.querySelector("button.icon-nuevo-blanco-32").onclick = function(){
      agregarNuevo(entidad);
    };
    if(UI.buscarConstructor(entidad).entidad_hijo){
      botonera.nodo.querySelector("button.icon-green-add").onclick = function(){
        var reg = {};
        //creo el formulario con el valor principal
        modificar(reg,UI.buscarConstructor(entidad).entidad_hijo);
        //activo edicion para guardar nuevo
        agregarNuevo(UI.buscarConstructor(entidad).entidad_hijo);
      };
    }
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
        cerrarListado(respuesta.entidad);
        cerrarFormulario(respuesta.entidad);
        var pet ={
           modulo: "agronomia",
           entidad: respuesta.entidad,
           operacion: "buscarHijos"
        };
        var cons = UI.buscarConstructor(respuesta.entidad);
        pet[UI.buscarConstructor(cons.entidad_padre).campo_codigo] = registro[UI.buscarConstructor(cons.entidad_padre).campo_codigo];
        setTimeout(function () {
          agregarListado(ventana,pet);
        }, 320);
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
  if(UI.buscarConstructor(entidad).entidad_hijo){
    cerrarFormulario(UI.buscarConstructor(entidad).entidad_hijo);
  }
  //si el formulario existe
  if(ventanaEditar.buscarSector('form'+entidad)){
    ventanaEditar.buscarSector('form'+entidad).nodo.classList.add('desaparecer');
    ventanaEditar.buscarSector('botonera '+entidad).nodo.classList.add('desaparecer');
  }
  //Si el listado de la entidad hijo existe
  cerrarListado(UI.buscarConstructor(entidad).entidad_hijo);
  setTimeout(function () {
    if(ventanaEditar.buscarSector('form'+entidad)){
      ventanaEditar.quitarSector('form'+entidad);
      ventanaEditar.quitarSector('botonera '+entidad);
    }
  }, 310);
}
function cerrarListado(entidad){
  var ventanaEditar = UI.buscarVentana("editarProductor");
  //Si el listado de la entidad hijo existe
  if(ventanaEditar.buscarSector('listado de '+entidad)){
      ventanaEditar.buscarSector('listado de '+entidad).nodo.classList.add('desaparecer');
  }
  setTimeout(function () {
    if(ventanaEditar.buscarSector('listado de '+entidad)){
      UI.quitarVentana('listado de '+entidad);
      ventanaEditar.quitarSector('listado de '+entidad);
    }
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
function desaparecerFormulariosHijos(entidad){
  var cons = UI.buscarConstructor(entidad);
  if(cons.entidad_hijo){
    desaparecerFormulariosHijos(cons.entidad_hijo);
    cerrarFormulario(cons.entidad_hijo);
  }
}
