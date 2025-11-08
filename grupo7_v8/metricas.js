/**
 * DASHBOARD DE MÉTRICAS CON DATOS FICTICIOS
 */

// Datos de productos basados en tu catálogo
const productosData = [
    { id: 1, nombre: 'Pan Francés', categoria: 'Panes', precio: 2.00 },
    { id: 2, nombre: 'Pan de Anís', categoria: 'Panes', precio: 2.00 },
    { id: 3, nombre: 'Pan de Trigo', categoria: 'Panes', precio: 2.00 },
    { id: 4, nombre: 'Torta de Maracuyá', categoria: 'Tortas', precio: 56.00 },
    { id: 5, nombre: 'Torta Selva Negra', categoria: 'Tortas', precio: 58.00 },
    { id: 6, nombre: 'Torta Helada', categoria: 'Tortas', precio: 45.00 },
    { id: 7, nombre: 'Torta Tres Leches', categoria: 'Tortas', precio: 60.00 },
    { id: 8, nombre: 'Torta One Piece', categoria: 'Tortas', precio: 100.00 },
    { id: 9, nombre: 'Pizza Romana', categoria: 'Pizzas', precio: 32.00 },
    { id: 10, nombre: 'Pizza de Carne', categoria: 'Pizzas', precio: 41.00 },
    { id: 11, nombre: 'Pizza Americana', categoria: 'Pizzas', precio: 30.00 },
    { id: 12, nombre: 'Pizza Pepperiscos', categoria: 'Pizzas', precio: 40.00 },
    { id: 13, nombre: 'Pionono de Vainilla', categoria: 'Piononos', precio: 24.00 },
    { id: 14, nombre: 'Pionono de Chocolate', categoria: 'Piononos', precio: 24.00 },
    { id: 15, nombre: 'Pionono de Fresa', categoria: 'Piononos', precio: 24.00 },
    { id: 16, nombre: 'Pionono de Moka', categoria: 'Piononos', precio: 25.00 },
    { id: 17, nombre: 'Bizcocho de Vainilla', categoria: 'Bizcochos', precio: 35.00 },
    { id: 18, nombre: 'Bizcocho de Chocolate', categoria: 'Bizcochos', precio: 35.00 },
    { id: 19, nombre: 'Bizcocho de Piña', categoria: 'Bizcochos', precio: 35.00 },
    { id: 20, nombre: 'Pye de Piña', categoria: 'Pye', precio: 38.00 },
    { id: 21, nombre: 'Pye de Manzana', categoria: 'Pye', precio: 38.00 },
    { id: 22, nombre: 'Pye de Limón', categoria: 'Pye', precio: 38.00 }
];

let metricasData = {};
let periodoActual = 'week';

document.addEventListener("DOMContentLoaded", () => {
    inicializarMetricas();
    cargarDatosMetricas();
    actualizarDashboard();
});

function inicializarMetricas() {
    // Event listeners para los botones de período
    document.querySelectorAll('.period-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            // Remover clase active de todos los botones
            document.querySelectorAll('.period-btn').forEach(b => b.classList.remove('active'));
            // Agregar clase active al botón clickeado
            this.classList.add('active');
            
            // Cambiar período
            periodoActual = this.getAttribute('data-period');
            actualizarDashboard();
        });
    });
}

function cargarDatosMetricas() {
    // Generar datos ficticios basados en los productos
    const categorias = ['Panes', 'Tortas', 'Pizzas', 'Piononos', 'Bizcochos', 'Pye'];
    
    // Datos para diferentes períodos
    metricasData = {
        today: generarDatosParaPeriodo('today'),
        week: generarDatosParaPeriodo('week'),
        month: generarDatosParaPeriodo('month'),
        all: generarDatosParaPeriodo('all')
    };
}

