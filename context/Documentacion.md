# Documento de Diseño  
## Sistema de Gestión de Gastos Empresariales

---

## 1. Visión general de la aplicación

El Sistema de Gestión de Gastos Empresariales será una aplicación web empresarial de tipo on-premise, diseñada para operar dentro de la infraestructura interna de una organización sin dependencia de servicios externos para su funcionamiento principal.

La solución estará enfocada exclusivamente a la administración de gastos de una sola empresa, permitiendo centralizar el registro, validación, autorización y consulta histórica de gastos operativos y administrativos.

El objetivo principal del sistema es garantizar trazabilidad, control presupuestal y seguimiento operativo sobre el ciclo completo del gasto, desde su captura inicial hasta su aprobación y consulta posterior.

El sistema administrará el siguiente ciclo operativo:

- Registro manual del gasto
- Carga y almacenamiento de CFDI en formato XML
- Extracción automatizada de datos fiscales relevantes
- Validación interna
- Flujo de aprobación por jerarquía organizacional
- Seguimiento del estado del gasto
- Consulta histórica y generación de reportes

La aplicación mantendrá retención histórica mínima de 5 años sobre:

- Gastos registrados
- CFDI asociados
- Historial de aprobaciones
- Bitácoras de auditoría
- Cambios operativos relevantes

El diseño arquitectónico priorizará simplicidad operativa, mantenibilidad y bajo acoplamiento técnico, evitando dependencias innecesarias y facilitando futuras ampliaciones controladas.

---

## 2. Alcance funcional

### Incluido

- Registro manual de gastos empresariales
- Captura de información operativa y contable del gasto
- Carga de facturas CFDI en formato XML
- Extracción automática de:
  - RFC emisor
  - RFC receptor
  - UUID
  - Fecha de emisión
  - Método de pago
  - Subtotal
  - IVA
  - Total
- Asociación de gastos a:
  - Área
  - Centro de costos
  - Categoría
- Flujo de aprobación por área
- Control presupuestal mensual por área
- Comparativos de presupuesto contra gasto real
- Administración de usuarios y roles
- Consulta histórica de gastos
- Registro de auditoría básica
- Reportes operativos
- Gestión de estados del gasto
- Notificaciones internas del flujo de aprobación

### Fuera de alcance

- Integración con ERP's
- Integración bancaria
- Timbrado de CFDI
- Validación SAT en línea
- Validación de RFC
- Validación de conceptos fiscales
- Validación de facturas canceladas
- Validación de comprobantes de pago
- Automatización contable completa
- Integración con servicios de terceros
- Aplicación móvil
- Multiempresa
- OCR de tickets o imágenes
- Gestión de pagos o tesorería

---

## 3. Contexto organizacional

### 3.1 Estructura organizacional

El sistema operará bajo una estructura organizacional basada en áreas funcionales y centros de costos.

Cada gasto deberá pertenecer obligatoriamente a:

- Un área organizacional
- Un centro de costos asociado

La estructura organizacional contemplará:

- Dirección General
- Finanzas
- Recursos Humanos
- Compras
- Sistemas / TI
- Operaciones
- Ventas

Cada área tendrá:

- Un responsable autorizado
- Un presupuesto asignado
- Un flujo de aprobación definido

Restricciones organizacionales:

- Un usuario capturista solo podrá registrar gastos para un área asignada
- Un gasto únicamente podrá asociarse a un centro de costos válido
- Los jefes de área únicamente podrán aprobar gastos correspondientes a su área

Los centros de costos permitirán clasificar y segmentar el gasto para fines:

- Operativos
- Presupuestales
- Administrativos
- Contables

### 3.2 Control presupuestal

El sistema administrará presupuestos mensuales por área y centro de costos.

El control presupuestal incluirá:

- Presupuesto mensual autorizado
- Gasto acumulado mensual
- Diferencia entre presupuesto y gasto real
- Porcentaje de consumo presupuestal
- Alertas de sobreconsumo

Los comparativos presupuestales permitirán:

- Consultar gasto real vs presupuestado
- Detectar desviaciones
- Apoyar procesos internos de autorización

---

## 4. Roles del sistema

### Usuario capturista

#### Puede hacer

- Registrar gastos
- Adjuntar CFDI XML
- Consultar sus gastos
- Corregir gastos rechazados
- Consultar historial de estados

#### Puede visualizar

- Gastos propios
- Estado de aprobación
- Presupuesto disponible del área

#### Administra

- Información operativa de los gastos capturados

---

### Jefe de área

#### Puede hacer

- Aprobar gastos
- Rechazar gastos
- Solicitar correcciones
- Consultar gastos del área

#### Puede visualizar

- Gastos pendientes de aprobación
- Historial de aprobaciones
- Presupuesto del área
- Comparativos presupuestales

#### Administra

- Flujo de aprobación de su área

---

### Cuentas por pagar

#### Puede hacer

- Consultar gastos aprobados
- Validar información documental
- Consultar CFDI
- Generar reportes operativos

#### Puede visualizar

- Historial completo de gastos
- Estados de autorización
- Información contable y fiscal básica

#### Administra

- Validación administrativa final del gasto

---

### Administrador de aplicación

#### Puede hacer

- Crear usuarios
- Asignar roles
- Configurar áreas
- Configurar centros de costos
- Configurar presupuestos
- Configurar catálogos

#### Puede visualizar

- Información global del sistema
- Bitácoras de auditoría
- Configuración general

#### Administra

- Parámetros operativos del sistema
- Seguridad y acceso
- Configuración organizacional

---

## 5. Arquitectura general

### 5.1 Enfoque arquitectónico

La solución seguirá una arquitectura FullStack basada en API REST utilizando el stack PERN.

Componentes principales del stack:

- PostgreSQL
- ExpressJS
- React
- NodeJS

La arquitectura estará separada en:

- Frontend web
- API backend
- Persistencia
- Infraestructura on-premise

El backend expondrá servicios REST para desacoplar la lógica de negocio de la interfaz de usuario.

---

### 5.2 Componentes principales

### web (frontend)

Tecnologías principales:

- HTML5
- CSS3
- Tailwind CSS
- JavaScript
- React

Responsabilidades:

- Interfaz de captura
- Formularios operativos
- Visualización de reportes
- Gestión de sesiones
- Flujo de aprobaciones
- Consulta histórica

---

### api (backend)

Tecnologías principales:

- NodeJS
- ExpressJS

Capas internas:

- Controladores
- Servicios
- Modelos / Repositorios

Responsabilidades:

- Lógica de negocio
- Validaciones
- Procesamiento XML
- Control de flujo
- Seguridad
- Gestión de usuarios
- Auditoría

---

### Persistencia

Tecnologías principales:

- PostgreSQL
- Almacenamiento local de archivos XML

Responsabilidades:

- Persistencia transaccional
- Integridad relacional
- Almacenamiento histórico
- Gestión documental básica

---

### Infraestructura

Componentes:

- Servidor on-premise
- Red interna corporativa
- Almacenamiento local
- Servicios de respaldo

Responsabilidades:

- Disponibilidad interna
- Respaldo periódico
- Seguridad física y lógica
- Mantenimiento operativo

