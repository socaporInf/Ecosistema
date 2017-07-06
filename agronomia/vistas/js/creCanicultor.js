function construirUI(){
  UI.maestro = {};
  maestro = UI.maestro;
  maestro.ventana = UI.agregarVentana({
    nombre: 'titulo',
    titulo:{
            html: 'Credito Cañicultor por Organizacion ',
            tipo: 'inverso'// liso o basico
          },
    sectores:[{
        nombre:'formulario',//el nombre que desees
        formulario: UI.buscarConstructor('creCanicultor'),
        //tambien se le puede agregar el founcionamiento
        //de modificar con las 2 condiciones
        tipo:'nuevo'
      },{
      nombre: 'grid', //puede ser lo que sea
      html:htmlprint
    },{
      nombre:'botonera',
      html:'<button type="button" nombre = "exportar" class="botonCreCanicultor">Exportar SQLFigo</button> <button type="button" id="importar" nombre="importar" class="botonCreCanicultor">Importar SQLFigo</button>'
    }]
  },document.querySelector('div[contenedor]'));

}

  var htmlprint = '<table>'+
          '<tr>'+
            '<td>Garantia</td>'+
            '<td>Peso (FIGO)</td>'+
            '<td>Peso (Agr)</td>'+
            '<td>Factor (FIGO)</td>'+
            '<td>Factor (Agr)</td>'+
            '<td>Toneladas (Estimadas)</td>'+
            '<td>Monto (Bs)</td>'+
            '<td>Seleccione</td>'+
          '</tr>'+
          '<tr>'+
            '<td>Garantia 1</td>'+
            '<td></td>'+
            '<td></td>'+
            '<td></td>'+
            '<td></td>'+
            '<td></td>'+
            '<td></td>'+
            '<td><input type="checkbox"/></td>'+
          '</tr>'+
          '<tr>'+
            '<td>Garantia 2</td>'+
            '<td></td>'+
            '<td></td>'+
            '<td></td>'+
            '<td></td>'+
            '<td></td>'+
            '<td></td>'+
            '<td><input type="checkbox"/></td>'+
          '</tr>'+
          '<tr>'+
            '<td>Garantia 3</td>'+
            '<td></td>'+
            '<td></td>'+
            '<td></td>'+
            '<td></td>'+
            '<td></td>'+
            '<td></td>'+
            '<td><input type="checkbox"/></td>'+
          '</tr>'+
        '</table>';