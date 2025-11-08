/**
 * CRUD PARA GESTIÓN DE PRODUCTOS
 */

let productos = [];
let categorias = [];
let productoEditando = null;
let productoAEliminar = null;

document.addEventListener("DOMContentLoaded", () => {
  inicializarControlProductos();
  cargarDatos();
});

function inicializarControlProductos() {
  // Botones principales
  document.getElementById('btn-nuevo-producto').addEventListener('click', () => {
    abrirModalNuevoProducto();
  });
  
  document.getElementById('btn-crear-primer-producto').addEventListener('click', () => {
    abrirModalNuevoProducto();
  });

  // Formulario producto
  document.getElementById('form-producto').addEventListener('submit', guardarProducto);
  document.getElementById('btn-cancelar-producto').addEventListener('click', () => {
    cerrarModal('modalProducto');
  });

  // Modal eliminar
  document.getElementById('btn-cancelar-eliminar-producto').addEventListener('click', () => {
    cerrarModal('modalConfirmarEliminarProducto');
  });
  document.getElementById('btn-confirmar-eliminar-producto').addEventListener('click', confirmarEliminacionProducto);

  // Filtros
  document.getElementById('filtro-categoria').addEventListener('change', filtrarProductos);
  document.getElementById('filtro-estado').addEventListener('change', filtrarProductos);
  document.getElementById('filtro-stock').addEventListener('change', filtrarProductos);
  document.getElementById('buscar-producto').addEventListener('input', filtrarProductos);
  document.querySelector('.btn-buscar').addEventListener('click', () => {
    filtrarProductos();
  });

  // Cerrar modales
  document.querySelectorAll('.modal .cerrar').forEach(btn => {
    btn.addEventListener('click', function() {
      cerrarModal(this.closest('.modal').id);
    });
  });
}

function cargarDatos() {
  // Cargar categorías
  const categoriasGuardadas = localStorage.getItem('categoriasDelicia');
  if (categoriasGuardadas) {
    categorias = JSON.parse(categoriasGuardadas);
  } else {
    // Si no hay categorías, crear algunas por defecto
    categorias = [
      { id: 1, nombre: 'Panes', color: '#8b4513', estado: 'activa', productos: 0 },
      { id: 2, nombre: 'Tortas', color: '#f8a100', estado: 'activa', productos: 0 },
      { id: 3, nombre: 'Pizzas', color: '#ff6b6b', estado: 'activa', productos: 0 },
      { id: 4, nombre: 'Piononos', color: '#4caf50', estado: 'activa', productos: 0 },
      { id: 5, nombre: 'Bizcochos', color: '#2196F3', estado: 'activa', productos: 0 }
    ];
    localStorage.setItem('categoriasDelicia', JSON.stringify(categorias));
  }

  // Cargar productos
  const productosGuardados = localStorage.getItem('productosDelicia');
  if (productosGuardados) {
    productos = JSON.parse(productosGuardados);
  } else {
    // Datos de ejemplo
    productos = [
      {
        id: 1,
        nombre: 'Pan Francés',
        categoriaId: 1,
        precio: 2.00,
        descripcion: 'Pan francés fresco y crujiente',
        ingredientes: 'Harina, agua, levadura, sal',
        imagen: 'img/pan-frances.jpg',
        stock: 50,
        estado: 'activo',
        fechaCreacion: new Date().toISOString()
      },
      {
        id: 2,
        nombre: 'Torta de Maracuyá',
        categoriaId: 2,
        precio: 56.00,
        descripcion: 'Torta refrescante con relleno de maracuyá',
        ingredientes: 'Harina, huevos, azúcar, maracuyá, crema',
        imagen: 'img/torta-de-maracuya.jpg',
        stock: 3,
        estado: 'activo',
        fechaCreacion: new Date().toISOString()
      },
      {
        id: 3,
        nombre: 'Pizza Romana',
        categoriaId: 3,
        precio: 32.00,
        descripcion: 'Pizza estilo romano con ingredientes frescos',
        ingredientes: 'Masa, salsa de tomate, queso mozzarella, pepperoni',
        imagen: 'img/pizza-romana.jpg',
        stock: 8,
        estado: 'activo',
        fechaCreacion: new Date().toISOString()
      },
      {
        id: 4,
        nombre: 'Pionono de Vainilla',
        categoriaId: 4,
        precio: 24.00,
        descripcion: 'Pionono esponjoso con relleno de vainilla',
        ingredientes: 'Harina, huevos, azúcar, esencia de vainilla',
        imagen: 'img/pionono-de-vainilla.jpg',
        stock: 0,
        estado: 'activo',
        fechaCreacion: new Date().toISOString()
      },
      {
        id: 5,
        nombre: 'Bizcocho de Vainilla',
        categoriaId: 5,
        precio: 35.00,
        descripcion: 'Bizcocho esponjoso de vainilla',
        ingredientes: 'Harina, huevos, azúcar, mantequilla, vainilla',
        imagen: 'img/bizcocho-de-vainilla.jpg',
        stock: 2,
        estado: 'activo',
        fechaCreacion: new Date().toISOString()
      }
    ];
    guardarProductos();
  }
  
  actualizarSelectCategorias();
  actualizarListaProductos();
  actualizarEstadisticas();
}

