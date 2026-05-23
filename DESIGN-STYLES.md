# DESIGN-STYLES.md — Mejoras Visuales

> Archivo de seguimiento para cambios de estilo. Solo modifica estilos, nunca lógica.

## Estilo General

- **Propósito**: Sistema clínico de rehabilitación — interfaz moderna, profesional y calmada
- **Tono**: Glassmorphism (cristal/translúcido), bordes redondeados, tonos teal/verde agua
- **Base**: Tailwind CSS con paleta `primary` (teal), `bg-gray-50` de fondo

## Cambios Realizados

### 1. Configuración global

| Archivo | Cambio |
|---------|--------|
| `tailwind.config.js` | Extendido con colores `glass`, animaciones (`fade-in`, `slide-up`, `pulse-soft`), `backdropBlur` |
| `src/styles.css` | Clases utilitarias: `glass-card`, `glass-card-strong`, `glass-sidebar`, `glass-login`, `input-field`, `btn-primary`, `btn-secondary`, `btn-danger`, `btn-ghost`, `badge-*`, `toggle-*`, scrollbar utilities, selección personalizada |

### 2. Login (`auth/login/login.component.ts`)

| Antes | Después |
|-------|---------|
| Fondo `bg-primary-50` sólido | Imagen de fondo (`referencia-login.png`) con overlay gradiente oscuro semi-transparente |
| Card `bg-white rounded-xl shadow-lg` | `glass-login` (blur 24px, bg blanco 75%, sombra profunda) |
| Inputs estándar | `input-field` (rounded-xl, focus ring teal) |
| Botón simple | `btn-primary` con hover scale y shadow |
| Spinner `&#9696;` | Spinner animado con borde CSS |
| Logo texto "KR" | Logo imagen `logo.png` |
| Animación: ❌ | `animate-fade-in` en el card |

### 3. Layout (`core/components/layout/layout.component.ts`)

| Antes | Después |
|-------|---------|
| Sidebar `bg-primary-900` sólido | Gradiente vertical (`#0d9488 → #115e59 → #134e4a → #0f172a`) |
| Logo texto "KR" | Logo imagen `logo.png` |
| Nav items sin hover fuerte | Hover `bg-white/10`, active `bg-white/15 shadow-sm`, texto `font-medium` |
| Section headers básicos | Uppercase tracking-widest, bold |
| User avatar gradient primary | Avatar gradient `from-teal-300 to-teal-600` |
| Footer simple | Footer con `background: rgba(0,0,0,0.2)` oscuro |
| `glass-sidebar` eliminado | Reemplazado por gradient CSS inline |

### 4. Doctor List (`features/doctores/doctor-list/`)

| Antes | Después |
|-------|---------|
| Card `bg-white rounded-xl shadow-sm` | `glass-card-strong` (blur + sombra) |
| Tabla simple | Tabla con header uppercase tracking, initial avatar gradient, hover states |
| Badge estado: clases inline | `badge-active` / `badge-inactive` con dot indicador |
| Botón Activar/Desactivar texto | **Toggle switch** animado (slide, primary-600 cuando activo) |
| Botones acción: clases repetitivas | `btn-ghost`, `btn-danger` |
| Search input simple | `input-field` con ícono de búsqueda |
| Empty state texto | Empty state con ícono + título + subtítulo |
| Header solo título | Header con título + descripción + `font-heading` |
| Animación: ❌ | `animate-fade-in` en contenedor principal |

### 5. Doctor Form (`features/doctores/doctor-form/`)

| Antes | Después |
|-------|---------|
| Card `bg-white rounded-xl shadow-md` | `glass-card-strong rounded-2xl` |
| Inputs básicos | `input-field` con placeholder, border sutil, focus ring teal |
| Botón Guardar: inline classes | `btn-primary` con spinner animado |
| Botón Cancelar: inline classes | `btn-secondary` con border hover |
| Header solo título | Header con ícono gradient + título + descripción |
| Margins `mt-6` | `p-6` container con `animate-fade-in` |

### 6. Doctor Horarios (`features/doctores/doctor-horarios/`)

| Antes | Después |
|-------|---------|
| Card `bg-white rounded-xl shadow-md` | `glass-card-strong rounded-2xl` |
| Días: `border rounded-lg p-4` | `glass-card rounded-xl p-5` |
| Time inputs básicos | Inputs con `rounded-xl`, focus ring, border sutil |
| Botón "+ Agregar bloque" básico | `bg-primary-50 text-primary-700 rounded-lg` con hover |
| Botón "x" simple | Contenedor cuadrado con hover state |
| Separador "a" | "—" más estilizado |

### 7. Paciente List + Form

- Mismos patrones que Doctor List/Form:
  - `glass-card-strong` container
  - Initial avatar gradient (primary-400 a primary-600)
  - `input-field`, `btn-primary`, `btn-secondary`, `btn-danger`, `btn-ghost`
  - Empty state con ícono + copy
  - Header descriptivo con `font-heading`
  - `animate-fade-in` en página

### 8. Usuario List + Form

- Mismos patrones:
  - Toggle switch para activar/desactivar (en list)
  - `badge-admin`, `badge-recepcion`, `badge-doctor` para roles
  - `badge-active` / `badge-inactive` para estado
  - Tabla con initial avatars gradient

### 9. Cambio Password

- Mismos patrones de glass card, `input-field`, `btn-primary`

## Componentes Compartidos (utilities CSS)

| Clase | Propósito |
|-------|-----------|
| `.glass-card` | Card translúcido (blur 16px, bg 75%) |
| `.glass-card-strong` | Card más opaco (blur 20px, bg 90%, sombra) |
| `.glass-sidebar` | Sidebar oscuro translúcido |
| `.glass-login` | Login card con blur 24px |
| `.input-field` | Input con rounded-xl, focus ring teal |
| `.input-field-error` | Input en estado error (borde rojo) |
| `.btn-primary` | Botón primario teal con shadow y hover scale |
| `.btn-secondary` | Botón secundario outline |
| `.btn-danger` | Botón peligro rojo pequeño |
| `.btn-ghost` | Botón ghost gris pequeño |
| `.badge-*` | Badges de estado con dot indicador |
| `.scrollbar-thin` | Scrollbar delgado personalizado |
| `animate-fade-in` | Animación de entrada con fade |

## Assets

| Archivo | Origen | Uso |
|---------|--------|-----|
| `assets/images/referencia-login.png` | `ReferenciaLogin.png` (raíz) | Login background |
| `assets/images/logo.png` | `Logo.png` (raíz) | Logo en login y sidebar |
| `assets/images/referencia-degradado.png` | `ReferenciaDegradado.png` (raíz) | Referencia visual sidebar gradient |

## Pendientes / Ideas

- [ ] Migrar a icon library (Material Symbols o Lucide)
- [ ] Agregar dark mode
- [ ] Refinar responsive (sidebar colapsable)
- [ ] Skeleton loaders en tablas
- [ ] Toast/notificaciones tras acciones