---

## 6. Módulos funcionales

### Módulo de autenticación

- Inicio de sesión
- Gestión de sesiones
- Control de acceso
- Recuperación de acceso
- Validación de permisos

### Módulo de administración de aplicación

- Administración de usuarios
- Administración de roles
- Configuración de áreas
- Configuración de centros de costos
- Configuración de presupuestos
- Administración de catálogos

### Módulo de captura de gastos

- Registro manual de gastos
- Asociación de área y centro de costos
- Carga de CFDI XML
- Consulta de gastos propios
- Edición de gastos rechazados

### Módulo de aprobación

- Bandeja de aprobación
- Aprobación de gastos
- Rechazo de gastos
- Observaciones de validación
- Historial de aprobaciones

### Módulo para generar Reportes

- Reportes operativos
- Reportes por área
- Reportes presupuestales
- Reportes históricos
- Exportación básica de información

### Módulo de auditoría

- Registro de acciones críticas
- Trazabilidad de cambios
- Seguimiento de estados
- Historial operativo

### Consulta de historial

- Búsqueda de gastos
- Consulta de CFDI
- Consulta de estados
- Consulta de aprobaciones históricas

### Notificaciones

- Avisos de aprobación pendiente
- Avisos de rechazo
- Avisos de corrección requerida
- Confirmaciones operativas

---

## 7. Flujo completo del gasto

### 1. Capturar un gasto

El usuario capturista registra:

- Información general
- Área
- Centro de costos
- Categoría
- Justificación
- Monto

Estado inicial:

- Borrador

---

### 2. Cargar XML de CFDI

El usuario adjunta el archivo XML correspondiente al gasto.

El sistema almacena el archivo en repositorio local.

---

### 3. Procesar XML

El backend procesa el XML y extrae:

- UUID
- RFC emisor
- RFC receptor
- Total
- Fecha
- Método de pago

El sistema asocia automáticamente la información fiscal al gasto.

---

### 4. Mandar aprobación

El usuario envía el gasto al flujo de autorización.

Estado:

- Pendiente de aprobación

---

### 5. Consultar aprobaciones de gasto

El jefe de área consulta:

- Gastos pendientes
- Presupuesto disponible
- Información documental
- Historial relacionado

---

### 6. Aprobación o rechazo

El jefe de área decide:

- Aprobar
- Rechazar

Estados posibles:

- Aprobado
- Rechazado

---

### 7. Corregir o validar

Si el gasto es rechazado:

- El usuario puede corregir información
- Adjuntar documentación válida
- Reenviar el gasto

Estado:

- Borrador
- Pendiente de aprobación

---

### 8. Generar un reporte

Los usuarios autorizados podrán generar:

- Reportes operativos
- Reportes presupuestales
- Reportes históricos
- Reportes por área

---

### Estados del gasto

- Borrador
- Pendiente de aprobación
- Aprobado
- Rechazado

---

## 8. Modelo de datos conceptual

### Entidades principales

- Usuario
- Rol o perfil
- Área
- Centro de costos
- Presupuesto
- Gasto
- Factura / CFDI
- Catálogo
- Aprobación
- Bitácora de auditoría
- Notificación

### Relaciones clave

- Un usuario pertenece a un área
- Un usuario tiene un rol
- Un área posee múltiples centros de costos
- Un área tiene presupuestos mensuales
- Un gasto pertenece a un usuario
- Un gasto pertenece a un área
- Un gasto pertenece a un centro de costos
- Un gasto puede tener un CFDI asociado
- Un gasto puede tener múltiples registros de aprobación
- Un gasto genera registros de auditoría
- Un rol define permisos operativos
- Los catálogos clasifican los gastos

---

## 9. Consideraciones técnicas y de seguridad

- Implementación de RBAC para control granular de permisos
- Validación obligatoria en backend
- Hash seguro de contraseñas
- Protección CSRF
- Protección XSS
- Prevención de SQL Injection mediante consultas parametrizadas
- Manejo seguro de archivos XML
- Restricción de tipos de archivo permitidos
- Validación estructural del XML
- Control de acceso por sesión autenticada
- Bitácora de auditoría inmutable
- Retención histórica mínima de 5 años
- Respaldos periódicos automáticos
- Restricción de acceso a archivos almacenados
- Políticas de contraseñas seguras
- Manejo centralizado de errores
- Separación de privilegios administrativos

---

## 10. Lineamientos de calidad y mantenibilidad

- Separación clara por capas
- Servicios de negocio centralizados
- Bajo acoplamiento entre módulos
- Uso mínimo de librerías externas
- Convenciones de nomenclatura homogéneas
- Validaciones reutilizables
- Configuración desacoplada del código
- Estructura modular mantenible
- Componentización controlada en frontend
- Manejo centralizado de configuración
- Preparación para crecimiento controlado
- Código orientado a mantenibilidad operativa
- Reutilización de lógica de negocio
- Estandarización de respuestas API

---

## 11. Conclusión

El Sistema de Gestión de Gastos Empresariales propone una arquitectura sólida y mantenible orientada al control operativo y financiero interno de la organización.

La solución permitirá establecer trazabilidad completa sobre el ciclo del gasto, fortaleciendo los procesos de autorización, seguimiento presupuestal y control documental mediante CFDI.

El enfoque arquitectónico basado en PERN y API REST facilita mantenibilidad, escalabilidad controlada e independencia tecnológica dentro de un entorno on-premise.

La separación modular, el control de accesos y las medidas de seguridad planteadas permiten construir una plataforma estable, auditable y alineada con las necesidades operativas de gestión de gastos empresariales.

---

# Diccionario de Datos

## Sistema de Gestión de Gastos Empresariales

---

# 1. Convenciones y Consideraciones

## Motor de Base de Datos

La solución utilizará:

* MySQL 8.x o MariaDB 10.x
* Motor InnoDB
* Soporte transaccional ACID
* Integridad referencial mediante llaves foráneas

---

## Convenciones de Nombres

### Tablas

* Nombre en plural
* Snake_case
* Ejemplo:

  * usuarios
  * gastos
  * centros_costos

### Columnas

* Snake_case
* Nombres descriptivos
* Sin abreviaturas ambiguas

### Llaves primarias

* Formato:

  * id
* Tipo:

  * BIGINT UNSIGNED

### Llaves foráneas

* Formato:

  * id_nombre_tabla
* Ejemplo:

  * id_usuario
  * id_area

---

## Tipos de Datos Estándar

| Uso               | Tipo recomendado |
| ----------------- | ---------------- |
| Identificadores   | BIGINT UNSIGNED  |
| Textos cortos     | VARCHAR          |
| Descripciones     | TEXT             |
| Fechas            | DATE             |
| Fecha y hora      | DATETIME         |
| Montos monetarios | DECIMAL(14,2)    |
| Estatus           | VARCHAR(30)      |
| Booleanos         | TINYINT(1)       |

---

## Manejo de PK y FK

### PK

* Todas las tablas tendrán PK numérica autoincremental
* PK simple
* Evitar PK compuestas

### FK

