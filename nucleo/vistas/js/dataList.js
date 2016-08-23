function construirUI(){
  var lista = UI.agregarLista({
    titulo: 'dataList',
    clases: ['ventana','inversa'],
    columnas: "3",
    carga:{
      uso:true,
      peticion:{
         modulo: "seguridad",
         entidad: "componente",
         operacion: "buscar"
      }
    },
    paginacion: {
      uso:false
    }
  },document.body.querySelector('div[contenedor]'));
}
