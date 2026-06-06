# Gestor de Gastos

Backend REST para el sistema de control de gastos empresariales. Node.js + Express + PostgreSQL, ECMAScript Modules nativos, arquitectura por capas (repositorio → servicio → controlador), RBAC por rol, sesiones por cookie.

## Requisitos

- Node.js 18 o superior
- Docker y Docker Compose

## Arranque local

```bash
docker compose up -d db
cd api
npm install
npm run db:migrate
npm run db:seed   # requiere variables de entorno (ver sección Migraciones)
npm start
```

La base de datos queda expuesta en `127.0.0.1:5433` para evitar colisiones con instalaciones locales. La API corre en el puerto definido en `api/.env` (por defecto `4000`).

## Configuración de entorno

Copia `api/.env.example` a `api/.env` y ajusta:

| Variable | Descripción |
|---|---|
| `DATABASE_URL` | Cadena de conexión PostgreSQL |
| `PORT` | Puerto de la API (default `4000`) |
| `API_PREFIX` | Prefijo de rutas (default `/api`) |
| `AUTH_COOKIE_NAME` | Nombre de la cookie de sesión |
| `SESSION_TTL_DAYS` | Días de vida de la sesión |

## Migraciones y seeds

```bash
npm run db:migrate
```

```bash
ADMIN_NAME="Administrador" \
ADMIN_EMAIL="admin@empresa.local" \
ADMIN_PASSWORD_HASH='$2b$...' \
npm run db:seed
```

`ADMIN_PASSWORD_HASH` debe ser un hash bcrypt, nunca texto plano. Usa comillas simples si el hash contiene `$` para evitar expansión del shell.

Otros scripts disponibles: `npm run db:init`, `npm run db:rollback`.

---

## Módulos implementados

### Salud

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/health` | Estado del servidor y conexión a BD |

### Autenticación

Sesión por cookie HTTP-only (`AUTH_COOKIE_NAME`).

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/api/auth/login` | Iniciar sesión |
| POST | `/api/auth/logout` | Cerrar sesión |
| GET | `/api/auth/me` | Usuario de la sesión activa |

```bash
# Login
curl -c cookies.txt -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@empresa.local","password":"..."}'

# Rutas protegidas
curl -b cookies.txt http://localhost:4000/api/auth/me
```

### Áreas

Requiere autenticación. CRUD + activar/desactivar. Solo ADMIN puede crear/editar/desactivar.

| Método | Ruta | Acceso |
|---|---|---|
| GET | `/api/areas` | Todos |
| GET | `/api/areas/:id` | Todos |
| POST | `/api/areas` | ADMIN |
| PUT | `/api/areas/:id` | ADMIN |
| PATCH | `/api/areas/:id/activar` | ADMIN |
| PATCH | `/api/areas/:id/desactivar` | ADMIN |

### Centros de costo

Requiere autenticación. CRUD + activar/desactivar. Cada centro pertenece a un área activa.

| Método | Ruta | Acceso |
|---|---|---|
| GET | `/api/centros-costo` | Todos |
| GET | `/api/centros-costo/:id` | Todos |
| POST | `/api/centros-costo` | ADMIN |
| PUT | `/api/centros-costo/:id` | ADMIN |
| PATCH | `/api/centros-costo/:id/activar` | ADMIN |
| PATCH | `/api/centros-costo/:id/desactivar` | ADMIN |

### Usuarios

Requiere autenticación. CRUD + activar/desactivar. No expone `password_hash`. Un usuario no puede desactivarse a sí mismo.

| Método | Ruta | Acceso |
|---|---|---|
| GET | `/api/usuarios` | ADMIN |
| GET | `/api/usuarios/:id` | ADMIN |
| POST | `/api/usuarios` | ADMIN |
| PUT | `/api/usuarios/:id` | ADMIN |
| PATCH | `/api/usuarios/:id/activar` | ADMIN |
| PATCH | `/api/usuarios/:id/desactivar` | ADMIN |

Roles disponibles: `ADMIN`, `CAPTURISTA`, `JEFE_AREA`, `CUENTAS_POR_PAGAR`.

### Categorías

