# 1. Resumen ejecutivo del backlog

La base documental define un sistema on-premise, de una sola empresa, orientado a registro, validación, aprobación, consulta histórica, control presupuestal y auditoría de gastos; además, el flujo funcional incluye captura manual, carga de XML CFDI, extracción de datos fiscales, aprobación por área, reportes y notificaciones internas.

El criterio de priorización que uso aquí es de desbloqueo técnico y funcional: primero cierro la base de ejecución y la coherencia tecnológica, después la identidad y el control de acceso, luego la estructura organizacional y catálogos, después el núcleo del gasto, luego el flujo de aprobación y presupuesto, y al final reportes, auditoría, notificaciones y endurecimiento. Esto sigue el principio de construir slices pequeños, verificables y encadenados.

La estrategia incremental propuesta evita construir “módulos completos” y en su lugar descompone el producto en incrementos verticales: base técnica, auth/RBAC, maestros organizacionales, gasto borrador, detalle, CFDI, envío a aprobación, revisión, presupuesto, reportes y trazabilidad. Donde los documentos difieren, priorizo la fuente de diseño y dejo el conflicto explícito para decisión posterior.

# 2. Supuestos de trabajo

* Tomo como línea base funcional el documento de diseño; el Research Spike lo uso como soporte conceptual y fiscal, no como sustituto del alcance ya definido.
* Asumo una sola organización, on-premise, sin ERP, sin banca, sin SAT en línea, sin OCR y sin multiempresa.
* Asumo que en la primera versión solo existe una aprobación principal por jefe de área; la parametrización avanzada por jerarquía, topes e instancias superiores queda fuera del primer backlog salvo confirmación expresa.
* Asumo que el XML CFDI es obligatorio para el gasto deducible y que la validación será estructural y de consistencia interna, no validación SAT en línea.
* Asumo que los documentos adicionales al XML son opcionales y no bloquean el flujo base del gasto. 
* Asumo que “notificaciones internas” significa avisos dentro del sistema, no correo/SMS/push externos. 

# 3. Huecos, ambigüedades o contradicciones detectadas

## Funcionales

* El diseño base define aprobación “por área” y roles como capturista, jefe de área y cuentas por pagar, pero el Research Spike propone un flujo más flexible con jerarquía, topes de importe y condiciones de presupuesto. Para el backlog inicial, conviene usar solo la aprobación por área y dejar la parametrización avanzada como evolución posterior.

## Técnicos

* Hay una contradicción directa de motor de base de datos: el documento de arquitectura habla de PERN con PostgreSQL, mientras el diccionario de datos fija MySQL 8.x o MariaDB 10.x. Esto debe resolverse antes de generar migraciones o modelos definitivos.
* En el árbol de backend aparecen piezas muy ambiciosas desde el inicio, como jobs, OpenAPI, PM2, tests y múltiples middlewares, pero no hay una secuencia de construcción explícita. El backlog debe controlar esa amplitud y activar solo lo indispensable por fase.

## De datos

* El Research Spike insiste en catálogo de cuentas y mapeo al Código Agrupador del SAT, pero el diseño/diccionario entregados no definen una tabla, entidad o flujo formal para ese catálogo contable. No lo meteré como requisito base hasta que se confirme.
* El modelo conceptual menciona aprobaciones y notificaciones, pero en el diccionario visible no aparece una definición tabular específica para esas entidades en el mismo nivel que gastos, usuarios, presupuestos o CFDI.

## De flujo

* El flujo operativo contempla borrador → pendiente de aprobación → aprobado/rechazado y retorno a borrador para corrección, pero no define con precisión si el rechazo reinicia solo la cabecera o también el detalle y los documentos relacionados. Eso debe fijarse en el backlog de transición de estados.
* El presupuesto se define mensual por área y centro de costos, pero no queda cerrado si el control es preventivo, reactivo o mixto al momento de aprobar. El Research Spike sugiere bloqueo o permisos especiales ante sobrepresupuesto; el diseño solo asegura comparativos y alertas.

## De seguridad

* El diseño exige RBAC, CSRF, XSS, SQL injection prevention, hash seguro y restricción de XML, pero no fija el detalle operativo de recuperación de acceso, política de contraseña o caducidad de sesión.

## De operación

