(() => {
  const CLAVE_CARRITO = 'carrito_puntofit';

  const formatearPrecio = (precio) => {
    return '$' + Number(precio).toLocaleString('es-AR');
  };

  const leerCarrito = () => {
    try {
      const datos = JSON.parse(localStorage.getItem(CLAVE_CARRITO));
      return Array.isArray(datos) ? datos : [];
    } catch (error) {
      return [];
    }
  };

  const guardarCarrito = (carrito) => {
    localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito));
  };

  const calcularTotales = (carrito) => {
    return carrito.reduce(
      (totales, item) => {
        const cantidad = Number(item.cantidad) || 0;
        const precio = Number(item.precio) || 0;

        totales.prendas += cantidad;
        totales.subtotal += precio * cantidad;

        return totales;
      },
      { prendas: 0, subtotal: 0 }
    );
  };

  const actualizarResumen = (carrito) => {
    const { prendas, subtotal } = calcularTotales(carrito);

    const subtotalCarrito = document.getElementById('carrito-subtotal');
    const totalCarrito = document.getElementById('carrito-total');
    const resumenCantidad = document.getElementById('resumen-cantidad');
    const resumenTotal = document.getElementById('resumen-total');

    if (subtotalCarrito) subtotalCarrito.textContent = formatearPrecio(subtotal);
    if (totalCarrito) totalCarrito.textContent = formatearPrecio(subtotal);
    if (resumenCantidad) resumenCantidad.textContent = prendas;
    if (resumenTotal) resumenTotal.textContent = formatearPrecio(subtotal);
  };

  const crearFila = (item, carrito) => {
    const fila = document.createElement('tr');

    const celdaProducto = document.createElement('td');
    const enlace = document.createElement('a');
    enlace.href = `producto.html#${item.id}`;
    enlace.textContent = item.nombre;
    celdaProducto.appendChild(enlace);
    fila.appendChild(celdaProducto);

    const celdaPrecio = document.createElement('td');
    celdaPrecio.textContent = formatearPrecio(item.precio);
    fila.appendChild(celdaPrecio);

    const celdaCantidad = document.createElement('td');
    const stepper = document.createElement('div');
    stepper.className = 'cantidad-stepper';

    const restar = document.createElement('button');
    restar.type = 'button';
    restar.setAttribute('aria-label', 'Restar cantidad');
    restar.textContent = '−';

    const input = document.createElement('input');
    input.type = 'number';
    input.min = '1';
    input.value = item.cantidad;
    input.name = 'cantidad';
    input.setAttribute('aria-label', 'Cantidad');

    const sumar = document.createElement('button');
    sumar.type = 'button';
    sumar.setAttribute('aria-label', 'Sumar cantidad');
    sumar.textContent = '+';

    restar.addEventListener('click', () => {
      actualizarCantidad(carrito, item.id, Number(item.cantidad) - 1);
    });

    sumar.addEventListener('click', () => {
      actualizarCantidad(carrito, item.id, Number(item.cantidad) + 1);
    });

    input.addEventListener('change', () => {
      actualizarCantidad(carrito, item.id, parseInt(input.value, 10));
    });

    stepper.appendChild(restar);
    stepper.appendChild(input);
    stepper.appendChild(sumar);
    celdaCantidad.appendChild(stepper);
    fila.appendChild(celdaCantidad);

    const celdaSubtotal = document.createElement('td');
    const cantidad = Number(item.cantidad) || 0;
    const precio = Number(item.precio) || 0;
    celdaSubtotal.textContent = formatearPrecio(precio * cantidad);
    fila.appendChild(celdaSubtotal);

    const celdaQuitar = document.createElement('td');
    const botonEliminar = document.createElement('button');
    botonEliminar.type = 'button';
    botonEliminar.className = 'btn-eliminar';
    botonEliminar.setAttribute('aria-label', 'Eliminar producto');
    botonEliminar.innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>';

    botonEliminar.addEventListener('click', () => {
      eliminarProducto(item.id);
    });

    celdaQuitar.appendChild(botonEliminar);
    fila.appendChild(celdaQuitar);

    return fila;
  };

  const actualizarCantidad = (carrito, id, cantidad) => {
    const item = carrito.find((producto) => producto.id === id);
    if (!item) return;

    item.cantidad = Math.max(1, Number(cantidad) || 1);
    guardarCarrito(carrito);
    renderizarCarrito();
  };

  const eliminarProducto = (id) => {
    const carrito = leerCarrito().filter((item) => item.id !== id);
    guardarCarrito(carrito);
    renderizarCarrito();
  };

  const renderizarCarrito = () => {
    const tbody = document.getElementById('carrito-items');
    if (!tbody) return;

    const carrito = leerCarrito();
    tbody.innerHTML = '';

    if (carrito.length === 0) {
      const filaVacia = document.createElement('tr');
      filaVacia.className = 'carrito-vacio';

      const celdaVacia = document.createElement('td');
      celdaVacia.colSpan = 5;
      celdaVacia.textContent = 'Carrito vacío';

      filaVacia.appendChild(celdaVacia);
      tbody.appendChild(filaVacia);
    } else {
      carrito.forEach((item) => {
        tbody.appendChild(crearFila(item, carrito));
      });
    }

    actualizarResumen(carrito);
  };

  const iniciarFormulario = () => {
    const form = document.getElementById('form-compra');
    if (!form) return;

    form.addEventListener('submit', (evento) => {
      evento.preventDefault();

      const carrito = leerCarrito();

      if (carrito.length === 0) {
        alert('Tu carrito está vacío. Agregá productos antes de finalizar la compra.');
        return;
      }

      const nombre = document.getElementById('compra-nombre').value.trim();
      const { prendas, subtotal } = calcularTotales(carrito);

      alert(
        `¡Gracias por tu compra, ${nombre || 'cliente'}! Confirmaste ${prendas} prenda(s) por ${formatearPrecio(subtotal)}.`
      );

      localStorage.removeItem(CLAVE_CARRITO);
      form.reset();
      renderizarCarrito();
    });
  };

  document.addEventListener('DOMContentLoaded', () => {
    renderizarCarrito();
    iniciarFormulario();
  });

  window.addEventListener('storage', (evento) => {
    if (evento.key === CLAVE_CARRITO) {
      renderizarCarrito();
    }
  });
})();