| Método | Ruta | Acceso |
|---|---|---|
| GET | `/api/categorias` | Todos |
| GET | `/api/categorias/:id` | Todos |
| POST | `/api/categorias` | ADMIN |
| PUT | `/api/categorias/:id` | ADMIN |
| PATCH | `/api/categorias/:id/activar` | ADMIN |
| PATCH | `/api/categorias/:id/desactivar` | ADMIN |

### Conceptos de deducibilidad

| Método | Ruta | Acceso |
|---|---|---|
| GET | `/api/conceptos-deducibilidad` | Todos |
| GET | `/api/conceptos-deducibilidad/:id` | Todos |
| POST | `/api/conceptos-deducibilidad` | ADMIN |
| PUT | `/api/conceptos-deducibilidad/:id` | ADMIN |
| PATCH | `/api/conceptos-deducibilidad/:id/activar` | ADMIN |
| PATCH | `/api/conceptos-deducibilidad/:id/desactivar` | ADMIN |

### Proveedores

Validación de RFC formato mexicano (`/^[A-Z&Ñ]{3,4}\d{6}[A-Z0-9]{3}$/`).

| Método | Ruta | Acceso |
|---|---|---|
| GET | `/api/proveedores` | Todos |
| GET | `/api/proveedores/:id` | Todos |
| POST | `/api/proveedores` | ADMIN |
| PUT | `/api/proveedores/:id` | ADMIN |
| PATCH | `/api/proveedores/:id/activar` | ADMIN |
| PATCH | `/api/proveedores/:id/desactivar` | ADMIN |

### Estatus de gastos

Solo lectura. Valores sembrados: `BORRADOR`, `PENDIENTE_APROBACION`, `APROBADO`, `RECHAZADO`.

| Método | Ruta | Acceso |
|---|---|---|
| GET | `/api/estatus-gastos` | Todos |

### Gastos

Control de acceso por rol:
- **CAPTURISTA**: ve y opera solo sus propios gastos.
- **JEFE_AREA**: ve todos los gastos de su área.
- **ADMIN / CUENTAS_POR_PAGAR**: acceso total.

Folio generado automáticamente: `GAS-{YYYY}-{000001}`. Baja lógica (`deleted_at`). `total = subtotal + iva` siempre calculado.

| Método | Ruta | Acceso |
|---|---|---|
| GET | `/api/gastos` | Todos (filtrado por rol) |
| GET | `/api/gastos/:id` | Todos (filtrado por rol) |
| POST | `/api/gastos` | CAPTURISTA, ADMIN |
| PUT | `/api/gastos/:id` | CAPTURISTA, ADMIN |
| DELETE | `/api/gastos/:id` | CAPTURISTA, ADMIN |

Solo se pueden editar/eliminar gastos en estado `BORRADOR`.

#### Partidas de gasto

`subtotal = cantidad × precio_unitario` (calculado). `iva` ingresado por el usuario. `total = subtotal + iva`. Las operaciones son atómicas: cada mutación recalcula los totales de la cabecera en la misma transacción.

| Método | Ruta | Acceso |
|---|---|---|
| GET | `/api/gastos/:id/detalle` | Todos |
| GET | `/api/gastos/:id/detalle/:detalleId` | Todos |
| POST | `/api/gastos/:id/detalle` | CAPTURISTA, ADMIN |
| PUT | `/api/gastos/:id/detalle/:detalleId` | CAPTURISTA, ADMIN |
| DELETE | `/api/gastos/:id/detalle/:detalleId` | CAPTURISTA, ADMIN |

#### CFDI (XML fiscal)

Un gasto puede tener como máximo un CFDI. El UUID debe ser único en el sistema. Se extrae automáticamente: UUID, RFC emisor/receptor, fecha, subtotal, IVA, total, método de pago, serie y folio. Si el RFC emisor coincide con un proveedor activo, se enlaza automáticamente. El archivo XML se almacena en `api/storage/uploads/xml/`. Solo gastos en `BORRADOR` aceptan subida y eliminación.

El XML se envía como cuerpo de la petición con `Content-Type: text/xml` o `application/xml`.