function actualizarSelectCategorias() {
  const selectCategoria = document.getElementById('categoria-producto');
  const selectFiltro = document.getElementById('filtro-categoria');
  
  // Limpiar selects
  selectCategoria.innerHTML = '<option value="">Seleccionar categoría</option>';
  selectFiltro.innerHTML = '<option value="todas">Todas las categorías</option>';
  
  // Agregar categorías activas
  categorias
    .filter(cat => cat.estado === 'activa')
    .forEach(categoria => {
      const option = document.createElement('option');
      option.value = categoria.id;
      option.textContent = categoria.nombre;
      selectCategoria.appendChild(option);
      
      const optionFiltro = document.createElement('option');
      optionFiltro.value = categoria.id;
      optionFiltro.textContent = categoria.nombre;
      selectFiltro.appendChild(optionFiltro);
    });
}

function actualizarListaProductos() {
  const container = document.getElementById('productos-container');
  const sinProductos = document.getElementById('sin-productos');
  
  if (productos.length === 0) {
    container.style.display = 'none';
    sinProductos.style.display = 'block';
    return;
  }
  
  container.style.display = 'grid';
  sinProductos.style.display = 'none';
  container.innerHTML = '';
  
  productos.forEach(producto => {
    const productoElement = crearElementoProducto(producto);
    container.appendChild(productoElement);
  });
}

function crearElementoProducto(producto) {
  const categoria = categorias.find(cat => cat.id === producto.categoriaId);
  const div = document.createElement('div');
  div.className = `producto-card estado-${producto.estado}`;
  
  const estadoStock = obtenerEstadoStock(producto.stock);
  
  div.innerHTML = `
    <div class="producto-imagen">
      <img src="${producto.imagen || 'https://via.placeholder.com/300x200/f8f8f8/666?text=Producto'}" alt="${producto.nombre}" onerror="this.src='https://via.placeholder.com/300x200/f8f8f8/666?text=Producto'">
      <div class="producto-badges">
        <span class="stock-badge ${estadoStock}">${obtenerTextoStock(producto.stock)}</span>
        ${producto.estado === 'inactivo' ? '<span class="estado-badge estado-inactivo">Inactivo</span>' : ''}
      </div>
    </div>
    
    <div class="producto-info">
      <div class="producto-header">
        <h3>${producto.nombre}</h3>
        <span class="producto-precio">S/${producto.precio.toFixed(2)}</span>
      </div>
      
      <div class="producto-categoria">
        <span class="categoria-tag" style="background-color: ${categoria?.color || '#ccc'}">
          ${categoria?.nombre || 'Sin categoría'}
        </span>
      </div>
      
      <p class="producto-descripcion">${producto.descripcion || 'Sin descripción'}</p>
      
      <div class="producto-meta">
        <div class="meta-item">
          <span class="meta-label">Stock:</span>
          <span class="stock-cantidad ${estadoStock}">${producto.stock} unidades</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">Creado:</span>
          <span>${new Date(producto.fechaCreacion).toLocaleDateString('es-ES')}</span>
        </div>
      </div>
      
      ${producto.ingredientes ? `
        <div class="producto-ingredientes">
          <strong>Ingredientes:</strong> ${producto.ingredientes}
        </div>
      ` : ''}
    </div>
    
    <div class="producto-acciones">
      <button class="btn btn-editar" data-id="${producto.id}">✏️ Editar</button>
      <button class="btn btn-eliminar" data-id="${producto.id}">🗑️ Eliminar</button>
    </div>
  `;
  
  // Agregar eventos
  div.querySelector('.btn-editar').addEventListener('click', function() {
    editarProducto(this.getAttribute('data-id'));
  });
  
  div.querySelector('.btn-eliminar').addEventListener('click', function() {
    solicitarEliminacionProducto(this.getAttribute('data-id'));
  });
  
  return div;
}

