/**
 * projects.js — Colección ORIGINAL de proyectos destacados.
 *
 * Los datos están congelados (Object.freeze): el filtro nunca los modifica,
 * sólo genera colecciones nuevas a partir de ellos (inmutabilidad).
 */
(function (app) {
    'use strict';

    const congelar = (proyecto) => Object.freeze({
        ...proyecto,
        tecnologias: Object.freeze([...proyecto.tecnologias])
    });

    const PROYECTOS = Object.freeze([
        congelar({
            id: 'budget_buddy',
            titulo: 'Budget-Buddy',
            descripcion: 'Aplicación de consola en C++ para el registro, análisis y control del presupuesto personal de estudiantes universitarios, con almacenamiento local en archivos CSV y generación de reportes por categoría, fecha y mes.',
            tecnologias: ['C++', 'STL', 'Archivos CSV'],
            rol: 'Desarrolladora, en colaboración con otros miembros del equipo (Jeimy Montaño, Luciana Saavedra).',
            resultado: 'Aplicación de consola completamente funcional, con registro y eliminación de gastos, detección de excesos de gasto y reportes automáticos por categoría, fecha y mes.',
            repositorio: 'https://github.com/ValFernAlvarez/Budget-Buddy',
            nota: null
        }),
        congelar({
            id: 'toque_fama',
            titulo: 'Toque-Fama',
            descripcion: 'Juego de lógica y deducción desarrollado en Python, en el que se debe adivinar un número secreto de 4 dígitos distintos combinando pistas de "Fama" (dígito y posición correctos) y "Toque" (dígito correcto, posición incorrecta).',
            tecnologias: ['Python', 'Tkinter', 'Pygame'],
            rol: 'Autora del proyecto (revisión de Arantza Jeimy Montaño).',
            resultado: 'Juego completo y funcional con tres niveles de dificultad (Principiante, Intermedio y Experto), interfaz gráfica personalizada, música de fondo y título animado; distribuido como ejecutable independiente para Windows.',
            repositorio: 'https://github.com/ValFernAlvarez/TOQUE-FAMA',
            nota: null
        }),
        congelar({
            id: 'ecoguardianes',
            titulo: 'Ecoguardianes',
            descripcion: 'Proyecto de impacto social y ambiental desarrollado durante el programa internacional Geeky Latin@s – Virtual STEAM Program (7.ª edición), orientado a empoderar a minorías y promover la inclusión en carreras STEAM.',
            tecnologias: ['Diseño de proyectos STEAM', 'Canva', 'Herramientas colaborativas'],
            rol: 'Integrante del equipo de desarrollo del proyecto.',
            resultado: '1er lugar en la categoría de Impacto Social STEAM, con un puntaje de 9.80/10 (junio de 2024).',
            repositorio: null,
            nota: 'Proyecto desarrollado en el marco de un programa internacional; no cuenta con repositorio o demostración pública en este momento.'
        }),
        congelar({
            id: 'hoja_vida_web',
            titulo: 'Hoja de Vida Web Interactiva',
            descripcion: 'Esta misma hoja de vida, desarrollada para la asignatura Tecnologías Web I: HTML5 semántico, CSS3 mobile-first y JavaScript ES6+ modular con tema persistente, menú responsivo, buscador en tiempo real, formulario validado y consumo de la API REST de GitHub.',
            tecnologias: ['HTML5', 'CSS3', 'JavaScript ES6+', 'Fetch API', 'GitHub Pages'],
            rol: 'Autora y desarrolladora única del proyecto.',
            resultado: 'Sitio desplegado en GitHub Pages que cumple los criterios de estructura semántica, accesibilidad, diseño responsivo e interactividad definidos en la rúbrica del curso.',
            repositorio: 'https://github.com/ValFernAlvarez/SIS214_ExamenPractico2_FernandezValeria',
            nota: null
        })
    ]);

    app.projects = { PROYECTOS };
})(window.HojaVida = window.HojaVida || {});
