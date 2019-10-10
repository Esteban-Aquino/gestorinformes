<?php

/**
 * Todas las interacciones con la base de datos se coloca aqui
 * Esteban Aquino 30/09/2019
 */
require 'oraconnect.php';
require '../util.php';

class operacionesDB {

    function __construct() {
        
    }

    /**
     * Retorna usuario logueado
     *
     * @param Usuario, Clave
     * @return usuario logueado
     */
    public static function ValidarUsuario($usuario, $clave) {
        $autorizado = false;
        try {
            $conn = new PDO('odbc:Driver={Microsoft ODBC for Oracle};
                        Server=' . DATABASE, $usuario, $clave);
            IF ($conn !== null) {
                $conn = null;
                $consulta = "SELECT INITCAP(P.NOMBRE) NOMBRE_USUARIO,U.COD_USUARIO, U.ESTADO
                            FROM USUARIOS U
                                 JOIN PERSONAS P
                                 ON U.COD_PERSONA = P.COD_PERSONA
                           WHERE U.COD_USUARIO = UPPER('" . $usuario . "')";
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
            if ($autorizado) {
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
    public static function getVentasAyer() {
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
    public static function getVentasDia() {
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
    public static function getDetalleVentasDia() {
        $consulta = "SELECT *"
                . "FROM V_INF_VENTAS_DIA_DET";
        try {
            // Preparar sentencia
            $comando = oraconnect::getInstance()->getDb()->query($consulta);
            // Ejecutar sentencia preparada
            //$comando->execute(array($nombre));
            $comando->execute();
            $result = $comando->fetchAll(PDO::FETCH_ASSOC);
            print $comando;
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
    public static function getDetalleVentasAyer() {
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

    /**
     * Retorna datos de venta de ayer
     *
     * @param Nada
     * @return ventas del dia
     */
    public static function getVentasMarca($p_fec_des, $p_fec_has) {
        $consulta = "SELECT COD_MARCA, MARCA,
                    SUM(VENTAS) VENTAS,
                    SUM(VENTAS_ANIO_PAST) VENTAS_ANIO_PAST,
                    ROUND(DECODE(NVL(SUM(VENTAS_ANIO_PAST), 0),
                                 0,
                                 DECODE(NVL(SUM(VENTAS), 0), 0, 0, 999),
                                 ((NVL(SUM(VENTAS), 0) - NVL(SUM(VENTAS_ANIO_PAST), 0)) /
                                 NVL(SUM(VENTAS_ANIO_PAST), 0)) * 100),
                          2) PORC
               FROM (
                     /*OPTIMA*/
                     SELECT  M.COD_MARCA,
                             M.DESCRIPCION MARCA,
                             ROUND(SUM(CASE
                                         WHEN V.FEC_ALTA BETWEEN
                                              TRUNC(TO_DATE('" . $p_fec_des . "', 'DD/MM/YYYY')) AND
                                              TRUNC(TO_DATE('" . $p_fec_has . "', 'DD/MM/YYYY')) THEN
                                          V.VENTA_NETA_GS
                                         ELSE
                                          0
                                       END)) VENTAS,
                             ROUND(SUM(CASE
                                         WHEN V.FEC_ALTA BETWEEN
                                              ADD_MONTHS((TRUNC(TO_DATE('" . $p_fec_des . "', 'DD/MM/YYYY'))),
                                                         -12) AND
                                              ADD_MONTHS(TRUNC(TO_DATE('" . $p_fec_has . "', 'DD/MM/YYYY')), -12) THEN
                                          V.VENTA_NETA_GS
                                         ELSE
                                          0
                                       END)) VENTAS_ANIO_PAST
                       FROM REL_MARCA_OP_GP M
                       JOIN VMATRIZ_VENTA_C_MAT V
                         ON M.COD_MARCA_OP = V.COD_MARCA
                      WHERE V.COD_VENDEDOR IN (SELECT DISTINCT VA.COD_VENDEDOR
                                               FROM EDS_VENDEDORES@GUATA VA
                                               WHERE VA.COD_EMPRESA = '2')
                      GROUP BY M.DESCRIPCION, M.COD_MARCA
                     UNION ALL
                     /*GP*/
                     SELECT M.COD_MARCA,
                            M.DESCRIPCION MARCA,
                            ROUND(SUM(CASE
                                        WHEN C.FEC_COMPROBANTE BETWEEN
                                             TRUNC(TO_DATE('" . $p_fec_des . "', 'DD/MM/YYYY')) AND
                                             TRUNC(TO_DATE('" . $p_fec_has . "', 'DD/MM/YYYY')) THEN
                                         C.TOTAL_GS
                                        ELSE
                                         0
                                      END)) VENTAS,
                            ROUND(SUM(CASE
                                        WHEN C.FEC_COMPROBANTE BETWEEN
                                             ADD_MONTHS((TRUNC(TO_DATE('" . $p_fec_des . "', 'DD/MM/YYYY'))),
                                                        -12) AND
                                             ADD_MONTHS(TRUNC(TO_DATE('" . $p_fec_has . "', 'DD/MM/YYYY')), -12) THEN
                                         C.TOTAL_GS
                                        ELSE
                                         0
                                      END)) VENTAS_ANIO_PAST
                       FROM REL_MARCA_OP_GP M
                       JOIN VVT_VTA_TOTAL_MAT@GUATA C
                         ON C.COD_MARCA = M.COD_MARCA_OP
                       WHERE C.COD_VENDEDOR IN (SELECT DISTINCT VA.COD_VENDEDOR
                                                FROM EDS_VENDEDORES@GUATA VA
                                                WHERE VA.COD_EMPRESA = '1')
                      GROUP BY M.DESCRIPCION, M.COD_MARCA)
              GROUP BY MARCA, COD_MARCA
              HAVING SUM(VENTAS) != 0 OR  SUM(VENTAS_ANIO_PAST) != 0
             ORDER BY 3 DESC
             ";
        //print $consulta;
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

    public static function getDetalleVentasRubro($p_fec_des, $p_fec_has, $cod_marca) {
        $consulta = "SELECT COD_RUBRO,
                    RUBRO,
                    SUM(VENTAS) VENTAS,
                    SUM(VENTAS_ANIO_PAST) VENTAS_ANIO_PAST,
                    (SUM(VENTAS) - SUM(VENTAS_ANIO_PAST)) DIFERENCIA
               FROM (
                     /*OPTIMA*/
                     SELECT R.COD_RUBRO,
                             R.DESCRIPCION RUBRO,
                             ROUND(SUM(CASE
                                         WHEN V.FEC_ALTA BETWEEN
                                              TRUNC(TO_DATE('" . $p_fec_des . "', 'DD/MM/YYYY')) AND
                                              TRUNC(TO_DATE('" . $p_fec_has . "', 'DD/MM/YYYY')) THEN
                                          V.VENTA_NETA_GS
                                         ELSE
                                          0
                                       END)) VENTAS,
                             ROUND(SUM(CASE
                                         WHEN V.FEC_ALTA BETWEEN
                                              ADD_MONTHS((TRUNC(TO_DATE('" . $p_fec_des . "', 'DD/MM/YYYY'))),
                                                         -12) AND
                                              ADD_MONTHS(TRUNC(TO_DATE('" . $p_fec_has . "', 'DD/MM/YYYY')), -12) THEN
                                          V.VENTA_NETA_GS
                                         ELSE
                                          0
                                       END)) VENTAS_ANIO_PAST
                       FROM VMATRIZ_VENTA_C_MAT V
                       JOIN REL_MARCA_OP_GP M
                         ON V.COD_MARCA = M.COD_MARCA_OP
                       JOIN REL_RUBRO_OP_GP R
                         ON V.COD_RUBRO = R.COD_RUBRO_OP
                      WHERE M.COD_MARCA = ".trim($cod_marca)."
                        AND V.COD_VENDEDOR IN (SELECT DISTINCT VA.COD_VENDEDOR
                                               FROM EDS_VENDEDORES@GUATA VA
                                               WHERE VA.COD_EMPRESA = '2')
                      GROUP BY R.COD_RUBRO, R.DESCRIPCION
                     UNION ALL
                     /*GP*/
                     SELECT R.COD_RUBRO,
                            R.DESCRIPCION RUBRO,
                            ROUND(SUM(CASE
                                        WHEN C.FEC_COMPROBANTE BETWEEN
                                             TRUNC(TO_DATE('" . $p_fec_des . "', 'DD/MM/YYYY')) AND
                                             TRUNC(TO_DATE('" . $p_fec_has . "', 'DD/MM/YYYY')) THEN
                                         C.TOTAL_GS
                                        ELSE
                                         0
                                      END)) VENTAS,
                            ROUND(SUM(CASE
                                        WHEN C.FEC_COMPROBANTE BETWEEN
                                             ADD_MONTHS((TRUNC(TO_DATE('" . $p_fec_des . "', 'DD/MM/YYYY'))),
                                                        -12) AND
                                             ADD_MONTHS(TRUNC(TO_DATE('" . $p_fec_has . "', 'DD/MM/YYYY')), -12) THEN
                                         C.TOTAL_GS
                                        ELSE
                                         0
                                      END)) VENTAS_ANIO_PAST
                       FROM REL_MARCA_OP_GP M
                       JOIN VVT_VTA_TOTAL_MAT@GUATA C
                         ON C.COD_MARCA = M.COD_MARCA_GP
                       JOIN REL_RUBRO_OP_GP R
                         ON C.COD_RUBRO = R.COD_RUBRO_GP
                      WHERE M.COD_MARCA = ".trim($cod_marca)."
                        AND C.COD_VENDEDOR IN (SELECT DISTINCT VA.COD_VENDEDOR
                                               FROM EDS_VENDEDORES@GUATA VA
                                               WHERE VA.COD_EMPRESA = '1')
                      GROUP BY R.COD_RUBRO, R.DESCRIPCION)
              GROUP BY RUBRO, COD_RUBRO
             HAVING SUM(VENTAS) != 0 OR SUM(VENTAS_ANIO_PAST) != 0
             ORDER BY 3 DESC";
        //print $consulta;
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