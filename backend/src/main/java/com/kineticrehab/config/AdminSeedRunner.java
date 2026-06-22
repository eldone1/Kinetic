package com.kineticrehab.config;

import com.kineticrehab.model.Rol;
import com.kineticrehab.model.Usuario;
import com.kineticrehab.repository.RolRepository;
import com.kineticrehab.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class AdminSeedRunner implements ApplicationRunner {

    private static final String ROLE_ADMIN = "ROLE_ADMIN";
    private static final String ROLE_RECEPCION = "ROLE_RECEPCION";
    private static final String ROLE_DOCTOR = "ROLE_DOCTOR";

    private final UsuarioRepository usuarioRepository;
    private final RolRepository rolRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.seed.admin.enabled:true}")
    private boolean enabled;

    @Value("${app.seed.admin.username:admin}")
    private String username;

    @Value("${app.seed.admin.email:admin@kineticrehab.local}")
    private String email;

    @Value("${app.seed.admin.password:admin12345}")
    private String password;

    @Value("${app.seed.admin.nombre:Administrador}")
    private String nombre;

    @Value("${app.seed.admin.apellidos:Sistema}")
    private String apellidos;

    @Value("${app.seed.admin.telefono:}")
    private String telefono;

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        if (!enabled) {
            log.info("Seed de administrador deshabilitado por configuración");
            return;
        }

        seedRoles();

        if (!StringUtils.hasText(username)
                || !StringUtils.hasText(email)
                || !StringUtils.hasText(password)
                || !StringUtils.hasText(nombre)
                || !StringUtils.hasText(apellidos)) {
            log.warn("No se ejecuta el seed admin: faltan variables obligatorias");
            return;
        }

        String normalizedUsername = username.trim();
        String normalizedEmail = email.trim().toLowerCase();

        Rol rolAdmin = rolRepository.findByNombre(ROLE_ADMIN)
                .orElseThrow(() -> new IllegalStateException("No existe el rol ROLE_ADMIN después del seed"));

        usuarioRepository.findByUsernameAndDeletedAtIsNull(normalizedUsername)
                .ifPresentOrElse(
                        usuario -> syncAdmin(usuario, rolAdmin, normalizedEmail),
                        () -> createAdminIfNotExists(rolAdmin, normalizedUsername, normalizedEmail)
                );
    }

    private void seedRoles() {
        List.of(
                        new RoleSeed(ROLE_ADMIN, "Acceso total al sistema"),
                        new RoleSeed(ROLE_RECEPCION, "Agenda, ventas y cobros"),
                        new RoleSeed(ROLE_DOCTOR, "Historia clínica y agenda propia")
                )
                .forEach(this::ensureRoleExists);
    }

    private void ensureRoleExists(RoleSeed seed) {
        rolRepository.findByNombre(seed.nombre())
                .ifPresentOrElse(
                        rol -> {
                            boolean changed = false;

                            if (!seed.descripcion().equals(rol.getDescripcion())) {
                                rol.setDescripcion(seed.descripcion());
                                changed = true;
                            }

                            if (changed) {
                                rolRepository.save(rol);
                                log.info("Rol {} actualizado desde seed", seed.nombre());
                            }
                        },
                        () -> {
                            Rol rol = Rol.builder()
                                    .nombre(seed.nombre())
                                    .descripcion(seed.descripcion())
                                    .build();
                            rolRepository.save(rol);
                            log.info("Rol {} creado al iniciar la aplicación", seed.nombre());
                        }
                );
    }

    private void syncAdmin(Usuario usuario, Rol rolAdmin, String normalizedEmail) {
        if (!ROLE_ADMIN.equals(usuario.getRol().getNombre())) {
            log.warn("Existe un usuario con username '{}' pero no tiene rol admin. Seed omitido", usuario.getUsername());
            return;
        }

        boolean changed = false;

        if (!usuario.getEmail().equalsIgnoreCase(normalizedEmail) && !usuarioRepository.existsByEmail(normalizedEmail)) {
            usuario.setEmail(normalizedEmail);
            changed = true;
        }

        if (!usuario.getNombre().equals(nombre.trim())) {
            usuario.setNombre(nombre.trim());
            changed = true;
        }

        if (!usuario.getApellidos().equals(apellidos.trim())) {
            usuario.setApellidos(apellidos.trim());
            changed = true;
        }

        String normalizedTelefono = StringUtils.hasText(telefono) ? telefono.trim() : null;
        if (!java.util.Objects.equals(usuario.getTelefono(), normalizedTelefono)) {
            usuario.setTelefono(normalizedTelefono);
            changed = true;
        }

        if (!usuario.getActivo()) {
            usuario.setActivo(true);
            changed = true;
        }

        if (!passwordEncoder.matches(password, usuario.getPassword())) {
            usuario.setPassword(passwordEncoder.encode(password));
            changed = true;
        }

        if (changed) {
            usuarioRepository.save(usuario);
            log.info("Administrador '{}' actualizado desde variables de entorno", usuario.getUsername());
            return;
        }

        log.info("Administrador '{}' ya existe. Seed idempotente sin cambios", usuario.getUsername());
    }

    private void createAdminIfNotExists(Rol rolAdmin, String normalizedUsername, String normalizedEmail) {
        if (usuarioRepository.existsByEmail(normalizedEmail)) {
            log.warn("No se crea admin: ya existe un usuario con email '{}'", normalizedEmail);
            return;
        }

        Usuario admin = Usuario.builder()
                .username(normalizedUsername)
                .email(normalizedEmail)
                .password(passwordEncoder.encode(password))
                .nombre(nombre.trim())
                .apellidos(apellidos.trim())
                .telefono(StringUtils.hasText(telefono) ? telefono.trim() : null)
                .rol(rolAdmin)
                .activo(true)
                .build();

        usuarioRepository.save(admin);
        log.info("Administrador '{}' creado correctamente al iniciar la aplicación", normalizedUsername);
    }

    private record RoleSeed(String nombre, String descripcion) {
    }
}