* Se exige retención mínima de 5 años y respaldos periódicos, pero no se definen aún ventana de respaldo, RPO/RTO, ni política de restauración.
* El stack de frontend/backend aparece muy desglosado en directorios, pero el documento no trae un plan de entrega por capas de UI; por eso el backlog deberá forzar slices funcionales y no “carpetas completas”.

# 4. Backlog inicial priorizado

| ID | Nombre corto del item | Tipo de item | Objetivo del item | Descripción funcional/técnica breve | Valor que aporta | Dependencias | Alcance incluido | Alcance excluido | Riesgos | Criterios de aceptación de alto nivel | Pruebas manuales sugeridas | Prioridad | Tamaño relativo | Fase sugerida | Orden sugerido dentro de la fase |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| BP-01 | Base técnica y persistencia | foundation | Cerrar la decisión técnica mínima para poder construir sin ambigüedad. | Resolver la contradicción PostgreSQL vs MySQL/MariaDB y dejar listo el esqueleto de ejecución, configuración y conexión base. | Evita rehacer la base del sistema. | Ninguna. | Decisión de motor BD; estructura base del repo; variables de entorno; conexión inicial; respuesta de salud. | Módulos de negocio; UI; reglas complejas. | Elegir tarde el motor de BD rompe migraciones y modelos. | La base corre; la BD seleccionada está documentada; existe healthcheck operativo. | Levantar entorno; verificar conexión; consultar healthcheck. | Crítica | M | F1 Base técnica | 1 |
| BP-02 | Auth, sesión y RBAC mínimo | seguridad | Controlar acceso al sistema desde el inicio. | Iniciar sesión, sesión autenticada y autorización por rol/área con guardias básicas. El diseño exige RBAC y sesión autenticada. | Bloquea acceso no autorizado y habilita todo lo demás. | BP-01. | Login; sesión; logout; autorización básica por rol. | Recuperación avanzada de acceso; MFA; políticas finas. | Riesgo de sobrecomplicar el primer corte de seguridad. | Un usuario válido entra; uno inválido no; un rol no autorizado queda bloqueado. | Login correcto/incorrecto; acceso a ruta privada; cierre de sesión. | Crítica | M | F2 Seguridad y acceso | 1 |
| BP-03 | Áreas y centros de costos | catálogo | Crear la estructura organizacional mínima. | CRUD de áreas y centros de costos, con relación obligatoria entre ambos. El diseño y el research los tratan como eje operativo. | Permite clasificar gastos y presupuestos. | BP-01, BP-02. | Alta, edición, consulta, baja lógica de áreas y centros de costos. | Escalamiento jerárquico avanzado. | Datos inconsistentes si se permite centro sin área. | Cada centro pertenece a un área activa; no hay orfandad. | Crear área; crear centro; validar pertenencia; desactivar área. | Crítica | S | F3 Catálogos y estructura organizacional | 1 |
| BP-04 | Usuarios y asignación organizacional | seguridad | Administrar usuarios con rol y área. | CRUD de usuarios con asignación a rol y área, respetando que el capturista solo opere sobre su área. | Hace operable el control de acceso real. | BP-02, BP-03. | Crear usuario; asignar rol; asignar área; activar/inactivar. | Delegación avanzada; self-service. | Mala asignación de área rompe el control operativo. | Usuario queda ligado a un rol y un área válidos. | Crear usuario; cambiar área; validar permisos por área. | Alta | S | F2 Seguridad y acceso | 2 |
| BP-05 | Catálogos operativos mínimos | catálogo | Disponibilizar catálogos que alimentan el gasto. | CRUD o seed administrable de categorías, conceptos de deducibilidad, estatus_gastos y proveedores. El diccionario sí define estas tablas. | Reduce fricción en captura y clasificación. | BP-01, BP-02, BP-03. | Categorías; conceptos_deducibilidad; estatus_gastos; proveedores. | Catálogo de cuentas SAT. | Catálogos vacíos bloquean el alta de gastos. | Existen valores activos seleccionables en captura. | Crear/editar catálogo; seleccionar valores en gasto. | Alta | S | F3 Catálogos y estructura organizacional | 2 |
| BP-06 | Gasto en borrador | full slice | Registrar la cabecera del gasto. | Alta/edición de gasto con estado borrador, asociado a usuario, área, centro de costos, fecha, concepto, justificación e importes base. | Activa el núcleo del producto. | BP-02, BP-03, BP-04, BP-05. | Alta de borrador; edición; baja lógica; consulta básica. | Aprobación; XML; presupuesto; reportes. | Si el borrador no queda bien modelado, todo el flujo se contamina. | Un gasto queda guardado como borrador y visible para su creador. | Crear borrador; editar; validar pertenencia a área/centro. | Crítica | S | F4 Caso de uso núcleo | 1 |
| BP-07 | Partidas y totales del gasto | full slice | Completar la estructura económica del gasto. | Alta/edición de líneas de gasto con categoría y concepto de deducibilidad; recalcular subtotales, IVA y total desde detalle. El diccionario exige gasto_detalle. | Da consistencia financiera al gasto. | BP-05, BP-06. | CRUD de partidas; cálculo de totales; validación de al menos una línea. | Contabilidad completa; pólizas; asientos. | Diferencias entre cabecera y detalle. | El total del gasto coincide con el detalle y no hay gasto sin línea. | Agregar/quitar partidas; verificar cálculo; guardar sin partidas. | Crítica | S | F4 Caso de uso núcleo | 2 |
| BP-08 | XML CFDI y extracción | archivos | Asociar el CFDI fiscal al gasto. | Carga y almacenamiento local del XML CFDI; extracción de UUID, RFC emisor/receptor, fecha, método de pago, subtotal, IVA y total. | Habilita trazabilidad fiscal mínima. | BP-06. | Subida XML; validación estructural; parseo; persistencia de datos extraídos. | Validación SAT en línea; cancelación; RFC checker. | XML mal formado o duplicado. | Se guarda el XML y se cargan los campos fiscales esperados. | Subir XML válido/dañado; verificar extracción; repetir UUID. | Crítica | M | F6 Manejo de archivos/documentos | 1 |
| BP-09 | Documentos relacionados | archivos | Soportar evidencia adicional al XML. | Adjuntar documentos no XML al gasto, con ruta física y metadatos básicos. El diseño contempla documentos_relacionados. | Mejora soporte documental sin meter OCR. | BP-06. | Adjuntar archivo; listar; eliminar lógica; observaciones. | OCR; imágenes como fuente principal. | Riesgo de acumular archivos innecesarios. | El gasto puede tener documentos extra visibles y recuperables. | Subir documento; abrir listado; borrar lógico. | Media | S | F6 Manejo de archivos/documentos | 2 |
| BP-10 | Envío a aprobación y estados | flujo | Formalizar el cambio de borrador a pendiente. | Transición de estado de borrador a pendiente de aprobación, con registro de fecha/envío y bloqueo de edición parcial según estado. | Abre el ciclo de autorización. | BP-06, BP-07, BP-08. | Cambio de estado; bloqueo de acciones; fecha_envío. | Escalamiento multi-nivel. | Estado inconsistente si se permite editar después de enviar. | Un gasto enviado ya no se comporta como borrador. | Enviar; intentar editar; regresar a estado previo si aplica. | Alta | S | F5 Flujo y validaciones | 1 |
| BP-11 | Bandeja de aprobación | flujo | Dar visibilidad al aprobador sobre lo pendiente. | Lista filtrada de gastos pendientes por área/rol con acceso a cabecera, detalle, CFDI y contexto presupuestal básico. | Desbloquea la revisión operativa. | BP-02, BP-03, BP-04, BP-10. | Bandeja; filtros; detalle de revisión; paginación. | Aprobación automática; reglas complejas por tope. | Listados lentos o con filtros incorrectos. | El jefe ve solo lo que le corresponde. | Abrir bandeja; filtrar por área; abrir detalle. | Alta | S | F5 Flujo y validaciones | 2 |
| BP-12 | Aprobar, rechazar y corregir | flujo | Cerrar el ciclo operativo del gasto. | Registrar aprobación, rechazo y observación; si se rechaza, devolver a borrador para corrección. | Materializa el flujo central del negocio. | BP-11. | Aprobar; rechazar; comentario; retorno a borrador. | Aprobación por jerarquía extendida. | Rechazos sin contexto o estados mal sincronizados. | Cada decisión deja huella y cambia el estado correctamente. | Aprobar; rechazar; corregir; reenviar. | Crítica | S | F5 Flujo y validaciones | 3 |
| BP-13 | Presupuestos mensuales | catálogo | Configurar el presupuesto mensual por área y centro de costos. | Alta y consulta de presupuestos por año/mes, área y centro de costos, con monto presupuestado y monto ejercido. | Habilita control presupuestal real. | BP-03. | CRUD de presupuestos; consulta por periodo. | Forecast; escenarios; presupuestos anuales. | Duplicidad de periodos o montos inconsistentes. | Un periodo único por combinación área/centro. | Crear presupuesto; duplicar periodo; consultar consumo. | Alta | S | F7 Presupuesto / reglas financieras | 1 |
| BP-14 | Validación presupuestal | flujo | Evitar aprobaciones que violen el presupuesto. | Comparar gasto vs presupuesto disponible y bloquear o advertir según la regla definida; el research plantea bloqueo o permisos especiales ante sobreconsumo. | Controla gasto antes de cerrar aprobación. | BP-12, BP-13. | Consumo; diferencia; porcentaje; alerta; validación al aprobar. | Motor de reglas avanzado por tope jerárquico. | Riesgo de fricción si se bloquea sin criterio claro. | El sistema calcula consumo y aplica la regla definida. | Aprobar con presupuesto suficiente/insuficiente. | Alta | S | F7 Presupuesto / reglas financieras | 2 |
| BP-15 | Historial y consulta | consulta | Dar trazabilidad al ciclo del gasto. | Búsqueda y consulta histórica de gastos, CFDI, estados y aprobaciones. El diseño lo pide de forma explícita. | Soporta operación y revisión posterior. | BP-06 a BP-12. | Filtros; detalle; consulta por estado/fecha/área. | Analítica avanzada; BI. | Sin buen índice, el historial se vuelve lento. | El usuario encuentra y abre un gasto histórico con su trazabilidad. | Buscar por folio; filtrar por estado; abrir historial. | Alta | S | F4 Caso de uso núcleo | 3 |
| BP-16 | Reportes operativos | reporte | Entregar información resumida para decisión operativa. | Reportes por área, presupuestales e históricos con exportación básica de información. | Soporta lectura ejecutiva y control. | BP-13, BP-14, BP-15. | Tablas y exportación básica. | Dashboards complejos; analítica predictiva. | Reportes sin criterio de corte o filtros pobres. | Se generan reportes consistentes con los datos del sistema. | Generar reporte por área; exportar; comparar totales. | Media | S | F8 Reportes | 1 |
| BP-17 | Bitácora de auditoría | auditoría | Registrar acciones críticas con trazabilidad. | Registrar eventos críticos, cambios relevantes y consultas sensibles en bitácora_auditoria. El diseño exige auditoría básica e inmutabilidad. | Da trazabilidad y soporte de control interno. | BP-02 y módulos de negocio. | Eventos críticos; usuario; módulo; acción; referencia; IP. | Auditoría forense avanzada. | Exceso de ruido o falta de eventos relevantes. | Las acciones críticas quedan registradas y consultables. | Crear/editar/aprobar/rechazar y revisar bitácora. | Alta | S | F9 Auditoría | 1 |
| BP-18 | Notificaciones internas | refinamiento | Avisar eventos operativos sin salir del sistema. | Generar avisos internos de aprobación pendiente, rechazo, corrección requerida y confirmaciones. | Reduce fricción operativa. | BP-10 a BP-12. | Avisos in-app; listado; estado leído/no leído. | Correo, SMS o push externo. | Notificaciones tardías o repetidas. | El usuario ve avisos coherentes con el flujo. | Generar rechazo; revisar aviso; marcar leído. | Media | S | F5 Flujo y validaciones | 4 |
| BP-19 | Hardening y retención | refinamiento | Cerrar seguridad y operación mínima para despliegue controlado. | Backups periódicos, retención 5 años, protección de archivos, headers, CSRF, XSS, consultas parametrizadas, manejo centralizado de errores y restricciones de acceso a XML. | Reduce riesgo operativo y técnico. | BP-01 a BP-18. | Backups; retención; seguridad de archivos; headers; errores. | Funcionalidad nueva de negocio. | Riesgo de dejar el sistema “funciona pero no opera”. | Existe una base segura y recuperable. | Verificar restricciones; simular error; validar backup. | Alta | M | F10 Hardening y refinamientos | 1 |

