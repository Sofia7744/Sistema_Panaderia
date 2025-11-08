package com.panaderiadelicia.repository;

import com.panaderiadelicia.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Optional<Usuario> findByEmail(String email);
    List<Usuario> findByActivoTrue();
    List<Usuario> findByRol(Usuario.Rol rol);
    List<Usuario> findByRolAndActivoTrue(Usuario.Rol rol);
}