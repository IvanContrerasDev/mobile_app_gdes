# F-014 — M-04 — Lugares, perfil y asistencia online

**Estado:** pending
**App(s):** mobile
**Creada:** 2026-11-04

Artefacto temporal; consolidar docs y eliminar solo tras cierre aprobado.

## Contexto

Parte de F-010, integración local autorizada en el inbox. App de empleados: reemplazar mocks conservando contratos aprobados. Android físico en LAN es entorno de aceptación.

## Alcance

Incluye los criterios siguientes y sus pruebas/documentación locales. No incluye código de otros repos, cambios SYNCED, Git, producción ni ratificar decisiones abiertas.

## Referencias (fuente de verdad)

- `docs/README.md`
- `docs/05-servicios-datos-y-contratos.md`
- `docs/07-convenciones-de-desarrollo.md`
- `docs/08-configuracion-ejecucion.md`
- `docs/09-verificacion-y-qa.md`
- `docs/10-deuda-tecnica-y-roadmap.md`
- `docs/arquitectura/contratos-api.md`
- `progress/leader/inbox/20261102-integracion-local.md`

Código a inspeccionar: `screens/HomeScreen.tsx`, `screens/PerfilScreen.tsx`, `services/workplaceService.ts`, `services/registerService.ts`, `services/locationService.ts`, `services/favoriteWorkplaceService.ts`, `services/recentWorkplaceService.ts`, `services/usedWorkplaceService.ts`, `types/workplace.ts`, `types/api.ts`.

## Dependencias

F-012 Consultar DTO exacto publicado en documentación/backend indicado por el contrato; no inventar campos. Los prerrequisitos externos B-01/B-02/B-03/B-04, Admin y teléfono se prueban con evidencia real; ausencia bloquea su aceptación, no el trabajo portátil independiente.

## Criterios de aceptación

- [ ] Una fuente GET /workplaces activa no paginada EMPLOYEE; DTO real siteId/siteName/clientName/coordenadas/radio, sin IDs fijos. Favoritos/usados/recientes locales por cuenta sin selección inactiva.
- [ ] GET /profile real y GET /attendance/status autoridad; refrescar al foreground/éxito/reinicio sin derivar estado de memoria local.
- [ ] POST /attendance/events con workplaceId,type,clientRequestId,latitude,longitude,accuracy,locationTimestamp y absenceReason opcional de catálogo; nunca userId. Online occurredAt servidor. Respuesta eventId/recordId/message.
- [ ] ID durable estable antes del primer envío, también timeout/reinicio; impedir doble envío, conservar datos ante fallo. GPS/permiso/geocerca/precisión/timeout no muestran éxito falso. Quitar logs de coordenadas y payloads.
- [ ] Franco conserva jornada libre sin obligación; no mapear a VACATION/LEAVE ni inferir incumplimiento. Consumir catálogo; representación aún ausente se registra como bloqueo parcial.
- [ ] Tests de payload/IDs reintento/reinicio, status/foreground, perfil, preferencias por cuenta/lugar inactivo/errores GPS. Smoke real lugar Admin y teléfono: entrada/salida/ausencia y matriz Admin como dependencia externa explícita.

Plan detallado: `docs/tasks/014-asistencia-online-plan.md`.

## Notas de implementación

Implementer hace UNA feature. Leer rol y skills locales; TDD/debugging para suite existente; ejecutar verificaciones frescas. No editar backlog ni autoaprobarse. Arquitectura incremental sobre services/types/stores actuales: cliente común → sesión → flujos → cola/uploads; evita reescritura monolítica y mantiene dependencia explícita. Dependencias externas no validadas quedan como bloqueo, nunca como éxito. Si la parte portátil pasa revisión, el leader puede preparar la siguiente tarea sin certificar esta aceptación externa.

## Registro de implementación

Pendiente del implementer; registrar archivos, decisiones, comandos y bloqueos concretos.

## Review

Pendiente de reviewer independiente.
