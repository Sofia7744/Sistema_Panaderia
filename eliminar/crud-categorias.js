/**
 * CRUD PARA GESTIÓN DE CATEGORÍAS
 */

let categorias = [];
let categoriaEditando = null;
let categoriaAEliminar = null;

document.addEventListener("DOMContentLoaded", () => {
  inicializarControlCategorias();
  cargarCategorias();
});

function inicializarControlCategorias() {
  // Botones principales
  document.getElementById('btn-nueva-categoria').addEventListener('click', () => {
    abrirModalNuevaCategoria();
  });
  
  document.getElementById('btn-crear-primera-categoria').addEventListener('click', () => {
    abrirModalNuevaCategoria();
  });

  // Formulario categoría
  document.getElementById('form-categoria').addEventListener('submit', guardarCategoria);
  document.getElementById('btn-cancelar-categoria').addEventListener('click', () => {
    cerrarModal('modalCategoria');
  });

  // Modal eliminar
  document.getElementById('btn-cancelar-eliminar').addEventListener('click', () => {
    cerrarModal('modalConfirmarEliminar');
  });
  document.getElementById('btn-confirmar-eliminar').addEventListener('click', confirmarEliminacion);

  // Búsqueda
  document.getElementById('buscar-categoria').addEventListener('input', filtrarCategorias);
  document.querySelector('.btn-buscar').addEventListener('click', () => {
    filtrarCategorias();
  });

  // Cerrar modales
  document.querySelectorAll('.modal .cerrar').forEach(btn => {
    btn.addEventListener('click', function() {
      cerrarModal(this.closest('.modal').id);
    });
  });

  // Color picker
  document.getElementById('color-categoria').addEventListener('input', function() {
    document.getElementById('color-preview').style.backgroundColor = this.value;
  });
}

function cargarCategorias() {
  // Cargar categorías del localStorage
  const categoriasGuardadas = localStorage.getItem('categoriasDelicia');
  
  if (categoriasGuardadas) {
    categorias = JSON.parse(categoriasGuardadas);
  } else {
    // Datos de ejemplo
    categorias = [
      {
        id: 1,
        nombre: 'Panes',
        descripcion: 'Panadería artesanal fresca',
        color: '#8b4513',
        estado: 'activa',
        productos: 8,
        fechaCreacion: new Date().toISOString()
      },
      {
        id: 2,
        nombre: 'Tortas',
        descripcion: 'Tortas y pasteles decorados',
        color: '#f8a100',
        estado: 'activa',
        productos: 12,
        fechaCreacion: new Date().toISOString()
      },
      {
        id: 3,
        nombre: 'Pizzas',
        descripcion: 'Pizzas artesanales',
        color: '#ff6b6b',
        estado: 'activa',
        productos: 6,
        fechaCreacion: new Date().toISOString()
      },
      {
        id: 4,
        nombre: 'Piononos',
        descripcion: 'Piononos de diferentes sabores',
        color: '#4caf50',
        estado: 'activa',
        productos: 5,
        fechaCreacion: new Date().toISOString()
      },
      {
        id: 5,
        nombre: 'Bizcochos',
        descripcion: 'Bizcochos esponjosos',
        color: '#2196F3',
        estado: 'activa',
        productos: 4,
        fechaCreacion: new Date().toISOString()
      }
    ];
    guardarCategorias();
  }
  
  actualizarListaCategorias();
  actualizarEstadisticas();
}

function actualizarListaCategorias() {
  const container = document.getElementById('categorias-container');
  const sinCategorias = document.getElementById('sin-categorias');
  
  if (categorias.length === 0) {
    container.style.display = 'none';
    sinCategorias.style.display = 'block';
    return;
  }
  
  container.style.display = 'grid';
  sinCategorias.style.display = 'none';
  container.innerHTML = '';
  
  categorias.forEach(categoria => {
    const categoriaElement = crearElementoCategoria(categoria);
    container.appendChild(categoriaElement);
  });
}

function crearElementoCategoria(categoria) {
  const div = document.createElement('div');
  div.className = `categoria-card estado-${categoria.estado}`;
  div.style.borderLeftColor = categoria.color;
  
  div.innerHTML = `
    <div class="categoria-header">
      <div class="categoria-info">
        <h3>${categoria.nombre}</h3>
        <span class="categoria-productos">${categoria.productos} productos</span>
      </div>
      <div class="categoria-estado">
        <span class="estado-badge estado-${categoria.estado}">
          ${categoria.estado === 'activa' ? 'Activa' : 'Inactiva'}
        </span>
      </div>
    </div>
    
    <div class="categoria-body">
      <p class="categoria-descripcion">${categoria.descripcion || 'Sin descripción'}</p>
      
      <div class="categoria-meta">
        <div class="meta-item">
          <span class="meta-label">Color:</span>
          <span class="color-indicator" style="background-color: ${categoria.color}"></span>
        </div>
        <div class="meta-item">
          <span class="meta-label">Creada:</span>
          <span>${new Date(categoria.fechaCreacion).toLocaleDateString('es-ES')}</span>
        </div>
      </div>
    </div>
    
    <div class="categoria-acciones">
      <button class="btn btn-editar" data-id="${categoria.id}">✏️ Editar</button>
      <button class="btn btn-eliminar" data-id="${categoria.id}">🗑️ Eliminar</button>
    </div>
  `;
  
  // Agregar eventos
  div.querySelector('.btn-editar').addEventListener('click', function() {
    editarCategoria(this.getAttribute('data-id'));
  });
  
  div.querySelector('.btn-eliminar').addEventListener('click', function() {
    solicitarEliminacion(this.getAttribute('data-id'));
  });
  
  return div;
}

