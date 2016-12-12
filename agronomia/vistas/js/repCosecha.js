var form = {
  campos:[
    {
      tipo : 'campoBusqueda',
      parametros : {
        titulo:'Zona',
        nombre: 'zona',
        requerido:true,
        eslabon:'simple',
        peticion:{
           modulo: "agronomia",
           entidad: "zona",
           operacion: "buscar"
        },
        onclickSlot:function(campo){
          var campoDep = UI.buscarVentana('formRep').buscarSector('form').formulario.buscarCampo('finca');
          campoDep.atributos.peticion.codigo_zona = campo.captarValor();
          campoDep.habilitar();
          campoDep.limpiar();
        },
        cuadro: {nombre: 'listaZonas',mensaje: 'Cargando Zonas'}
      }
    },
    {
      tipo : 'campoBusqueda',
      parametros : {
        titulo:'Finca',
        nombre: 'finca',
        requerido:true,
        eslabon:'simple',
        peticion:{
          modulo: "agronomia",
          entidad: "finca",
          operacion: "buscarPorZona"
        },
        cuadro: {nombre: 'listafinca',mensaje: 'Cargando fincas'}
        }
    },
    {
      tipo : 'campoBusqueda',
      parametros : {
        titulo:'Municipio',
        nombre: 'municipio',
        requerido:true,
        eslabon:'simple',
        peticion:{
           modulo: "global",
           entidad: "municipio",
           operacion: "buscar"
        },
        cuadro: {nombre: 'listaMunicipio',mensaje: 'Cargando Municipios'}
      }
    },
    {
      tipo: 'radio',
      parametros : {
        nombre: 'agrupacion',
        titulo: 'Nivel de Detalle',
        eslabon : 'area',
        valor: 'T',
        opciones:[
          {nombre:'Resumido Total(Zona)',valor:'T'},
          {nombre:'Resumido(Finca)',valor:'R'},
          {nombre:'Detallado(Tablon)',valor:'D'}
        ]
      }
    },
    {
      tipo: 'radio',
      parametros : {
        nombre: 'presentacion',
        titulo: 'Presentación',
        eslabon : 'doble',
        valor: 'P',
        opciones:[
          {nombre:'PDF',valor:'P'},
          {nombre:'Excel',valor:'E'}
        ]
      }
    }
  ]
};
var Ministerio = {
  campos:[
    {
      tipo : 'campoBusqueda',
      parametros : {
        titulo:'Municipio',
        nombre: 'municipio',
        requerido:true,
        eslabon:'simple',
        peticion:{
           modulo: "global",
           entidad: "municipio",
           operacion: "buscar"
        },
        cuadro: {nombre: 'listaMunicipio',mensaje: 'Cargando Municipios'}
      }
    }
  ]
};
function construirUI(){
  var peticion = {
     modulo: "agronomia",
     entidad: "zafra",
     operacion: "buscarActivo"
  };
  torque.Operacion(peticion).then(function(res){
    UI.elementos.cabecera.agregarHTML('<article Zafra codigo="'+res.registro.codigo+'">Zafra: '+res.registro.nombre+'</article>');
  });
  var formRep = UI.agregarVentana({
    nombre:'formRep',
    tipo: 'ventana',
    clases: ['form-rep'],
    titulo: {
      tipo:'inverso',
      html:'Resumen Finca Estimado vs Real'
    },
    sectores:[
      {
        nombre:'form',
        tipo: 'nuevo',
        formulario: form
      },{
				nombre:'operaciones',
				html: '<button class="mat-text-but" ejecutar>Generar Reporte</button>'+
							'<button class="mat-text-but" limpiar>Limpiar</button>'
			}
    ]
  },document.body.querySelector('div[contenedor]'));
  formRep.buscarSector('form').formulario.buscarCampo('finca').deshabilitar();
  var botonera = formRep.buscarSector('operaciones').nodo;
  //PRIVILEGIO: operacion ejecutar
  if(sesion.privilegioActivo.buscarOperacion('ejecutar')){
    botonera.querySelector('button[ejecutar]').onclick= function(){
      ejecutar();
    };
  }
  botonera.querySelector('button[limpiar]').onclick= function(){
     UI.buscarVentana('formRep').buscarSector('form').formulario.limpiar();
     formRep.buscarSector('form').formulario.buscarCampo('finca').deshabilitar();
  };
  var formMinisterio = UI.agregarVentana({
    nombre:'formMinisterio',
    tipo: 'ventana',
    clases: ['form-rep'],
    titulo: {
      tipo:'inverso',
      html:'Resumen Ministerio'
    },
    sectores:[
      {
        nombre:'formMinisterio',
        tipo: 'nuevo',
        formulario: Ministerio
      },{
        nombre:'operaciones',
        html: '<button class="mat-text-but" ejecutar>Generar Reporte</button>'+
              '<button class="mat-text-but" limpiar>Limpiar</button>'
      }
    ]
  },document.body.querySelector('div[contenedor]'));
  if(sesion.privilegioActivo.buscarOperacion('ejecutar')){
    formMinisterio.buscarSector('operaciones').nodo.querySelector('button[ejecutar]').onclick= function(){
      ejecutarMinisterio();
    };
  }
}
function ejecutarMinisterio(){
  var ventanaCarga = UI.crearVentanaModal({
    cabecera:{
      html: 'Resumen Ministerio'
    },
    cuerpo:{html:''}
  });
  var peticion = {
     modulo: "agronomia",
     entidad: "reportesCosecha",
     reporte: 'ministerio',
     municipio: UI.buscarVentana('formMinisterio').buscarSector('formMinisterio').formulario.buscarCampo('municipio').captarValor(),
     zafra: UI.elementos.cabecera.nodo.querySelector('article').getAttribute('codigo')
  };
  var cuadro = {
    contenedor: ventanaCarga.partes.cuerpo.nodo,
    cuadro: {
      nombre: 'cargarReporteMinisterio',
      mensaje: 'Cargando Datos'
    }
  };
  torque.manejarOperacion(peticion,cuadro)
    .then(function(respuesta){
      generearCuadroSecundario();
      //id de la plantilla del reporte dentro jsreport(servidor de reportes)
      var datos = {
        reporte: {"shortid":"rkP2anaMe"},
        datosRep: {
         "estados" :organizarDatosMinisterio(respuesta.registros),
         "zafra": respuesta.zafra
        }
      };
      return datos;
    })
    .then(torque.pedirReporte)
    .then(done,error);
}
function ejecutar(){
  var ventanaCarga = UI.crearVentanaModal({
    cabecera:{
      html: 'Resumen Finca'
    },
    cuerpo:{html:''}
  });
  var form = UI.buscarVentana('formRep').buscarSector('form').formulario;
  var peticion = {
     modulo: "agronomia",
     entidad: "reportesCosecha",
     reporte: "resumenFinca",
     zona: form.buscarCampo("zona").captarValor(),
     finca: form.buscarCampo('finca').captarValor(),
     tipo: form.buscarCampo('agrupacion').captarValor(),
     municipio: form.buscarCampo('municipio').captarValor(),
     presentacion: form.buscarCampo('presentacion').captarValor()
  };
  var cuadro={
    contenedor: ventanaCarga.partes.cuerpo.nodo,
    cuadro:{
      nombre: 'carga reporte',
      mensaje: 'Cargando Datos'
    }
  };
  torque.manejarOperacion(peticion,cuadro)
    .then(generearCuadroSecundario)
    .then(function(respuesta){
      var datos = {};
      switch (UI.buscarVentana('formRep').buscarSector('form').formulario.buscarCampo('presentacion').captarValor()) {
        case 'P':
          switch (UI.buscarVentana('formRep').buscarSector('form').formulario.buscarCampo('agrupacion').captarValor()){
            case 'T':
              datos.reporte = {"shortid":"r1NEEf7Mg"};
              datos.datosRep = { "zonas" :organizarDatosResumenFinca('T',respuesta.registros)};
              break;
            case 'R':
              //id de la plantilla del reporte dentro jsreport(servidor de reportes)
              datos.reporte = {"shortid":"BkUi3un-g"};
              datos.datosRep = { "zonas" :organizarDatosResumenFinca('R',respuesta.registros)};
              break;
            case 'D':
              //id de la plantilla del reporte dentro jsreport(servidor de reportes)
              datos.reporte = {"shortid":"BJUZmtQzg"};
              datos.datosRep = { "zonas" :organizarDatosResumenFinca('D',respuesta.registros)};
              break;
          }
          break;
          case 'E':
            datos.reporte = {"shortid":"HJmzQumMx"};
            datos.datosRep = { "zonas" :organizarDatosResumenFinca('R',respuesta.registros)};
            datos.presentacion = 'E';
            break;
      }
      return datos;
    })
    .then(torque.pedirReporte)
    .then(done,error);
}
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
