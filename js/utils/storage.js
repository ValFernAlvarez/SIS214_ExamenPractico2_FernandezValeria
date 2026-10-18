/**
 * storage.js — Utilidades de persistencia local.
 *
 * Todo valor se serializa con JSON.stringify() al guardar y se reconstruye con
 * JSON.parse() al leer. Ambas operaciones están protegidas con try...catch porque
 * localStorage puede estar bloqueado (modo privado) o contener JSON corrupto.
 */
(function (app) {
    'use strict';

    /**
     * Lee y deserializa un valor de localStorage.
     * @param {string} clave - Clave de almacenamiento.
     * @param {*} valorPorDefecto - Valor devuelto si no existe o no se puede leer.
     * @returns {*} El valor deserializado o el valor por defecto.
     */
    function leerJSON(clave, valorPorDefecto = null) {
        try {
            const textoGuardado = localStorage.getItem(clave);
            return textoGuardado === null ? valorPorDefecto : JSON.parse(textoGuardado);
        } catch (error) {
            console.warn(`No se pudo leer "${clave}" desde localStorage:`, error.message);
            return valorPorDefecto;
        }
    }

    /**
     * Serializa y guarda un valor en localStorage.
     * @param {string} clave - Clave de almacenamiento.
     * @param {*} valor - Valor serializable a guardar.
     * @returns {boolean} true si se guardó correctamente.
     */
    function guardarJSON(clave, valor) {
        try {
            localStorage.setItem(clave, JSON.stringify(valor));
            return true;
        } catch (error) {
            console.warn(`No se pudo guardar "${clave}" en localStorage:`, error.message);
            return false;
        }
    }

    app.storage = { leerJSON, guardarJSON };
})(window.HojaVida = window.HojaVida || {});
