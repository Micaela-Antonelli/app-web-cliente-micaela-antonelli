const crearBoton = (href, clase, texto) => {
  const enlace = document.createElement('a');
  enlace.href = href;
  enlace.className = clase;
  enlace.target = '_blank';
  enlace.rel = 'noopener noreferrer';
  enlace.textContent = texto;
  return enlace;
};

const crearSucursal = (sucursal) => {
  const card = document.createElement('div');
  card.className = 'sucursal-card';

  const info = document.createElement('div');
  info.className = 'sucursal-info';

  const titulo = document.createElement('h2');
  titulo.textContent = sucursal.name;
  info.appendChild(titulo);

  const direccion = document.createElement('p');
  direccion.className = 'direccion';
  direccion.textContent = sucursal.address;
  info.appendChild(direccion);

  if (sucursal.hours) {
    const horario = document.createElement('p');
    horario.className = 'horario';

    const etiqueta = document.createElement('strong');
    etiqueta.textContent = 'Horario: ';

    horario.appendChild(etiqueta);
    horario.appendChild(document.createTextNode(sucursal.hours));
    info.appendChild(horario);
  }

  const acciones = document.createElement('div');
  acciones.className = 'sucursal-acciones';

  if (sucursal.whatsapp) {
    acciones.appendChild(
      crearBoton(
        'https://wa.me/' + sucursal.whatsapp,
        'btn-whatsapp',
        'Contactar por WhatsApp'
      )
    );
  }

  if (sucursal.maps_url) {
    acciones.appendChild(crearBoton(sucursal.maps_url, 'btn-direcciones', 'Cómo llegar'));
  }

  if (acciones.children.length > 0) {
    info.appendChild(acciones);
  }

  card.appendChild(info);

  if (sucursal.map_embed) {
    const mapa = document.createElement('div');
    mapa.className = 'sucursal-map';

    const iframe = document.createElement('iframe');
    iframe.src = sucursal.map_embed;
    iframe.loading = 'lazy';
    iframe.title = 'Mapa de ' + sucursal.name;
    iframe.setAttribute('allowfullscreen', '');
    iframe.setAttribute('referrerpolicy', 'no-referrer-when-downgrade');

    mapa.appendChild(iframe);
    card.appendChild(mapa);
  }

  return card;
};

const mostrarSucursales = async () => {
  const contenedor = document.getElementById('lista-sucursales');
  if (!contenedor) return;

  try {
    const sucursales = await obtenerSucursales();
    contenedor.innerHTML = '';

    if (sucursales.length === 0) {
      const mensaje = document.createElement('p');
      mensaje.className = 'intro';
      mensaje.textContent = 'No hay sucursales cargadas por el momento.';
      contenedor.appendChild(mensaje);
      return;
    }

    sucursales.forEach((sucursal) => {
      contenedor.appendChild(crearSucursal(sucursal));
    });
  } catch (error) {
    contenedor.innerHTML = '';

    const mensaje = document.createElement('p');
    mensaje.className = 'intro';
    mensaje.textContent = 'No pudimos cargar las sucursales. Intentá de nuevo más tarde.';
    contenedor.appendChild(mensaje);

    console.error('Error al cargar las sucursales:', error);
  }
};

document.addEventListener('DOMContentLoaded', mostrarSucursales);
