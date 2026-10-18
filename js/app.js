document.addEventListener('DOMContentLoaded', () => {
  const secciones = {
    catalogo: [
      'calza-power-flex',
      'top-training-supreme',
      'conjunto-run-flex',
      'remera-performance',
      'legging-studio-fit',
      'pollera-active-motion',
      'top-sweat-pro',
      'conjunto-dikka'
    ],
    ofertas: [
      'pollera-active-motion',
      'top-sweat-pro',
      'top-training-supreme',
      'calza-power-flex'
    ],
    'mas-vendidos': [
      'remera-performance',
      'legging-studio-fit',
      'performance-runner',
      'conjunto-run-flex'
    ]
  };

  const formatearPrecio = (precio) => {
    return '$' + precio.toLocaleString('es-AR');
  };

  const crearTarjeta = (producto) => {
    const article = document.createElement('article');

    const enlace = document.createElement('a');
    enlace.href = `producto.html#${producto.id}`;

    const img = document.createElement('img');
    img.src = producto.imagen;
    img.alt = producto.alt;
    enlace.appendChild(img);

    const h3 = document.createElement('h3');
    const enlaceNombre = document.createElement('a');
    enlaceNombre.href = `producto.html#${producto.id}`;
    enlaceNombre.textContent = producto.nombre;
    h3.appendChild(enlaceNombre);

    article.appendChild(enlace);
    article.appendChild(h3);

    if (producto.oferta && producto.precioAnterior) {
      const del = document.createElement('del');
      del.textContent = formatearPrecio(producto.precioAnterior);
      article.appendChild(del);
    }

    const strong = document.createElement('strong');
    strong.textContent = formatearPrecio(producto.precio);
    article.appendChild(strong);

    const boton = document.createElement('button');
    boton.type = 'button';
    boton.textContent = 'Agregar al carrito';
    article.appendChild(boton);

    return article;
  };

  let todosLosProductos = [];

  const crearDropdownResultados = () => {
    const dropdown = document.createElement('div');
    dropdown.id = 'search_results_dropdown';
    dropdown.className = 'search-dropdown d-none';
    dropdown.setAttribute('role', 'listbox');
    dropdown.setAttribute('aria-label', 'Resultados de búsqueda');
    return dropdown;
  };

  const renderizarResultados = (productos, dropdown) => {
    dropdown.innerHTML = '';

    if (productos.length === 0) {
      const sinResultados = document.createElement('div');
      sinResultados.className = 'search-dropdown__sin-resultados';
      sinResultados.textContent = 'Sin resultados';
      sinResultados.setAttribute('role', 'option');
      dropdown.appendChild(sinResultados);
      return;
    }

    productos.forEach((producto) => {
      const enlace = document.createElement('a');
      enlace.href = `producto.html#${producto.id}`;
      enlace.className = 'search-dropdown__item';
      enlace.setAttribute('role', 'option');

      const img = document.createElement('img');
      img.src = producto.imagen;
      img.alt = producto.alt;
      enlace.appendChild(img);

      const info = document.createElement('div');
      info.className = 'search-dropdown__info';

      const nombre = document.createElement('span');
      nombre.className = 'search-dropdown__nombre';
      nombre.textContent = producto.nombre;
      info.appendChild(nombre);

      const precio = document.createElement('span');
      precio.className = 'search-dropdown__precio';
      precio.textContent = formatearPrecio(producto.precio);
      info.appendChild(precio);

      enlace.appendChild(info);
      dropdown.appendChild(enlace);
    });
  };

  const ocultarDropdown = (dropdown) => {
    dropdown.classList.add('d-none');
  };

  const mostrarDropdown = (dropdown) => {
    dropdown.classList.remove('d-none');
  };

  const buscador = document.getElementById('buscar');
  const contenedorBuscador = document.querySelector('.buscador-contenedor');
  const dropdown = crearDropdownResultados();
  contenedorBuscador.appendChild(dropdown);

  buscador.addEventListener('input', () => {
    const valor = buscador.value.trim().toLowerCase();

    if (valor.length < 3) {
      ocultarDropdown(dropdown);
      return;
    }

    const coincidencias = todosLosProductos.filter((producto) =>
      producto.nombre.toLowerCase().includes(valor) ||
      producto.categoria.toLowerCase().includes(valor)
    );

    renderizarResultados(coincidencias, dropdown);
    mostrarDropdown(dropdown);
  });

  document.addEventListener('click', (evento) => {
    if (!contenedorBuscador.contains(evento.target)) {
      ocultarDropdown(dropdown);
    }
  });

  buscador.addEventListener('keydown', (evento) => {
    if (evento.key === 'Escape') {
      ocultarDropdown(dropdown);
      buscador.blur();
    }
  });

  const renderizarSecciones = () => {
    const productosPorId = {};
    todosLosProductos.forEach((producto) => {
      productosPorId[producto.id] = producto;
    });

    Object.entries(secciones).forEach(([seccion, ids]) => {
      const contenedor = document.querySelector(`.grilla-productos[data-seccion="${seccion}"]`);
      if (!contenedor) return;

      contenedor.innerHTML = '';
      ids.forEach((id) => {
        const producto = productosPorId[id];
        if (producto) {
          contenedor.appendChild(crearTarjeta(producto));
        }
      });
    });
  };

  const filtrarPorCategoria = (categoria) => {
    const contenedorCatalogo = document.querySelector('.grilla-productos[data-seccion="catalogo"]');
    if (!contenedorCatalogo) return;

    const seccionOfertas = document.getElementById('ofertas');
    const seccionMasVendidos = document.getElementById('mas-vendidos');
    if (seccionOfertas) seccionOfertas.classList.add('d-none');
    if (seccionMasVendidos) seccionMasVendidos.classList.add('d-none');

    document.querySelectorAll('.grilla-productos').forEach((grilla) => {
      grilla.innerHTML = '';
    });

    const coincidencias = todosLosProductos.filter(
      (producto) => producto.categoria.toLowerCase() === categoria.toLowerCase()
    );

    if (coincidencias.length === 0) {
      const mensaje = document.createElement('p');
      mensaje.className = 'intro';
      mensaje.textContent = `Sin resultados en la categoría "${categoria}".`;
      contenedorCatalogo.appendChild(mensaje);
      return;
    }

    coincidencias.forEach((producto) => {
      contenedorCatalogo.appendChild(crearTarjeta(producto));
    });
  };

  const categoriasValidas = ['tops', 'shorts', 'conjuntos', 'calzas', 'remeras', 'joggers', 'zapatillas'];

  const aplicarFiltroDesdeHash = () => {
    if (todosLosProductos.length === 0) return;
    if (!document.querySelector('.grilla-productos')) return;

    const hash = window.location.hash.replace('#', '').toLowerCase();

    if (hash && categoriasValidas.includes(hash)) {
      filtrarPorCategoria(hash);
      return;
    }

    const seccionOfertas = document.getElementById('ofertas');
    const seccionMasVendidos = document.getElementById('mas-vendidos');
    if (seccionOfertas) seccionOfertas.classList.remove('d-none');
    if (seccionMasVendidos) seccionMasVendidos.classList.remove('d-none');
    renderizarSecciones();
  };

  window.addEventListener('hashchange', aplicarFiltroDesdeHash);

  fetch('data/productos.json')
    .then((respuesta) => respuesta.json())
    .then((datos) => {
      todosLosProductos = datos.productos;
      aplicarFiltroDesdeHash();
    })
    .catch((error) => {
      console.error('Error al cargar los productos:', error);
    });
});
