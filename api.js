// 1. Configuración (una sola vez)
const API_PRODUCTOS = 'https://wjouzmxfnelynpwvdjxc.supabase.co/rest/v1/Products';
const KEY = 'sb_publishable_XaVveBwSlfV0jT2kCFi8Zw_j5O2KnS1';

const cabeceras = {
  apikey: KEY,
  Authorization: 'Bearer ' + KEY,
  'Content-Type': 'application/json',
  Prefer: 'return=representation'
};

// 2. Una sola función que hace el fetch para cualquier verbo
const pedirApi = async (metodo, filtro, datos) => {
  const respuesta = await fetch(API_PRODUCTOS + filtro, {
    method: metodo,
    headers: cabeceras,
    body: JSON.stringify(datos)
  });

  // fetch no da error con un 400 o un 500: hay que revisarlo a mano
  if (!respuesta.ok) {
    throw new Error('Error ' + respuesta.status);
  }

  return respuesta.json();
};

// 3. Los cuatro verbos
const obtenerFilas = () => pedirApi('GET', '?order=id');
const crearProducto = (producto) => pedirApi('POST', '', producto);
const reemplazarProducto = (producto) => pedirApi('PUT', '?id=eq.' + producto.id, producto);
const borrarProducto = (id) => pedirApi('DELETE', '?id=eq.' + id);

// 4. La tienda usa nombres en español: traducimos cada fila de la tabla
const traducirProducto = (fila) => ({
  id: fila.name.trim().toLowerCase().replaceAll(' ', '-'),
  nombre: fila.name.trim(),
  precio: fila.price,
  precioAnterior: fila.previous_price,
  categoria: fila.category,
  imagen: fila.image,
  alt: fila.alt,
  descripcion: fila.description,
  oferta: fila.offer
});

const obtenerProductos = async () => {
  const filas = await obtenerFilas();
  return filas.map(traducirProducto);
};