* Todas las relaciones principales utilizarán FK explícitas
* Restricción referencial obligatoria
* Eliminación restringida para datos operativos

---

## Soft Delete

Las tablas operativas utilizarán:

* deleted_at
* deleted_by

Esto permitirá:

* Trazabilidad
* Recuperación lógica
* Conservación histórica

---

## Auditoría

Las tablas operativas incluirán:

* created_at
* created_by
* updated_at
* updated_by

Las operaciones críticas additionally generarán registros en bitácora_auditoria.

---

## 🔐 Manejo de Datos Sensibles

Datos sensibles que deberán manejarse con protección:

* Contraseñas
* RFC
* Rutas documentales
* Correos corporativos

Lineamientos:

* Contraseñas con hash seguro
* No almacenar contraseñas en texto plano
* Validación de acceso por roles
* Restricción de visualización según permisos
* Acceso controlado a documentos XML

---

# 2. Organización y Seguridad

---

# Tabla: roles

## 1. Descripción general

Representa los perfiles operativos del sistema.

Permite controlar permisos y responsabilidades funcionales.

---

## 2. Relaciones

* Se relaciona con usuarios

---

## 3. Llaves e índices

### PK

* id

### Índices

* ux_roles_nombre

---

## 4. Tabla de columnas

| Nombre      | Tipo         | Descripción           | Atributos |
| ----------- | ------------ | --------------------- | --------- |
| id          | BIGINT       | Identificador único   | PK        |
| nombre      | VARCHAR(100) | Nombre del rol        | UNIQUE    |
| descripcion | VARCHAR(255) | Descripción operativa | NULL      |
| activo      | TINYINT(1)   | Estatus activo        | DEFAULT 1 |
| created_at  | DATETIME     | Fecha creación        | NOT NULL  |
| updated_at  | DATETIME     | Fecha actualización   | NULL      |

---

# Tabla: areas

## 1. Descripción general

Representa las áreas organizacionales de la empresa.

Sirve para clasificación operativa y flujo de autorización.

---

## 2. Relaciones

* Se relaciona con usuarios
* Se relaciona con centros_costos
* Se relaciona con presupuestos
* Se relaciona con gastos

---

## 3. Llaves e índices

### PK

* id

### Índices

* ux_areas_nombre

---

## 4. Tabla de columnas

| Nombre      | Tipo         | Descripción         | Atributos |
| ----------- | ------------ | ------------------- | --------- |
| id          | BIGINT       | Identificador único | PK        |
| nombre      | VARCHAR(150) | Nombre del área     | UNIQUE    |
| descripcion | VARCHAR(255) | Descripción         | NULL      |
| activo      | TINYINT(1)   | Estatus             | DEFAULT 1 |
| created_at  | DATETIME     | Fecha creación      | NOT NULL  |
| updated_at  | DATETIME     | Fecha actualización | NULL      |

---

# Tabla: centros_costos

## 1. Descripción general

Representa los centros de costos asociados a un área.

Permite segmentar y controlar gastos.

---

## 2. Relaciones

* Se relaciona con areas
* Se relaciona con gastos
* Se relaciona con presupuestos

---

## 3. Llaves e índices

### PK

* id

### FK

* id_area

### Índices

* idx_centros_costos_area
* ux_centros_costos_clave

---

## 4. Tabla de columnas

| Nombre      | Tipo         | Descripción         | Atributos |
| ----------- | ------------ | ------------------- | --------- |
| id          | BIGINT       | Identificador       | PK        |
| id_area     | BIGINT       | Área asociada       | FK        |
| clave       | VARCHAR(50)  | Clave interna       | UNIQUE    |
| nombre      | VARCHAR(150) | Nombre centro costo | NOT NULL  |
| descripcion | VARCHAR(255) | Descripción         | NULL      |
| activo      | TINYINT(1)   | Estatus             | DEFAULT 1 |
| created_at  | DATETIME     | Fecha creación      | NOT NULL  |
| updated_at  | DATETIME     | Fecha actualización | NULL      |

---

# Tabla: usuarios

## 1. Descripción general

Representa los usuarios autenticados del sistema.

---

## 2. Relaciones

* Se relaciona con roles
* Se relaciona con areas
* Se relaciona con gastos

---

## 3. Llaves e índices

### PK

* id

### FK

* id_rol
* id_area

### Índices

* ux_usuarios_correo
* idx_usuarios_area

---

## 4. Tabla de columnas

| Nombre        | Tipo         | Descripción         | Atributos |
| ------------- | ------------ | ------------------- | --------- |
| id            | BIGINT       | Identificador       | PK        |
| id_rol        | BIGINT       | Rol asignado        | FK        |
| id_area       | BIGINT       | Área asignada       | FK        |
| nombre        | VARCHAR(150) | Nombre completo     | NOT NULL  |
| correo        | VARCHAR(150) | Correo corporativo  | UNIQUE    |
| password_hash | VARCHAR(255) | Contraseña cifrada  | NOT NULL  |
| activo        | TINYINT(1)   | Estatus             | DEFAULT 1 |
| ultimo_acceso | DATETIME     | Último acceso       | NULL      |
| created_at    | DATETIME     | Fecha creación      | NOT NULL  |
| updated_at    | DATETIME     | Fecha actualización | NULL      |

---

# Tabla: categorias

## 1. Descripción general

Clasifica los tipos de gastos registrados.

---

## 2. Relaciones

* Se relaciona con gastos_detalle

---

## 3. Llaves e índices

### PK

* id

### Índices

* ux_categorias_nombre

---

## 4. Tabla de columnas

| Nombre      | Tipo         | Descripción   | Atributos |
| ----------- | ------------ | ------------- | --------- |
| id          | BIGINT       | Identificador | PK        |
| nombre      | VARCHAR(150) | Categoría     | UNIQUE    |
| descripcion | VARCHAR(255) | Descripción   | NULL      |
| activo      | TINYINT(1)   | Estatus       | DEFAULT 1 |

---

# Tabla: proveedores

## 1. Descripción general

Representa proveedores relacionados con CFDI y gastos.

---

## 2. Relaciones

* Se relaciona con facturas_cfdi

---

## 3. Llaves e índices

### PK

* id

### Índices

* ux_proveedores_rfc

---

## 4. Tabla de columnas

| Nombre       | Tipo         | Descripción   | Atributos |
| ------------ | ------------ | ------------- | --------- |
| id           | BIGINT       | Identificador | PK        |
| rfc          | VARCHAR(20)  | RFC proveedor | UNIQUE    |
| razon_social | VARCHAR(255) | Razón social  | NOT NULL  |
| correo       | VARCHAR(150) | Correo        | NULL      |
| telefono     | VARCHAR(50)  | Teléfono      | NULL      |
| activo       | TINYINT(1)   | Estatus       | DEFAULT 1 |

---

# Tabla: conceptos_deducibilidad

## 1. Descripción general

Catálogo de conceptos fiscales de deducibilidad.

---

## 2. Relaciones

* Se relaciona con gastos_detalle

---

## 3. Llaves e índices

### PK

* id

### Índices

* ux_conceptos_deducibilidad_nombre