function generarDatosParaPeriodo(periodo) {
    const baseMultiplier = {
        today: 1,
        week: 7,
        month: 30,
        all: 120
    }[periodo];

    // Ventas por categoría
    const ventasPorCategoria = {};
    const categorias = ['Panes', 'Tortas', 'Pizzas', 'Piononos', 'Bizcochos', 'Pye'];
    
    categorias.forEach(categoria => {
        const productosCategoria = productosData.filter(p => p.categoria === categoria);
        const ventas = productosCategoria.reduce((sum, producto) => {
            const cantidadVendida = Math.floor(Math.random() * 10 * baseMultiplier) + 1;
            return sum + (producto.precio * cantidadVendida);
        }, 0);
        ventasPorCategoria[categoria] = Math.round(ventas);
    });

    // Productos más vendidos
    const productosMasVendidos = productosData
        .map(producto => {
            const cantidadVendida = Math.floor(Math.random() * 20 * baseMultiplier) + 5;
            return {
                ...producto,
                cantidadVendida,
                totalVendido: producto.precio * cantidadVendida
            };
        })
        .sort((a, b) => b.cantidadVendida - a.cantidadVendida)
        .slice(0, 5);

    // Estado de reservas
    const estadoReservas = {
        pendiente: Math.floor(Math.random() * 8 * baseMultiplier) + 2,
        confirmada: Math.floor(Math.random() * 15 * baseMultiplier) + 5,
        lista: Math.floor(Math.random() * 10 * baseMultiplier) + 3,
        entregada: Math.floor(Math.random() * 50 * baseMultiplier) + 20,
        cancelada: Math.floor(Math.random() * 5 * baseMultiplier) + 1
    };

    // Ingresos por día de la semana
    const ingresosPorDia = ['lun', 'mar', 'mié', 'jue', 'vie', 'sáb', 'dom'].map((dia, index) => {
        const base = [120, 180, 160, 200, 220, 280, 150][index]; // Patrón semanal típico
        return Math.round(base * baseMultiplier / 7);
    });

    // Últimas reservas
    const ultimasReservas = Array.from({ length: 8 }, (_, i) => {
        const estados = ['pendiente', 'confirmada', 'lista', 'entregada', 'cancelada'];
        const estado = estados[Math.floor(Math.random() * estados.length)];
        const total = Math.round((Math.random() * 200 + 30) * 100) / 100;
        
        return {
            id: `RES-${1000 + i}`,
            cliente: ['Juan Pérez', 'María García', 'Carlos López', 'Ana Martínez', 'Luis Rodríguez'][i % 5],
            fecha: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toLocaleDateString('es-ES'),
            total: total,
            estado: estado
        };
    });

    // Calcular KPIs
    const totalIngresos = Object.values(ventasPorCategoria).reduce((sum, venta) => sum + venta, 0);
    const totalReservas = Object.values(estadoReservas).reduce((sum, count) => sum + count, 0);
    const productosVendidos = productosMasVendidos.reduce((sum, producto) => sum + producto.cantidadVendida, 0);

    return {
        ventasPorCategoria,
        productosMasVendidos,
        estadoReservas,
        ingresosPorDia,
        ultimasReservas,
        totalIngresos,
        totalReservas,
        productosVendidos,
        reservasPendientes: estadoReservas.pendiente
    };
}

function actualizarDashboard() {
    const data = metricasData[periodoActual];
    
    // Actualizar KPIs
    actualizarKPIs(data);
    
    // Actualizar gráficos
    actualizarVentasPorCategoria(data.ventasPorCategoria);
    actualizarProductosMasVendidos(data.productosMasVendidos);
    actualizarEstadoReservas(data.estadoReservas);
    actualizarIngresosPorDia(data.ingresosPorDia);
    actualizarUltimasReservas(data.ultimasReservas);
}

function actualizarKPIs(data) {
    // Ingresos Totales
    document.getElementById('totalIngresos').textContent = `S/ ${data.totalIngresos.toLocaleString('es-ES', { minimumFractionDigits: 2 })}`;
    
    // Cambio porcentual (ficticio)
    const cambioIngresos = Math.round((Math.random() * 30) - 10);
    const ingresosChange = document.getElementById('ingresosChange');
    ingresosChange.textContent = `${cambioIngresos >= 0 ? '+' : ''}${cambioIngresos}%`;
    ingresosChange.className = `kpi-change ${cambioIngresos >= 0 ? 'positive' : 'negative'}`;

    // Total Reservas
    document.getElementById('totalReservas').textContent = data.totalReservas.toLocaleString();
    
    const cambioReservas = Math.round((Math.random() * 25) - 5);
    const reservasChange = document.getElementById('reservasChange');
    reservasChange.textContent = `${cambioReservas >= 0 ? '+' : ''}${cambioReservas}%`;
    reservasChange.className = `kpi-change ${cambioReservas >= 0 ? 'positive' : 'negative'}`;

    // Reservas Pendientes
    document.getElementById('reservasPendientes').textContent = data.reservasPendientes.toLocaleString();

    // Productos Vendidos
    document.getElementById('productosVendidos').textContent = data.productosVendidos.toLocaleString();
}

