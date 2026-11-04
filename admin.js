const lista = document.getElementById('lista-productos');
const form = document.getElementById('form-producto');
const botonGuardar = document.getElementById('boton-guardar');
const botonCancelar = document.getElementById('boton-cancelar');

let productoEditandoId = null;

// GET: trae los productos y dibuja la lista
const mostrarProductos = async () => {
  try {
    const productos = await obtenerFilas();
    lista.innerHTML = '';

    productos.forEach((producto) => {
      const li = document.createElement('li');
      li.textContent = producto.name + ' - $' + producto.price + ' ';

      const botonEditar = document.createElement('button');
      botonEditar.textContent = 'Editar';
      botonEditar.addEventListener('click', () => cargarEnFormulario(producto));

      const botonBorrar = document.createElement('button');
      botonBorrar.textContent = 'Borrar';
      botonBorrar.addEventListener('click', () => borrar(producto.id));

      li.append(botonEditar, botonBorrar);
      lista.appendChild(li);
    });
  } catch (error) {
    alert(error.message);
  }
};

// Lee todos los campos del formulario con los nombres de columnas de Supabase
const leerFormulario = () => {
  const precioAnterior = document.getElementById('precio-anterior').value;
  const imagen = document.getElementById('imagen').value.trim();
  const alt = document.getElementById('alt').value.trim();
  const descripcion = document.getElementById('descripcion').value.trim();

  return {
    name: document.getElementById('nombre').value.trim(),
    price: Number(document.getElementById('precio').value),
    previous_price: precioAnterior === '' ? null : Number(precioAnterior),
    category: document.getElementById('categoria').value.trim(),
    image: imagen || null,
    alt: alt || null,
    description: descripcion || null,
    offer: document.getElementById('oferta').checked
  };
};

// Carga un producto en el formulario y activa el modo edición
const cargarEnFormulario = (producto) => {
  productoEditandoId = producto.id;

  document.getElementById('nombre').value = producto.name || '';
  document.getElementById('precio').value = producto.price ?? '';
  document.getElementById('precio-anterior').value = producto.previous_price ?? '';
  document.getElementById('categoria').value = producto.category || '';
  document.getElementById('imagen').value = producto.image || '';
  document.getElementById('alt').value = producto.alt || '';
  document.getElementById('descripcion').value = producto.description || '';
  document.getElementById('oferta').checked = Boolean(producto.offer);

  botonGuardar.textContent = 'Guardar cambios';
  botonCancelar.hidden = false;
  form.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

// Vuelve al modo creación y limpia el formulario
const salirModoEdicion = () => {
  productoEditandoId = null;
  form.reset();
  botonGuardar.textContent = 'Crear producto';
  botonCancelar.hidden = true;
};

// POST o PATCH según corresponda: crea un producto o guarda los cambios
form.addEventListener('submit', async (evento) => {
  evento.preventDefault();

  try {
    const datos = leerFormulario();

    if (productoEditandoId !== null) {
      await actualizarProducto({ id: productoEditandoId, ...datos });
    } else {
      await crearProducto(datos);
    }

    salirModoEdicion();
    mostrarProductos();
  } catch (error) {
    alert(error.message);
  }
});

botonCancelar.addEventListener('click', salirModoEdicion);

// DELETE: borra el producto por su id
const borrar = async (id) => {
  if (!confirm('¿Seguro que querés borrarlo?')) return;
  try {
    await borrarProducto(id);
    if (productoEditandoId === id) salirModoEdicion();
    mostrarProductos();
  } catch (error) {
    alert(error.message);
  }
};

mostrarProductos();
