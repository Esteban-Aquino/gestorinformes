/**
 * Autor: Esteban Aqiono
 * Fecha: 30/09/2018
 * Descripcion: Funciones del Login y varias del sistema
 */
/********* INDEX LOGGIN *********/
function inicializaLogin() {
    // verificar si tiene session abierta
    var usr = datosUsuario("usuario");
    //console.log(usr);
    if (usr !== null && usr !== "") {
        //console.log("nulo");
        location.href = "principal.html";
    }
    //cerrarSessionAjax();
    $("#usuario").focus();
    siguienteCampo('#usuario', '#clave', false);
    siguienteCampo('#clave', '#btn-ingresar button', false);
}

function validarLoggin() {
    var vusuario = $("#usuario").val();
    var vclave = $("#clave").val();
    if (vusuario.trim() === '') {
        mensaje('Ingrese usuario', 'Aceptar', '#usuario_usuario');
        $("#usuario_usuario").focus();
    } else if (vclave.trim() === '') {
        mensaje('Contraseña Invalida', 'Aceptar', '#clase_usuario');
        $("#clave_usuario").focus();
    } else {
        validarAccesoAjax();
        //location.href = "menu.html";
    }
    ;
}

function validarAccesoAjax() {
    var pDatosFormulario = JSON.stringify(getFormData($('#formAcceso')));//$('#formAcceso');
    //console.log(pDatosFormulario);
    var pUrl = 'api/validar';
    var pBeforeSend = "";
    var pSucces = "ValidarAccesoAjaxSuccess(json)";
    var pError = "ajax_error()";
    var pComplete = "";
    ajax(pDatosFormulario, pUrl, pBeforeSend, pSucces, pError, pComplete);
}

function ajax(pDatosFormulario, pUrl, pBeforeSend, pSucces, pError, pComplete) {
    var usr = new Object();
    usr.usuario = datosUsuario('usuario');
    //console.log("enviando-ajax");
    //console.log(usr);
    eval(pBeforeSend);
    $.ajax({
        type: 'POST',
        url: pUrl,
        data: pDatosFormulario,
        dataType: 'json',
        headers: usr
    }).done(function (json) {
        eval(pSucces);
    }).fail(function (e) {
        eval(pSucces);
    }).always(function (objeto, exito, error) {
        eval(pComplete);
    });
}

function ajaxGet(pUrl, pBeforeSend, pSucces, pError, pComplete) {
    var usr = new Object();
    usr.usuario = datosUsuario('usuario');
    //console.log("enviando-ajax");
    //console.log(usr);
    eval(pBeforeSend);
    $.ajax({
        type: 'GET',
        url: pUrl,
        dataType: 'json',
        headers: usr
    }).done(function (json) {
        eval(pSucces);
    }).fail(function (e) {
        eval(pSucces);
    }).always(function (objeto, exito, error) {
        eval(pComplete);
    });
}

function ValidarAccesoAjaxSuccess(json) {
    //console.log("Recibiendo");
    //console.log(datos_usuario);
    if (json.acceso) {
        // guardar en storage
        var datos_usuario = new Object();
        datos_usuario["nombre_usuario"] = json.datos_usuario[0].NOMBRE_USUARIO;
        datos_usuario["cod_usuario"] = json.datos_usuario[0].COD_USUARIO;
        sessionStorage.setItem("datos_usuario", JSON.stringify(datos_usuario));
        location.href = "principal.html";
        console.log("Ok");
    } else {
        sessionStorage.setItem("datos_usuario", "");
        console.log("Fail");
        mensaje('Credenciales Invalidas', 'Aceptar', '#usuario_usuario');
    }
    ;
}

function ajax_error() {
    mensaje('No se puede conectar a la Base de datos', 'Aceptar', '');
}

function siguienteCampo(actual, siguiente, preventDefault) {
    $(actual).on('keydown', function (event) { // funcion callback , anonima
        //console.log("---> " + event.which);
        if (event.which === 13) {
            if (preventDefault) {
                event.preventDefault();
            }
            $(siguiente).focus();
            $(siguiente).select();
        }
    });
}

