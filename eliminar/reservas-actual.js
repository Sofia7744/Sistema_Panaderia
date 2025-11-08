/**
 * GESTIÓN DE PEDIDOS DEL USUARIO
 */

let pedidos = [];
let pedidoACancelar = null;

document.addEventListener("DOMContentLoaded", () => {
  inicializarMisPedidos();
  cargarPedidos();
});

function inicializarMisPedidos() {
  // Modal cancelar pedido
  document.querySelector('#modalCancelarPedido .cerrar').addEventListener('click', () => {
    cerrarModal('modalCancelarPedido');
  });

  document.getElementById('btn-cancelar-pedido-no').addEventListener('click', () => {
    cerrarModal('modalCancelarPedido');
  });

  document.getElementById('btn-cancelar-pedido-si').addEventListener('click', confirmarCancelacion);

  // Modal detalles pedido
  document.querySelector('#modalDetallesPedido .cerrar').addEventListener('click', () => {
    cerrarModal('modalDetallesPedido');
  });

  // Modal pago exitoso
  document.querySelector('#modalPagoExitoso .cerrar').addEventListener('click', () => {
    cerrarModal('modalPagoExitoso');
  });

  document.getElementById('btn-cerrar-pago-exitoso').addEventListener('click', () => {
    cerrarModal('modalPagoExitoso');
  });

  // Cerrar modales al hacer clic fuera
  window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
      cerrarModal(e.target.id);
    }
  });
}

function cargarPedidos() {
  // Cargar pedidos del localStorage
  const pedidosGuardados = localStorage.getItem('pedidosDelicia');
  if (pedidosGuardados) {
    pedidos = JSON.parse(pedidosGuardados);
  }
  
  // Si no hay pedidos, mostrar datos de ejemplo
  if (pedidos.length === 0) {
    pedidos = generarPedidosEjemplo();
    guardarPedidos();
  }
  
  actualizarListaPedidos();
}

