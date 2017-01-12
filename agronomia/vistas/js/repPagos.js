function construirUI(){
  var peticion = {
     modulo: "agronomia",
     entidad: "zafra",
     operacion: "buscarActivo"
  };
  torque.Operacion(peticion).then(function(res){
    UI.elementos.cabecera.agregarHTML('<article Zafra codigo="'+res.registro.codigo+'">Zafra: '+res.registro.nombre+'</article>');
  });
  //form resumen finca
  agregarForm(form,'Liquidacion','Liquidacion Semanal',ejecutar);
}
function ejecutar(){
  var ventanaCarga = UI.crearVentanaModal({
    cabecera:{
      html: 'Liquidacion Semanal'
    },
    cuerpo:{html:''}
  });
  var peticion = UI.juntarObjetos({
     modulo: "agronomia",
     entidad: "reportesPagos",
     reporte: "liquidacionNucleo",
     zafra: UI.elementos.cabecera.nodo.querySelector('article').getAttribute('codigo')
  },UI.buscarVentana('formTransporte').buscarSector('formTransporte').formulario.captarValores());
  var cuadro = {
    contenedor: ventanaCarga.partes.cuerpo.nodo,
    cuadro: {
      nombre: 'cargarReporteLiquidacion',
      mensaje: 'Cargando Datos',
    }
  };
  torque.manejarOperacion(peticion,cuadro)
    .then(function(respuesta){
      generearCuadroSecundario();
      //id de la plantilla del reporte dentro jsreport(servidor de reportes)
      console.log(respuesta);

      //return datos;
    });
    //.then(torque.pedirReporte)
    //.then(done,error);
}
