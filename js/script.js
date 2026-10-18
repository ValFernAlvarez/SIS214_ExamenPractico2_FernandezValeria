'use strict';

(function themeToggle() {
    const STORAGE_KEY = 'portafolio_theme';
    const root = document.documentElement;
    const boton = document.getElementById('theme_toggle');
    const icono = document.getElementById('theme_toggle_icon');

    if (!boton) return;

    const aplicarTema = (tema) => {
        const esOscuro = tema === 'dark';
        if (esOscuro) {
            root.setAttribute('data-theme', 'dark');
        } else {
            root.removeAttribute('data-theme');
        }
        boton.setAttribute('aria-pressed', String(esOscuro));
        boton.setAttribute('aria-label', esOscuro ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
        if (icono) icono.src = esOscuro ? 'assets/icons/sun.svg' : 'assets/icons/moon.svg';
    };

    const leerTemaGuardado = () => {
        try {
            const crudo = localStorage.getItem(STORAGE_KEY);
            return crudo ? JSON.parse(crudo) : null;
        } catch (error) {
            return null;
        }
    };

    const guardarTema = (tema) => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(tema));
        } catch (error) {
        }
    };

    const temaGuardado = leerTemaGuardado();
    if (temaGuardado) {
        aplicarTema(temaGuardado);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        aplicarTema('dark');
    }

    boton.addEventListener('click', () => {
        const nuevoTema = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        aplicarTema(nuevoTema);
        guardarTema(nuevoTema);
    });
})();


(function menuResponsivo() {
    const boton = document.getElementById('menu_toggle');
    const menu = document.getElementById('nav_menu');
    if (!boton || !menu) return;

    const establecerMenu = (abierto) => {
        menu.classList.toggle('nav_menu_abierto', abierto);
        boton.setAttribute('aria-expanded', String(abierto));
        boton.setAttribute('aria-label', abierto ? 'Cerrar menú de navegación' : 'Abrir menú de navegación');
    };

    boton.addEventListener('click', () => {
        establecerMenu(!menu.classList.contains('nav_menu_abierto'));
    });

    menu.addEventListener('click', (evento) => {
        if (evento.target.tagName === 'A') establecerMenu(false);
    });
})();


(function filtroProyectos() {
    const lista = document.getElementById('lista_proyectos');
    const estado = document.getElementById('proyectos_status');
    const entrada = document.getElementById('filtro_proyectos');
    if (!lista || !entrada) return;

    const proyectos = Object.freeze([
        Object.freeze({
            nombre: 'Budget-Buddy',
            descripcion: 'Aplicación de consola en C++ para el control de presupuesto personal, con almacenamiento local en CSV y reportes de gasto por categoría, fecha y mes.',
            tecnologias: Object.freeze(['C++', 'CSV'])
        }),
        Object.freeze({
            nombre: 'TOQUE-FAMA',
            descripcion: 'Juego de lógica estilo Mastermind con Python y Tkinter, música de fondo con Pygame y título animado en GIF.',
            tecnologias: Object.freeze(['Python', 'Tkinter', 'Pygame'])
        }),
        Object.freeze({
            nombre: 'PataLibre',
            descripcion: 'Plataforma de donación de insumos para mascotas, desarrollada con JavaFX y PostgreSQL para la materia Programación II.',
            tecnologias: Object.freeze(['Java', 'JavaFX', 'PostgreSQL'])
        })
    ]);

    const renderizar = (coleccion) => {
        lista.innerHTML = '';
        coleccion.forEach((proyecto) => {
            const item = document.createElement('li');

            const titulo = document.createElement('h3');
            titulo.textContent = proyecto.nombre;

            const descripcion = document.createElement('p');
            descripcion.textContent = proyecto.descripcion;

            const tecnologias = document.createElement('p');
            tecnologias.className = 'proyecto_tech';
            tecnologias.textContent = proyecto.tecnologias.join(' · ');

            item.append(titulo, descripcion, tecnologias);
            lista.appendChild(item);
        });

        if (estado) {
            estado.textContent = coleccion.length === 0
                ? 'No se encontraron proyectos con ese término.'
                : `${coleccion.length} proyecto(s) encontrado(s)`;
        }
    };

    const filtrar = (consulta) => {
        const termino = consulta.trim().toLowerCase();
        return proyectos
            .filter(({ nombre, descripcion, tecnologias }) =>
                !termino
                || nombre.toLowerCase().includes(termino)
                || descripcion.toLowerCase().includes(termino)
                || tecnologias.some((tecnologia) => tecnologia.toLowerCase().includes(termino)))
            .map((proyecto) => ({ ...proyecto }));
    };

    entrada.addEventListener('input', () => renderizar(filtrar(entrada.value)));
    renderizar(filtrar(''));
})();


