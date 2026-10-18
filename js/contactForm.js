/**
 * contactForm.js — Formulario de contacto interactivo.
 *
 * · Intercepta el evento "submit" con event.preventDefault() (sin recarga).
 * · Combina la validación nativa de HTML5 (Constraint Validation API: validity,
 *   checkValidity) con intercepciones en tiempo real mediante el evento "input".
 * · Muestra mensajes visuales de error o éxito asociados a cada campo.
 */
(function (app) {
    'use strict';

    /** Mensajes por campo y tipo de error nativo (ValidityState). */
    const MENSAJES_ERROR = Object.freeze({
        nombre: {
            valueMissing: 'Escribe tu nombre completo.',
            tooShort: 'El nombre debe tener al menos 3 caracteres.'
        },
        correo: {
            valueMissing: 'Escribe tu correo electrónico.',
            typeMismatch: 'Ingresa un correo válido (ej. nombre@dominio.com).'
        },
        telefono: {
            valueMissing: 'Escribe tu número de teléfono.',
            patternMismatch: 'Ingresa un celular boliviano de 8 dígitos que empiece con 6 o 7 (ej. 70000000).'
        },
        motivo: {
            valueMissing: 'Selecciona un motivo de contacto.'
        },
        fecha_respuesta: {
            rangeUnderflow: 'La fecha no puede ser anterior a hoy.',
            rangeOverflow: 'Elige una fecha dentro del próximo año.',
            badInput: 'La fecha ingresada no es válida.'
        },
        mensaje: {
            valueMissing: 'Escribe tu mensaje.',
            tooShort: 'El mensaje debe tener al menos 10 caracteres.'
        },
        aceptacion: {
            valueMissing: 'Debes aceptar el uso de tus datos para poder enviar el formulario.'
        }
    });

    const MENSAJE_EXITO = 'Campo válido ✓';
    const MENSAJE_GENERICO = 'Este campo no es válido.';

    /** Obtiene el mensaje que corresponde al primer error nativo del campo. */
    function obtenerMensajeError(campo) {
        const mensajesCampo = MENSAJES_ERROR[campo.id] ?? {};
        const tipoError = Object.keys(mensajesCampo).find((tipo) => campo.validity[tipo]);
        return tipoError ? mensajesCampo[tipoError] : MENSAJE_GENERICO;
    }

    /** Formatea una fecha como AAAA-MM-DD usando la hora local. */
    const formatearFecha = (fecha) =>
        `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}-${String(fecha.getDate()).padStart(2, '0')}`;

    /** Inicializa el formulario de contacto. */
    function initFormularioContacto() {
        const formulario = document.getElementById('form_contacto');
        if (!formulario) return;

        const estado = document.getElementById('form_status');
        const campos = Array.from(formulario.querySelectorAll('input:not([type="reset"]), select, textarea'));

        // La fecha de respuesta preferida va desde hoy hasta dentro de un año
        const campoFecha = document.getElementById('fecha_respuesta');
        if (campoFecha) {
            const hoy = new Date();
            const dentroDeUnAnio = new Date(hoy.getFullYear() + 1, hoy.getMonth(), hoy.getDate());
            campoFecha.min = formatearFecha(hoy);
            campoFecha.max = formatearFecha(dentroDeUnAnio);
        }

        /** Pinta el resultado de la validación junto al campo. */
        function mostrarResultado(campo, valido) {
            const contenedor = document.getElementById(`${campo.id}_error`);
            const vacioOpcional = !campo.required && campo.value === '';

            campo.classList.toggle('is_invalid', !valido);
            campo.classList.toggle('is_valid', valido && !vacioOpcional);

            if (valido) {
                campo.removeAttribute('aria-invalid');
            } else {
                campo.setAttribute('aria-invalid', 'true');
            }

            if (!contenedor) return;
            contenedor.classList.toggle('is_error', !valido);
            contenedor.classList.toggle('is_success', valido && !vacioOpcional);
            contenedor.textContent = valido
                ? (vacioOpcional ? '' : MENSAJE_EXITO)
                : obtenerMensajeError(campo);
        }

        /** Valida un campo con la API nativa y actualiza su interfaz. */
        function validarCampo(campo) {
            const valido = campo.checkValidity();
            mostrarResultado(campo, valido);
            return valido;
        }

        function limpiarCampo(campo) {
            const contenedor = document.getElementById(`${campo.id}_error`);
            campo.classList.remove('is_invalid', 'is_valid');
            campo.removeAttribute('aria-invalid');
            if (contenedor) {
                contenedor.textContent = '';
                contenedor.classList.remove('is_error', 'is_success');
            }
        }

        function mostrarEstadoGeneral(mensaje, tipo) {
            estado.textContent = mensaje;
            estado.classList.toggle('is_success', tipo === 'success');
            estado.classList.toggle('is_error', tipo === 'error');
        }

        // Validación en tiempo real: cada pulsación (input) y al salir del campo (blur)
        campos.forEach((campo) => {
            campo.addEventListener('input', () => validarCampo(campo));
            campo.addEventListener('blur', () => {
                if (campo.required || campo.value !== '') validarCampo(campo);
            });
        });

        // Interceptación del ciclo de vida de "submit": no hay recarga de página
        formulario.addEventListener('submit', (evento) => {
            evento.preventDefault();

            const resultados = campos.map((campo) => ({ campo, valido: validarCampo(campo) }));
            const primerInvalido = resultados.find(({ valido }) => !valido);

            if (primerInvalido) {
                mostrarEstadoGeneral('Por favor corrige los campos marcados antes de enviar.', 'error');
                primerInvalido.campo.focus();
                return;
            }

            const { nombre } = Object.fromEntries(new FormData(formulario));
            formulario.reset();
            mostrarEstadoGeneral(
                `¡Gracias, ${nombre.trim()}! Tu mensaje fue validado correctamente. ` +
                'Este sitio es estático (sin servidor), por lo que el mensaje no se envía a ningún lugar.',
                'success'
            );
        });

        // Al limpiar el formulario se borran también los mensajes y estados visuales
        formulario.addEventListener('reset', () => {
            campos.forEach(limpiarCampo);
            mostrarEstadoGeneral('', null);
        });
    }

    app.contactForm = { initFormularioContacto };
})(window.HojaVida = window.HojaVida || {});
