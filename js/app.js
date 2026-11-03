const CLAVE_CARRITO = 'carrito_puntofit';

const agregarAlCarrito = (producto) => {
  let carrito = [];

  try {
    carrito = JSON.parse(localStorage.getItem(CLAVE_CARRITO)) || [];
  } catch (error) {
    carrito = [];
  }

  if (!Array.isArray(carrito)) {
    carrito = [];
  }

  const existente = carrito.find((item) => item.id === producto.id);

  if (existente) {
    existente.cantidad = (Number(existente.cantidad) || 0) + 1;
  } else {
    carrito.push({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      imagen: producto.imagen,
      alt: producto.alt,
      cantidad: 1
    });
  }

  localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito));
  return carrito;
};

window.agregarAlCarrito = agregarAlCarrito;

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

    const precios = document.createElement('div');
    precios.className = 'precio-producto';

    if (producto.oferta && producto.precioAnterior) {
      const del = document.createElement('del');
      del.textContent = formatearPrecio(producto.precioAnterior);
      precios.appendChild(del);
    }

    const strong = document.createElement('strong');
    strong.textContent = formatearPrecio(producto.precio);
    precios.appendChild(strong);
    article.appendChild(precios);

    const boton = document.createElement('button');
    boton.type = 'button';
    boton.textContent = 'Agregar al carrito';
    boton.addEventListener('click', () => {
      agregarAlCarrito(producto);
      boton.textContent = '¡Agregado!';
      window.setTimeout(() => {
        boton.textContent = 'Agregar al carrito';
      }, 1200);
    });
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
  
  if (buscador && contenedorBuscador) {
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
  }

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

  const categoriasValidas = ['tops', 'shorts', 'conjuntos', 'calzas', 'remeras', 'joggers', 'zapatillas'];

  const capitalizar = (texto) => texto.charAt(0).toUpperCase() + texto.slice(1);

  const crearOpcionesCategoria = () => {
    const contenedor = document.getElementById('filtros-categorias');
    if (!contenedor) return;

    const categorias = new Set(categoriasValidas);
    todosLosProductos.forEach((producto) => {
      if (producto.categoria) {
        categorias.add(producto.categoria.toLowerCase());
      }
    });

    contenedor.innerHTML = '';
    categorias.forEach((categoria) => {
      const label = document.createElement('label');
      const input = document.createElement('input');
      input.type = 'checkbox';
      input.name = 'categoria';
      input.value = categoria;

      const texto = document.createElement('span');
      texto.textContent = capitalizar(categoria);

      label.appendChild(input);
      label.appendChild(texto);
      contenedor.appendChild(label);
    });
  };

  const obtenerFiltros = () => {
    const categorias = Array.from(
      document.querySelectorAll('#filtros-categorias input[type="checkbox"]:checked'),
      (input) => input.value
    );

    const precioMinInput = document.getElementById('precio-min');
    const precioMaxInput = document.getElementById('precio-max');

    return {
      categorias,
      precioMin: precioMinInput && precioMinInput.value !== '' ? Number(precioMinInput.value) : null,
      precioMax: precioMaxInput && precioMaxInput.value !== '' ? Number(precioMaxInput.value) : null
    };
  };

  const limpiarFiltros = () => {
    document.querySelectorAll('#filtros-categorias input[type="checkbox"]').forEach((input) => {
      input.checked = false;
    });

    const precioMinInput = document.getElementById('precio-min');
    const precioMaxInput = document.getElementById('precio-max');
    if (precioMinInput) precioMinInput.value = '';
    if (precioMaxInput) precioMaxInput.value = '';
  };

  const aplicarFiltros = () => {
    const contenedorCatalogo = document.querySelector('.grilla-productos[data-seccion="catalogo"]');
    if (!contenedorCatalogo || todosLosProductos.length === 0) return;

    const filtros = obtenerFiltros();
    const resumen = document.getElementById('filtros-resumen');

    if (
      filtros.precioMin !== null &&
      filtros.precioMax !== null &&
      filtros.precioMin > filtros.precioMax
    ) {
      if (resumen) resumen.textContent = 'El precio mínimo no puede ser mayor que el máximo.';
      return;
    }

    const hayFiltros =
      filtros.categorias.length > 0 || filtros.precioMin !== null || filtros.precioMax !== null;

    const seccionOfertas = document.getElementById('ofertas');
    const seccionMasVendidos = document.getElementById('mas-vendidos');

    if (!hayFiltros) {
      if (seccionOfertas) seccionOfertas.classList.remove('d-none');
      if (seccionMasVendidos) seccionMasVendidos.classList.remove('d-none');
      if (resumen) resumen.textContent = '';
      renderizarSecciones();
      return;
    }

    if (seccionOfertas) seccionOfertas.classList.add('d-none');
    if (seccionMasVendidos) seccionMasVendidos.classList.add('d-none');

    const coincidencias = todosLosProductos.filter((producto) => {
      const categoria = (producto.categoria || '').toLowerCase();
      const precio = Number(producto.precio) || 0;
      const cumpleCategoria =
        filtros.categorias.length === 0 || filtros.categorias.includes(categoria);
      const cumpleMinimo = filtros.precioMin === null || precio >= filtros.precioMin;
      const cumpleMaximo = filtros.precioMax === null || precio <= filtros.precioMax;
      return cumpleCategoria && cumpleMinimo && cumpleMaximo;
    });

    document.querySelectorAll('.grilla-productos').forEach((grilla) => {
      grilla.innerHTML = '';
    });

    if (coincidencias.length === 0) {
      const mensaje = document.createElement('p');
      mensaje.className = 'intro';
      mensaje.textContent = 'No encontramos productos con esos filtros.';
      contenedorCatalogo.appendChild(mensaje);
    } else {
      coincidencias.forEach((producto) => {
        contenedorCatalogo.appendChild(crearTarjeta(producto));
      });
    }

    if (resumen) {
      resumen.textContent =
        coincidencias.length === 1
          ? '1 producto encontrado con los filtros aplicados.'
          : `${coincidencias.length} productos encontrados con los filtros aplicados.`;
    }
  };

  const sincronizarFiltrosConHash = () => {
    if (todosLosProductos.length === 0) return;
    if (!document.querySelector('.grilla-productos')) return;

    const hash = window.location.hash.replace('#', '').toLowerCase();
    limpiarFiltros();

    if (hash && categoriasValidas.includes(hash)) {
      const input = Array.from(
        document.querySelectorAll('#filtros-categorias input[type="checkbox"]'),
        (checkbox) => checkbox
      ).find((checkbox) => checkbox.value === hash);

      if (input) input.checked = true;
    }

    aplicarFiltros();
  };

  const formFiltros = document.getElementById('form-filtros');
  if (formFiltros) {
    let temporizadorPrecios = null;

    const aplicarFiltrosConRetraso = () => {
      window.clearTimeout(temporizadorPrecios);
      temporizadorPrecios = window.setTimeout(aplicarFiltros, 300);
    };

    formFiltros.addEventListener('submit', (evento) => {
      evento.preventDefault();
      aplicarFiltros();
    });

    formFiltros.addEventListener('reset', () => {
      window.clearTimeout(temporizadorPrecios);
      window.setTimeout(() => {
        if (window.location.hash) {
          history.replaceState(null, '', window.location.pathname + window.location.search);
        }
        aplicarFiltros();
      }, 0);
    });

    const contenedorCategorias = document.getElementById('filtros-categorias');
    if (contenedorCategorias) {
      contenedorCategorias.addEventListener('change', aplicarFiltros);
    }

    ['precio-min', 'precio-max'].forEach((id) => {
      const input = document.getElementById(id);
      if (!input) return;

      input.addEventListener('input', aplicarFiltrosConRetraso);
      input.addEventListener('change', () => {
        window.clearTimeout(temporizadorPrecios);
        aplicarFiltros();
      });
    });
  }

  window.addEventListener('hashchange', sincronizarFiltrosConHash);

  if (typeof obtenerProductos === 'function') {
    obtenerProductos()
      .then((productos) => {
        todosLosProductos = productos;
        crearOpcionesCategoria();
        sincronizarFiltrosConHash();
      })
      .catch((error) => {
        console.error('Error al cargar los productos:', error);
      });
  } else {
    console.error('obtenerProductos no está definido');
  }
});
