/**
 * ESTRUCTURA: 1.Exploración 2.Carrito 3.Autenticación 4.Checkout
 */

// === INICIALIZACIÓN ===
document.addEventListener("DOMContentLoaded", () => {
  inicializarEventos();
  configurarFiltros();
  configurarPago();
  cargarCarrito();
  verificarSesion();
});

function inicializarEventos() {
  // Botones de añadir al carrito
  document.querySelectorAll('.btn-add-cart').forEach(btn => {
    btn.addEventListener('click', function() {
      agregarAlCarrito(
        this.getAttribute('data-nombre'),
        parseFloat(this.getAttribute('data-precio'))
      );
    });
  });
  
  // Carrito
  document.getElementById('btn-mostrar-carrito').addEventListener('click', () => abrirModal('modalCarrito'));
  document.getElementById('btn-vaciar-carrito').addEventListener('click', vaciarCarrito);
  document.getElementById('btn-finalizar-compra').addEventListener('click', procesarCompra);
  
  // Autenticación
  document.querySelector('.btn-login').addEventListener('click', e => {
    e.preventDefault();
    usuarioActual ? mostrarMenuUsuario(e) : abrirModal('modalLogin');
  });
  
  // Tabs login/registro
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => cambiarTab(btn.getAttribute('data-tab')));
  });
  
  // Formularios
  document.getElementById('form-login').addEventListener('submit', iniciarSesion);
  document.getElementById('form-registro').addEventListener('submit', registrarse);
  
  // Cierre de sesión
  document.getElementById('cerrar-sesion').addEventListener('click', e => {
    e.preventDefault();
    abrirModal('modalCerrarSesion');
    document.getElementById('menuUsuario').style.display = 'none';
  });
  
  document.getElementById('btnCerrarSesionDirecto').addEventListener('click', e => {
    e.preventDefault();
    abrirModal('modalCerrarSesion');
  });
  
  document.getElementById('btn-cancelar-logout').addEventListener('click', () => cerrarModal('modalCerrarSesion'));
  document.getElementById('btn-confirmar-logout').addEventListener('click', () => {
    realizarCierreSesion();
    cerrarModal('modalCerrarSesion');
  });
  
  // Cerrar menú usuario
  document.querySelector('.cerrar-menu').addEventListener('click', () => {
    document.getElementById('menuUsuario').style.display = 'none';
  });
  
  // Cerrar modales
  document.querySelectorAll('.modal .cerrar').forEach(btn => {
    btn.addEventListener('click', function() {
      cerrarModal(this.closest('.modal').id);
    });
  });

  // Pago
  document.getElementById('btn-confirmar-pago').addEventListener('click', confirmarPago);
}

// === 1. CATÁLOGO ===
function configurarFiltros() {
  const botones = document.querySelectorAll('.tabs button');
  const items = document.querySelectorAll('.gallery .item');

  botones.forEach(btn => {
    btn.addEventListener('click', () => {
      botones.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const categoria = btn.dataset.categoria;

      items.forEach(item => {
        item.style.display = (categoria === 'todos' || item.classList.contains(categoria)) ? 'block' : 'none';
      });
    });
  });
}

// === 2. CARRITO ===
let carrito = [];

function agregarAlCarrito(nombre, precio, cantidad = 1) {
  const existe = carrito.find(item => item.nombre === nombre);
  
  if (existe) {
    existe.cantidad += cantidad;
  } else {
    carrito.push({ nombre, precio, cantidad });
  }
  
  localStorage.setItem('carritoDelicia', JSON.stringify(carrito));
  actualizarCarrito();
  mostrarNotificacion(`${cantidad} ${nombre} añadido al carrito`);
}

function eliminarDelCarrito(index) {
  carrito.splice(index, 1);
  localStorage.setItem('carritoDelicia', JSON.stringify(carrito));
  actualizarCarrito();
}

function actualizarCantidad(index, cambio) {
  carrito[index].cantidad += cambio;
  if (carrito[index].cantidad <= 0) {
    eliminarDelCarrito(index);
    return;
  }
  localStorage.setItem('carritoDelicia', JSON.stringify(carrito));
  actualizarCarrito();
}

