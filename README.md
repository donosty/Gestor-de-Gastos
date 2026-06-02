# Gestor de Gastos

Base tecnica minima para el backend del sistema de control de gastos.
El backend usa ECMAScript Modules de forma nativa.

## Requisitos

- Node.js 18 o superior
- Docker y Docker Compose

## Configuracion de entorno

1. Copia `api/.env.example` a `api/.env`.
2. Ajusta el valor de `DATABASE_URL` solo si cambias el puerto o credenciales del contenedor.
3. Revisa `PORT`, `API_PREFIX`, `APP_NAME`, `NODE_ENV`, `AUTH_COOKIE_NAME` y `SESSION_TTL_DAYS`.

## Arranque local

1. Levanta la base de datos con `docker compose up -d db`.
2. Instala dependencias con `npm install`.
3. Inicia la API con `npm start`.

La base de datos queda expuesta en `127.0.0.1:5433` para evitar colisiones con instalaciones locales.

## Verificacion

- Healthcheck: `GET /api/health` si usas el valor por defecto de `API_PREFIX`.
- Inicializacion de base de datos: `npm run db:init`.

## Autenticacion (API)

Endpoints:

- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`

Ejemplos:

Login:

```
curl -i -X POST http://127.0.0.1:4000/api/auth/login \
	-H "Content-Type: application/json" \
	-d '{"email":"admin@empresa.local","password":"Admin123!"}'
```

Me (requiere cookie de sesion):

```
curl -i http://127.0.0.1:4000/api/auth/me \
	-H "Cookie: gestor_gastos_session=TOKEN"
```

Logout:

```
curl -i -X POST http://127.0.0.1:4000/api/auth/logout \
	-H "Cookie: gestor_gastos_session=TOKEN"
```

## Migraciones y seeds

1. Levanta la base de datos con `docker compose up -d db`.
2. Ejecuta migraciones con las variables de entorno requeridas:

```
AUTH_COOKIE_NAME="gestor_gastos_session" \
SESSION_TTL_DAYS=7 \
npm run db:migrate
```
3. Ejecuta seeds con las variables de entorno requeridas:

```
AUTH_COOKIE_NAME="gestor_gastos_session" \
SESSION_TTL_DAYS=7 \
ADMIN_NAME="Administrador" \
ADMIN_EMAIL="admin@empresa.local" \
ADMIN_PASSWORD_HASH='$2b$12$6tgGx4Siq2/2M/4vuidJuepejKh3t5a8lJ.oPDEeE8MITZRvZjunC' \
npm run db:seed
```

`ADMIN_PASSWORD_HASH` debe ser un hash seguro (por ejemplo bcrypt) y nunca texto plano.
Usa comillas simples si el hash contiene caracteres `$` para evitar expansion del shell.

## Relaciones actuales

- `usuarios.rol_id` referencia `roles.id` (FK obligatoria para preparar RBAC).

## Alcance de esta base

- No incluye refresh tokens.
- No incluye CRUDs administrativos.
- No incluye gasto ni CRUDs de negocio.
- No incluye pantallas funcionales.