---

## 4. Tabla de columnas

| Nombre      | Tipo         | Descripción        | Atributos |
| ----------- | ------------ | ------------------ | --------- |
| id          | BIGINT       | Identificador      | PK        |
| nombre      | VARCHAR(150) | Concepto deducible | UNIQUE    |
| descripcion | VARCHAR(255) | Descripción        | NULL      |
| deducible   | TINYINT(1)   | Indicador fiscal   | DEFAULT 1 |
| activo      | TINYINT(1)   | Estatus            | DEFAULT 1 |

---

# Tabla: estatus_gastos

## 1. Descripción general

Catálogo de estados operativos del gasto.

---

## 2. Relaciones

* Se relaciona con gastos

---

## 3. Llaves e índices

### PK

* id

### Índices

* ux_estatus_gastos_nombre

---

## 4. Tabla de columnas

| Nombre      | Tipo         | Descripción      | Atributos |
| ----------- | ------------ | ---------------- | --------- |
| id          | BIGINT       | Identificador    | PK        |
| nombre      | VARCHAR(50)  | Estado del gasto | UNIQUE    |
| descripcion | VARCHAR(255) | Descripción      | NULL      |

---

# Tabla: presupuestos

## 1. Descripción general

Representa presupuestos mensuales por área y centro de costos.

---

## 2. Relaciones

* Se relaciona con areas
* Se relaciona con centros_costos

---

## 3. Llaves e índices

### PK

* id

### FK

* id_area
* id_centro_costo

### Índices

* idx_presupuestos_area
* idx_presupuestos_periodo

---

## 4. Tabla de columnas

| Nombre              | Tipo          | Descripción         | Atributos |
| ------------------- | ------------- | ------------------- | --------- |
| id                  | BIGINT        | Identificador       | PK        |
| id_area             | BIGINT        | Área                | FK        |
| id_centro_costo     | BIGINT        | Centro costo        | FK        |
| anio                | SMALLINT      | Año presupuesto     | NOT NULL  |
| mes                 | TINYINT       | Mes presupuesto     | NOT NULL  |
| monto_presupuestado | DECIMAL(14,2) | Monto autorizado    | NOT NULL  |
| monto_ejercido      | DECIMAL(14,2) | Gasto acumulado     | DEFAULT 0 |
| created_at          | DATETIME      | Fecha creación      | NOT NULL  |
| updated_at          | DATETIME      | Fecha actualización | NULL      |

---

# Tabla: gastos

## 1. Descripción general

Cabecera principal del gasto empresarial.

Contiene información operativa y de control.

---

## 2. Relaciones

* Se relaciona con usuarios
* Se relaciona con areas
* Se relaciona con centros_costos
* Se relaciona con estatus_gastos
* Se relaciona con facturas_cfdi
* Se relaciona con gastos_detalle
* Se relaciona con documentos_relacionados

---

## 3. Llaves e índices

### PK

* id

### FK

* id_usuario
* id_area
* id_centro_costo
* id_estatus

### Índices

* idx_gastos_usuario
* idx_gastos_area
* idx_gastos_estatus
* idx_gastos_fecha

---

## 4. Tabla de columnas

| Nombre                 | Tipo          | Descripción         | Atributos |
| ---------------------- | ------------- | ------------------- | --------- |
| id                     | BIGINT        | Identificador       | PK        |
| folio                  | VARCHAR(50)   | Folio interno       | UNIQUE    |
| id_usuario             | BIGINT        | Usuario capturista  | FK        |
| id_area                | BIGINT        | Área                | FK        |
| id_centro_costo        | BIGINT        | Centro costo        | FK        |
| id_estatus             | BIGINT        | Estado gasto        | FK        |
| fecha_gasto            | DATE          | Fecha gasto         | NOT NULL  |
| concepto_general       | VARCHAR(255)  | Concepto general    | NOT NULL  |
| justificacion          | TEXT          | Justificación       | NULL      |
| subtotal               | DECIMAL(14,2) | Subtotal gasto      | NOT NULL  |
| iva                    | DECIMAL(14,2) | IVA                 | NOT NULL  |
| total                  | DECIMAL(14,2) | Total gasto         | NOT NULL  |
| fecha_envio_aprobacion | DATETIME      | Fecha envío         | NULL      |
| fecha_aprobacion       | DATETIME      | Fecha aprobación    | NULL      |
| observaciones_rechazo  | TEXT          | Motivo rechazo      | NULL      |
| created_at             | DATETIME      | Fecha creación      | NOT NULL  |
| updated_at             | DATETIME      | Fecha actualización | NULL      |
| deleted_at             | DATETIME      | Baja lógica         | NULL      |

---

# Tabla: gastos_detalle

## 1. Descripción general

Representa partidas o conceptos individuales del gasto.

Permite mantener trazabilidad simple sin sobreingeniería.

---

## 2. Relaciones

* Se relaciona con gastos
* Se relaciona con categorias
* Se relaciona con conceptos_deducibilidad

---

## 3. Llaves e índices

### PK

* id

### FK

* id_gasto
* id_categoria
* id_concepto_deducibilidad

### Índices

* idx_gastos_detalle_gasto

---

## 4. Tabla de columnas

| Nombre                    | Tipo          | Descripción         | Atributos |
| ------------------------- | ------------- | ------------------- | --------- |
| id                        | BIGINT        | Identificador       | PK        |
| id_gasto                  | BIGINT        | Gasto asociado      | FK        |
| id_categoria              | BIGINT        | Categoría           | FK        |
| id_concepto_deducibilidad | BIGINT        | Deducibilidad       | FK        |
| descripcion               | VARCHAR(255)  | Descripción partida | NOT NULL  |
| cantidad                  | DECIMAL(12,2) | Cantidad            | DEFAULT 1 |
| precio_unitario           | DECIMAL(14,2) | Precio unitario     | NOT NULL  |
| subtotal                  | DECIMAL(14,2) | Subtotal línea      | NOT NULL  |
| iva                       | DECIMAL(14,2) | IVA línea           | NOT NULL  |
| total                     | DECIMAL(14,2) | Total línea         | NOT NULL  |

---

# Tabla: facturas_cfdi

## 1. Descripción general

Almacena información fiscal extraída del XML CFDI.

Relación simplificada 1:1 con gasto.

---

## 2. Relaciones

* Se relaciona con gastos
* Se relaciona con proveedores

---

## 3. Llaves e índices

### PK

* id

### FK

* id_gasto
* id_proveedor

### Índices

* ux_facturas_cfdi_uuid
* ux_facturas_cfdi_gasto

---

## 4. Tabla de columnas

