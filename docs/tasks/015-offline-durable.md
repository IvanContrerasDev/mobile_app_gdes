# F-015 — M-05 — Cola offline durable y reconciliación

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

Código a inspeccionar: `services/offlineRegisterService.ts`, `services/syncService.ts`, `services/networkService.ts`, `services/registerService.ts`, `screens/HomeScreen.tsx`, `app/index.tsx`.

## Dependencias

F-014 Consultar DTO exacto publicado en documentación/backend indicado por el contrato; no inventar campos. Los prerrequisitos externos B-01/B-02/B-03/B-04, Admin y teléfono se prueban con evidencia real; ausencia bloquea su aceptación, no el trabajo portátil independiente.

## Criterios de aceptación

- [ ] Cola versionada durable con propietario/clientRequestId/occurredAt/GPS originales; formato anterior aislado; lectura corrupta/escritura fallida nunca equivale a cola vacía ni éxito guardado. Mutex para todas modificaciones y sync.
- [ ] UI PENDIENTE tras persistir distinto de CONFIRMADO servidor; no alterar status como si hubiera ACK. Foreground/reconexión sincroniza secuencial por recepción, sin doble proceso.
- [ ] clientSentAt fresco cada intento; resto del contenido/ID original estable. Quitar solo confirmados eventId/recordId o replay; 429/5xx/red reintento acotado, terminales visibles sin borrado silencioso.
- [ ] Logout/cambio cuenta conserva evidencia del propietario y jamás la envía bajo otra cuenta; pendientes visibles al volver propietario; sin borrado manual hasta ratificar retención/descarte.
- [ ] Pruebas ACK perdido/restart/post-ACK-pre-delete, sync parcial, inserción concurrente, reconexiones dobles, propietario distinto/corrupción/error persistencia, 24 h inclusivas/>24 h y skew con semántica servidor. No decidir política temporal abierta.

Plan detallado: `docs/tasks/015-offline-durable-plan.md`.

## Notas de implementación

Implementer hace UNA feature. Leer rol y skills locales; TDD/debugging para suite existente; ejecutar verificaciones frescas. No editar backlog ni autoaprobarse. Arquitectura incremental sobre services/types/stores actuales: cliente común → sesión → flujos → cola/uploads; evita reescritura monolítica y mantiene dependencia explícita. Dependencias externas no validadas quedan como bloqueo, nunca como éxito. Si la parte portátil pasa revisión, el leader puede preparar la siguiente tarea sin certificar esta aceptación externa.

## Registro de implementación

Pendiente del implementer; registrar archivos, decisiones, comandos y bloqueos concretos.

## Review

Pendiente de reviewer independiente.
