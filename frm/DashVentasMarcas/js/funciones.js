/**
 * Autor: Esteban Aqiono
 * Fecha: 9/10/2018
 * Descripcion: Funciones del Dashboard Ventas por marca
 */
$.ready(inicializa());
function inicializa() {
    validadSesion();
    var date = new Date();
    $('#fec_desde').val(moment(new Date(date.getFullYear(), date.getMonth(), 1)).format("YYYY-MM-DD"));
    $('#fec_hasta').val(moment(new Date(date.getFullYear(), date.getMonth() + 1, 0)).format("YYYY-MM-DD"));
    aplicarFiltros();
}
function cargar() {
    console.log("Cargando");
    GetVentas();
}

function aplicarFiltros(){
    $('#kpi-card').html('');
    $('#cargando-ventas-ayer').removeClass('oculto');
    cargar();
}
function Repetir() {
    setInterval("cargar()", 30000);
}
function GetVentas() {
    var fec_desde = moment($('#fec_desde').val()).format('DD/MM/YYYY');
    var fec_hasta = moment($('#fec_hasta').val()).format('DD/MM/YYYY');
    var pUrl = 'api/getventasmarca?fec_desde=' + fec_desde + '&fec_hasta=' + fec_hasta;
    var pBeforeSend = "";
    var pSucces = "GetVentasSuccess(json)";
    var pError = "ajax_error('Error al buscar ventas por marca')";
    var pComplete = "";
    //console.log(pUrl);
    ajaxGet(pUrl, pBeforeSend, pSucces, pError, pComplete);
}
function GetVentasSuccess(json) {
    if (json['estado'] === "Error") {
        ajax_error(json['mensaje']);
    } else {
        var jsonDatos = json['datos'];
        var codigo, marca, ventas, proc_ventas, proc_ant;
        $('#kpi-card').html("");
        $.each(jsonDatos, function (key, value) {
            //console.log(value.MARCA);
            codigo = value.COD_MARCA;
            marca = value.MARCA;
            ventas = Math.round((parseInt(value.VENTAS) / 1000000) * 100) / 100||0;
            proc_ventas = Math.round(parseInt(value.PORC))||0;
            proc_ant = Math.round(((parseInt(value.VENTAS_ANIO_PAST) / 1000000) * 100)) / 100||0;

            if (parseInt(proc_ventas) > 500) {
                proc_ventas = "+500";
            }
            genera_kpi(codigo, marca, ventas, proc_ventas, proc_ant, '#kpi-card','frm/ventasRubro');
            
            //console.log("Ventas Dia Cargado");
        });
        $('#cargando-ventas-ayer').addClass('oculto');
    }
}

function params($dato,frm){
    
    var marca = $dato.find('#codigo').text();
    var desc_marca = $dato.find('.count_top b').text();
    var fec_desde = $('#fec_desde').val();
    var fec_hasta = $('#fec_hasta').val();
    
    var params = {
        cod_marca: marca,
        desc_marca: desc_marca,
        fec_desde: fec_desde,
        fec_hasta: fec_hasta
    };
    sessionStorage.setItem('ventasRubro',JSON.stringify(params));
    cargar_formulario(frm);
}
// Ayer
function genera_kpi(codigo,titulo, monto, porc, monto_ant, selector, frm) {
    var vcolor, vflecha, vfrm;
    vfrm = frm||'N';
    if (monto > monto_ant) {
        vcolor = 'green';
        vflecha = 'fa fa-sort-asc';
    } else if (monto < monto_ant) {
        vcolor = 'red';
        vflecha = 'fa fa-sort-down';
    } else {
        vcolor = 'grey';
        vflecha = 'fa fa-unsorted';
    }
    if (vfrm !== 'N'){
        vfrm = `onclick="params($(this),'`+vfrm+`')"`;
    }else{
        vfrm = '';
    }

    var vkpi_template = `<div class="col-md-2 col-sm-4 col-xs-6 tile_stats_count" `+vfrm+`>
                            <div id="` + codigo + `" class="x_panel" >
                                <label id="codigo" class="oculto">`+codigo+`</label>
                                <div class="x_title">
                                    <span class="count_top"> <b>` + titulo.toUpperCase() + `</b></span>
                                </div>
                                <div id="div-ventas" class="centrado">
                                    <div id="monto_` + titulo.replace(/ /g, '') + `" class="count">` + monto + `</div>
                                    <div><span class="count_bottom"> Millones de Gs</span></div>
                                    <div>
                                        <span class="count_bottom centrado">
                                            <i id="ventas_` + titulo.replace(/ /g, '') + `_color" class="` + vcolor + `">
                                                <i id="ventas_` + titulo.replace(/ /g, '') + `_flecha" class="` + vflecha + `"></i>
                                                <label id="porc_ventas_` + titulo.replace(/ /g, '') + `">` + porc + `%</label> </i>
                                        </span>
                                    </div>   
                                </div>
                                <div class="divider"></div>
                                <div id="div-ventas-ayer-past" class="centrado">
                                    <span class="count_bottom">
                                        <i>Año Pasado: <label id="monto_ventas_` + titulo.replace(/ /g, '') + `_anio_past">` + monto_ant + `</label></i>
                                    </span>
                                </div>
                            </div>
                        </div>`;
    $(selector).append(vkpi_template);
    
}


$('.toma-fecha').daterangepicker({
    singleDatePicker: true,
    singleClasses: "picker_4"
}, function (start, end, label) {
    //console.log(start.toISOString(), end.toISOString(), label);
});