function cargarCarrito() {
  const saved = localStorage.getItem('carritoDelicia');
  if (saved) {
    carrito = JSON.parse(saved);
    actualizarCarrito();
  }
}

function actualizarCarrito() {
  const items = document.getElementById('carrito-items');
  const total = document.getElementById('total');
  
  items.innerHTML = '';
  
  if (carrito.length === 0) {
    items.innerHTML = '<p>Tu carrito está vacío</p>';
    total.textContent = 'Total: S/0.00';
    return;
  }
  
  let suma = 0;
  
  carrito.forEach((producto, index) => {
    const subtotal = producto.precio * producto.cantidad;
    suma += subtotal;
    
    const item = document.createElement('div');
    item.className = 'carrito-item';
    item.innerHTML = `
      <p><strong>${producto.nombre}</strong> - S/${producto.precio.toFixed(2)} x 
        <button class="btn-disminuir" data-index="${index}">-</button>
        ${producto.cantidad}
        <button class="btn-aumentar" data-index="${index}">+</button>
        = S/${subtotal.toFixed(2)}
        <button class="btn-eliminar" data-index="${index}">Eliminar</button>
      </p>
    `;
    items.appendChild(item);
  });
  
  // Configurar eventos botones
  document.querySelectorAll('.btn-disminuir').forEach(btn => {
    btn.addEventListener('click', function() {
      actualizarCantidad(parseInt(this.getAttribute('data-index')), -1);
    });
  });
  
  document.querySelectorAll('.btn-aumentar').forEach(btn => {
    btn.addEventListener('click', function() {
      actualizarCantidad(parseInt(this.getAttribute('data-index')), 1);
    });
  });
  
  document.querySelectorAll('.btn-eliminar').forEach(btn => {
    btn.addEventListener('click', function() {
      eliminarDelCarrito(parseInt(this.getAttribute('data-index')));
    });
  });
  
  total.textContent = `Total: S/${suma.toFixed(2)}`;
}

function vaciarCarrito() {
  carrito = [];
  localStorage.setItem('carritoDelicia', JSON.stringify(carrito));
  actualizarCarrito();
  mostrarNotificacion('Carrito vaciado');
}

// === 3. AUTENTICACIÓN ===
let usuarioActual = null;

function verificarSesion() {
  const saved = localStorage.getItem('usuarioDelicia');
  if (saved) {
    usuarioActual = JSON.parse(saved);
    actualizarUIUsuario();
  }
}

function iniciarSesion(event) {
  event.preventDefault();
  
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;
  const recordar = document.getElementById('remember-me').checked;
  
  if (email && password) {
    usuarioActual = {
      email: email,
      nombre: email.split('@')[0],
      fechaLogin: new Date()
    };
    
    if (recordar) {
      localStorage.setItem('usuarioDelicia', JSON.stringify(usuarioActual));
    }
    
    actualizarUIUsuario();
    cerrarModal('modalLogin');
    mostrarNotificacion(`¡Bienvenido, ${usuarioActual.nombre}!`);
  } else {
    alert('Por favor completa todos los campos.');
  }
}

function registrarse(event) {
  event.preventDefault();
  
  const nombre = document.getElementById('registro-nombre').value;
  const email = document.getElementById('registro-email').value;
  const password = document.getElementById('registro-password').value;
  const confirm = document.getElementById('registro-password-confirm').value;
  const terminos = document.getElementById('terminos').checked;
  
  if (!nombre || !email || !password || !confirm) {
    alert('Por favor completa todos los campos.');
    return;
  }
  
  if (password !== confirm) {
    alert('Las contraseñas no coinciden.');
    return;
  }
  
  if (!terminos) {
    alert('Debes aceptar los términos y condiciones.');
    return;
  }
  
  usuarioActual = {
    nombre: nombre,
    email: email,
    fechaRegistro: new Date()
  };
  
  localStorage.setItem('usuarioDelicia', JSON.stringify(usuarioActual));
  actualizarUIUsuario();
  cerrarModal('modalLogin');
  mostrarNotificacion(`¡Cuenta creada exitosamente! Bienvenido, ${nombre}`);
}

