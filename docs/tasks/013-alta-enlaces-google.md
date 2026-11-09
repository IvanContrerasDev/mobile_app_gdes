# F-013 — M-03 — Alta, email, recuperación y Google

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

Código a inspeccionar: `screens/RegisterScreen.tsx`, `screens/VerifyCodeScreen.tsx`, `screens/ForgotPasswordScreen.tsx`, `screens/SuccessScreens.tsx`, `navigation/AuthNavigator.tsx`, `services/passwordRecoveryService.ts`, `components/GoogleModal.tsx`, `app/`.

## Dependencias

F-012 Consultar DTO exacto publicado en documentación/backend indicado por el contrato; no inventar campos. Los prerrequisitos externos B-01/B-02/B-03/B-04, Admin y teléfono se prueban con evidencia real; ausencia bloquea su aceptación, no el trabajo portátil independiente.

## Criterios de aceptación

- [ ] Registro envía diez campos ingleses y siteId catálogo público exactos; OTP REGISTER retorna 202 sin tokens; pendiente email y reenvío reales; password nueva 12–128 Unicode según backend.
- [ ] Rutas frío/caliente gdes://email-verified?success=true muestran retorno sin autenticar por query ni destruir sesión ajena; estados inválido/usado/vencido claros.
- [ ] Recuperación neutra real; reset servido en Admin /password-reset accesible desde Android. Prueba de nueva password y revocación anterior con evidencia cuando B-02/A-03 disponibles.
- [ ] Retirar identidad y selector Google falsos; OAuth Authorization Code + PKCE/idToken y OTP backend conforme credenciales/audience/redirect. Sin credenciales mostrar no configurado; no simular éxito; validación externa separada.
- [ ] Tests de payload/catalog/OTP sin tokens/deep links/query no confiable/recuperación/OAuth cancelado y configuración ausente; correo local y Google real se registran con evidencia o bloqueo concreto.

Plan detallado: `docs/tasks/013-alta-enlaces-google-plan.md`.

## Notas de implementación

Implementer hace UNA feature. Leer rol y skills locales; TDD/debugging para suite existente; ejecutar verificaciones frescas. No editar backlog ni autoaprobarse. Arquitectura incremental sobre services/types/stores actuales: cliente común → sesión → flujos → cola/uploads; evita reescritura monolítica y mantiene dependencia explícita. Dependencias externas no validadas quedan como bloqueo, nunca como éxito. Si la parte portátil pasa revisión, el leader puede preparar la siguiente tarea sin certificar esta aceptación externa.

## Registro de implementación

Pendiente del implementer; registrar archivos, decisiones, comandos y bloqueos concretos.

## Review

Pendiente de reviewer independiente.
