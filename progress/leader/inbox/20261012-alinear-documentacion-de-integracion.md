# Alinear documentación mobile con el contrato común (2026-10-12)

**Origen:** orchestrator de GdesProject  
**Estado:** pendiente de procesamiento por leader mobile

## Contexto

El contrato común se sincronizó. La documentación local `docs/05-servicios-datos-y-contratos.md` aún describe payloads históricos (`action` en español, `{ success, message }`, `workplace` en vez de `workplaceId`) y `docs/arquitectura/contratos-api.md` tiene registros históricos que ahora deben distinguirse con claridad de los contratos vigentes.

## Trabajo solicitado

1. Revisar y actualizar la documentación local de integración para que diferencie contrato vigente de estado actual de la implementación mock.
2. Reflejar los payloads vigentes: evento `CHECK_IN | CHECK_OUT | ABSENCE`, `occurredAt`, `clientRequestId`, `absenceReason` (si ABSENCE), sobre `POST /attendance/events`; sesión `AuthUser` en inglés y con `role`; envelopes `{ data }`/`{ error }`; `workplaceId` en cargas documentales.
3. Identificar en el backlog local qué trabajo móvil sigue pendiente para consumir esos contratos, con estado `pending`/next steps según la autoridad local. No cambiar código ni cerrar una feature sin el proceso propio del repo.
4. Conservar las decisiones globales de P-05/F-006 que no cambian el contrato móvil. No inferir fechas límite de marcaciones offline ni el origen de carga de `cuil`, `hireDate` y `position`; mantenerlos como preguntas abiertas para el humano/backend.
5. Incorporar la nueva ventana máxima de 24 horas entre `occurredAt` y `receivedAt` del servidor para eventos offline; identificar si se requiere una feature pendiente para UX/sincronización y coordinar el código de error con backend. El límite exacto está incluido y más de 24 horas está fuera de ventana.
6. Registrar el procesamiento en `progress/leader/current.md` y señalar cualquier conflicto entre el contrato común y docs locales.

## Resultado esperado

Documentación local utilizable para integrar mobile con backend y admin, sin presentar mocks como implementación real.