function actualizarEstadisticas() {
  const totalCategorias = categorias.length;
  const categoriasActivas = categorias.filter(c => c.estado === 'activa').length;
  const totalProductos = categorias.reduce((sum, cat) => sum + (cat.productos || 0), 0);
  
  document.getElementById('total-categorias').textContent = totalCategorias;
  document.getElementById('categorias-activas').textContent = categoriasActivas;
  document.getElementById('total-productos').textContent = totalProductos;
}

function abrirModalNuevaCategoria() {
  categoriaEditando = null;
  document.getElementById('titulo-modal-categoria').textContent = 'Nueva Categoría';
  document.getElementById('form-categoria').reset();
  document.getElementById('color-categoria').value = '#f8a100';
  document.getElementById('color-preview').style.backgroundColor = '#f8a100';
  document.getElementById('estado-categoria').value = 'activa';
  
  abrirModal('modalCategoria');
}

function editarCategoria(categoriaId) {
  const categoria = categorias.find(c => c.id == categoriaId);
  if (!categoria) return;
  
  categoriaEditando = categoria;
  
  document.getElementById('titulo-modal-categoria').textContent = 'Editar Categoría';
  document.getElementById('nombre-categoria').value = categoria.nombre;
  document.getElementById('descripcion-categoria').value = categoria.descripcion || '';
  document.getElementById('color-categoria').value = categoria.color;
  document.getElementById('color-preview').style.backgroundColor = categoria.color;
  document.getElementById('estado-categoria').value = categoria.estado;
  
  abrirModal('modalCategoria');
}

function guardarCategoria(event) {
  event.preventDefault();
  
  const nombre = document.getElementById('nombre-categoria').value.trim();
  const descripcion = document.getElementById('descripcion-categoria').value.trim();
  const color = document.getElementById('color-categoria').value;
  const estado = document.getElementById('estado-categoria').value;
  
  if (!nombre) {
    alert('El nombre de la categoría es obligatorio');
    return;
  }
  
  // Verificar si el nombre ya existe (excluyendo la categoría actual en edición)
  const nombreExiste = categorias.some(cat => 
    cat.nombre.toLowerCase() === nombre.toLowerCase() && 
    cat.id !== (categoriaEditando?.id || null)
  );
  
  if (nombreExiste) {
    alert('Ya existe una categoría con ese nombre');
    return;
  }
  
  if (categoriaEditando) {
    // Editar categoría existente
    categoriaEditando.nombre = nombre;
    categoriaEditando.descripcion = descripcion;
    categoriaEditando.color = color;
    categoriaEditando.estado = estado;
    categoriaEditando.fechaActualizacion = new Date().toISOString();
  } else {
    // Nueva categoría
    const nuevaCategoria = {
      id: Date.now(), // ID único basado en timestamp
      nombre,
      descripcion,
      color,
      estado,
      productos: 0,
      fechaCreacion: new Date().toISOString()
    };
    categorias.push(nuevaCategoria);
  }
  
  guardarCategorias();
  actualizarListaCategorias();
  actualizarEstadisticas();
  cerrarModal('modalCategoria');
  
  mostrarNotificacion(
    categoriaEditando ? 
    'Categoría actualizada correctamente' : 
    'Categoría creada correctamente'
  );
  
  categoriaEditando = null;
}

function solicitarEliminacion(categoriaId) {
  const categoria = categorias.find(c => c.id == categoriaId);
  if (!categoria) return;
  
  categoriaAEliminar = categoria;
  
  let mensaje = `¿Estás seguro que deseas eliminar la categoría "${categoria.nombre}"?`;
  
  if (categoria.productos > 0) {
    mensaje += `\n\n⚠️ Esta categoría tiene ${categoria.productos} productos asociados.`;
  }
  
  document.getElementById('mensaje-eliminacion').textContent = mensaje;
  abrirModal('modalConfirmarEliminar');
}

function confirmarEliminacion() {
  if (!categoriaAEliminar) return;
  
  const index = categorias.findIndex(c => c.id === categoriaAEliminar.id);
  if (index !== -1) {
    categorias.splice(index, 1);
    guardarCategorias();
    actualizarListaCategorias();
    actualizarEstadisticas();
    mostrarNotificacion(`Categoría "${categoriaAEliminar.nombre}" eliminada correctamente`);
  }
  
  cerrarModal('modalConfirmarEliminar');
  categoriaAEliminar = null;
}

function filtrarCategorias() {
  const busqueda = document.getElementById('buscar-categoria').value.toLowerCase();
  const categoriasCards = document.querySelectorAll('.categoria-card');
  
  categoriasCards.forEach(card => {
    const nombre = card.querySelector('h3').textContent.toLowerCase();
    const descripcion = card.querySelector('.categoria-descripcion').textContent.toLowerCase();
    
    if (nombre.includes(busqueda) || descripcion.includes(busqueda)) {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });
}

function guardarCategorias() {
  localStorage.setItem('categoriasDelicia', JSON.stringify(categorias));
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
