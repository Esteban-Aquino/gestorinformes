<?php

/**
 * Obtiene todas las listas de la base de datos
 */

require_once '../config/operacionesDB.php';

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    ini_set('max_execution_time', 480);
    $fec_desde = $_GET['fec_desde'];
    $fec_hasta = $_GET['fec_hasta'];
    $cod_marca = $_GET['cod_marca'];
    // Manejar petición GET
    $existencia= operacionesDB::getDetalleVentasRubro($fec_desde, $fec_hasta,$cod_marca);
    
    if ($existencia) {

        /*$datos["estado"] = 1;*/
         $datos["datos"] = $existencia;
         print json_encode($datos);
            //echo json_last_error();
    } else {
        print json_encode(array("estado" => "Error",
                                "mensaje" => "Ha ocurrido un error"));
    }
}

?>
