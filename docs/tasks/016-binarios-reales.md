# F-016 — M-06 — Multipart de planillas y documentos

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

Código a inspeccionar: `services/uploadDocumentService.ts`, `services/documentService.ts`, `screens/DocumentosScreen.tsx`, `types/document.ts`.

## Dependencias

F-014 Consultar DTO exacto publicado en documentación/backend indicado por el contrato; no inventar campos. Los prerrequisitos externos B-01/B-02/B-03/B-04, Admin y teléfono se prueban con evidencia real; ausencia bloquea su aceptación, no el trabajo portátil independiente.

## Criterios de aceptación

- [ ] FormData nativo usa URI/nombre/MIME reales; planilla ordinaria workplaceId y período month/year escalar por request, múltiples períodos requests/resultados separados sin atomicidad ficticia.
- [ ] Documentos usan tipo contractual y workplaceId opcional; preservar contingencia con null confirmada, sin lugar ficticio. Integrar transporte B-04 una vez publicado; si no está, registrar bloqueo parcial sin eliminar flujo.
- [ ] Envelopes EMPLOYEE timesheetIds/documentIds/message exactos, sin confundir created de Admin. Una fuente lugares activos reutilizada M-04.
- [ ] 1–10 archivos, hasta 20 MiB inclusivos por archivo y extensiones contractuales; permisos/cancelación/URI inaccesible/red/error mantienen selección y nunca éxito falso. No retry automático de carga incierta ni cola implícita.
- [ ] Tests payloads nativos/período/nulos/envelopes/límites/selección-error/sesión expirada y respuesta perdida. Android imagen/PDF → Admin mismos bytes y rechazo atómico/storage caído con evidencia real o bloqueo identificado.

Plan detallado: `docs/tasks/016-binarios-reales-plan.md`.

## Notas de implementación

Implementer hace UNA feature. Leer rol y skills locales; TDD/debugging para suite existente; ejecutar verificaciones frescas. No editar backlog ni autoaprobarse. Arquitectura incremental sobre services/types/stores actuales: cliente común → sesión → flujos → cola/uploads; evita reescritura monolítica y mantiene dependencia explícita. Dependencias externas no validadas quedan como bloqueo, nunca como éxito. Si la parte portátil pasa revisión, el leader puede preparar la siguiente tarea sin certificar esta aceptación externa.

## Registro de implementación

Pendiente del implementer; registrar archivos, decisiones, comandos y bloqueos concretos.

## Review

Pendiente de reviewer independiente.
