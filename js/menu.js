/**
 * menu.js — Menú hamburguesa responsivo (móvil y tablet).
 *
 * Alterna la clase CSS "is_open" sobre la lista de enlaces y muta el atributo
 * aria-expanded (true/false) del botón para mantener la accesibilidad.
 * En escritorio (> 1024px) el CSS muestra el menú completo y oculta el botón.
 */
(function (app) {
    'use strict';

    const CLASE_ABIERTO = 'is_open';
    const MEDIA_ESCRITORIO = '(min-width: 1025px)';

    /** Inicializa el menú de navegación adaptativo. */
    function initMenu() {
        const boton = document.getElementById('menu_toggle');
        const menu = document.getElementById('menu_principal');
        if (!boton || !menu) return;

        const estaAbierto = () => menu.classList.contains(CLASE_ABIERTO);

        /** Abre o cierra el menú y refleja el estado en aria-expanded. */
        function establecerEstado(abierto) {
            menu.classList.toggle(CLASE_ABIERTO, abierto);
            boton.setAttribute('aria-expanded', String(abierto));
        }

        // Evento click sobre el botón: conmuta la visibilidad
        boton.addEventListener('click', () => establecerEstado(!estaAbierto()));

        // Delegación de eventos: un único listener en la lista captura los clics en los enlaces
        menu.addEventListener('click', (evento) => {
            if (evento.target.closest('a')) establecerEstado(false);
        });

        // Tecla Escape: cierra el menú y devuelve el foco al botón
        document.addEventListener('keydown', (evento) => {
            if (evento.key === 'Escape' && estaAbierto()) {
                establecerEstado(false);
                boton.focus();
            }
        });

        // Clic fuera del menú: lo cierra
        document.addEventListener('click', (evento) => {
            if (estaAbierto() && !evento.target.closest('.site_nav')) establecerEstado(false);
        });

        // Al pasar a escritorio se restablece el estado del menú
        window.matchMedia(MEDIA_ESCRITORIO).addEventListener('change', (cambio) => {
            if (cambio.matches) establecerEstado(false);
        });
    }

    app.menu = { initMenu };
})(window.HojaVida = window.HojaVida || {});