# 5. Agrupación por fases

## Fase 1. Base técnica mínima

Objetivo: cerrar la plataforma sobre una base consistente y construible.
Items: BP-01.
Razón: sin motor de BD y arranque base definidos, todo lo demás se rehace o se frena.

## Fase 2. Seguridad y autenticación

Objetivo: impedir acceso indebido y dejar identidad operativa.
Items: BP-02, BP-04.
Razón: la captura de gastos y la administración solo tienen sentido si cada usuario actúa dentro de su rol y área.

## Fase 3. Catálogos y estructura organizacional

Objetivo: formalizar áreas, centros de costos y catálogos base.
Items: BP-03, BP-05, BP-13.
Razón: el gasto debe anclarse a una estructura real y a catálogos ya existentes en el modelo.

## Fase 4. Caso de uso núcleo

Objetivo: registrar el gasto en borrador con todo lo mínimo para existir.
Items: BP-06, BP-07, BP-08, BP-09.
Razón: sin cabecera, detalle y CFDI, el sistema no entrega valor principal.

## Fase 5. Flujo y validaciones

Objetivo: mover el gasto por estados y tomar decisiones operativas.
Items: BP-10, BP-11, BP-12, BP-14, BP-18.
Razón: aquí se cierra el ciclo de autorización y el control presupuestal que sí está en alcance.

