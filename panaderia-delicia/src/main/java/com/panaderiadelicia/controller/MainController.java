package com.panaderiadelicia.controller;

import com.panaderiadelicia.entity.Usuario;
import com.panaderiadelicia.repository.UsuarioRepository;
import com.panaderiadelicia.repository.ProductoRepository;
import com.panaderiadelicia.repository.CategoriaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class MainController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ProductoRepository productoRepository;

    @Autowired
    private CategoriaRepository categoriaRepository;

    // 🏠 INICIO (Landing page pública)
    @GetMapping("/")
    public String inicio(Model model) {
        var productos = productoRepository.findByActivoTrue();
        var productosDestacados = productos.subList(0, Math.min(6, productos.size()));
        model.addAttribute("productosDestacados", productosDestacados);
        return "index";
    }

    // 🛍️ PRODUCTOS (Catálogo público)
    @GetMapping("/productos")
    public String productos(Model model) {
        var productos = productoRepository.findByActivoTrue();
        var categorias = categoriaRepository.findByActivoTrue();
        model.addAttribute("productos", productos);
        model.addAttribute("categorias", categorias);
        return "productos";
    }

    // 🎉 PROMOCIONES
    @GetMapping("/promociones")
    public String promociones(Model model) {
        var productos = productoRepository.findByActivoTrue();
        model.addAttribute("productos", productos);
        return "promociones";
    }

    // 📋 NUEVA COMPRA (Carrito)
    @GetMapping("/nueva-compra")
    public String nuevaCompra(Model model) {
        var productos = productoRepository.findByActivoTrue();
        model.addAttribute("productos", productos);
        return "nueva-compra";
    }

    // 📦 MIS COMPRAS (Solo logueados)
    @GetMapping("/mis-compras")
    public String misCompras(Model model) {
        // Aquí iría el historial de compras del usuario
        return "mis-compras";
    }

    // 👤 MI PERFIL (Solo logueados)
    @GetMapping("/mi-perfil")
    public String miPerfil(Model model) {
        // Usuario de ejemplo
        Usuario usuario = new Usuario();
        usuario.setNombre("Cliente Ejemplo");
        usuario.setEmail("cliente@ejemplo.com");
        usuario.setTelefono("987654321");
        usuario.setRol(Usuario.Rol.CLIENTE);

        model.addAttribute("usuario", usuario);
        return "mi-perfil";
    }

    // ⚙️ GESTIÓN PRODUCTOS (Solo personal)
    @GetMapping("/gestion-productos")
    public String gestionProductos(Model model) {
        var productos = productoRepository.findAll(); // TODOS, incluyendo inactivos
        var categorias = categoriaRepository.findByActivoTrue();
        model.addAttribute("productos", productos);
        model.addAttribute("categorias", categorias);
        return "gestion-productos";
    }

    // ⚙️ GESTIÓN CATEGORÍAS (Solo personal)
    @GetMapping("/gestion-categorias")
    public String gestionCategorias(Model model) {
        var categorias = categoriaRepository.findAll(); // TODAS, incluyendo inactivas
        model.addAttribute("categorias", categorias);
        return "gestion-categorias";
    }

    // ⚙️ GESTIÓN USUARIOS (Solo personal)
    @GetMapping("/gestion-usuarios")
    public String gestionUsuarios(Model model) {
        var usuarios = usuarioRepository.findAll();
        model.addAttribute("usuarios", usuarios);
        model.addAttribute("roles", Usuario.Rol.values());
        return "gestion-usuarios";
    }

    // ⚙️ GESTIÓN COMPRAS (Solo personal)
    @GetMapping("/gestion-compras")
    public String gestionCompras(Model model) {
        // Aquí iría la lista de todas las compras
        return "gestion-compras";
    }

    // 📊 MÉTRICAS (Solo personal)
    @GetMapping("/metricas")
    public String metricas(Model model) {
        // Datos para métricas
        long totalProductos = productoRepository.findByActivoTrue().size();
        long totalCategorias = categoriaRepository.findByActivoTrue().size();
        long totalUsuarios = usuarioRepository.count();
        long productosInactivos = productoRepository.findAll().size() - totalProductos;
        long categoriasInactivas = categoriaRepository.findAll().size() - totalCategorias;

        model.addAttribute("totalProductos", totalProductos);
        model.addAttribute("totalCategorias", totalCategorias);
        model.addAttribute("totalUsuarios", totalUsuarios);
        model.addAttribute("productosInactivos", productosInactivos);
        model.addAttribute("categoriasInactivas", categoriasInactivas);

        return "metricas";
    }

    // 🔐 LOGIN
    @GetMapping("/login")
    public String login() {
        return "login";
    }

    // 📋 PROCESAR LOGIN
    @GetMapping("/procesar-login")
    public String procesarLogin(@RequestParam String email,
                                @RequestParam String password,
                                @RequestParam String rol,
                                Model model) {

        // Simulación de login
        Usuario usuario = new Usuario();
        usuario.setNombre("Usuario Ejemplo");
        usuario.setEmail(email);
        usuario.setRol(Usuario.Rol.valueOf(rol));

        model.addAttribute("usuario", usuario);
        return "redirect:/?login=exitoso";
    }

    // ⚙️ FORMULARIO NUEVO PRODUCTO (Solo personal)
    @GetMapping("/gestion-productos/nuevo")
    public String formularioNuevoProducto(Model model) {
        var categorias = categoriaRepository.findByActivoTrue();
        model.addAttribute("categorias", categorias);
        model.addAttribute("producto", new Producto());
        return "gestion-productos-formulario";
    }
}