| Nombre             | Tipo          | Descripción             | Atributos |
| ------------------ | ------------- | ----------------------- | --------- |
| id                 | BIGINT        | Identificador           | PK        |
| id_gasto           | BIGINT        | Gasto asociado          | FK UNIQUE |
| id_proveedor       | BIGINT        | Proveedor               | FK        |
| uuid               | VARCHAR(100)  | UUID CFDI               | UNIQUE    |
| serie              | VARCHAR(30)   | Serie CFDI              | NULL      |
| folio              | VARCHAR(50)   | Folio CFDI              | NULL      |
| rfc_emisor         | VARCHAR(20)   | RFC emisor              | NOT NULL  |
| rfc_receptor       | VARCHAR(20)   | RFC receptor            | NOT NULL  |
| fecha_emision      | DATETIME      | Fecha emisión           | NOT NULL  |
| metodo_pago        | VARCHAR(20)   | Método pago             | NULL      |
| subtotal           | DECIMAL(14,2) | Subtotal CFDI           | NOT NULL  |
| iva                | DECIMAL(14,2) | IVA CFDI                | NOT NULL  |
| total              | DECIMAL(14,2) | Total CFDI              | NOT NULL  |
| ruta_xml           | VARCHAR(500)  | Ruta almacenamiento XML | NOT NULL  |
| nombre_archivo_xml | VARCHAR(255)  | Nombre archivo          | NOT NULL  |
| created_at         | DATETIME      | Fecha creación          | NOT NULL  |

---

# Tabla: documentos_relacionados

## 1. Descripción general

Permite almacenar documentos adicionales asociados al gasto.

---

## 2. Relaciones

* Se relaciona con gastos

---

## 3. Llaves e índices

### PK

* id

### FK

* id_gasto

### Índices

* idx_documentos_gasto

---

## 4. Tabla de columnas

| Nombre         | Tipo         | Descripción    | Atributos |
| -------------- | ------------ | -------------- | --------- |
| id             | BIGINT       | Identificador  | PK        |
| id_gasto       | BIGINT       | Gasto asociado | FK        |
| tipo_documento | VARCHAR(50)  | Tipo documento | NOT NULL  |
| nombre_archivo | VARCHAR(255) | Nombre archivo | NOT NULL  |
| ruta_archivo   | VARCHAR(500) | Ruta física    | NOT NULL  |
| observaciones  | VARCHAR(255) | Observaciones  | NULL      |
| created_at     | DATETIME     | Fecha creación | NOT NULL  |

---

# Tabla: bitacora_auditoria

## 1. Descripción general

Registra eventos críticos del sistema para trazabilidad operativa.

---

## 2. Relaciones

* Se relaciona con usuarios

---

## 3. Llaves e índices

### PK

* id

### FK

* id_usuario

### Índices

* idx_bitacora_usuario
* idx_bitacora_fecha

---

## 4. Tabla de columnas

| Nombre        | Tipo         | Descripción          | Atributos |
| ------------- | ------------ | -------------------- | --------- |
| id            | BIGINT       | Identificador        | PK        |
| id_usuario    | BIGINT       | Usuario acción       | FK        |
| modulo        | VARCHAR(100) | Módulo afectado      | NOT NULL  |
| accion        | VARCHAR(100) | Acción ejecutada     | NOT NULL  |
| referencia_id | BIGINT       | Registro relacionado | NULL      |
| descripcion   | TEXT         | Descripción evento   | NULL      |
| ip_origen     | VARCHAR(100) | IP origen            | NULL      |
| created_at    | DATETIME     | Fecha evento         | NOT NULL  |

---

# 6. Reglas de Integridad y Validaciones

## Reglas de Gastos

* Todo gasto debe pertenecer a:

  * un área
  * un centro de costos
  * un usuario

* Todo gasto debe tener:

  * un estatus válido
  * al menos una línea de detalle

* El total del gasto debe calcularse desde gastos_detalle

* El subtotal, IVA y total del CFDI deben coincidir con el gasto

---

## Reglas CFDI

* Un gasto solo puede tener un CFDI asociado
* UUID no puede repetirse
* El XML debe existir físicamente
* Debe existir proveedor relacionado

---

## Reglas Presupuestales

* No permitir gastos fuera de periodo presupuestal
* Validar presupuesto disponible antes de aprobación
* Actualizar monto ejercido tras aprobación

---

## Reglas de Flujo

* Solo el jefe del área puede aprobar
* Solo gastos pendientes pueden aprobarse
* Gastos rechazados regresan a borrador

---

## Reglas de Seguridad

* Usuario solo captura gastos de su área
* Usuarios inactivos no pueden autenticarse
* Eliminaciones físicas restringidas

---

# 7. Índices Recomendados

## Índices por FK

Implementar índices sobre:

* id_usuario
* id_area
* id_centro_costo
* id_estatus
* id_gasto

---

## Índices de búsqueda frecuente

### gastos

* fecha_gasto
* id_estatus
* id_area

### facturas_cfdi

* uuid
* rfc_emisor
* fecha_emision

### usuarios

* correo

### presupuestos

* anio
* mes
* id_area

---

## Índices compuestos recomendados

### gastos

* (id_area, id_estatus)
* (id_usuario, fecha_gasto)

### presupuestos

* (anio, mes, id_area)

---

## Consideraciones

* Evitar índices sobre columnas de baja consulta
* Evitar índices redundantes
* Priorizar rendimiento de escritura y mantenibilidad
* Mantener el modelo simple y entendible

---

# Principio Rector del Modelo

“Tan simple como sea posible, pero suficientemente estructurado para crecer.”

---

# Arbol de directorios de backend