function obtenerEstadoStock(stock) {
  if (stock === 0) return 'agotado';
  if (stock <= 5) return 'bajo';
  return 'disponible';
}

function obtenerTextoStock(stock) {
  if (stock === 0) return 'Agotado';
  if (stock <= 5) return 'Stock bajo';
  return 'En stock';
}

function actualizarEstadisticas() {
  const totalProductos = productos.length;
  const productosActivos = productos.filter(p => p.estado === 'activo').length;
  const stockBajo = productos.filter(p => p.stock > 0 && p.stock <= 5).length;
  const sinStock = productos.filter(p => p.stock === 0).length;
  
  document.getElementById('total-productos').textContent = totalProductos;
  document.getElementById('productos-activos').textContent = productosActivos;
  document.getElementById('stock-bajo').textContent = stockBajo;
  document.getElementById('sin-stock').textContent = sinStock;
}

function abrirModalNuevoProducto() {
  productoEditando = null;
  document.getElementById('titulo-modal-producto').textContent = 'Nuevo Producto';
  document.getElementById('form-producto').reset();
  document.getElementById('estado-producto').value = 'activo';
  document.getElementById('stock-producto').value = '0';
  
  abrirModal('modalProducto');
}

function editarProducto(productoId) {
  const producto = productos.find(p => p.id == productoId);
  if (!producto) return;
  
  productoEditando = producto;
  
  document.getElementById('titulo-modal-producto').textContent = 'Editar Producto';
  document.getElementById('nombre-producto').value = producto.nombre;
  document.getElementById('categoria-producto').value = producto.categoriaId;
  document.getElementById('precio-producto').value = producto.precio;
  document.getElementById('stock-producto').value = producto.stock;
  document.getElementById('descripcion-producto').value = producto.descripcion || '';
  document.getElementById('ingredientes-producto').value = producto.ingredientes || '';
  document.getElementById('imagen-producto').value = producto.imagen || '';
  document.getElementById('estado-producto').value = producto.estado;
  
  abrirModal('modalProducto');
}

function guardarProducto(event) {
  event.preventDefault();
  
  const nombre = document.getElementById('nombre-producto').value.trim();
  const categoriaId = parseInt(document.getElementById('categoria-producto').value);
  const precio = parseFloat(document.getElementById('precio-producto').value);
  const stock = parseInt(document.getElementById('stock-producto').value) || 0;
  const descripcion = document.getElementById('descripcion-producto').value.trim();
  const ingredientes = document.getElementById('ingredientes-producto').value.trim();
  const imagen = document.getElementById('imagen-producto').value.trim();
  const estado = document.getElementById('estado-producto').value;
  
  if (!nombre || !categoriaId || isNaN(precio)) {
    alert('Los campos nombre, categoría y precio son obligatorios');
    return;
  }
  
  if (precio < 0) {
    alert('El precio no puede ser negativo');
    return;
  }
  
  if (stock < 0) {
    alert('El stock no puede ser negativo');
    return;
  }
  
  // Verificar si el nombre ya existe (excluyendo el producto actual en edición)
  const nombreExiste = productos.some(prod => 
    prod.nombre.toLowerCase() === nombre.toLowerCase() && 
    prod.id !== (productoEditando?.id || null)
  );
  
  if (nombreExiste) {
    alert('Ya existe un producto con ese nombre');
    return;
  }
  
  if (productoEditando) {
    // Editar producto existente
    productoEditando.nombre = nombre;
    productoEditando.categoriaId = categoriaId;
    productoEditando.precio = precio;
    productoEditando.stock = stock;
    productoEditando.descripcion = descripcion;
    productoEditando.ingredientes = ingredientes;
    productoEditando.imagen = imagen;
    productoEditando.estado = estado;
    productoEditando.fechaActualizacion = new Date().toISOString();
  } else {
    // Nuevo producto
    const nuevoProducto = {
      id: Date.now(), // ID único basado en timestamp
      nombre,
      categoriaId,
      precio,
      stock,
      descripcion,
      ingredientes,
      imagen: imagen || '',
      estado,
      fechaCreacion: new Date().toISOString()
    };
    productos.push(nuevoProducto);
  }
  
  guardarProductos();
  actualizarListaProductos();
  actualizarEstadisticas();
  cerrarModal('modalProducto');
  
  mostrarNotificacion(
    productoEditando ? 
    'Producto actualizado correctamente' : 
    'Producto creado correctamente'
  );
  
  productoEditando = null;
}

