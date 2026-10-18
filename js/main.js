/**
 * main.js — Punto de entrada de la aplicación.
 *
 * Cada funcionalidad vive en su propio módulo ES6 y se inicializa desde aquí.
 */
(function (app) {
    'use strict';

    const { initTema } = app.theme;
    const { initMenu } = app.menu;
    const { initFiltroProyectos } = app.filter;
    const { initFormularioContacto } = app.contactForm;
    const { initGithub } = app.githubApi;

    initTema();
    initMenu();
    initFiltroProyectos();
    initFormularioContacto();
    initGithub();
})(window.HojaVida = window.HojaVida || {});