```
empresa-gastos/                                 ← carpeta raíz principal del sistema bajo dominio/subdominio
├── .gitignore                                  ← exclusión de archivos sensibles y temporales
├── README.md                                   ← documentación general del repositorio
├── LICENSE                                     ← licencia interna o corporativa
├── .editorconfig                               ← reglas de formato compartidas
├── .gitattributes                              ← configuración adicional de Git
├── docker-compose.yml                          ← orquestación local opcional de servicios
├── package.json                                ← dependencias y scripts globales del repositorio
├── package-lock.json                           ← lock de versiones npm
├── docs/                                       ← documentación técnica general del sistema
│   ├── arquitectura/                           ← diagramas y decisiones arquitectónicas
│   ├── negocio/                                ← documentación funcional y reglas negocio
│   ├── api/                                    ← documentación de integración backend/frontend
│   └── infraestructura/                        ← documentación despliegue y servidores
│
├── api/                                        ← backend REST principal del sistema
│   ├── .env                                    ← variables sensibles del entorno
│   ├── .env.example                            ← plantilla de variables entorno
│   ├── .gitignore                              ← exclusiones específicas backend
│   ├── package.json                            ← dependencias backend
│   ├── package-lock.json                       ← lock dependencias backend
│   ├── nodemon.json                            ← configuración entorno desarrollo
│   ├── tsconfig.json                           ← configuración TypeScript (si aplica)
│   ├── jsconfig.json                           ← configuración JavaScript avanzada
│   ├── swagger.config.js                       ← configuración Swagger/OpenAPI
│   ├── ecosystem.config.js                     ← configuración PM2 despliegue
│   ├── jest.config.js                          ← configuración pruebas automatizadas
│   │
│   ├── public/                                 ← entrypoint público del backend
│   │   ├── index.js                            ← punto entrada principal API
│   │   └── healthcheck.php                     ← validación simple disponibilidad servidor
│   │
│   ├── bootstrap/                              ← inicialización y arranque aplicación
│   │   ├── app.js                              ← inicialización aplicación Express
│   │   ├── server.js                           ← configuración servidor HTTP
│   │   ├── routes.js                           ← carga centralizada de rutas
│   │   ├── middlewares.js                      ← registro global middlewares
│   │   ├── database.js                         ← inicialización conexión BD
│   │   ├── swagger.js                          ← inicialización documentación API
│   │   └── scheduler.js                        ← inicialización tareas programadas
│   │
│   ├── core/                                   ← núcleo reutilizable de la aplicación
│   │   ├── base/                               ← clases base reutilizables
│   │   │   ├── BaseController.js               ← controlador base
│   │   │   ├── BaseService.js                  ← servicio base
│   │   │   ├── BaseRepository.js               ← repositorio base
│   │   │   ├── BaseValidator.js                ← validaciones base
│   │   │   └── BaseResponse.js                 ← respuestas estándar API
│   │   │
│   │   ├── constants/                          ← constantes globales sistema
│   │   ├── enums/                              ← enumeraciones centralizadas
│   │   ├── exceptions/                         ← manejo centralizado excepciones
│   │   ├── security/                           ← componentes seguridad reutilizables
│   │   ├── logger/                             ← configuración logs centralizados
│   │   └── config/                             ← configuración interna aplicación
│   │
│   ├── routes/                                 ← definición centralizada rutas API
│   │   ├── index.js                            ← agregador principal rutas
│   │   ├── auth.routes.js                      ← rutas autenticación
│   │   ├── users.routes.js                     ← rutas usuarios
│   │   ├── roles.routes.js                     ← rutas roles
│   │   ├── areas.routes.js                     ← rutas áreas
│   │   ├── cost-centers.routes.js              ← rutas centros costo
│   │   ├── budgets.routes.js                   ← rutas presupuestos
│   │   ├── expenses.routes.js                  ← rutas gastos
│   │   ├── approvals.routes.js                 ← rutas flujo aprobación
│   │   ├── documents.routes.js                 ← rutas documentos CFDI
│   │   ├── catalogs.routes.js                  ← rutas catálogos
│   │   ├── reports.routes.js                   ← rutas reportes
│   │   └── audit.routes.js                     ← rutas auditoría
│   │
│   ├── middlewares/                            ← middlewares HTTP y seguridad
│   │   ├── auth.middleware.js                  ← validación autenticación
│   │   ├── role.middleware.js                  ← validación permisos RBAC
│   │   ├── validation.middleware.js            ← validaciones request
│   │   ├── error.middleware.js                 ← manejo errores API
│   │   ├── audit.middleware.js                 ← auditoría automática requests
│   │   ├── rate-limit.middleware.js            ← limitador solicitudes
│   │   ├── upload.middleware.js                ← manejo carga archivos
│   │   ├── csrf.middleware.js                  ← protección CSRF
│   │   ├── security-headers.middleware.js      ← headers seguridad
│   │   └── xml-validation.middleware.js        ← validación XML CFDI
│   │
│   ├── modules/                                ← módulos organizados por feature
│   │   ├── auth/                               ← módulo autenticación y sesión
│   │   │   ├── controllers/                    ← controladores módulo auth
│   │   │   ├── services/                       ← lógica negocio auth
│   │   │   ├── repositories/                   ← acceso datos auth
│   │   │   ├── validators/                     ← validaciones auth
│   │   │   ├── dtos/                           ← contratos entrada/salida
│   │   │   ├── policies/                       ← reglas acceso módulo
│   │   │   ├── docs/                           ← documentación Swagger módulo
│   │   │   └── tests/                          ← pruebas módulo auth
│   │   │
│   │   ├── users/                              ← módulo usuarios
│   │   ├── roles/                              ← módulo roles
│   │   ├── areas/                              ← módulo áreas
│   │   ├── cost-centers/                       ← módulo centros costo
│   │   ├── budgets/                            ← módulo presupuestos
│   │   ├── catalogs/                           ← módulo catálogos operativos
│   │   ├── providers/                          ← módulo proveedores
│   │   ├── expenses/                           ← módulo gastos cabecera
│   │   ├── expense-items/                      ← módulo líneas gasto
│   │   ├── documents/                          ← módulo documentos y CFDI
│   │   ├── approvals/                          ← módulo flujo aprobación
│   │   ├── reports/                            ← módulo reportes
│   │   ├── audit/                              ← módulo auditoría
│   │   └── notifications/                      ← módulo notificaciones internas
│   │
│   ├── contracts/                              ← contrato API consumido frontend
│   │   ├── openapi/                            ← especificación OpenAPI
│   │   │   ├── openapi.yaml                    ← contrato principal API
│   │   │   ├── schemas/                        ← esquemas entidades API
│   │   │   ├── requests/                       ← contratos request
│   │   │   ├── responses/                      ← contratos response
│   │   │   ├── examples/                       ← ejemplos payloads
│   │   │   └── security/                       ← definición seguridad API
│   │   │
│   │   └── postman/                            ← colecciones Postman integración
│   │
│   ├── database/                               ← capa persistencia y configuración BD
│   │   ├── connection/                         ← conexión base datos
│   │   ├── migrations/                         ← migraciones estructura BD
│   │   ├── seeders/                            ← datos iniciales sistema
│   │   ├── factories/                          ← generación datos prueba
│   │   ├── views/                              ← vistas SQL controladas
│   │   └── backups/                            ← scripts y respaldos locales
│   │
│   ├── storage/                                ← almacenamiento archivos sistema
│   │   ├── temp/                               ← archivos temporales
│   │   ├── uploads/                            ← carga archivos usuarios
│   │   │   ├── xml/                            ← almacenamiento CFDI XML
│   │   │   ├── documents/                      ← documentos adicionales
│   │   │   └── reports/                        ← exportaciones reportes
│   │   │
│   │   ├── logs/                               ← logs aplicación
│   │   └── cache/                              ← archivos cache temporales
│   │
│   ├── utils/                                  ← utilitarios reutilizables
│   │   ├── xml/                                ← utilitarios procesamiento CFDI
│   │   ├── dates/                              ← helpers fechas
│   │   ├── currency/                           ← helpers monetarios
│   │   ├── files/                              ← utilitarios archivos
│   │   ├── pagination/                         ← utilitarios paginación
│   │   ├── responses/                          ← helpers respuestas API
│   │   ├── validators/                         ← validadores reutilizables
│   │   └── encryption/                         ← utilitarios cifrado
│   │
│   ├── jobs/                                   ← tareas asíncronas programadas
│   │   ├── budget-validation.job.js            ← validación presupuestal automática
│   │   ├── cleanup-temp-files.job.js           ← limpieza temporales
│   │   ├── audit-retention.job.js              ← mantenimiento auditoría
│   │   └── report-generation.job.js            ← generación reportes pesados
│   │
│   ├── tests/                                  ← pruebas globales backend
│   │   ├── integration/                        ← pruebas integración API
│   │   ├── unit/                               ← pruebas unitarias
│   │   ├── e2e/                                ← pruebas end-to-end backend
│   │   ├── fixtures/                           ← datos controlados prueba
│   │   └── mocks/                              ← mocks reutilizables
│   │
│   ├── scripts/                                ← scripts operativos mantenimiento
│   │   ├── start-dev.sh                        ← arranque entorno desarrollo
│   │   ├── deploy.sh                           ← despliegue backend
│   │   ├── backup-db.sh                        ← respaldo base datos
│   │   └── restore-db.sh                       ← restauración respaldos
│   │
│   └── tmp/                                    ← archivos runtime temporales
│
└── web/                                        ← frontend independiente consumiendo API
    └── README.md                               ← placeholder frontend no detallado
```