function solicitarEliminacionProducto(productoId) {
  const producto = productos.find(p => p.id == productoId);
  if (!producto) return;
  
  productoAEliminar = producto;
  
  let mensaje = `¿Estás seguro que deseas eliminar el producto "${producto.nombre}"?`;
  
  if (producto.stock > 0) {
    mensaje += `\n\n⚠️ Este producto tiene ${producto.stock} unidades en stock.`;
  }
  
  document.getElementById('mensaje-eliminacion-producto').textContent = mensaje;
  abrirModal('modalConfirmarEliminarProducto');
}

function confirmarEliminacionProducto() {
  if (!productoAEliminar) return;
  
  const index = productos.findIndex(p => p.id === productoAEliminar.id);
  if (index !== -1) {
    productos.splice(index, 1);
    guardarProductos();
    actualizarListaProductos();
    actualizarEstadisticas();
    mostrarNotificacion(`Producto "${productoAEliminar.nombre}" eliminado correctamente`);
  }
  
  cerrarModal('modalConfirmarEliminarProducto');
  productoAEliminar = null;
}

function filtrarProductos() {
  const filtroCategoria = document.getElementById('filtro-categoria').value;
  const filtroEstado = document.getElementById('filtro-estado').value;
  const filtroStock = document.getElementById('filtro-stock').value;
  const busqueda = document.getElementById('buscar-producto').value.toLowerCase();
  
  const productosFiltrados = productos.filter(producto => {
    // Filtro por categoría
    if (filtroCategoria !== 'todas' && producto.categoriaId != filtroCategoria) {
      return false;
    }
    
    // Filtro por estado
    if (filtroEstado !== 'todos' && producto.estado !== filtroEstado) {
      return false;
    }
    
    // Filtro por stock
    if (filtroStock !== 'todos') {
      const estadoStock = obtenerEstadoStock(producto.stock);
      if (filtroStock !== estadoStock) {
        return false;
      }
    }
    
    // Búsqueda por texto
    if (busqueda && !producto.nombre.toLowerCase().includes(busqueda) && 
        !(producto.descripcion && producto.descripcion.toLowerCase().includes(busqueda))) {
      return false;
    }
    
    return true;
  });
  
  mostrarProductosFiltrados(productosFiltrados);
}

function mostrarProductosFiltrados(productosFiltrados) {
  const container = document.getElementById('productos-container');
  const sinProductos = document.getElementById('sin-productos');
  
  if (productosFiltrados.length === 0) {
    container.style.display = 'none';
    sinProductos.style.display = 'block';
    sinProductos.querySelector('h3').textContent = 'No se encontraron productos';
    sinProductos.querySelector('p').textContent = 'Intenta con otros filtros de búsqueda';
    return;
  }
  
  container.style.display = 'grid';
  sinProductos.style.display = 'none';
  container.innerHTML = '';
  
  productosFiltrados.forEach(producto => {
    const productoElement = crearElementoProducto(producto);
    container.appendChild(productoElement);
  });
}

function guardarProductos() {
  localStorage.setItem('productosDelicia', JSON.stringify(productos));
}

// Funciones de utilidad
function abrirModal(id) {
  document.getElementById(id).style.display = 'block';
}

function cerrarModal(id) {
  document.getElementById(id).style.display = 'none';
}

function mostrarNotificacion(mensaje) {
  // Puedes usar el sistema de notificaciones existente
  alert(mensaje); // Temporal
}