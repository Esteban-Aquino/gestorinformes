<?php
    /**
    * Validar Usuario
    * Esteban Aquino 30/09/2019
    */
    require_once '../config/operacionesDB.php';
    
    # Obtener headers
    $head = getallheaders();
    $usuario = $head['usuario'];
    $ok = false;
    if ($usuario == 'null'||$usuario == null) { 
        # Capturar post JSON
        $json_str = file_get_contents('php://input');
        # Obtener como Array
        $json_obj = json_decode(utf8_converter_sting($json_str), true);
        $usuario = $json_obj['usuario'];
        $clave = $json_obj['clave'];
        
        if ($usuario != null || $clave != null){
            $conn = operacionesDB::ValidarUsuario($usuario, $clave);
            //print $conn;
            if ($conn != null){
                $ok = true;
                $respuesta["datos_usuario"] = $conn;
                $respuesta["acceso"] = true;
            }
        }
    }else{
        // verificar hash
        $ok = true;
        $respuesta["datos_usuario"] = $usuario;
        $respuesta["acceso"] = true;
    }
    if (!$ok){
        $respuesta["datos_usuario"] = null;
        $respuesta["acceso"] = false;
        //http_response_code(401);
    }else{
        //http_response_code(200);
    }
    // agregar cabecera
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Headers: *');
    print json_encode($respuesta);
?>
