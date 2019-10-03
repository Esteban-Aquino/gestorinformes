<?php

/**
 * Todas las interacciones con la base de datos se coloca aqui
 * Esteban Aquino 30/09/2019
 */
require 'oraconnect.php';
require '../util.php';

class operacionesDB
{
    function __construct()
    {
    }

    /**
     * Retorna usuario logueado
     *
     * @param Usuario, Clave
     * @return usuario logueado
     */
    public static function ValidarUsuario($usuario,$clave)
    {   
        $autorizado = false;
        try {
            $conn = new PDO('odbc:Driver={Microsoft ODBC for Oracle};
                        Server='.DATABASE,
                        $usuario, 
                        $clave);
            IF ($conn !== null){
                $conn = null;
                $consulta = "SELECT INITCAP(P.NOMBRE) NOMBRE_USUARIO,U.COD_USUARIO, U.ESTADO
                            FROM USUARIOS U
                                 JOIN PERSONAS P
                                 ON U.COD_PERSONA = P.COD_PERSONA
                           WHERE U.COD_USUARIO = UPPER('".$usuario."')";
                //print $consulta;
                // Preparar sentencia
                $comando = oraconnect::getInstance()->getDb()->query($consulta);
                // Ejecutar sentencia preparada
                $comando->execute();
                $result = $comando->fetchAll(PDO::FETCH_ASSOC);
                IF ($result !== null) {
                    IF ($result[0]['ESTADO'] === 'A') {
                        $autorizado = true;
                    }
                }
            }
            if ($autorizado){
                return utf8_converter($result);
            }
        
        } catch (PDOException $e) {
            return null;
        }
  }
  
  /**
     * Retorna datos de venta del dia ANTERIOR
     *
     * @param Nada
     * @return ventas del dia
     */
     public static function getVentasAyer()
    {
        $consulta = "SELECT * FROM V_INF_VENTAS_AYER";
        try {
            // Preparar sentencia
            $comando = oraconnect::getInstance()->getDb()->query($consulta);
            // Ejecutar sentencia preparada
            //$comando->execute(array($nombre));
            $comando->execute();
            $result = $comando->fetchAll(PDO::FETCH_ASSOC);

            return utf8_converter($result);

        } catch (PDOException $e) {
            return false;
        }
    }
  
  /**
     * Retorna datos de venta del dia
     *
     * @param Nada
     * @return ventas del dia
     */
     public static function getVentasDia()
    {
        $consulta = "SELECT *"
                  . "FROM V_INF_VENTAS_DIA";
        try {
            // Preparar sentencia
            $comando = oraconnect::getInstance()->getDb()->query($consulta);
            // Ejecutar sentencia preparada
            //$comando->execute(array($nombre));
            $comando->execute();
            $result = $comando->fetchAll(PDO::FETCH_ASSOC);

            return utf8_converter($result);

        } catch (PDOException $e) {
            return false;
        }
    }
    
    /**
     * Retorna datos de venta del dia
     *
     * @param Nada
     * @return ventas del dia
     */
     public static function getDetalleVentasDia()
    {
        $consulta = "SELECT *"
                  . "FROM V_INF_VENTAS_DIA_DET";
        try {
            // Preparar sentencia
            $comando = oraconnect::getInstance()->getDb()->query($consulta);
            // Ejecutar sentencia preparada
            //$comando->execute(array($nombre));
            $comando->execute();
            $result = $comando->fetchAll(PDO::FETCH_ASSOC);

            return utf8_converter($result);

        } catch (PDOException $e) {
            return false;
        }
    }
    
    /**
     * Retorna datos de venta de ayer
     *
     * @param Nada
     * @return ventas del dia
     */
     public static function getDetalleVentasAyer()
    {
        $consulta = "SELECT *"
                  . "FROM V_INF_VENTAS_AYER_DET";
        try {
            // Preparar sentencia
            $comando = oraconnect::getInstance()->getDb()->query($consulta);
            // Ejecutar sentencia preparada
            //$comando->execute(array($nombre));
            $comando->execute();
            $result = $comando->fetchAll(PDO::FETCH_ASSOC);

            return utf8_converter($result);

        } catch (PDOException $e) {
            return false;
        }
    }
  
  
    
}    
?>