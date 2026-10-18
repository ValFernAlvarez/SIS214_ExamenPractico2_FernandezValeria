# Hoja de Vida Web Interactiva — Valeria Fernández

Segundo Examen Práctico (Unidad II) · **Tecnologías Web I (SIS-214)** · Universidad Católica Boliviana "San Pablo"

| | |
|---|---|
| **Estudiante** | Valeria Christen Fernández Álvarez |
| **Repositorio** | https://github.com/ValFernAlvarez/SIS214_ExamenPractico2_FernandezValeria |
| **Producción (GitHub Pages)** | https://valfernalvarez.github.io/SIS214_ExamenPractico2_FernandezValeria/ |

CV / portafolio profesional de una sola página, construido con **HTML5 semántico, CSS3 mobile-first y JavaScript ES6+ modular**, sin frameworks ni librerías. Parte de la hoja de vida de la Unidad I y le suma interactividad dinámica.

## Tecnologías

- HTML5 semántico + WAI-ARIA
- CSS3: custom properties, Flexbox, Grid, Media Queries (mobile-first)
- JavaScript ES6+: un archivo por funcionalidad (patrón módulo con IIFE y espacio de nombres `HojaVida`), `async/await`, Fetch API, `localStorage`
- Git + GitHub + GitHub Pages


```bash
python3 -m http.server 8000   # y abrir http://localhost:8000
```

> La sección de GitHub necesita conexión a internet.

## Arquitectura

```
.
├── index.html              # Estructura semántica (header, nav, main, section, article, aside, footer)
├── css/
│   ├── tokens.css          # :root con tokens + tema oscuro + reset universal
│   ├── base.css            # Tipografía, enlaces, botones, accesibilidad
│   ├── layout.css          # Header, menú, secciones, pie (Grid/Flexbox + media queries)
│   └── components.css      # Tarjetas, formulario, buscador, estados de la API
├── js/
│   ├── preload.js          # Script clásico en <head>: aplica el tema antes del primer pintado
│   ├── main.js             # Punto de entrada: inicializa los módulos (se carga al final)
│   ├── theme.js            # 1. Tema oscuro/claro persistente
│   ├── menu.js             # 2. Menú hamburguesa ARIA
│   ├── filter.js           # 3. Buscador en tiempo real
│   ├── contactForm.js      # 4. Formulario con validación
│   ├── githubApi.js        # 5. Fetch a la API REST de GitHub
│   ├── data/projects.js    # Datos originales
│   └── utils/{storage,dom}.js
├── assets/                 # Imágenes, audio, video y PDF del CV

```

### Diseño responsivo (mobile-first)

Los estilos base son los de móvil; se amplían con `min-width`:

| Rango | Media query | Cambios principales |
|---|---|---|
| Móvil | base (< 768px) | Una columna, menú hamburguesa |
| Tablet | `768px – 1024px` | Encabezado en Grid de 2 columnas, tarjetas en 2 columnas, menú hamburguesa en 2 columnas |
| Escritorio | `> 1024px` (`min-width: 1025px`) | Menú completo visible, multimedia y repositorios en 3 columnas, formulario en 2 columnas |

**Flexbox** se usa en navegación, botones, chips y etiquetas; **Grid** en el encabezado, las listas de tarjetas, multimedia y el formulario. Los tokens (`--primary-color`, `--secondary-color`, `--bg-color`, `--text-color`, `--font-family-base`, `--spacing-unit`) están en `:root` junto con la regla de reset `* { box-sizing: border-box; margin: 0; padding: 0; }`.

### Las 5 funcionalidades JavaScript

1. **Tema Dark/Light** (`theme.js`): alterna `data-theme` en `<html>`; guarda `{"tema":"dark"}` con `JSON.stringify()` y lo restaura con `JSON.parse()` (`utils/storage.js`, protegido con `try...catch`). `preload.js` evita el parpadeo al recargar.
2. **Menú hamburguesa** (`menu.js`): evento `click` conmuta la clase `is_open` y muta `aria-expanded` (`true`/`false`); cierra con Escape, clic en enlace o clic fuera.
3. **Buscador en tiempo real** (`filter.js`): evento `input`; los datos originales están congelados con `Object.freeze` y se procesan con `PROYECTOS.filter(...).map(...)` sin mutarlos. Normaliza tildes y mayúsculas, y anuncia resultados con `aria-live`.
4. **Formulario de contacto** (`contactForm.js`): intercepta `submit` con `event.preventDefault()`; usa la Constraint Validation API de HTML5 (`validity`, `checkValidity`) y el evento `input` para mostrar mensajes de error/éxito por campo. *El sitio es estático: el mensaje se valida pero no se envía a un servidor.*
5. **Módulo asíncrono** (`githubApi.js`): `fetch` + `async/await` hacia `https://api.github.com/users/ValFernAlvarez` y sus repositorios, en `try...catch`, evaluando `response.ok` y mapeando 400, 403, 404 y 5xx a mensajes específicos. La interfaz muestra los estados **loading**, **success** y **error** (con botón *Reintentar* y tiempo de espera de 10 s).

### Accesibilidad

`lang="es"`, enlace "Saltar al contenido", `aria-label`, `aria-expanded`, `aria-controls`, `aria-pressed`, `aria-live`, `aria-invalid`, `role="search"`/`status`/`alert`, foco visible, `prefers-reduced-motion`. Sin `<div>` ni `<span>`: todo el marcado usa elementos semánticos.