function generarPedidosEjemplo() {
  const fechaActual = new Date();
  return [
    {
      id: 'PD-001',
      fecha: new Date(fechaActual.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      productos: [
        { nombre: 'Pionono de Vainilla', precio: 24, cantidad: 1 },
        { nombre: 'Pan de Anís', precio: 2, cantidad: 3 }
      ],
      total: 30,
      estado: 'entregado',
      metodoPago: 'yape',
      direccion: 'Av. Principal 123, Lima'
    },
    {
      id: 'PD-002',
      fecha: new Date(fechaActual.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      productos: [
        { nombre: 'Torta de Maracuyá', precio: 56, cantidad: 1 },
        { nombre: 'Bizcocho de Vainilla', precio: 35, cantidad: 1 }
      ],
      total: 91,
      estado: 'en-camino',
      metodoPago: 'tarjeta',
      direccion: 'Calle Secundaria 456, Lima'
    },
    {
      id: 'PD-003',
      fecha: fechaActual.toISOString(),
      productos: [
        { nombre: 'Pionono de Chocolate', precio: 24, cantidad: 2 },
        { nombre: 'Pan Francés', precio: 1.5, cantidad: 6 }
      ],
      total: 57,
      estado: 'confirmado',
      metodoPago: 'efectivo',
      direccion: 'Jr. Los Olivos 789, Lima'
    },
    {
      id: 'PD-004',
      fecha: new Date(fechaActual.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      productos: [
        { nombre: 'Torta Selva Negra', precio: 58, cantidad: 1 }
      ],
      total: 58,
      estado: 'cancelado',
      metodoPago: 'yape',
      direccion: 'Av. Siempre Viva 742, Lima',
      motivoCancelacion: 'Cambio de planes'
    }
  ];
}

function actualizarListaPedidos() {
  const container = document.getElementById('pedidos-container');
  const sinPedidos = document.getElementById('sin-pedidos');
  
  if (pedidos.length === 0) {
    container.style.display = 'none';
    sinPedidos.style.display = 'block';
    return;
  }
  
  container.style.display = 'block';
  sinPedidos.style.display = 'none';
  container.innerHTML = '';
  
  // Ordenar pedidos por fecha (más reciente primero)
  const pedidosOrdenados = [...pedidos].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
  
  pedidosOrdenados.forEach(pedido => {
    const pedidoElement = crearElementoPedido(pedido);
    container.appendChild(pedidoElement);
  });
}

function crearElementoPedido(pedido) {
  const div = document.createElement('div');
  div.className = `pedido-card estado-${pedido.estado}`;
  
  const fecha = new Date(pedido.fecha).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  
  const estadoTexto = {
    'pendiente': 'Pendiente',
    'confirmado': 'Confirmado',
    'en-camino': 'En Camino',
    'entregado': 'Entregado',
    'cancelado': 'Cancelado'
  }[pedido.estado];
  
  const productosResumen = pedido.productos.map(p => 
    `${p.cantidad}x ${p.nombre}`
  ).join(', ');
  
  div.innerHTML = `
    <div class="pedido-header">
      <div class="pedido-info">
        <h3>Pedido ${pedido.id}</h3>
        <span class="pedido-fecha">${fecha}</span>
      </div>
      <div class="pedido-estado">
        <span class="estado-badge estado-${pedido.estado}">${estadoTexto}</span>
      </div>
    </div>
    
    <div class="pedido-body">
      <div class="pedido-productos">
        <p><strong>Productos:</strong> ${productosResumen}</p>
      </div>
      <div class="pedido-detalles">
        <div class="detalle-item">
          <span>Total:</span>
          <strong>S/${pedido.total.toFixed(2)}</strong>
        </div>
        <div class="detalle-item">
          <span>Método de pago:</span>
          <span>${pedido.metodoPago.toUpperCase()}</span>
        </div>
        <div class="detalle-item">
          <span>Dirección:</span>
          <span>${pedido.direccion}</span>
        </div>
      </div>
    </div>
    
    <div class="pedido-acciones">
      <button class="btn btn-ver-detalles" data-id="${pedido.id}">Ver Detalles</button>
      ${pedido.estado === 'pendiente' || pedido.estado === 'confirmado' ? 
        `<button class="btn btn-cancelar" data-id="${pedido.id}">Cancelar Pedido</button>` : 
        ''
      }
    </div>
  `;
  
  // Agregar eventos
  div.querySelector('.btn-ver-detalles').addEventListener('click', function() {
    verDetallesPedido(this.getAttribute('data-id'));
  });
  
  if (div.querySelector('.btn-cancelar')) {
    div.querySelector('.btn-cancelar').addEventListener('click', function() {
      solicitarCancelacion(this.getAttribute('data-id'));
    });
  }
  
  return div;
}

function verDetallesPedido(pedidoId) {
  const pedido = pedidos.find(p => p.id === pedidoId);
  if (!pedido) return;
  
  const modal = document.getElementById('modalDetallesPedido');
  const content = document.getElementById('detalles-pedido-content');
  
  const fecha = new Date(pedido.fecha).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  
  const estadoTexto = {
    'pendiente': 'Pendiente',
    'confirmado': 'Confirmado',
    'en-camino': 'En Camino',
    'entregado': 'Entregado',
    'cancelado': 'Cancelado'
  }[pedido.estado];
  
  let productosHTML = '';
  pedido.productos.forEach(producto => {
    productosHTML += `
      <div class="producto-detalle">
        <span>${producto.cantidad}x ${producto.nombre}</span>
        <span>S/${(producto.precio * producto.cantidad).toFixed(2)}</span>
      </div>
    `;
  });
  
  content.innerHTML = `
    <div class="detalles-pedido">
      <div class="detalle-seccion">
        <h3>Información del Pedido</h3>
        <div class="detalle-linea">
          <span><strong>Número de pedido:</strong></span>
          <span>${pedido.id}</span>
        </div>
        <div class="detalle-linea">
          <span><strong>Fecha:</strong></span>
          <span>${fecha}</span>
        </div>
        <div class="detalle-linea">
          <span><strong>Estado:</strong></span>
          <span class="estado-badge estado-${pedido.estado}">${estadoTexto}</span>
        </div>
      </div>
      
      <div class="detalle-seccion">
        <h3>Productos</h3>
        <div class="productos-lista">
          ${productosHTML}
        </div>
        <div class="detalle-linea total">
          <span><strong>Total:</strong></span>
          <span><strong>S/${pedido.total.toFixed(2)}</strong></span>
        </div>
      </div>
      
      <div class="detalle-seccion">
        <h3>Información de Entrega</h3>
        <div class="detalle-linea">
          <span><strong>Método de pago:</strong></span>
          <span>${pedido.metodoPago.toUpperCase()}</span>
        </div>
        <div class="detalle-linea">
          <span><strong>Dirección:</strong></span>
          <span>${pedido.direccion}</span>
        </div>
      </div>
      
      ${pedido.motivoCancelacion ? `
        <div class="detalle-seccion">
          <h3>Información de Cancelación</h3>
          <div class="detalle-linea">
            <span><strong>Motivo:</strong></span>
            <span>${pedido.motivoCancelacion}</span>
          </div>
        </div>
      ` : ''}
    </div>
  `;
  
  modal.style.display = 'block';
}

function solicitarCancelacion(pedidoId) {
  pedidoACancelar = pedidoId;
  const pedido = pedidos.find(p => p.id === pedidoId);
  
  if (pedido) {
    document.getElementById('mensaje-cancelacion').textContent = 
      `¿Estás seguro que deseas cancelar el pedido ${pedidoId}?`;
    abrirModal('modalCancelarPedido');
  }
}

function confirmarCancelacion() {
  if (!pedidoACancelar) return;
  
  const pedidoIndex = pedidos.findIndex(p => p.id === pedidoACancelar);
  if (pedidoIndex !== -1) {
    pedidos[pedidoIndex].estado = 'cancelado';
    pedidos[pedidoIndex].motivoCancelacion = 'Cancelado por el cliente';
    pedidos[pedidoIndex].fechaCancelacion = new Date().toISOString();
    
    guardarPedidos();
    actualizarListaPedidos();
    mostrarNotificacion(`Pedido ${pedidoACancelar} cancelado correctamente`);
  }
  
  cerrarModal('modalCancelarPedido');
  pedidoACancelar = null;
}

function guardarPedidos() {
  localStorage.setItem('pedidosDelicia', JSON.stringify(pedidos));
}

// Función para mostrar modal de pago exitoso (se puede llamar desde otras páginas)
function mostrarPagoExitoso() {
  abrirModal('modalPagoExitoso');
}

// Funciones de utilidad
function abrirModal(id) {
  document.getElementById(id).style.display = 'block';
}

function cerrarModal(id) {
  document.getElementById(id).style.display = 'none';
}

function mostrarNotificacion(mensaje) {
  // Reutilizar la función de notificación existente o crear una simple
  alert(mensaje); // Temporal - puedes reemplazar con tu sistema de notificaciones
}
