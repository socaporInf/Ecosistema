  usuario =   {
    nombre: 'usuario',
    modulo: 'seguridad',
    campo_nombre: 'nombre',
    campo_codigo: 'nombre',
    titulo: 'Usuario',
    altura: 320,
    campos : [
      {
        tipo : 'campoDeTexto',
        parametros : {titulo:'Nombre',nombre:'codigo',tipo:'simple',eslabon:'simple',usaToolTip:true}
      },{
        tipo : 'campoDeTexto',
        parametros : {titulo:'Clave',nombre:'contrasena',tipo:'password',eslabon:'simple',usaToolTip:false}
      },{
        tipo : 'saltoDeLinea'
      },{
        tipo: 'comboBox',
        parametros : {
          nombre:'tipoUsuario',
          titulo:'Tipos de Usuario',
          eslabon : 'area',
          peticion : {
    			   modulo: "seguridad",
    			   entidad: "registroVirtual",
    			   operacion: "listar",
    			   nombre_tabla: "TIPO_USUARIO"
    			}
        }
      },{
        tipo : 'saltoDeLinea'
      },{
        tipo : 'campoDeTexto',
        parametros : {titulo:'Cedula',nombre:'cedula',tipo:'simple',eslabon:'simple',usaToolTip:true}
      },{
        tipo : 'campoDeTexto',
        parametros : {titulo:'Correo',nombre:'correo',tipo:'simple',eslabon:'simple',usaToolTip:true}
      },{
        tipo : 'saltoDeLinea'
      },{
        tipo : 'Radio',
        parametros : {
          nombre : 'estado',
          opciones : [
            {valor:'A',nombre:'Activo'},
            {valor:'I',nombre:'Inactivo'}
          ]
        }
      }
    ],
    botones:{
      nuevo:{
        quitar:['seguridad']
      },
      modificar: {
        agregar:[
          {
            tipo:'seguridad',
            click: function(boton){
              abrirFormSeg();
            }
          }
        ],
        quitar:[]
      }
    }
};
