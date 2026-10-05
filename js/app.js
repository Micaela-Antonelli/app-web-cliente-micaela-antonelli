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

  fetch('data/productos.json')
    .then((respuesta) => respuesta.json())
    .then((datos) => {
      const productosPorId = {};
      datos.productos.forEach((producto) => {
        productosPorId[producto.id] = producto;
      });

      Object.entries(secciones).forEach(([seccion, ids]) => {
        const contenedor = document.querySelector(`.grilla-productos[data-seccion="${seccion}"]`);
        if (!contenedor) return;

        ids.forEach((id) => {
          const producto = productosPorId[id];
          if (producto) {
            contenedor.appendChild(crearTarjeta(producto));
          }
        });
      });
    })
    .catch((error) => {
      console.error('Error al cargar los productos:', error);
    });
});
