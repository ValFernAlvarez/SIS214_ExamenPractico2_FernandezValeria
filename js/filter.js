/**
 * filter.js — Buscador en tiempo real de proyectos.
 *
 * · Escucha el evento "input" del campo de búsqueda.
 * · Procesa los datos con una tubería funcional .filter() → .map(), sin mutar
 *   la colección original (PROYECTOS está congelada).
 * · Renderiza los resultados con nodos del DOM y anuncia el conteo a lectores
 *   de pantalla mediante una región aria-live.
 */
(function (app) {
    'use strict';

    const { PROYECTOS } = app.projects;
    const { crearElemento } = app.dom;

    /** Quita tildes, pasa a minúsculas y recorta espacios para comparar textos. */
    const normalizar = (texto) =>
        texto.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();

    /** Texto sobre el que se busca: título, descripción, rol, resultado y tecnologías. */
    const textoBuscable = (proyecto) =>
        normalizar([
            proyecto.titulo,
            proyecto.descripcion,
            proyecto.rol,
            proyecto.resultado,
            ...proyecto.tecnologias
        ].join(' '));

    /**
     * Devuelve los proyectos que contienen TODAS las palabras del término buscado.
     * No modifica la colección recibida: .filter() genera un arreglo nuevo.
     * @param {ReadonlyArray<Object>} proyectos - Colección original.
     * @param {string} termino - Texto escrito por la usuaria.
     * @returns {Object[]}
     */
    const filtrarProyectos = (proyectos, termino) => {
        const palabras = normalizar(termino).split(/\s+/).filter(Boolean);
        return proyectos.filter((proyecto) => {
            const texto = textoBuscable(proyecto);
            return palabras.every((palabra) => texto.includes(palabra));
        });
    };

    /**
     * Construye el elemento <li><article>…</article></li> de un proyecto.
     * @param {Object} proyecto
     * @returns {HTMLLIElement}
     */
    const crearTarjetaProyecto = (proyecto) => {
        const campo = (etiqueta, valor) =>
            crearElemento('p', {}, [crearElemento('strong', { texto: `${etiqueta}: ` }), valor]);

        const tecnologias = crearElemento(
            'ul',
            { clase: 'tag_list', atributos: { 'aria-label': 'Tecnologías utilizadas' } },
            proyecto.tecnologias.map((tecnologia) => crearElemento('li', { texto: tecnologia }))
        );

        const hijos = [
            crearElemento('h3', { texto: proyecto.titulo }),
            campo('Descripción', proyecto.descripcion),
            tecnologias,
            campo('Rol desempeñado', proyecto.rol),
            campo('Resultado obtenido', proyecto.resultado)
        ];

        if (proyecto.repositorio) {
            hijos.push(crearElemento('a', {
                clase: 'btn btn_outline btn_sm',
                texto: 'Ver repositorio en GitHub',
                atributos: {
                    href: proyecto.repositorio,
                    target: '_blank',
                    rel: 'noopener noreferrer',
                    'aria-label': `Ver repositorio de ${proyecto.titulo} en GitHub (se abre en una nueva pestaña)`
                }
            }));
        }

        if (proyecto.nota) {
            hijos.push(crearElemento('p', {}, [crearElemento('small', { texto: proyecto.nota })]));
        }

        return crearElemento('li', {}, [crearElemento('article', {}, hijos)]);
    };

    /** Texto del resumen de resultados (concordancia singular/plural). */
    const describirResultados = (mostrados, total, termino) => {
        const busqueda = termino.trim();
        if (!busqueda) return `Mostrando los ${total} proyectos.`;
        if (mostrados === 0) return `Ningún proyecto coincide con «${busqueda}».`;

        const verbo = mostrados === 1 ? 'Coincide' : 'Coinciden';
        return `${verbo} ${mostrados} de ${total} proyectos con «${busqueda}».`;
    };

    /** Inicializa el buscador y renderiza la lista inicial. */
    function initFiltroProyectos() {
        const formulario = document.getElementById('form_buscador');
        const campo = document.getElementById('buscador_proyectos');
        const lista = document.getElementById('lista_proyectos');
        const resumen = document.getElementById('resumen_busqueda');
        const mensajeVacio = document.getElementById('proyectos_vacio');
        if (!campo || !lista) return;

        /** Tubería: filter (selecciona) → map (transforma a nodos) → render. */
        function renderizar(termino) {
            const tarjetas = filtrarProyectos(PROYECTOS, termino).map(crearTarjetaProyecto);

            lista.replaceChildren(...tarjetas);
            mensajeVacio.hidden = tarjetas.length > 0;
            resumen.textContent = describirResultados(tarjetas.length, PROYECTOS.length, termino);
        }

        // Filtrado en tiempo real con cada pulsación / pegado / borrado
        campo.addEventListener('input', (evento) => renderizar(evento.target.value));

        // Evita que Enter recargue la página
        formulario?.addEventListener('submit', (evento) => evento.preventDefault());

        renderizar('');
    }

    app.filter = { filtrarProyectos, crearTarjetaProyecto, initFiltroProyectos };
})(window.HojaVida = window.HojaVida || {});
