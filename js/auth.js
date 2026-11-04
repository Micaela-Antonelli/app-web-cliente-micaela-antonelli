(() => {
  const CLAVE_USUARIO = 'usuario_puntofit';
  const CLAVE_SESION = 'sesion_puntofit';

  const leer = (clave) => {
    try {
      const datos = JSON.parse(localStorage.getItem(clave));
      return datos && typeof datos === 'object' ? datos : null;
    } catch (error) {
      return null;
    }
  };

  const guardar = (clave, valor) => {
    localStorage.setItem(clave, JSON.stringify(valor));
  };

  const obtenerNombre = (usuario) => {
    if (!usuario) return '';
    const nombre = (usuario.nombre || '').trim();
    if (nombre) return nombre;
    return (usuario.email || '').split('@')[0];
  };

  const actualizarHeader = () => {
    const acciones = document.querySelector('.header-actions');
    if (!acciones) return;

    const enlaceIngresar = acciones.querySelector('a[href="login.html"]');
    const enlaceRegistro = acciones.querySelector('a[href="registro.html"]');
    if (!enlaceIngresar || !enlaceRegistro) return;

    const sesion = leer(CLAVE_SESION);
    if (!sesion) return;

    const saludo = document.createElement('span');
    saludo.className = 'login-link';
    saludo.textContent = 'Hola, ' + obtenerNombre(sesion);

    const salir = document.createElement('a');
    salir.href = '#';
    salir.className = 'login-link';
    salir.textContent = 'Cerrar sesión';
    salir.addEventListener('click', (evento) => {
      evento.preventDefault();
      localStorage.removeItem(CLAVE_SESION);
      window.location.reload();
    });

    enlaceIngresar.replaceWith(saludo);
    enlaceRegistro.replaceWith(salir);
  };

  const iniciarLogin = () => {
    const form = document.getElementById('form-login');
    if (!form) return;

    form.addEventListener('submit', (evento) => {
      evento.preventDefault();

      const email = document.getElementById('login-email').value.trim();
      const registrado = leer(CLAVE_USUARIO);

      const sesion =
        registrado && registrado.email === email ? registrado : { nombre: '', email };

      guardar(CLAVE_SESION, sesion);
      window.location.href = 'index.html';
    });
  };

  const iniciarRegistro = () => {
    const form = document.getElementById('form-registro');
    if (!form) return;

    form.addEventListener('submit', (evento) => {
      evento.preventDefault();

      const password = document.getElementById('reg-password').value;
      const confirmacion = document.getElementById('reg-password-confirm').value;

      if (password !== confirmacion) {
        alert('Las contraseñas no coinciden.');
        return;
      }

      const usuario = {
        nombre: document.getElementById('reg-nombre').value.trim(),
        apellido: document.getElementById('reg-apellido').value.trim(),
        email: document.getElementById('reg-email').value.trim()
      };

      guardar(CLAVE_USUARIO, usuario);
      guardar(CLAVE_SESION, usuario);
      window.location.href = 'index.html';
    });
  };

  document.addEventListener('DOMContentLoaded', () => {
    actualizarHeader();
    iniciarLogin();
    iniciarRegistro();
  });
})();
