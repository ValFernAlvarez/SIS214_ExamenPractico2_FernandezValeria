/**
 * theme.js — Conmutador de tema (Dark / Light Mode).
 *
 * Alterna el atributo global data-theme en <html> y persiste la preferencia
 * en localStorage mediante JSON.stringify() / JSON.parse() (ver utils/storage.js).
 */
(function (app) {
    'use strict';

    const { leerJSON, guardarJSON } = app.storage;

    const CLAVE_PREFERENCIAS = 'hojaVida.preferencias';
    const TEMAS = Object.freeze({ CLARO: 'light', OSCURO: 'dark' });

    const RUTAS_ICONO = Object.freeze({
        [TEMAS.CLARO]: 'assets/images/icons/moon.svg', // icono que invita a pasar a oscuro
        [TEMAS.OSCURO]: 'assets/images/icons/sun.svg'  // icono que invita a pasar a claro
    });

    /** Devuelve el tema activo según el atributo data-theme de <html>. */
    const obtenerTemaActual = () =>
        document.documentElement.getAttribute('data-theme') === TEMAS.OSCURO
            ? TEMAS.OSCURO
            : TEMAS.CLARO;

    /**
     * Aplica un tema al DOM y sincroniza el estado del botón (ARIA e ícono).
     * @param {string} tema - 'light' o 'dark'.
     * @param {HTMLButtonElement} boton - Botón conmutador.
     * @param {HTMLImageElement|null} icono - Imagen dentro del botón.
     */
    function aplicarTema(tema, boton, icono) {
        const esOscuro = tema === TEMAS.OSCURO;

        if (esOscuro) {
            document.documentElement.setAttribute('data-theme', TEMAS.OSCURO);
        } else {
            document.documentElement.removeAttribute('data-theme');
        }

        boton.setAttribute('aria-pressed', String(esOscuro));
        if (icono) icono.src = RUTAS_ICONO[tema];
    }

    /** Inicializa el conmutador de tema y restaura la preferencia guardada. */
    function initTema() {
        const boton = document.getElementById('theme_toggle');
        const icono = document.getElementById('theme_toggle_icon');
        if (!boton) return;

        // Restaura la preferencia (preload.js ya aplicó el tema; aquí se sincroniza el botón)
        const preferencias = leerJSON(CLAVE_PREFERENCIAS, {});
        const temaInicial = preferencias.tema ?? obtenerTemaActual();
        aplicarTema(temaInicial, boton, icono);

        boton.addEventListener('click', () => {
            const nuevoTema = obtenerTemaActual() === TEMAS.OSCURO ? TEMAS.CLARO : TEMAS.OSCURO;
            aplicarTema(nuevoTema, boton, icono);
            guardarJSON(CLAVE_PREFERENCIAS, { ...leerJSON(CLAVE_PREFERENCIAS, {}), tema: nuevoTema });
        });
    }

    app.theme = { initTema };
})(window.HojaVida = window.HojaVida || {});