function actualizarVentasPorCategoria(ventasPorCategoria) {
    const container = document.getElementById('categoriaChart');
    const maxVenta = Math.max(...Object.values(ventasPorCategoria));
    
    let html = '';
    Object.entries(ventasPorCategoria).forEach(([categoria, venta]) => {
        const porcentaje = maxVenta > 0 ? (venta / maxVenta) * 100 : 0;
        
        html += `
            <div class="chart-bar">
                <div class="chart-bar-label">${categoria}</div>
                <div class="chart-bar-container">
                    <div class="chart-bar-fill" style="width: ${porcentaje}%">
                        <span class="chart-bar-value">S/ ${venta.toLocaleString()}</span>
                    </div>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

function actualizarProductosMasVendidos(productosMasVendidos) {
    const container = document.getElementById('topProductos');
    
    let html = '';
    productosMasVendidos.forEach((producto, index) => {
        const rank = index + 1;
        const rankClass = rank <= 3 ? 'top-rank-highlight' : '';
        
        html += `
            <div class="top-item">
                <div class="top-rank ${rankClass}">${rank}</div>
                <div class="top-info">
                    <div class="top-name">${producto.nombre}</div>
                    <div class="top-category">${producto.categoria}</div>
                </div>
                <div class="top-value">${producto.cantidadVendida} und</div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

function actualizarEstadoReservas(estadoReservas) {
    const container = document.getElementById('estadoChart');
    const estados = document.querySelectorAll('.estado-item');
    
    const estadoMapping = {
        'Pendiente': estadoReservas.pendiente,
        'Confirmada': estadoReservas.confirmada,
        'Lista': estadoReservas.lista,
        'Entregada': estadoReservas.entregada,
        'Cancelada': estadoReservas.cancelada
    };
    
    estados.forEach((estadoItem, index) => {
        const estadoText = estadoItem.querySelector('.estado-label span:last-child').textContent;
        const countElement = estadoItem.querySelector('.estado-count');
        countElement.textContent = estadoMapping[estadoText].toLocaleString();
    });
}

function actualizarIngresosPorDia(ingresosPorDia) {
    const container = document.getElementById('ingresosChart');
    const maxIngreso = Math.max(...ingresosPorDia);
    const dias = ['lun', 'mar', 'mié', 'jue', 'vie', 'sáb', 'dom'];
    
    let html = '';
    ingresosPorDia.forEach((ingreso, index) => {
        const porcentaje = maxIngreso > 0 ? (ingreso / maxIngreso) * 100 : 0;
        const altura = Math.max(porcentaje, 10); // Mínimo 10% de altura para visibilidad
        
        html += `
            <div class="line-bar" style="height: ${altura}%">
                <div class="line-bar-tooltip">
                    <p>
                        ${dias[index]}
                        <br>
                        S/ ${ingreso.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                    </p>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

function actualizarUltimasReservas(ultimasReservas) {
    const tbody = document.getElementById('recentReservasBody');
    
    let html = '';
    ultimasReservas.forEach(reserva => {
        const estadoClass = `estado-${reserva.estado.toLowerCase()}`;
        
        html += `
            <tr>
                <td>${reserva.id}</td>
                <td>${reserva.cliente}</td>
                <td>${reserva.fecha}</td>
                <td><strong>S/ ${reserva.total.toLocaleString('es-ES', { minimumFractionDigits: 2 })}</strong></td>
                <td>
                    <span class="reserva-estado-badge ${estadoClass}">
                        ${reserva.estado.charAt(0).toUpperCase() + reserva.estado.slice(1)}
                    </span>
                </td>
            </tr>
        `;
    });
    
    tbody.innerHTML = html;
}

// Función para actualizar datos en tiempo real (simulado)
function simularActualizacionEnTiempoReal() {
    setInterval(() => {
        // Regenerar datos para el período actual
        metricasData[periodoActual] = generarDatosParaPeriodo(periodoActual);
        actualizarDashboard();
    }, 30000); // Actualizar cada 30 segundos
}

// Iniciar simulación de datos en tiempo real (opcional)
// simularActualizacionEnTiempoReal();