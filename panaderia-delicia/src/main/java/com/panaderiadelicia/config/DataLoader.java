package com.panaderiadelicia.config;

import com.panaderiadelicia.entity.Categoria;
import com.panaderiadelicia.entity.Producto;
import com.panaderiadelicia.entity.Usuario;
import com.panaderiadelicia.repository.CategoriaRepository;
import com.panaderiadelicia.repository.ProductoRepository;
import com.panaderiadelicia.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import java.math.BigDecimal;

@Component
public class DataLoader implements CommandLineRunner {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private CategoriaRepository categoriaRepository;

    @Autowired
    private ProductoRepository productoRepository;

    @Override
    public void run(String... args) throws Exception {
        // Crear usuarios de prueba
        if (usuarioRepository.count() == 0) {
            Usuario admin = new Usuario("admin@panaderia.com", "admin123", "Administrador", Usuario.Rol.PERSONAL);
            Usuario cliente = new Usuario("cliente@email.com", "cliente123", "Juan Cliente", Usuario.Rol.CLIENTE);

            usuarioRepository.save(admin);
            usuarioRepository.save(cliente);
        }

        // Crear categorías de prueba
        if (categoriaRepository.count() == 0) {
            Categoria panes = new Categoria("Panes", "Variedad de panes frescos");
            Categoria pasteles = new Categoria("Pasteles", "Pasteles y tortas");
            Categoria galletas = new Categoria("Galletas", "Galletas y cookies");

            categoriaRepository.save(panes);
            categoriaRepository.save(pasteles);
            categoriaRepository.save(galletas);
        }

        // Crear productos de prueba
        if (productoRepository.count() == 0) {
            Categoria panes = categoriaRepository.findByNombre("Panes").orElseThrow();
            Categoria pasteles = categoriaRepository.findByNombre("Pasteles").orElseThrow();

            Producto panFrances = new Producto("Pan Francés", "Pan crujiente y dorado", new BigDecimal("3.50"), panes);
            Producto baguette = new Producto("Baguette", "Pan largo y crujiente", new BigDecimal("4.00"), panes);
            Producto tortaChocolate = new Producto("Torta de Chocolate", "Deliciosa torta de chocolate", new BigDecimal("25.00"), pasteles);

            productoRepository.save(panFrances);
            productoRepository.save(baguette);
            productoRepository.save(tortaChocolate);
        }
    }
}