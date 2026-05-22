package com.kineticrehab.repository;

import com.kineticrehab.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    Optional<Usuario> findByUsernameAndDeletedAtIsNull(String username);

    Optional<Usuario> findByEmailAndDeletedAtIsNull(String email);

    List<Usuario> findAllByDeletedAtIsNull();

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);
}