(function validacionFormulario() {
    const formulario = document.getElementById('form_contacto');
    if (!formulario) return;

    const estadoFormulario = document.getElementById('form_status');

    const mensajesError = {
        nombre: 'Escribe tu nombre completo (mínimo 3 caracteres).',
        correo: 'Ingresa un correo electrónico válido (ej. nombre@dominio.com).',
        mensaje: 'Escribe un mensaje de al menos 10 caracteres.',
        aceptacion: 'Debes aceptar el uso de tus datos para poder enviar el formulario.'
    };

    const mostrarError = (campo) => {
        const contenedor = document.getElementById(`${campo.id}_error`);
        if (contenedor) {
            contenedor.textContent = mensajesError[campo.id] || 'Este campo no es válido.';
            contenedor.classList.remove('exito_mensaje');
        }
        campo.classList.remove('valid');
        campo.classList.add('invalid');
        campo.setAttribute('aria-invalid', 'true');
    };

    const mostrarExito = (campo) => {
        const contenedor = document.getElementById(`${campo.id}_error`);
        if (contenedor) {
            contenedor.textContent = '✓ Correcto';
            contenedor.classList.add('exito_mensaje');
        }
        campo.classList.remove('invalid');
        campo.classList.add('valid');
        campo.removeAttribute('aria-invalid');
    };

    const limpiarCampo = (campo) => {
        const contenedor = document.getElementById(`${campo.id}_error`);
        if (contenedor) {
            contenedor.textContent = '';
            contenedor.classList.remove('exito_mensaje');
        }
        campo.classList.remove('invalid', 'valid');
        campo.removeAttribute('aria-invalid');
    };

    const validarCampo = (campo) => {
        const esValido = campo.checkValidity();
        if (esValido) {
            mostrarExito(campo);
        } else {
            mostrarError(campo);
        }
        return esValido;
    };

    const campos = [...formulario.querySelectorAll('#nombre, #correo, #mensaje, #aceptacion')];

    campos.forEach((campo) => {
        campo.addEventListener('input', () => {
            if (campo.classList.contains('invalid') || campo.classList.contains('valid')) {
                validarCampo(campo);
            }
        });
        campo.addEventListener('change', () => validarCampo(campo));
        campo.addEventListener('blur', () => validarCampo(campo));
    });

    formulario.addEventListener('submit', (evento) => {
        evento.preventDefault();

        const resultados = campos.map((campo) => ({ campo, valido: validarCampo(campo) }));
        const primerInvalido = resultados.find(({ valido }) => !valido);

        if (primerInvalido) {
            if (estadoFormulario) {
                estadoFormulario.textContent = 'Por favor corrige los campos marcados antes de enviar.';
                estadoFormulario.classList.remove('success');
                estadoFormulario.classList.add('error');
            }
            primerInvalido.campo.focus();
            return;
        }

        if (estadoFormulario) {
            estadoFormulario.textContent = '¡Gracias! Tu mensaje fue validado correctamente y quedaría listo para enviarse.';
            estadoFormulario.classList.remove('error');
            estadoFormulario.classList.add('success');
        }

        campos.forEach(limpiarCampo);
        formulario.reset();
    });
})();


(function githubRepos() {
    const estado = document.getElementById('github_status');
    const lista = document.getElementById('github_lista');
    if (!estado || !lista) return;

    const USUARIO = 'ValFernAlvarez';
    const URL_API = `https://api.github.com/users/${USUARIO}/repos?sort=updated&per_page=5`;

    const mensajesHttp = {
        400: 'Solicitud incorrecta (400): la petición a GitHub no es válida.',
        403: 'GitHub limitó las consultas por un rato (403). Intenta de nuevo más tarde.',
        404: 'No se encontró el usuario de GitHub (404).',
        500: 'El servidor de GitHub tuvo un problema (500).'
    };

    const establecerEstado = (tipo, texto) => {
        estado.className = `github_status ${tipo}`;
        estado.textContent = texto;
    };

    const dibujarRepositorios = (repositorios) => {
        repositorios
            .filter((repositorio) => !repositorio.fork)
            .map((repositorio) => ({
                nombre: repositorio.name,
                descripcion: repositorio.description || 'Sin descripción.',
                url: repositorio.html_url,
                estrellas: repositorio.stargazers_count
            }))
            .forEach(({ nombre, descripcion, url, estrellas }) => {
                const item = document.createElement('li');

                const enlace = document.createElement('a');
                enlace.href = url;
                enlace.target = '_blank';
                enlace.rel = 'noopener noreferrer';
                enlace.textContent = `${nombre} (${estrellas} ★)`;

                const detalle = document.createElement('p');
                detalle.textContent = descripcion;

                item.append(enlace, detalle);
                lista.appendChild(item);
            });
    };

    const cargarRepositorios = async () => {
        establecerEstado('loading', 'Cargando repositorios públicos...');
        lista.innerHTML = '';

        try {
            const respuesta = await fetch(URL_API);

            if (!respuesta.ok) {
                const mensaje = mensajesHttp[respuesta.status]
                    || (respuesta.status >= 500
                        ? `El servidor de GitHub tuvo un problema (${respuesta.status}).`
                        : `No se pudieron cargar los repositorios (${respuesta.status}).`);
                establecerEstado('error', mensaje);
                return;
            }

            const repositorios = await respuesta.json();

            if (!Array.isArray(repositorios) || repositorios.length === 0) {
                establecerEstado('error', 'Este usuario todavía no tiene repositorios públicos.');
                return;
            }

            dibujarRepositorios(repositorios);
            establecerEstado('success', 'Repositorios públicos actualizados correctamente.');
        } catch (error) {
            establecerEstado('error', 'No se pudo conectar con la API de GitHub. Intenta de nuevo más tarde.');
        }
    };

    cargarRepositorios();
})();
