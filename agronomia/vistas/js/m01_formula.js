var nuevo1 = function(){
//obtnenemos el objeto maestro del objeto UI
  var maestro = UI.elementos.maestro;
  //activamos el proceso normal de modificacion
  maestro
    .nuevo()
    .then(function(){
      agregarbotonformula();
      maestro.forma.formulario.buscarCampo('tex_for').deshabilitar();
      maestro.forma.formulario.buscarCampo('val_for').deshabilitar();
    })
}; 

var consultarregistro = function(slot){
//obtnenemos el objeto maestro del objeto UI
  var maestro = UI.elementos.maestro;
  //activamos el proceso normal de modificacion
  maestro
    .consultar(slot)
    .then(function(){
      agregarbotonformula();
    })
}; 

var agregarbotonformula= function(){
  var elemento = UI.elementos.maestro.forma.formulario.campos[4];
  var div = document.createElement('div');
  div.setAttribute("area","");
  div.classList.add("group");
  div.innerHTML=''+
    '<h6>Generar Formula</h6>'+
    '<div class="columna-50">'+
      '<h6>Componentes</h6>'+
      '<select name="componentes" multiple id="componentes"> '+
        //'<option onclick="activarformula(this)" value="0">CAÑA</option>'+
      '</select>'+

    '</div>'+
    '<div class="columna-50">'+
      '<h6>Opciones</h6>'+
      '<select name="cformula" id="formula" multiple>'+
        '<option onclick="activarformula(this)" value="1">1</option>'+
        '<option onclick="activarformula(this)" value="2">2</option>'+
        '<option onclick="activarformula(this)" value="3">3</option>'+
        '<option onclick="activarformula(this)" value="(">(</option>'+
        '<option onclick="activarformula(this)" value=")">)</option>'+
        '<option onclick="activarformula(this)" value="4">4</option>'+
        '<option onclick="activarformula(this)" value="5">5</option>'+
        '<option onclick="activarformula(this)" value="6">6</option>'+
        '<option onclick="activarformula(this)" value="*">*</option>'+
        '<option onclick="activarformula(this)" value="/">/</option>'+
        '<option onclick="activarformula(this)" value="7">7</option>'+
        '<option onclick="activarformula(this)" value="8">8</option>'+
        '<option onclick="activarformula(this)" value="9">9</option>'+
        '<option onclick="activarformula(this)" value="+">+</option>'+
        '<option onclick="activarformula(this)" value="-">-</option>'+
        '<option style="width:35.3%;" onclick="eliminar()" value="borrar">borrar</option>'+
        '<option onclick="activarformula(this)" value="0">0</option>'+
        '<option style="width:35.2%;" onclick="eliminar_total()"  value="probar">borra total</option>'+
      '</select>'+
    '</div>';
    elemento.nodo.parentNode.appendChild(div);

    //armo la peticion
    peticion={
      modulo: "agronomia",
      entidad: "m01componente",
      operacion: "valor-componente",
    }
    console.log("armado de componentes");
    //ejecuto la peticion y traigo los componentes para generar formula
    torque.Operacion(peticion)
      .then(function(registro){
        //console.log(registro);
        html='';
        for (var i = 0; i < registro.registros.length; i++) {
          html+='<option onclick="activarformula(this)" value="'+registro.registros[i].valor+'">'+registro.registros[i].nombre+'</option> ';
        }
        var elemento = document.querySelectorAll('#componentes');
        elemento[elemento.length -1].innerHTML=html;
    });
}


  //agrega los valores a la formula
  var formulafinal=[]; 
  var valformula=[]; 
  function activarformula(este){
    formulafinal.push(este.textContent);
    valformula.push(este.value);
    document.forms[0].tex_for.value += este.textContent;
    document.forms[0].val_for.value += este.value;
  }

  //elimina caracter por caracter agregado a la formula
  function eliminar(){
    formulafinal.pop();
    valformula.pop();
    //console.log(formula);
    document.forms[0].tex_for.value='';
    document.forms[0].val_for.value='';
    for (var i = 0; i < formulafinal.length; i++) {
      document.forms[0].tex_for.value += formulafinal[i];
      document.forms[0].val_for.value += valformula[i];
    }
  }

  //limpia la el campo formula
  function eliminar_total(){
    document.forms[0].tex_for.value='';
    document.forms[0].val_for.value='';
  }
