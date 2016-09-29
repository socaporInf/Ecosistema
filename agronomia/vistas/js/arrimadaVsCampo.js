function construirUI(){
  //contruir titulo
  var ventTitulo = UI.agregarVentana({
    tipo: 'titulo',
    nombre: 'tituloGeneral',
    titulo:{
      html: 'Arrimada vs Campo <div opciones>settings</div>',
      tipo: 'basico'// liso o basico
    },
    clases : ['arrimada']
  },document.body.querySelector('div[contenedor]'));
  //contruir ventanas laterales
  construirLat('izq','Arrimada');
  construirLat('der','Campo');

  var btn = ventTitulo.nodo.querySelector('div[opciones]');
  btn.onclick = function(){

  };
}
function construirLat(lado,titulo){
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
    carga: {
      uso:true,
      peticion:{
         modulo: "seguridad",
         entidad: "componente",
         operacion: "buscar"
      },
      espera:{
        cuadro:{
          nombre: 'buscalista',
          mensaje: 'Buscando ...'
        }
      }
    },
  },UI.buscarVentana('lat'+lado).buscarSector('list'+lado).nodo);

}