function mensaje(mensaje, textoBoton, focusCampo) {
    // 1. Agregar al final un div con id=mensajes al body
    $('body').append('<div id="mensajes"></div>');
    // 2. Se guarda el contenido del componente en una variable -> modal
    modal = '<div id="divModal" class="modal fade" tabindex="-1" role="dialog" ';
    modal += '     aria-labelledby="gridSystemModalLabel">';
    modal += '<div class="modal-dialog" role="document">';
    modal += '<div class="modal-content">';
    modal += '  <div class="modal-header">';
    modal += '    <button type="button" class="close" data-dismiss="modal" ';
    modal += '            aria-label="Close"><span aria-hidden="true">&times;</span></button>';
    modal += '    <h4 class="modal-title" id="gridSystemModalLabel">Mensaje del Sistema</h4>';
    modal += '  </div>';
    modal += '  <div class="modal-body">';
    modal += '     ' + mensaje;
    modal += '  </div>';
    modal += '  <div class="modal-footer">';
    modal += '    <button id="botonAceptar" type="button" class="btn btn-primary"';
    modal += '            data-dismiss="modal">' + textoBoton + '</button>';
    modal += '  </div>';
    modal += '</div>';
    modal += '</div>';
    modal += '</div>';
    // 3. Insertar el contenido de la variable modal en el div mensajes
    $('#mensajes').html(modal);
    // 4. Mostar el modal
    $('#divModal').modal('show');
    // 5. Cuando se visualiza todo el modal lleva el cursor al boton Aceptar
    $('#divModal').on('shown.bs.modal', function (e) {
        $('#botonAceptar').focus();
    });
    // 6. Cuando se oculta el modal se lleva el foco al campo que se recibio como parametro
    $('#divModal').on('hidden.bs.modal', function (e) {
        $(focusCampo).focus();
        $(focusCampo).select();
        // 7. Remueve el div mensajes del body
        $('#mensajes').remove();
    });
}

function estaSeguro(mensaje, accion, focusCampo) {
    // 1. Agregar al final un div con id=mensajes al body
    $('body').append('<div id="estaSeguro"></div>');
    // 2. Se guarda el contenido del componente en una variable -> modal
    modal = '<div id="divModalEstaSeguro" class="modal fade" tabindex="-1" role="dialog" ';
    modal += '     aria-labelledby="gridSystemModalLabel">';
    modal += '<div class="modal-dialog" role="document">';
    modal += '<div class="modal-content">';
    modal += '  <div class="modal-header">';
    modal += '    <button type="button" class="close" data-dismiss="modal" ';
    modal += '            aria-label="Close"><span aria-hidden="true">&times;</span></button>';
    modal += '    <h4 class="modal-title" id="gridSystemModalLabel">Mensaje del Sistema</h4>';
    modal += '  </div>';
    modal += '  <div class="modal-body">';
    modal += '     ' + mensaje;
    modal += '  </div>';
    modal += '  <div class="modal-footer">';
    modal += '    <button id="botonSi" type="button" class="btn btn-primary"';
    modal += '            data-dismiss="modal">Si</button>';
    modal += '    <button id="botonNo" type="button" class="btn btn-primary"';
    modal += '            data-dismiss="modal">No</button>';
    modal += '  </div>';
    modal += '</div>';
    modal += '</div>';
    modal += '</div>';
    // 3. Insertar el contenido de la variable modal en el div mensajes
    $('#estaSeguro').html(modal);
    // 4. Mostar el modal
    $('#divModalEstaSeguro').modal('show');
    // 5. Cuando se visualiza todo el modal lleva el cursor al boton Aceptar
    $('#divModalEstaSeguro').on('shown.bs.modal', function (e) {
        $('#botonNo').focus();
    });
    // 6. Cuando se oculta el modal se lleva el foco al campo que se recibio como parametro
    $('#divModalEstaSeguro').on('hidden.bs.modal', function (e) {
        $(focusCampo).focus();
        $(focusCampo).select();
        // 7. Remueve el div mensajes del body
        $('#estaSeguro').remove();
    });
    // eventos a si y no
    $('#botonSi').on('click', function () {
        eval(accion);
    });

}

