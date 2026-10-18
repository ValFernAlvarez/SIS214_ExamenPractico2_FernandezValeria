/**
 * githubApi.js — Módulo asíncrono: integración con la API REST pública de GitHub.
 *
 * · Usa Fetch API con async/await.
 * · Encapsula las peticiones en try...catch y evalúa response.ok.
 * · Gestiona códigos HTTP (200, 400, 403, 404, 500…) con mensajes específicos.
 * · Refleja en la interfaz los tres estados: loading, success y error.
 */
(function (app) {
    'use strict';

    const { crearElemento } = app.dom;

    const USUARIO_GITHUB = 'ValFernAlvarez';
    const URL_BASE = 'https://api.github.com';
    const MAX_REPOSITORIOS = 6;
    const TIEMPO_MAXIMO_MS = 10000;

    /** Error que conserva el código de estado HTTP devuelto por el servidor. */
    class ErrorHTTP extends Error {
        constructor(estado, mensaje) {
            super(mensaje);
            this.name = 'ErrorHTTP';
            this.estado = estado;
        }
    }

    /**
     * Traduce un código de estado HTTP en un mensaje comprensible para la usuaria.
     * @param {Response} respuesta - Respuesta con response.ok === false.
     * @returns {string}
     */
    function describirEstadoHTTP(respuesta) {
        switch (respuesta.status) {
            case 400:
                return 'Solicitud incorrecta (400 Bad Request): los parámetros enviados a GitHub no son válidos.';
            case 403:
                return respuesta.headers.get('x-ratelimit-remaining') === '0'
                    ? 'GitHub limitó temporalmente las consultas (403 Forbidden). Intenta de nuevo en unos minutos.'
                    : 'Acceso denegado por GitHub (403 Forbidden).';
            case 404:
                return `No se encontró el usuario "${USUARIO_GITHUB}" en GitHub (404 Not Found).`;
            case 500:
            case 502:
            case 503:
                return `GitHub tiene problemas en su servidor (${respuesta.status}). Intenta de nuevo más tarde.`;
            default:
                return `La API respondió con un estado inesperado (${respuesta.status}).`;
        }
    }

    /**
     * Realiza una petición GET a la API y devuelve el JSON si la respuesta es 2xx.
     * @param {string} ruta - Ruta relativa, p. ej. "/users/octocat".
     * @param {AbortSignal} senal - Permite cancelar la petición por tiempo de espera.
     * @returns {Promise<any>}
     * @throws {ErrorHTTP} Si response.ok es false.
     */
    async function solicitarJSON(ruta, senal) {
        const respuesta = await fetch(`${URL_BASE}${ruta}`, {
            headers: { Accept: 'application/vnd.github+json' },
            signal: senal
        });

        if (!respuesta.ok) {
            throw new ErrorHTTP(respuesta.status, describirEstadoHTTP(respuesta));
        }
        return respuesta.json();
    }

    /** Convierte cualquier error capturado en un mensaje para mostrar en pantalla. */
    function describirError(error) {
        if (error instanceof ErrorHTTP) return error.message;
        if (error.name === 'AbortError') {
            return 'La consulta tardó demasiado (tiempo de espera agotado). Revisa tu conexión e intenta de nuevo.';
        }
        if (error instanceof TypeError) {
            return 'No se pudo conectar con GitHub. Revisa tu conexión a internet.';
        }
        return 'Ocurrió un error inesperado al consultar GitHub.';
    }

    /* ---------- Renderizado ---------- */

    const formatearFecha = (iso) =>
        new Date(iso).toLocaleDateString('es-BO', { year: 'numeric', month: 'short', day: 'numeric' });

    function crearPerfil(perfil) {
        const estadisticas = [
            `${perfil.public_repos} repositorios públicos`,
            `${perfil.followers} seguidores`,
            `${perfil.following} siguiendo`
        ].map((texto) => crearElemento('li', { texto }));

        const info = [
            crearElemento('h3', { texto: perfil.name ?? perfil.login }),
            crearElemento('p', { texto: perfil.bio ?? 'Perfil público de GitHub.' }),
            crearElemento('ul', { clase: 'github_stats' }, estadisticas)
        ];

        return [
            crearElemento('img', {
                atributos: {
                    src: perfil.avatar_url,
                    alt: `Avatar de GitHub de ${perfil.login}`,
                    width: '96',
                    height: '96',
                    loading: 'lazy'
                }
            }),
            crearElemento('section', {}, info)
        ];
    }

    function crearTarjetaRepositorio(repo) {
        const meta = [
            repo.language ?? 'Sin lenguaje definido',
            `★ ${repo.stargazers_count}`,
            `Actualizado: ${formatearFecha(repo.pushed_at ?? repo.updated_at)}`
        ].join(' · ');

        return crearElemento('li', {}, [
            crearElemento('article', {}, [
                crearElemento('h3', { texto: repo.name }),
                crearElemento('p', { texto: repo.description ?? 'Sin descripción.' }),
                crearElemento('p', { clase: 'repo_meta', texto: meta }),
                crearElemento('a', {
                    clase: 'btn btn_outline btn_sm',
                    texto: 'Ver en GitHub',
                    atributos: {
                        href: repo.html_url,
                        target: '_blank',
                        rel: 'noopener noreferrer',
                        'aria-label': `Abrir el repositorio ${repo.name} en GitHub (se abre en una nueva pestaña)`
                    }
                })
            ])
        ]);
    }

    /* ---------- Módulo principal ---------- */

    /** Inicializa la sección de GitHub y lanza la primera carga. */
    function initGithub() {
        const estado = document.getElementById('github_status');
        const contenedorPerfil = document.getElementById('github_profile');
        const listaRepos = document.getElementById('github_repos');
        if (!estado || !contenedorPerfil || !listaRepos) return;

        /** Muestra uno de los tres estados de la petición: loading, success o error. */
        function mostrarEstado(tipo, mensaje, conReintento = false) {
            estado.hidden = false;
            estado.className = `api_status is_${tipo}`;
            estado.setAttribute('role', tipo === 'error' ? 'alert' : 'status');
            estado.textContent = mensaje;

            if (conReintento) {
                const reintentar = crearElemento('button', {
                    clase: 'btn btn_primary btn_sm',
                    texto: 'Reintentar',
                    atributos: { type: 'button' }
                });
                reintentar.addEventListener('click', cargarDatos);
                estado.append(reintentar);
            }
        }

        async function cargarDatos() {
            // Estado LOADING
            mostrarEstado('loading', 'Cargando datos desde la API de GitHub…');
            contenedorPerfil.hidden = true;
            listaRepos.replaceChildren();

            const controlador = new AbortController();
            const temporizador = setTimeout(() => controlador.abort(), TIEMPO_MAXIMO_MS);

            try {
                const [perfil, repos] = await Promise.all([
                    solicitarJSON(`/users/${USUARIO_GITHUB}`, controlador.signal),
                    solicitarJSON(
                        `/users/${USUARIO_GITHUB}/repos?sort=pushed&per_page=30`,
                        controlador.signal
                    )
                ]);

                // Estado SUCCESS: pipeline filter → slice → map (sin mutar la respuesta)
                const tarjetas = repos
                    .filter((repo) => !repo.fork)
                    .slice(0, MAX_REPOSITORIOS)
                    .map(crearTarjetaRepositorio);

                contenedorPerfil.replaceChildren(...crearPerfil(perfil));
                contenedorPerfil.hidden = false;
                listaRepos.replaceChildren(...tarjetas);

                mostrarEstado(
                    'success',
                    tarjetas.length
                        ? `Datos cargados correctamente (200 OK): ${tarjetas.length} repositorios recientes.`
                        : 'Perfil cargado (200 OK), pero no hay repositorios propios para mostrar.'
                );
            } catch (error) {
                // Estado ERROR
                console.warn('No se pudo consultar la API de GitHub:', error);
                mostrarEstado('error', describirError(error), true);
            } finally {
                clearTimeout(temporizador);
            }
        }

        cargarDatos();
    }

    app.githubApi = { initGithub };
})(window.HojaVida = window.HojaVida || {});