## Fase 6. Consulta histórica y reportes

Objetivo: dar visibilidad a la operación.
Items: BP-15, BP-16.
Razón: se construyen mejor cuando ya existen estados, aprobación y presupuesto reales.

## Fase 7. Auditoría

Objetivo: dejar trazabilidad confiable.
Items: BP-17.
Razón: la bitácora depende de que ya existan eventos funcionales relevantes que auditar.

## Fase 8. Hardening y refinamientos

Objetivo: consolidar operación segura y recuperable.
Items: BP-19.
Razón: no debe adelantarse sobre funciones aún inestables; primero hay que fijar el comportamiento funcional.

# 6. Secuencia recomendada de ejecución

El orden real recomendado es: BP-01 → BP-02 → BP-03 → BP-04 → BP-05 → BP-06 → BP-07 → BP-08 → BP-10 → BP-11 → BP-12 → BP-13 → BP-14 → BP-15 → BP-16 → BP-17 → BP-18 → BP-19. Este orden respeta la dependencia natural entre identidad, catálogos, gasto, aprobación, presupuesto y trazabilidad.

El primer incremento ideal es BP-01, porque resuelve la contradicción del motor de datos y deja el suelo técnico para todo lo demás. Sin esa decisión, cualquier desarrollo posterior puede quedar desalineado con el modelo de datos.

