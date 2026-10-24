const lista = document.getElementById('lista-productos');
const form = document.getElementById('form-producto');

// GET: trae los productos y dibuja la lista
const mostrarProductos = async () => {
  try {
    const productos = await obtenerFilas();
    lista.innerHTML = '';

    productos.forEach((producto) => {
      const li = document.createElement('li');
      li.textContent = producto.name + ' - $' + producto.price + ' ';

      const botonEditar = document.createElement('button');
      botonEditar.textContent = 'Cambiar precio';
      botonEditar.addEventListener('click', () => cambiarPrecio(producto));

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

// POST: crea un producto con los datos del formulario
form.addEventListener('submit', async (evento) => {
  evento.preventDefault();
  try {
    await crearProducto({
      name: document.getElementById('nombre').value,
      price: Number(document.getElementById('precio').value),
      category: document.getElementById('categoria').value,
      image: document.getElementById('imagen').value,
      offer: false
    });
    form.reset();
    mostrarProductos();
  } catch (error) {
    alert(error.message);
  }
});

// PUT: manda el producto completo con el precio nuevo
const cambiarPrecio = async (producto) => {
  const nuevoPrecio = prompt('Nuevo precio para ' + producto.name, producto.price);
  if (!nuevoPrecio) return;
  try {
    producto.price = Number(nuevoPrecio);
    await reemplazarProducto(producto);
    mostrarProductos();
  } catch (error) {
    alert(error.message);
  }
};

// DELETE: borra el producto por su id
const borrar = async (id) => {
  if (!confirm('¿Seguro que querés borrarlo?')) return;
  try {
    await borrarProducto(id);
    mostrarProductos();
  } catch (error) {
    alert(error.message);
  }
};

mostrarProductos();