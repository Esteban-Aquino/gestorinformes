/**
 * Autor: Esteban Aqiono
 * Fecha: 30/09/2018
 * Descripcion: Funciones de ventas
 */

$.ready(inicializa());

function inicializa() {
    validadSesion();
    GetDetalleVentasAyer();
    $('select.form-control.input-sm').val(50).change();

}

function GetDetalleVentasAyer(){
    var pUrl= 'api/getdetalleventasayer';
    var pBeforeSend = "";
    var pSucces = "GetDetalleVentasAyerSuccess(json)";
    var pError = "ajax_error()";
    var pComplete = "";
    //console.log("enviando-func");
    ajaxGet(pUrl, pBeforeSend, pSucces, pError, pComplete);
}

function GetDetalleVentasAyerSuccess(json){
    console.log(json['existencia'][0].SUCURSAL);
    var vplantilla;
    var vdatos;
    $.each(json['existencia'], function (key, value) {
        var vsucursal = value.SUCURSAL;
        var vactual = value.ACTUAL;
        var vanterior = value.ANTERIOR;
        var vdiferencia = value.DIFERENCIA;
        var vcolor;
        if (parseInt(vactual)>parseInt(vanterior)){
            vcolor = 'gs green';
        }else if(parseInt(vactual)<parseInt(vanterior)){
            vcolor = 'gs red';
        } else{
            vcolor = 'gs grey';
        }
        vplantilla = '<tr> '+
                        '<td>'+vsucursal+'</td> '+
                        '<td class="gs"> '+vactual+'</td> '+
                        '<td class="gs"> '+vanterior+'</td> '+
                        '<td class="'+vcolor+'">'+vdiferencia+'</td> '+
                    "</tr>";
        
        vdatos += vplantilla;
    });
    $('#tableBody').html(vdatos);
    $('#datatable').DataTable();
    formatoGs();
}

function formatoGs() {
    $('.gs').priceFormat({
        prefix: '',
        centsSeparator: ',',
        thousandsSeparator: '.',
        centsLimit: 0,
        allowNegative: true
    });
}