function realizarCierreSesion() {
  usuarioActual = null;
  localStorage.removeItem('usuarioDelicia');
  actualizarUIUsuario();
  mostrarNotificacion('Has cerrado sesión correctamente');
}

function actualizarUIUsuario() {
  const btnLogin = document.querySelector('.btn-login');
  const btnLogout = document.getElementById('btnCerrarSesionDirecto');
  
  if (usuarioActual) {
    btnLogin.textContent = usuarioActual.nombre;
    btnLogin.onclick = mostrarMenuUsuario;
    btnLogout.style.display = 'block';
    document.getElementById('nombreUsuario').textContent = usuarioActual.nombre;
  } else {
    btnLogin.textContent = 'Iniciar Sesión';
    btnLogout.style.display = 'none';
    btnLogin.onclick = function(e) {
      e.preventDefault();
      abrirModal('modalLogin');
    };
  }
}

function mostrarMenuUsuario(event) {
  event.preventDefault();
  const menu = document.getElementById('menuUsuario');
  menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
}

// === 4. CHECKOUT Y PAGO ===
function procesarCompra() {
  if (carrito.length === 0) {
    alert('Tu carrito está vacío');
    return;
  }
  
  if (!usuarioActual) {
    alert('Debes iniciar sesión para completar la compra');
    abrirModal('modalLogin');
    return;
  }
  
  cerrarModal('modalCarrito');
  abrirModal('modalMetodoPago');
}

function configurarPago() {
  document.querySelectorAll('input[name="metodo-pago"]').forEach(radio => {
    radio.addEventListener('change', function() {
      document.querySelectorAll('.form-pago').forEach(form => {
        form.classList.remove('active');
      });
      
      document.getElementById(`form-${this.value}`).classList.add('active');
    });
  });
}

function confirmarPago() {
  const metodo = document.querySelector('input[name="metodo-pago"]:checked').value;
  let valido = false;
  
  switch(metodo) {
    case 'tarjeta':
      const nombre = document.getElementById('nombre-tarjeta').value.trim();
      const numero = document.getElementById('numero-tarjeta').value.trim();
      const fecha = document.getElementById('fecha-expiracion').value;
      const cvv = document.getElementById('cvv').value.trim();
      
      valido = nombre && numero.length === 16 && !isNaN(numero) && 
               fecha && cvv.length === 3 && !isNaN(cvv);
      if (!valido) alert('Por favor, ingresa datos válidos de la tarjeta.');
      break;
      
    case 'yape':
      const tel = document.getElementById('yape-numero').value.trim();
      valido = tel && tel.length >= 9;
      if (!valido) alert('Por favor, ingresa un número de teléfono válido para Yape.');
      break;
      
    case 'efectivo':
      const dir = document.getElementById('direccion-entrega').value.trim();
      valido = !!dir;
      if (!valido) alert('Por favor, ingresa una dirección de entrega válida.');
      break;
  }
  
  if (valido) {
    const modal = document.querySelector('#modalMetodoPago .modal-contenido');
    const original = modal.innerHTML;
    modal.setAttribute('data-contenido-original', original);
    
    modal.innerHTML = `
      <div class="confirmacion-pago">
        <div class="icon">✓</div>
        <h3>¡Pago Confirmado!</h3>
        <p>Tu pedido ha sido procesado correctamente.</p>
        <p>Recibirás un correo electrónico con los detalles del pedido.</p>
        <button class="btn-submit" id="btn-cerrar-confirmacion">Aceptar</button>
      </div>
    `;
    
    document.getElementById('btn-cerrar-confirmacion').addEventListener('click', function() {
      cerrarModal('modalMetodoPago');
      
      setTimeout(() => {
        modal.innerHTML = modal.getAttribute('data-contenido-original');
        configurarPago();
        document.getElementById('btn-confirmar-pago').addEventListener('click', confirmarPago);
        
        document.querySelectorAll('.modal .cerrar').forEach(btn => {
          btn.addEventListener('click', function() {
            cerrarModal(this.closest('.modal').id);
          });
        });
      }, 500);
      
      vaciarCarrito();
    });
  }
}