No conviene adelantar reportes, notificaciones ni hardening antes de que exista el flujo mínimo de gasto con estado, porque terminarían consumiendo tiempo sobre una base todavía inestable. Tampoco conviene abrir un motor de reglas contables/fiscales completo antes de cerrar el alcance formal del sistema.

# 7. Identificación de items demasiado grandes

Los siguientes bloques tenderían a crecer demasiado si se construyen como una sola pieza:

* “Administración de aplicación” debe dividirse en usuarios, áreas, centros de costo, roles y catálogos operativos.
* “Módulo de gastos” debe dividirse en cabecera, detalle, XML, documentos adjuntos, envío y corrección.
* “Módulo de aprobación” debe dividirse en bandeja, detalle, decisión y retorno a corrección.
* “Reportes” debe dividirse en consulta histórica, reporte operativo y exportación.
* “Seguridad y hardening” debe dividirse en auth/RBAC, validación de archivos, restricciones de acceso, backups y retención.

La división correcta ya quedó reflejada en los items BP-02 a BP-19. No conviene volver a agruparlos en “hacer el módulo X completo”, porque eso rompe el criterio incremental que el proyecto necesita.

# 8. Backlog listo para usarse con una IA desarrolladora

Los primeros 8 items más convenientes para construir son BP-01, BP-02, BP-03, BP-04, BP-05, BP-06, BP-07 y BP-08. Están al inicio porque desbloquean la base técnica, el control de acceso, la estructura organizacional y el registro real del gasto con CFDI, que es el núcleo del sistema.

Lo que desbloquean es claro: BP-01 permite avanzar sin contradicción tecnológica; BP-02 y BP-04 habilitan el acceso correcto; BP-03 y BP-05 dan catálogos y estructura; BP-06 y BP-07 permiten capturar el gasto; BP-08 agrega el amparo fiscal documental.

El primer incremento real de desarrollo debería ser BP-01, seguido inmediatamente por BP-02. Esa combinación deja la base estable para que el resto del backlog se implemente como slices verticales sin rehacer infraestructura.
