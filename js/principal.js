/**
 * Autor: Esteban Aqiono
 * Fecha: 30/09/2018
 * Descripcion: Funciones de la pantalla principal
 */
$.ready(inicializaPrincipal());

function inicializaPrincipal() {
    // verificar si tiene session abierta
    validadSesion();
    //cargar_formulario('frm/dashboard');
    cargar_formulario('frm/DashVentasMarcas');
    $('#nombre_usuario').text(datosUsuario('nombre'));
    $('#log_out').on('click',function(){
        sessionStorage.setItem("datos_usuario", "");
        location.href = "index.html";
    });
}