// === UTILIDADES ===
function abrirModal(id) {
  document.getElementById(id).style.display = 'block';
}

function cerrarModal(id) {
  document.getElementById(id).style.display = 'none';
}

function cambiarTab(tabId) {
  document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  
  document.getElementById(tabId).classList.add('active');
  document.querySelectorAll('.tab-btn')[tabId === 'login-tab' ? 0 : 1].classList.add('active');
}

function mostrarNotificacion(mensaje) {
  const notif = document.createElement('div');
  notif.className = 'notificacion';
  notif.textContent = mensaje;
  document.body.appendChild(notif);
  setTimeout(() => notif.remove(), 2000);
}

// Funcionalidad para la página de gestión de reservas
document.addEventListener('DOMContentLoaded', function() {
  // Elementos principales
  const estadoModal = document.getElementById('estadoModal');
  const closeEstadoModal = document.getElementById('closeEstadoModal');
  const reservaIdModal = document.getElementById('reservaIdModal');
  const filterButtons = document.querySelectorAll('.filter-btn');
  const estadoOptions = document.querySelectorAll('.estado-option');
  const estadoButtons = document.querySelectorAll('.btn-estado');
  const reservasTableBody = document.getElementById('reservasTableBody');
  
  // Datos de ejemplo para las reservas - AHORA CON APELLIDOS
  const reservas = [
      { id: 1, cliente: "Juan", apellidos: "Arrollo", telefono: "123456789", fecha: "30/09/2025", hora: "10:00", total: "S/ 100.00", estado: "pendiente" },
      { id: 2, cliente: "Maria", apellidos: "Quijada", telefono: "987654321", fecha: "01/10/2025", hora: "11:00", total: "S/ 200.00", estado: "confirmada" },
      { id: 3, cliente: "Juan", apellidos: "Perez", telefono: "123456789", fecha: "30/09/2025", hora: "10:00", total: "S/ 100.00", estado: "lista" },
      { id: 4, cliente: "Maria", apellidos: "Rodriguez", telefono: "987654321", fecha: "01/10/2025", hora: "11:00", total: "S/ 200.00", estado: "cancelada" },
      { id: 5, cliente: "Maria", apellidos: "Arrieta", telefono: "987654321", fecha: "01/10/2025", hora: "11:00", total: "S/ 200.00", estado: "entregada" },
      { id: 6, cliente: "Juan", apellidos: "Rojas", telefono: "123456789", fecha: "30/09/2025", hora: "10:00", total: "S/ 100.00", estado: "pendiente" },
      { id: 7, cliente: "Maria", apellidos: "Chancas", telefono: "987654321", fecha: "01/10/2025", hora: "11:00", total: "S/ 200.00", estado: "confirmada" },
      { id: 8, cliente: "Juan", apellidos: "Ramos", telefono: "123456789", fecha: "30/09/2025", hora: "10:00", total: "S/ 100.00", estado: "lista" },
      { id: 9, cliente: "Maria", apellidos: "Sanchez", telefono: "987654321", fecha: "01/10/2025", hora: "11:00", total: "S/ 200.00", estado: "cancelada" },
      { id: 10, cliente: "Maria", apellidos: "Limas", telefono: "987654321", fecha: "01/10/2025", hora: "11:00", total: "S/ 200.00", estado: "entregada" }
  ];
  
  // Función para actualizar la tabla con las reservas
  function actualizarTabla(reservasAMostrar = reservas) {
      reservasTableBody.innerHTML = '';
      
      if (reservasAMostrar.length === 0) {
          reservasTableBody.innerHTML = `
              <tr>
                  <td colspan="9" style="text-align: center; padding: 2rem;">
                      No hay reservas para mostrar
                  </td>
              </tr>
          `;
          return;
      }
      
      reservasAMostrar.forEach(reserva => {
          const claseEstado = `estado-${reserva.estado}`;
          const textoEstado = reserva.estado.charAt(0).toUpperCase() + reserva.estado.slice(1);
          
          const fila = document.createElement('tr');
          fila.innerHTML = `
              <td><strong>#${reserva.id}</strong></td>
              <td>${reserva.cliente}</td>
              <td>${reserva.apellidos}</td> <!-- AGREGADO EL CAMPO APELLIDOS -->
              <td>${reserva.telefono}</td>
              <td>${reserva.fecha}</td>
              <td>${reserva.hora}</td>
              <td><strong>${reserva.total}</strong></td>
              <td>
                  <span class="reserva-estado-badge ${claseEstado}">${textoEstado}</span>
              </td>
              <td>
                  <div>
                      <button class="btn-icon btn-view">Ver</button>
                      <button class="btn-icon btn-estado" data-id="${reserva.id}">Estado</button>
                  </div>
              </td>
          `;
          reservasTableBody.appendChild(fila);
      });
      
      // Reasignar eventos a los botones de estado recién creados
      document.querySelectorAll('.btn-estado').forEach(btn => {
          btn.addEventListener('click', function() {
              const reservaId = this.getAttribute('data-id');
              abrirModalEstado(reservaId);
          });
      });
  }
  
  // Función para abrir el modal de cambio de estado
  function abrirModalEstado(reservaId) {
      reservaIdModal.textContent = reservaId;
      estadoModal.classList.remove('hidden');
      estadoModal.classList.add('active');
  }
  
  // Función para cerrar el modal de cambio de estado
  function cerrarModalEstado() {
      estadoModal.classList.remove('active');
      estadoModal.classList.add('hidden');
  }
  
  // Función para filtrar reservas por estado
  function filtrarReservas(estado) {
      if (estado === '') {
          actualizarTabla(reservas);
      } else {
          const reservasFiltradas = reservas.filter(reserva => reserva.estado === estado);
          actualizarTabla(reservasFiltradas);
      }
  }
  
  // Función para cambiar el estado de una reserva
  function cambiarEstadoReserva(reservaId, nuevoEstado) {
      const reservaIndex = reservas.findIndex(reserva => reserva.id === parseInt(reservaId));
      if (reservaIndex !== -1) {
          reservas[reservaIndex].estado = nuevoEstado;
          actualizarTabla();
          cerrarModalEstado();
          
          // Mostrar notificación de éxito
          mostrarNotificacion(`Estado de reserva #${reservaId} actualizado a ${nuevoEstado}`);
      }
  }
  
  // Función para mostrar notificaciones
  function mostrarNotificacion(mensaje) {
      const notificacion = document.createElement('div');
      notificacion.className = 'notificacion';
      notificacion.textContent = mensaje;
      document.body.appendChild(notificacion);
      
      setTimeout(() => {
          notificacion.remove();
      }, 3000);
  }
  
  // Event Listeners
  
  // Cerrar modal al hacer clic en la X
  closeEstadoModal.addEventListener('click', cerrarModalEstado);
  
  // Cerrar modal al hacer clic fuera del contenido
  estadoModal.addEventListener('click', function(e) {
      if (e.target === estadoModal || e.target.classList.contains('modal-overlay')) {
          cerrarModalEstado();
      }
  });
  
  // Filtrar reservas al hacer clic en los botones de filtro
  filterButtons.forEach(btn => {
      btn.addEventListener('click', function() {
          // Remover clase active de todos los botones
          filterButtons.forEach(b => b.classList.remove('active'));
          // Agregar clase active al botón clickeado
          this.classList.add('active');
          // Filtrar reservas
          const estado = this.getAttribute('data-estado');
          filtrarReservas(estado);
      });
  });
  
  // Cambiar estado de reserva al seleccionar una opción en el modal
  estadoOptions.forEach(option => {
      option.addEventListener('click', function() {
          const nuevoEstado = this.getAttribute('data-estado');
          const reservaId = reservaIdModal.textContent;
          cambiarEstadoReserva(reservaId, nuevoEstado);
      });
  });
  
  // Inicializar la tabla con todas las reservas
  actualizarTabla();
});