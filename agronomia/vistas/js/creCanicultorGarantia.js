function construirUI(){
  var ventana = UI.agregarVentana({
      nombre: 'titulo',
      titulo:{
        html: 'Credito Cañicultor por Garantia',
        tipo: 'inverso'// liso o basico
      },
    sectores:[{
        nombre:'formulario',//el nombre que desees
        formulario: UI.buscarConstructor('creCanicultorGarantia'),
        //tambien se le puede agregar el founcionamiento
        //de modificar con las 2 condiciones
        tipo:'nuevo'
      },{
      nombre: 'grid', //puede ser lo que sea
      html:''
    },{
      nombre:'botonera',
      html:'<button type="button" nombre = "exportar" class="botonCreCanicultor">Exportar SQLFigo</button>'
            //'<button type="button" id="importar" nombre="importar" class="botonCreCanicultor">Importar SQLFigo</button>'
    }]
  },document.querySelector('div[contenedor]'));
  
  var grid = new Grid();
  //UI.servidor = new Servidor();
  ventana.buscarSector('grid').nodo.appendChild(grid.nodo);
  ventana.buscarSector('grid').grid = grid;
}


function actualizar(campo){
  //alert(campo.captarValor());
  peticion={
    modulo: "agronomia",
    entidad: "crecanicultor",
    operacion: "buscar_organizaciones",
    id_bus: campo.captarValor()
  }

  torque.Operacion(peticion)
    .then(function(registro){
      console.log(registro);
      //var arreglo = Object.keys(registro['registros']).map(x => registro['registros'][x]);
      //var can=arreglo.length;
      var ventana = UI.buscarVentana('titulo');
      ventana.buscarSector('grid').grid.removerHijos();
      ventana.buscarSector('grid').grid.agregarHijos(registro.registros);
  });
}

var Grid = function(atributos){
  var yo = this;
  yo.atributos = atributos || {};
  
  yo.cabecera =  '<tr>'+
      '<td>#</td>'+
      '<td>Rif</td>'+
      '<td>Organizacion</td>'+
      '<td>Peso (FIGO)</td>'+
      '<td>Factor (FIGO)</td>'+
      '<td>Peso (Agr)</td>'+
      '<td>Factor (Agr)</td>'+
      '<td>Toneladas (Estimadas)</td>'+
      '<td>Monto (Bs)</td>'+
      '<td>Seleccione</td>'+
    '</tr>';
  yo.hijos = [];
  yo.nodo=null;

  yo.construir();
}

Grid.prototype.construir = function(){
  var nodo = document.createElement('table');
  nodo.innerHTML= this.cabecera;
  this.nodo=nodo;
  if(this.atributos.hijos){
    this.agregarHijos(this.atributos.hijos);
  }
};

Grid.prototype.agregarHijos = function(hijos){
  var yo = this;
  if (hijos){
    hijos.forEach(function(hijo){
      var newHijo = new Hijo(hijo);
      yo.nodo.appendChild(newHijo.nodo);
      yo.hijos.push(newHijo);
    });
  }
};

Grid.prototype.buscarHijo = function(propiedad,valor){
  var yo = this;
  var resultado = false;
  yo.hijos.forEach(function(hijo){
    if(!hijo.atributos.hasOwnProperty(propiedad)){
      console.error('no existe la propiedad '+propiedad+' para los hijos');
    }else{
      if(hijo.atributos[propiedad] == valor){
        resultado = hijo;
      }
    }
  });
  return resultado;
}

Grid.prototype.removerHijos = function(){
  var yo = this;
  yo.hijos.forEach(function(hijo){
    hijo.nodo.parentNode.removeChild(hijo.nodo);
  });
  yo.hijos = [];
}

Grid.prototype.removerHijo = function(propiedad,valor){
  var yo = this;
  var hijo = yo.buscarHijo(propiedad,valor);
  if(hijo){
    hijo.nodo.parentNode.removeChild(hijo.nodo);
    yo.hijos.splice(yo.hijos.indexOf(hijo),1);
  }
}

var Hijo = function(objeto){
  var yo = this;
  yo.nodo = null;
  yo.atributos = objeto;
  
  yo.crear();
}

Hijo.prototype.crear = function(){
  var yo = this;
  var tr = document.createElement('tr');
  tr.innerHTML = '<td>'+yo.atributos.numero+'</td>'+
  '<td>'+yo.atributos.rif+'</td>'+
  '<td>'+yo.atributos.nombre+'</td>'+
  '<td>'+yo.atributos.peso_figo+'</td>'+
  '<td>'+yo.atributos.factor_figo+'</td>'+
  '<td>'+yo.atributos.peso_agro+'</td>'+
  '<td></td>'+
  '<td>'+yo.atributos.ton_est+'</td>'+
  '<td></td>'+
  '<td><input type="checkbox" name="pasar"></td>';
  yo.nodo = tr;
}