function mostrar_foto($this) {
    //console.log($this.attr("src"));
    mostrar_imagen($this.attr("src"), "Imagen de Usuario");
}

function mostrar_imagen(pfoto, pDesc) {
    // 1. Agregar al final un div con id=mensajes al body
    $('body').append('<div id="mensajes"></div>');
    // 2. Se guarda el contenido del componente en una variable -> modal
    modal = '<div id="divModal" class="modal fade" tabindex="-1" role="dialog" ';
    modal += '     aria-labelledby="gridSystemModalLabel">';
    modal += '<div class="modal-dialog" role="document">';
    modal += '<div class="modal-content">';
    modal += '  <div class="modal-header">';
    modal += '    <button type="button" class="close" data-dismiss="modal" ';
    modal += '            aria-label="Close"><span aria-hidden="true">&times;</span></button>';
    modal += '    <h4 class="modal-title" id="gridSystemModalLabel">' + pDesc + '</h4>';
    modal += '  </div>';
    modal += '  <div class="modal-body centrado">';
    modal += '      <img src="' + pfoto + '" height="350" alt="" class="img-circle"/>';
    modal += '  </div>';
    modal += '  <div class="modal-footer">';
    modal += '    <button id="botonAceptar" type="button" class="btn btn-primary"';
    modal += '            data-dismiss="modal">Cerrar</button>';
    modal += '  </div>';
    modal += '</div>';
    modal += '</div>';
    modal += '</div>';
    // 3. Insertar el contenido de la variable modal en el div mensajes
    $('#mensajes').html(modal);
    // 4. Mostar el modal
    $('#divModal').modal('show');
    // 5. Cuando se visualiza todo el modal lleva el cursor al boton Aceptar
    $('#divModal').on('shown.bs.modal', function (e) {
        $('#botonAceptar').focus();
    });
    // 6. Cuando se oculta el modal se lleva el foco al campo que se recibio como parametro
    $('#divModal').on('hidden.bs.modal', function (e) {
        // 7. Remueve el div mensajes del body
        $('#mensajes').remove();
    });
}

function getFormData($form) {
    var unindexed_array = $form.serializeArray();
    var indexed_array = {};

    $.map(unindexed_array, function (n, i) {
        indexed_array[n['name']] = n['value'];
    });

    return indexed_array;
}

function cargar_formulario(frm) {
    //$('#boton-menu').click();
    //"restrict mode";
     /*$("#main_container").fadeOut(0, function () {
     $("#main_container").load(frm);
     $("#main_container").fadeIn(800, function () {});
     });*/
    $("#formulario").fadeOut(0, function () {
        $.get(frm, function (htmlexterno) {
            $("#formulario").html(htmlexterno);
            $("#formulario").fadeIn(800, function () {});
        });
    });

    /*
     $("#busquedas").remove();
     $("#formularios").load(frm);
     */
}

function salir_formulario() {
    $("#formularios").html("");
}

function siguiente(funcion) {
    var pag = Number($("#pagina").val());
    $("#pagina").val(pag + 1);
    eval(funcion);
}

function anterior(funcion) {
    var pag = Number($("#pagina").val());
    if (pag - 1 > 0) {
        console.log(pag - 1);
        $("#pagina").val(pag - 1);
    }
    eval(funcion);
}

function formatoGs() {
    $('.gs').priceFormat({
        prefix: '',
        centsSeparator: ',',
        thousandsSeparator: '.',
        centsLimit: 0,
        allowNegative: false
    });
}

function validadSesion(){
    // verificar si tiene session abierta
    var usr = datosUsuario('usuario');
    //console.log(usr);
    if (usr===null||usr===""){
        location.href = "index.html";
    }
}

function datosUsuario(tipo){
    var usr = sessionStorage.getItem("datos_usuario");
    if (usr===null||usr===""){
        return "";
    } else {
        if (tipo==="usuario"){
            return JSON.parse(usr).cod_usuario;
        } else if (tipo==="nombre") {
           return JSON.parse(usr).nombre_usuario; 
        } else {
            return "";
        }
    }
}