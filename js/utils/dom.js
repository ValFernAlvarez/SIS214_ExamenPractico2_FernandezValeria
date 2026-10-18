/**
 * dom.js — Utilidades para construir nodos del DOM de forma segura.
 *
 * Se crean elementos con createElement()/textContent (en lugar de innerHTML)
 * para evitar inyección de HTML y mantener un marcado limpio.
 */
(function (app) {
    'use strict';

    /**
     * Crea un elemento HTML con clase, texto, atributos e hijos opcionales.
     * @param {string} etiqueta - Nombre de la etiqueta (p. ej. 'article').
     * @param {{clase?: string, texto?: string, atributos?: Object<string,string>}} [opciones]
     * @param {Array<Node|string>} [hijos] - Nodos o textos a insertar dentro.
     * @returns {HTMLElement}
     */
    function crearElemento(etiqueta, { clase, texto, atributos = {} } = {}, hijos = []) {
        const elemento = document.createElement(etiqueta);

        if (clase) elemento.className = clase;
        if (texto !== undefined) elemento.textContent = texto;

        Object.entries(atributos).forEach(([nombre, valor]) => {
            elemento.setAttribute(nombre, valor);
        });

        hijos.forEach((hijo) => elemento.append(hijo));
        return elemento;
    }

    app.dom = { crearElemento };
})(window.HojaVida = window.HojaVida || {});
