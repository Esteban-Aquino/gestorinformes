/**
 * Autor: Esteban Aqiono
 * Fecha: 30/09/2018
 * Descripcion: Funciones del Dashboard
 */
$.ready(inicializa());
function inicializa() {
    validadSesion();
    cargar();
    Repetir();
    
    $('#ventas_dia').on('click',function(){
        cargar_formulario('frm/ventas');
    });
    $('#ventas_ayer').on('click',function(){
        cargar_formulario('frm/ventas_ayer');
    });
}
function cargar(){
    console.log("Cargando");
    GetVentasDia();
    GetVentasAyer();
}
function Repetir() {
    setInterval("cargar()", 30000);
}
function GetVentasDia(){
    var pUrl= 'api/getventasdia';
    var pBeforeSend = "";
    var pSucces = "GetVentasDiaSuccess(json)";
    var pError = "ajax_error()";
    var pComplete = "";
    //console.log("enviando-func");
    ajaxGet(pUrl, pBeforeSend, pSucces, pError, pComplete);
}
function GetVentasDiaSuccess(json){
    //console.log("recibiendo");
    //console.log(json['existencia'].VENTAS_HOY);
    var ventas_dia = json['existencia'][0].VENTAS_HOY|| 0;
    var ventas_ani_past = json['existencia'][0].VENTAS_ANIO_PAST|| 0;
    var proc_ventas_dia = json['existencia'][0].PORC|| 0;
    var ventas_dia_ani_past = json['existencia'][0].VENTAS_ANIO_PAST|| 0;
    var vcolor;
    var vflecha;
    if (parseInt(ventas_dia)>parseInt(ventas_ani_past)){
        vcolor = 'green';
        vflecha = 'fa fa-sort-asc';
    }else if(parseInt(ventas_dia)<parseInt(ventas_ani_past)){
        vcolor = 'red';
        vflecha = 'fa fa-sort-down';
    } else{
        vcolor = 'grey';
        vflecha = 'fa fa-unsorted';
    }
    
    if (parseInt(proc_ventas_dia) > 500){
        proc_ventas_dia = "+500";
    }
    
    $('#monto_ventas_dia').text(ventas_dia);
    $('#porc_ventas_dia').text(proc_ventas_dia+'%');
    $('#monto_ventas_dia_anio_past').text(ventas_dia_ani_past);
    
    $('#ventas_dia_color').removeClass();
    $('#ventas_dia_color').addClass(vcolor);
    $('#ventas_dia_flecha').removeClass();
    $('#ventas_dia_flecha').addClass(vflecha);
    console.log("Ventas Dia Cargado");
}
// Ayer
function GetVentasAyer(){
    var pUrl= 'api/getventasayer';
    var pBeforeSend = "";
    var pSucces = "GetVentasAyerSuccess(json)";
    var pError = "ajax_error()";
    var pComplete = "";
    //console.log("enviando-func");
    ajaxGet(pUrl, pBeforeSend, pSucces, pError, pComplete);
}
function GetVentasAyerSuccess(json){
    //console.log("recibiendo");
    //console.log(json['existencia'].VENTAS_HOY);
    var ventas_dia = json['existencia'][0].VENTAS_AYER|| 0;
    var ventas_ani_past = json['existencia'][0].VENTAS_ANIO_PAST|| 0;
    var proc_ventas_dia = json['existencia'][0].PORC|| 0;
    var ventas_dia_ani_paso = json['existencia'][0].VENTAS_ANIO_PAST|| 0;
    var vcolor;
    var vflecha;
    if (parseInt(ventas_dia)>parseInt(ventas_ani_past)){
        vcolor = 'green';
        vflecha = 'fa fa-sort-asc';
    }else if(parseInt(ventas_dia)<parseInt(ventas_ani_past)){
        vcolor = 'red';
        vflecha = 'fa fa-sort-down';
    } else{
        vcolor = 'grey';
        vflecha = 'fa fa-unsorted';
    }
    
    if (parseInt(proc_ventas_dia) > 500){
        proc_ventas_dia = "+500";
    }
    
    $('#monto_ventas_ayer').text(ventas_dia);
    $('#porc_ventas_ayer').text(proc_ventas_dia+'%');
    $('#monto_ventas_ayer_anio_past').text(ventas_dia_ani_paso);
    
    $('#ventas_ayer_color').removeClass();
    $('#ventas_ayer_color').addClass(vcolor);
    $('#ventas_ayer_flecha').removeClass();
    $('#ventas_ayer_flecha').addClass(vflecha);
    console.log("Ventas Ayer Cargado");
}

