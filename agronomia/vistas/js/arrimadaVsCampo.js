function construirUI(){
  var layOut = {};
  //contruir titulo
  layOut.ventTitulo = UI.agregarVentana({
    tipo: 'titulo',
    nombre: 'tituloGeneral',
    titulo:{
      html: 'Arrimada vs Campo <div opciones>settings</div>',
      tipo: 'basico'// liso o basico
    },
    clases : ['arrimada']
  },document.body.querySelector('div[contenedor]'));
  //contruir ventanas laterales
  layOut.latIzq = construirLat('izq','Arrimada',{
     modulo: "agronomia",
     entidad: "arriamadaVsCampo",
     operacion: "buscarValidacion"
  });
  layOut.latDer = construirLat('der','Campo',{
     modulo: "agronomia",
     entidad: "arriamadaVsCampo",
     operacion: "buscarValidacionRelacionada"
  });
  UI.elementos.layOut = layOut;
  var btn = layOut.ventTitulo.nodo.querySelector('div[opciones]');
  btn.onclick = function(){

  };
}
function construirLat(lado,titulo,petLista){
  var lateral = UI.agregarVentana({
    nombre:'lat'+lado,
    clases: ['ventana','lat-'+lado],
    sectores:[{
      nombre:'list'+lado,
      html:''
    },{
      nombre:'total'+lado,
      html:'<section totales>'+
              '<article total>Total Ton. Caña</article>'+
              '<article valor>90</article>'+
              '<article total>Total Ton. Azucar</article>'+
              '<article valor>90</article>'+
            '</section>'
    }]
  },document.body.querySelector('div[contenedor]'));

  var lista =   UI.agregarLista({
    titulo: titulo,
    clases: ['embebida'],
    campo_nombre: '',
    registrosPorPagina: 16,
    carga: {
      uso:true,
      peticion:petLista,
      espera:{
        cuadro:{
          nombre: 'buscalista'+lado,
          mensaje: 'Buscando ...'
        }
      }
    },
  },UI.buscarVentana('lat'+lado).buscarSector('list'+lado).nodo);

  return lateral;
}
