//TODO: hacer validacion de los datos del dia y aprobarlos para que pasen al sistema
var form = {
  campos:[
    {
        tipo : 'campoBusqueda',
        parametros : {
          titulo:'Dia',
          nombre: 'fechadia',
          requerido:true,
          eslabon:'simple',
          peticion:{
             modulo: "agronomia",
             entidad: "validarCorreo",
             operacion: "buscarDia"
          },
          cuadro: {nombre: 'listaDias',mensaje: 'Cargando Dias'}
        }
    },{
      tipo : 'campoDeTexto',
      parametros : {
        titulo:'Registros por Pagina',nombre:'cantReg',tipo:'simple',eslabon:'simple',max: 3,valor: 40
      }
    }
  ]
};
function construirUI(){
  var formRep = UI.agregarVentana({
    nombre:'formRep',
    tipo: 'ventana',
    clases: ['form-rep'],
    titulo: {
      tipo:'inverso',
      html:'Parametros'
    },
    sectores:[
      {
        nombre:'form',
        tipo: 'nuevo',
        formulario: form
      },{
				nombre:'operaciones',
				html: '<button class="mat-text-but" ejecutar>Buscar Datos</button>'+
							'<button class="mat-text-but" limpiar>Limpiar</button>'
			}
    ]
  },document.body.querySelector('div[contenedor]'));
  var botonera = formRep.buscarSector('operaciones').nodo;
  //PRIVILEGIO: operacion consultar
  if(sesion.privilegioActivo.buscarOperacion('consultar')){
    botonera.querySelector('button[ejecutar]').onclick= function(){
      ejecutar();
    };
  }
  botonera.querySelector('button[limpiar]').onclick= function(){
     UI.buscarVentana('formRep').buscarSector('form').formulario.limpiar();
  };
}
function ejecutar(){
  var form = UI.buscarVentana('formRep').buscarSector('form').formulario;
  var operacion;
  var columnas;
  operacion = "mostrarDatosDia";
  columnas = '18';
  if(!UI.buscarVentana('listado')){
    crearListado(operacion,columnas,form);
  }else{
    var listado = UI.buscarVentana('listado');
    listado.atributos.carga.peticion.operacion = operacion;
    listado.atributos.carga.peticion.fechadia = form.buscarCampo('fechadia').captarValor();
    listado.registrosPorPagina = parseInt(form.buscarCampo('cantReg').captarValor()) || 40;
    listado.recargar();
  }
}
function crearListado(operacion,columnas,form){
  var lista = UI.agregarLista({
    titulo: 'Datos Validacion',
    nombre : 'listado',
    selector: 'apagado',
    clases: ['ventana','inversa','not-first','last','completo'],
    columnas: columnas,
    registrosPorPagina: parseInt(form.buscarCampo('cantReg').captarValor()) || 40,
    carga:{
      uso:true,
      peticion: {
         modulo: "agronomia",
         entidad: "validarCorreo",
         operacion: operacion,
         fechadia: form.buscarCampo('fechadia').captarValor()
      }
    },
    paginacion: {
      uso:false
    }
  },document.body.querySelector('div[contenedor]'));
}
function cerrarListado(){
  UI.quitarVentana('listado');
}
