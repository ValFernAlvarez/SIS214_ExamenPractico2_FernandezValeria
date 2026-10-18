/**
 * preload.js — Script clásico (no módulo) que se ejecuta de forma síncrona en <head>.
 *
 * Aplica el tema guardado ANTES del primer pintado para evitar el "parpadeo"
 * de tema claro en usuarios que eligieron el modo oscuro, y marca el documento
 * con la clase "js" (mejora progresiva: el CSS sólo colapsa el menú si hay JS).
 */
(function aplicarPreferenciasIniciales() {
    var raiz = document.documentElement;
    raiz.classList.add('js');

    try {
        var guardado = JSON.parse(localStorage.getItem('hojaVida.preferencias'));
        var tema = guardado && guardado.tema;

        if (!tema && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            tema = 'dark';
        }
        if (tema === 'dark') {
            raiz.setAttribute('data-theme', 'dark');
        }
    } catch (error) {
        // Sin localStorage o JSON inválido: se queda el tema claro por defecto.
    }
})();