---

# Arbol de directorios de frontend

```
empresa-gastos/                                 ← carpeta raíz principal del sistema bajo dominio/subdominio
├── .gitignore                                  ← exclusión archivos temporales y sensibles
├── README.md                                   ← documentación general del repositorio
├── LICENSE                                     ← licencia del proyecto
├── .editorconfig                               ← reglas de formato compartidas
├── .gitattributes                              ← configuración Git
├── package.json                                ← scripts y dependencias globales
├── package-lock.json                           ← control versiones dependencias
├── docs/                                       ← documentación técnica general
│   ├── frontend/                               ← documentación específica frontend
│   ├── backend/                                ← documentación backend no detallada
│   ├── arquitectura/                           ← diagramas y definiciones arquitectura
│   └── negocio/                                ← documentación funcional
│
├── api/                                        ← backend independiente consumido vía API
│   └── README.md                               ← placeholder backend no detallado
│
└── web/                                        ← frontend React principal del sistema
    ├── .env                                    ← variables entorno frontend
    ├── .env.example                            ← plantilla configuración entorno
    ├── .gitignore                              ← exclusiones frontend
    ├── package.json                            ← dependencias frontend
    ├── package-lock.json                       ← lock dependencias frontend
    ├── vite.config.js                          ← configuración Vite
    ├── tailwind.config.js                      ← configuración Tailwind CSS
    ├── postcss.config.js                       ← configuración PostCSS
    ├── jsconfig.json                           ← aliases y configuración JS
    ├── eslint.config.js                        ← reglas linting frontend
    ├── index.html                              ← entrypoint HTML principal
    │
    ├── public/                                 ← archivos públicos estáticos
    │   ├── favicon.ico                         ← icono aplicación
    │   ├── logo.svg                            ← logotipo sistema
    │   ├── manifest.json                       ← configuración aplicación web
    │   └── images/                             ← imágenes públicas globales
    │
    ├── src/                                    ← código fuente principal frontend
    │   ├── main.jsx                            ← punto entrada React
    │   ├── App.jsx                             ← componente raíz aplicación
    │   │
    │   ├── assets/                             ← recursos estáticos internos
    │   │   ├── images/                         ← imágenes internas
    │   │   ├── icons/                          ← iconografía sistema
    │   │   ├── fonts/                          ← tipografías locales
    │   │   └── illustrations/                  ← ilustraciones UI
    │   │
    │   ├── styles/                             ← estilos y presentación visual
    │   │   ├── globals.css                     ← estilos globales
    │   │   ├── tailwind.css                    ← importación Tailwind
    │   │   ├── variables.css                   ← variables visuales
    │   │   ├── animations.css                  ← animaciones reutilizables
    │   │   ├── layouts.css                     ← estilos layout generales
    │   │   └── themes/                         ← variantes visuales o temas
    │   │
    │   ├── config/                             ← configuraciones centralizadas
    │   │   ├── env.js                          ← lectura variables entorno
    │   │   ├── api.config.js                   ← configuración API Axios
    │   │   ├── routes.config.js                ← constantes rutas frontend
    │   │   ├── table.config.js                 ← configuración TanStack Table
    │   │   ├── auth.config.js                  ← configuración autenticación
    │   │   └── storage.config.js               ← configuración local/session storage
    │   │
    │   ├── router/                             ← configuración navegación React Router
    │   │   ├── index.jsx                       ← router principal
    │   │   ├── private.routes.jsx              ← rutas privadas autenticadas
    │   │   ├── public.routes.jsx               ← rutas públicas
    │   │   ├── role.routes.jsx                 ← control rutas por roles
    │   │   └── guards/                         ← validaciones navegación
    │   │
    │   ├── layouts/                            ← layouts generales aplicación
    │   │   ├── MainLayout.jsx                  ← layout principal autenticado
    │   │   ├── AuthLayout.jsx                  ← layout login/autenticación
    │   │   ├── DashboardLayout.jsx             ← layout dashboard
    │   │   ├── ReportLayout.jsx                ← layout reportes
    │   │   └── components/                     ← componentes internos layouts
    │   │
    │   ├── context/                            ← contextos globales React
    │   │   ├── AuthContext.jsx                 ← sesión y autenticación
    │   │   ├── UserContext.jsx                 ← información usuario
    │   │   ├── NotificationContext.jsx         ← notificaciones globales
    │   │   ├── ThemeContext.jsx                ← configuración visual
    │   │   └── LoadingContext.jsx              ← control loaders globales
    │   │
    │   ├── hooks/                              ← hooks personalizados reutilizables
    │   │   ├── useAuth.js                      ← lógica autenticación
    │   │   ├── useAxios.js                     ← instancia Axios reutilizable
    │   │   ├── usePermissions.js               ← validación permisos
    │   │   ├── usePagination.js                ← lógica paginación
    │   │   ├── useModal.js                     ← manejo modales
    │   │   ├── useNotifications.js             ← manejo notificaciones
    │   │   └── useDebounce.js                  ← optimización búsquedas
    │   │
    │   ├── services/                           ← consumo API mediante Axios
    │   │   ├── apiClient.js                    ← instancia central Axios
    │   │   ├── auth.service.js                 ← servicios autenticación
    │   │   ├── users.service.js                ← servicios usuarios
    │   │   ├── roles.service.js                ← servicios roles
    │   │   ├── areas.service.js                ← servicios áreas
    │   │   ├── costCenters.service.js          ← servicios centros costo
    │   │   ├── budgets.service.js              ← servicios presupuestos
    │   │   ├── expenses.service.js             ← servicios gastos
    │   │   ├── expenseItems.service.js         ← servicios líneas gasto
    │   │   ├── approvals.service.js            ← servicios aprobación
    │   │   ├── documents.service.js            ← servicios CFDI/documentos
    │   │   ├── catalogs.service.js             ← servicios catálogos
    │   │   ├── reports.service.js              ← servicios reportes
    │   │   ├── audit.service.js                ← servicios auditoría
    │   │   └── interceptors/                   ← interceptores Axios
    │   │       ├── auth.interceptor.js         ← manejo tokens/sesión
    │   │       ├── error.interceptor.js        ← manejo errores HTTP
    │   │       └── response.interceptor.js     ← normalización respuestas
    │   │
    │   ├── interfaces/                         ← contratos de datos frontend
    │   │   ├── auth.interface.js               ← contratos autenticación
    │   │   ├── user.interface.js               ← contratos usuarios
    │   │   ├── expense.interface.js            ← contratos gastos
    │   │   ├── budget.interface.js             ← contratos presupuestos
    │   │   ├── report.interface.js             ← contratos reportes
    │   │   └── api-response.interface.js       ← contratos respuestas API
    │   │
    │   ├── types/                              ← tipos reutilizables frontend
    │   │   ├── auth.types.js                   ← tipos autenticación
    │   │   ├── expense.types.js                ← tipos gastos
    │   │   ├── table.types.js                  ← tipos tablas
    │   │   ├── status.types.js                 ← tipos estados
    │   │   └── common.types.js                 ← tipos comunes
    │   │
    │   ├── helpers/                            ← utilitarios y helpers
    │   │   ├── currency.helper.js              ← formatos monetarios
    │   │   ├── date.helper.js                  ← formatos fechas
    │   │   ├── storage.helper.js               ← manejo storage navegador
    │   │   ├── validation.helper.js            ← validaciones frontend
    │   │   ├── permissions.helper.js           ← validación permisos UI
    │   │   ├── file.helper.js                  ← manejo archivos
    │   │   ├── xml.helper.js                   ← apoyo visual XML
    │   │   ├── export.helper.js                ← exportaciones reportes
    │   │   └── table.helper.js                 ← helpers TanStack Table
    │   │
    │   ├── constants/                          ← constantes reutilizables
    │   │   ├── roles.constants.js              ← roles sistema
    │   │   ├── status.constants.js             ← estados operativos
    │   │   ├── permissions.constants.js        ← permisos sistema
    │   │   ├── api.constants.js                ← constantes API
    │   │   └── app.constants.js                ← constantes generales
    │   │
    │   ├── components/                         ← componentes reutilizables UI
    │   │   ├── common/                         ← componentes genéricos
    │   │   │   ├── Button/                     ← botones reutilizables
    │   │   │   ├── Input/                      ← inputs reutilizables
    │   │   │   ├── Select/                     ← selects reutilizables
    │   │   │   ├── Modal/                      ← modales reutilizables
    │   │   │   ├── Loader/                     ← indicadores carga
    │   │   │   ├── Alert/                      ← alertas visuales
    │   │   │   ├── Badge/                      ← etiquetas estados
    │   │   │   ├── Tooltip/                    ← ayudas visuales
    │   │   │   └── Breadcrumb/                 ← navegación jerárquica
    │   │   │
    │   │   ├── forms/                          ← componentes formularios
    │   │   │   ├── ExpenseForm/                ← formulario gasto
    │   │   │   ├── LoginForm/                  ← formulario login
    │   │   │   ├── BudgetForm/                 ← formulario presupuesto
    │   │   │   └── UserForm/                   ← formulario usuario
    │   │   │
    │   │   ├── tables/                         ← tablas TanStack Table
    │   │   │   ├── ExpensesTable/              ← tabla gastos
    │   │   │   ├── UsersTable/                 ← tabla usuarios
    │   │   │   ├── ReportsTable/               ← tabla reportes
    │   │   │   ├── ApprovalsTable/             ← tabla aprobaciones
    │   │   │   └── shared/                     ← componentes compartidos tablas
    │   │   │
    │   │   ├── cards/                          ← tarjetas resumen visual
    │   │   ├── charts/                         ← componentes gráficas
    │   │   ├── navigation/                     ← navegación aplicación
    │   │   ├── dashboard/                      ← widgets dashboard
    │   │   ├── reports/                        ← componentes reportes
    │   │   ├── approvals/                      ← componentes flujo aprobación
    │   │   └── documents/                      ← componentes manejo documentos
    │   │
    │   ├── pages/                              ← pantallas completas aplicación
    │   │   ├── auth/                           ← pantallas autenticación
    │   │   │   ├── LoginPage.jsx               ← pantalla login
    │   │   │   ├── ForgotPasswordPage.jsx      ← recuperación acceso
    │   │   │   └── UnauthorizedPage.jsx        ← acceso denegado
    │   │   │
    │   │   ├── dashboard/                      ← dashboard principal
    │   │   │   └── DashboardPage.jsx           ← pantalla principal
    │   │   │
    │   │   ├── expenses/                       ← pantallas gastos
    │   │   │   ├── ExpensesPage.jsx            ← listado gastos
    │   │   │   ├── ExpenseCreatePage.jsx       ← captura gasto
    │   │   │   ├── ExpenseDetailPage.jsx       ← detalle gasto
    │   │   │   ├── ExpenseEditPage.jsx         ← edición gasto
    │   │   │   └── ExpenseApprovePage.jsx      ← aprobación gasto
    │   │   │
    │   │   ├── approvals/                      ← bandeja aprobaciones
    │   │   │   └── ApprovalsPage.jsx           ← listado aprobaciones
    │   │   │
    │   │   ├── reports/                        ← pantallas reportes
    │   │   │   ├── ReportsPage.jsx             ← listado reportes
    │   │   │   ├── ExpenseReportPage.jsx       ← reporte gastos
    │   │   │   └── BudgetReportPage.jsx        ← reporte presupuestos
    │   │   │
    │   │   ├── administration/                 ← administración sistema
    │   │   │   ├── UsersPage.jsx               ← administración usuarios
    │   │   │   ├── RolesPage.jsx               ← administración roles
    │   │   │   ├── AreasPage.jsx               ← administración áreas
    │   │   │   ├── BudgetsPage.jsx             ← administración presupuestos
    │   │   │   └── CostCentersPage.jsx         ← administración centros costo
    │   │   │
    │   │   ├── catalogs/                       ← administración catálogos
    │   │   │   ├── CategoriesPage.jsx          ← catálogo categorías
    │   │   │   ├── ProvidersPage.jsx           ← catálogo proveedores
    │   │   │   ├── ConceptsPage.jsx            ← conceptos deducibilidad
    │   │   │   └── StatusPage.jsx              ← estatus operativos
    │   │   │
    │   │   ├── audit/                          ← auditoría sistema
    │   │   │   └── AuditPage.jsx               ← consulta auditoría
    │   │   │
    │   │   └── errors/                         ← pantallas error
    │   │       ├── NotFoundPage.jsx            ← página 404
    │   │       └── ServerErrorPage.jsx         ← página error servidor
    │   │
    │   ├── store/                              ← estado global escalable
    │   │   ├── slices/                         ← estados segmentados
    │   │   ├── actions/                        ← acciones globales
    │   │   ├── reducers/                       ← reducers globales
    │   │   └── index.js                        ← configuración store
    │   │
    │   ├── validations/                        ← validaciones formularios
    │   │   ├── auth.validation.js              ← validaciones login
    │   │   ├── expense.validation.js           ← validaciones gastos
    │   │   ├── budget.validation.js            ← validaciones presupuestos
    │   │   └── user.validation.js              ← validaciones usuarios
    │   │
    │   └── tests/                              ← pruebas frontend
    │       ├── unit/                           ← pruebas unitarias
    │       ├── integration/                    ← pruebas integración
    │       ├── e2e/                            ← pruebas end-to-end
    │       ├── mocks/                          ← mocks frontend
    │       └── fixtures/                       ← datos prueba
    │
    └── dist/                                   ← build generado despliegue
```