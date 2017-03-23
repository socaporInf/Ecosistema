
function generearCuadroSecundario(respuesta){
  var contenedor = UI.elementos.modalWindow.buscarUltimaCapaContenido().partes.cuerpo.nodo;
  //------------Cuadro Carga-------------------------------
    cuadroCarga.contenedor.innerHTML='';
    var cuadroDeCarga = UI.crearCuadroDeCarga({
      nombre:'cargandoPDF1',
      mensaje:'Generando Archivo'
    },contenedor);
    cuadroDeCarga.style.marginTop = '80px';
  //-----------------------------------------------------------
  return respuesta;
}
var done = function(file){
  if(file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"){
    var vinculo = document.createElement('a');
    vinculo.href = window.URL.createObjectURL(file);
    vinculo.click();
    UI.elementos.modalWindow.eliminarUltimaCapa();
  }else if(file.type === 'application/pdf'){
    //cierro cuadro carga secundario
    UI.buscarCuadroCarga('cargandoPDF1').terminarCarga();
    //incrustar pdf en aplicacion
    var iframe = document.createElement('iframe');
    iframe.type = 'application/pdf';
    var enlace = window.URL.createObjectURL(file);
    iframe.src = enlace;
    var capa = UI.elementos.modalWindow.buscarUltimaCapaContenido();
    capa.nodo.classList.add('iframe');
    capa.nodo.classList.add('top');
    capa.nodo.classList.add("completo");
    capa.partes.cuerpo.nodo.appendChild(iframe);
    //agregar boton de cierre
    capa.partes.cabecera.agregarBotonCerrar();
  }
};
//callback si existe algun error
var error = function(error){
  console.log(error);
  var capa = UI.elementos.modalWindow.buscarUltimaCapaContenido();
  capa.convertirEnMensaje({
    titulo: 'Error en Carga de Reporte',
    cuerpo: 'Se ha sucitado un error en el momento de la generacion del reporte, intente de nuevo mas tarde',
    nombre_tipo:'ERROR'
  });
};
function agregarForm(formulario,nombre,titulo,ejecutarReporte){
  var form = UI.agregarVentana({
    nombre:'form'+nombre,
    tipo: 'ventana',
    clases: ['form-rep'],
    titulo: {
      tipo:'inverso',
      html:titulo
    },
    sectores:[
      {
        nombre:'form'+nombre,
        tipo: 'nuevo',
        formulario: formulario
      },{
        nombre:'operaciones',
        html: '<button class="mat-text-but" ejecutar>Generar Reporte</button>'+
              '<button class="mat-text-but" limpiar>Limpiar</button>'
      }
    ]
  },document.body.querySelector('div[contenedor]'));
  if(sesion.privilegioActivo.buscarOperacion('ejecutar')){
    form.buscarSector('operaciones').nodo.querySelector('button[ejecutar]').onclick= function(){
      ejecutarReporte();
    };
  }
}
