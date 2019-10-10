/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var cod_marca;
var desc_marca;
(function () {
    console.log('ventasRubro');
    var params = sessionStorage.getItem('ventasRubro');
    if (!empty(params)) {
        this.cod_marca = JSON.parse(params).cod_marca;
        this.desc_marca = JSON.parse(params).desc_marca;
        $('#filtro').text('Marca: '+this.desc_marca);
        $('#fec_desde').val(moment(JSON.parse(params).fec_desde).format("YYYY-MM-DD"));
        $('#fec_hasta').val(moment(JSON.parse(params).fec_hasta).format("YYYY-MM-DD"));;
    } else {
        $('#fec_desde').val(moment(new Date(date.getFullYear(), date.getMonth(), 1)).format("YYYY-MM-DD"));
        $('#fec_hasta').val(moment(new Date(date.getFullYear(), date.getMonth() + 1, 0)).format("YYYY-MM-DD"));
    }
    GetDetalleVentas();
})();

function cargar(){
    $('#cargando-ventas').removeClass('oculto');
    $('#table-ventas"').addClass('oculto');
    GetDetalleVentas();
}
function GetDetalleVentas(){
    var vfec_desde = moment($('#fec_desde').val()).format('DD/MM/YYYY');
    var vfec_hasta = moment($('#fec_hasta').val()).format('DD/MM/YYYY');
    var vcod_marca = this.cod_marca;
    var pUrl= 'api/getDetallementasrubro?fec_desde=' + vfec_desde + '&fec_hasta=' + vfec_hasta+'&cod_marca='+vcod_marca;
    var pBeforeSend = "";
    var pSucces = "GetDetalleVentasSuccess(json)";
    var pError = "ajax_error()";
    var pComplete = "";
    //console.log("enviando-func");
    ajaxGet(pUrl, pBeforeSend, pSucces, pError, pComplete);
}

function GetDetalleVentasSuccess(json){
    //console.log(json['datos']);
    var vplantilla;
    var vdatos;
    $.each(json['datos'], function (key, value) {
        var vrubro = value.RUBRO;
        var vactual = value.VENTAS;
        var vanterior = value.VENTAS_ANIO_PAST;
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
                        '<td>'+vrubro+'</td> '+
                        '<td class="gs"> '+vactual+'</td> '+
                        '<td class="gs"> '+vanterior+'</td> '+
                        '<td class="'+vcolor+'">'+vdiferencia+'</td> '+
                    "</tr>";
        
        vdatos += vplantilla;
    });
    //console.log(vdatos);
    $('#tableBody').html(vdatos);
    $('#datatable').DataTable();
    formatoGs();
    $('#cargando-ventas').addClass('oculto');
    $('#table-ventas').removeClass('oculto');
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