| Método | Ruta | Acceso |
|---|---|---|
| POST | `/api/gastos/:id/cfdi` | CAPTURISTA, ADMIN |
| GET | `/api/gastos/:id/cfdi` | Todos |
| DELETE | `/api/gastos/:id/cfdi` | CAPTURISTA, ADMIN |

```bash
curl -b cookies.txt -X POST http://localhost:4000/api/gastos/1/cfdi \
  -H "Content-Type: text/xml" \
  --data-binary @factura.xml
```

#### Documentos relacionados

Evidencia adicional (PDF, imágenes, etc.) adjunta al gasto. Un gasto puede tener múltiples documentos. Baja lógica: el registro se marca como eliminado pero el archivo físico permanece en disco. Archivos XML son rechazados (usar endpoint CFDI). Límite de tamaño: 10 MB por archivo. Almacenados en `api/storage/uploads/docs/`.

El campo de formulario debe llamarse `archivo`. El campo `observaciones` es opcional.

| Método | Ruta | Acceso |
|---|---|---|
| POST | `/api/gastos/:id/documentos` | CAPTURISTA, ADMIN |
| GET | `/api/gastos/:id/documentos` | Todos |
| DELETE | `/api/gastos/:id/documentos/:docId` | CAPTURISTA, ADMIN |

```bash
curl -b cookies.txt -X POST http://localhost:4000/api/gastos/1/documentos \
  -F "archivo=@recibo.pdf" \
  -F "observaciones=Recibo original"
```

---

## Esquema de base de datos

| Tabla | Descripción |
|---|---|
| `roles` | Roles del sistema (ADMIN, CAPTURISTA, JEFE_AREA, CUENTAS_POR_PAGAR) |
| `usuarios` | Usuarios con rol y área asignada |
| `sesiones` | Sesiones activas (token hasheado, expiración, revocación) |
| `areas` | Áreas organizacionales |
| `centros_costo` | Centros de costo asociados a un área |
| `categorias` | Categorías de gasto |
| `conceptos_deducibilidad` | Conceptos de deducibilidad fiscal |
| `proveedores` | Proveedores con RFC validado |
| `estatus_gastos` | Catálogo de estados del gasto (solo lectura) |
| `gastos` | Cabecera del gasto (folio, área, centro de costo, totales) |
| `gastos_detalle` | Partidas del gasto (cantidad, precio, categoría, concepto) |
| `facturas_cfdi` | Datos extraídos del XML CFDI asociado al gasto |
| `documentos_relacionados` | Archivos de evidencia adjuntos al gasto (baja lógica) |

## Estructura de archivos

```
api/
├── bootstrap/          Arranque del servidor y registro de middlewares
├── core/               Excepciones (HttpError) y utilidades base
├── database/
│   ├── connection/     Pool de conexión PostgreSQL
│   ├── migrations/     Migraciones SQL (001–014)
│   └── seeders/        Seeds iniciales (roles, usuario admin)
├── middlewares/        auth, role (RBAC)
├── modules/
│   ├── auth/           Login, logout, me
│   ├── catalogs/       Categorías, conceptos de deducibilidad, estatus gastos
│   ├── cost-centers/   Centros de costo
│   ├── expenses/       Gastos, detalle, CFDI, documentos relacionados
│   ├── locations/      Áreas
│   ├── providers/      Proveedores
│   └── users/          Usuarios
├── routes/             Routers por módulo
├── scripts/            db-init, db-migrate, db-rollback, db-seed
├── storage/
│   └── uploads/
│       ├── xml/        Archivos XML CFDI
│       └── docs/       Documentos relacionados
└── utils/              cfdi-parser (regex, sin dependencias externas)
```

## Notas de seguridad

- Contraseñas hasheadas con bcrypt (10 rondas mínimo).
- `password_hash` nunca incluido en respuestas de la API.
- Sesiones por cookie HTTP-only; token almacenado hasheado en BD.
- Todas las consultas usan parámetros posicionales (`$1`, `$2`, …), sin interpolación de strings.
- RBAC aplicado en capa de middleware y reforzado en capa de servicio.
- Archivos XML solo aceptados en el endpoint CFDI; los documentos relacionados rechazan XML.
