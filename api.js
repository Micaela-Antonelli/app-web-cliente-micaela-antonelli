// 1. Configuración (una sola vez)
const API_PRODUCTOS = 'https://wjouzmxfnelynpwvdjxc.supabase.co/rest/v1/Products';
const API_SUCURSALES = 'https://wjouzmxfnelynpwvdjxc.supabase.co/rest/v1/Sucursales';
const KEY = 'sb_publishable_XaVveBwSlfV0jT2kCFi8Zw_j5O2KnS1';

const cabeceras = {
  apikey: KEY,
  Authorization: 'Bearer ' + KEY,
  'Content-Type': 'application/json',
  Prefer: 'return=representation'
};

// 2. Una sola función que hace el fetch para cualquier verbo y tabla
const pedirUrl = async (url, metodo, filtro, datos) => {
  const respuesta = await fetch(url + filtro, {
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

const pedirApi = (metodo, filtro, datos) => pedirUrl(API_PRODUCTOS, metodo, filtro, datos);

// 3. Los cuatro verbos
const obtenerFilas = () => pedirApi('GET', '?order=id');
const crearProducto = (producto) => pedirApi('POST', '', producto);
const actualizarProducto = (producto) => pedirApi('PATCH', '?id=eq.' + producto.id, producto);
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

const obtenerSucursales = () => pedirUrl(API_SUCURSALES, 'GET', '?order=id');