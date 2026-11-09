# F-011 — M-01 — Runtime, transporte y verificación reproducible

**Estado:** in_progress
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

Código a inspeccionar: `package.json`, `package-lock.json`, `app.json`, `components/useKeyboardFormScroll.ts`, `screens/RegisterScreen.tsx`, `utils/registration.test.cjs`, `types/api.ts`, `services/httpClient.ts`, `docs/08-configuracion-ejecucion.md`, `docs/09-verificacion-y-qa.md`.

## Dependencias

Sin dependencia de implementación local. Consultar DTO exacto publicado en documentación/backend indicado por el contrato; no inventar campos. Los prerrequisitos externos B-01/B-02/B-03/B-04, Admin y teléfono se prueban con evidencia real; ausencia bloquea su aceptación, no el trabajo portátil independiente.

## Criterios de aceptación

- [x] Resolver peers/lockfile con versiones Expo/React/RN compatibles verificadas en fuentes oficiales; npm ci sin force/legacy-peer-deps. Registrar cualquier bloqueo de red/registry con comando y error concreto.
- [x] Diagnosticar las cuatro fallas de registration.test.cjs contrastando geometría e intención vigente; no alterar expectativas solo para verde. El margen de teclado no debe compensarse dos veces tras resize; documentar por qué cada expectativa o implementación cambia. Mantener apariencia de domicilio actual si no existe acuerdo de cambio; las pruebas deben verificar visibilidad completa y navegación, no imponer una altura arbitraria.
- [x] Cliente HTTP único en services/httpClient.ts con base EXPO_PUBLIC_API_BASE_URL validada, /api/v1 preservado, JSON/envelope data, error {code,message,retryable}, timeout y cancelación distinguibles; sin fallback mock. Soportar inyección de fetch para tests y evolución de auth M-02.
- [x] Scripts test/typecheck; suites de transporte incluyen URL/prefijo, body y headers, 204/202, error contractual, respuesta inválida, red, timeout y cancelación; TypeScript y suite existente ejecutados.
- [ ] Preparar development build local Android, esquema gdes, permisos GPS/cámara/picker, HTTP LAN limitado a desarrollo y .env.example sin secretos. Registrar prerrequisitos/compandos exactos para build e instalación.
- [ ] Comprobar API/health y catálogo desde Android físico en LAN y error al caer la red; sin teléfono/toolchain disponible registrar bloqueo concreto. Expo Go o curl de PC no satisfacen el criterio.

Plan detallado: `docs/tasks/011-runtime-api-plan.md`.

## Notas de implementación

Implementer hace UNA feature. Leer rol y skills locales; TDD/debugging para suite existente; ejecutar verificaciones frescas. No editar backlog ni autoaprobarse. Arquitectura incremental sobre services/types/stores actuales: cliente común → sesión → flujos → cola/uploads; evita reescritura monolítica y mantiene dependencia explícita. Dependencias externas no validadas quedan como bloqueo, nunca como éxito. Si la parte portátil pasa revisión, el leader puede preparar la siguiente tarea sin certificar esta aceptación externa.

## Registro de implementación

**Resultado implementer: blocked por aceptación nativa externa; parte portátil implementada y disponible para revisión independiente.** No se cambia el estado del backlog ni se autoaprueba la tarea.

Archivos: `package.json`, `package-lock.json`, `app.json`, `.gitignore`, `.env.example`, `plugins/withAndroidDevelopmentHttp.js`, `types/api.ts`, `services/httpClient.ts`, `services/httpClient.test.cjs`, `services/runtimeStartup.test.cjs`, `app/index.tsx`, `components/useKeyboardFormScroll.ts`, `utils/registration.test.cjs`, docs locales 05/08/09/10 y `progress/implementer/current.md`. Android generado por prebuild se ignora; sin cambios de producto en otros repos, SYNCED ni mutaciones Git.

Decisiones:
- React DOM se fija a 19.2.3, igual que React; Expo se acota a ~57.0.22, RN queda 0.86.3. Compatibilidad contrastada con `node_modules/expo/bundledNativeModules.json`, [matriz Expo](https://docs.expo.dev/versions/latest/) y [SDK 57 oficial](https://expo.dev/changelog/sdk-57). Lock reproducible sin forzar peers, con dev client/build-properties del SDK.
- Las cuatro fallas iniciales fueron reproducidas (3/7 pasan). El factor 0.95 restaba 24 al keyboardTop=480 antes de aplicar otro margen fijo de 24: se elimina el factor, overlap vuelve a 296 y luego 0 tras resize. Domicilio conserva 90 visualmente: se retira únicamente la expectativa de diseño 144 del formulario; geometría comprueba visibilidad de campos de 90 y 144 y se mantienen navegación/IME/confirmación.
- Cliente JSON único con fetch inyectable y URL requerida, validada en render inicial antes de habilitar AuthNavigator/AppNavigator y en cada solicitud, sin fallback; protege prefijo, conserva status/data/pagination y error contractual. Timeout/cancelación incluyen body, abortan fetch y limpian recursos; no hace refresh ni reintentos. URL ausente/inválida muestra error accionable con EXPO_PUBLIC_API_BASE_URL, .env, /api/v1 y reinicio de Metro/app, conservando INVALID_CONFIG tipado y bloqueando incluso sesión persistida o hidratación pendiente. URL válida no dispara requests al arrancar. DTOs genéricos deben validarse en cada servicio futuro; auth/mocks no migrados en M-01.
- Permisos GPS/cámara/pickers y esquema gdes configurados. Main manifest rechaza HTTP y overlay debug permite LAN. `__DEV__` exige HTTPS en cliente release. Build local documentado; no se instaló toolchain ni se produjo APK.

Evidencia 2026-11-05:
- `npm ci --fetch-retries=0 --fetch-timeout=15000 --cache /tmp/gdes-mobile-npm-cache`: exit 0 (682 packages), con acceso al registry autorizado por herramienta; antes falló en sandbox `ENOTFOUND registry.npmjs.org`. Sin force/legacy-peer-deps. npm audit informa 26 advisories (3 low/13 moderate/9 high/1 critical), pendientes de evaluación, sin aplicar fix fuera de alcance.
- TDD: diez casos iniciales de transporte fallaron por ausencia del cliente; adicionales detectaron query timestamp, body circular y rechazo asíncrono de URL ausente antes de sus correcciones. Verificación final: `node services/httpClient.test.cjs` 13/13; `node utils/registration.test.cjs` 7/7; `node services/runtimeStartup.test.cjs` 15/15; `npm test` exit 0 (3 archivos); `npm run typecheck` exit 0. El feedback local 1 se contrastó con código mediante receiving-code-review: 13 casos negativos de render inicial fallaron antes del guard y pasan tras integrarlo. Se preservan dos pruebas positivas de configuración válida.
- `npx --no-install expo config --type public`: exit 0; `CI=1 EXPO_NO_GIT_STATUS=1 npx --no-install expo prebuild --platform android --no-install`: exit 0. Permisos GPS/cámara, micrófono removido, esquema gdes y cleartext main=false/debug=true inspeccionados en manifiestos generados. Advertencia no bloqueante: falta expo-system-ui para userInterfaceStyle nativo.
- `EXPO_OFFLINE=1 npx --no-install expo install --check`: exit 0, dependencies up to date; advierte validación offline limitada (la evidencia principal es metadata oficial + instalación limpia).
- `CI=1 npm run android:build -- --no-bundler`: exit 1, `Failed to resolve the Android SDK path ... /home/ivcontreras/Android/Sdk` y `Error: spawn adb ENOENT`. `command -v java`, `adb`, `sdkmanager` no encuentra ejecutables.

Bloqueos vigentes: instalar/configurar JDK/Android SDK/adb y conectar Android físico autorizado. Faltan compilar APK, instalar, probar GPS/cámara/picker/esquema y API health/catálogo/red caída desde runtime del teléfono. No se certifican backend/storage/fixture/Admin ni LAN por curl PC. `/catalogs` es público; `/workplaces` autenticado se verificará tras M-02. Prerrequisitos y comandos exactos en docs 08/09. Se puede revisar parte portátil sin certificar aceptación nativa ni cerrar estos dos criterios.

## Review

**Veredicto: cambios requeridos exclusivamente por 2 bloqueos externos. Parte portátil conforme, sin defectos locales pendientes detectados.** Reviewer independiente, 2026-11-05. Criterios 1/2/3/4 conformes en verificación portátil; configuración/documentación portátil del criterio 5 conforme. No se aprueba integralmente F-011 ni se certifica Android físico. El leader puede avanzar M-02/trabajo independiente con esta base portátil, conservando las dependencias y aceptación externa explícitas.

Verificación fresca reviewer: `npm test` exit 0 (3 archivos), `node services/runtimeStartup.test.cjs` 15/15 y `npm run typecheck` exit 0. El render inicial bloquea configuración ausente/inválida antes de navegación, incluso con sesión persistida/hidratación pendiente; muestra error accionable sin fetch. Configuración válida preserva el flujo existente y HTTP release se bloquea. Transporte tipado y docs 05/08/09 coherentes. Evidencia y matriz por criterio en `progress/reviewer/current.md`. Build reproducido exit 1 por SDK/adb ausentes.

1. **Externo — development build Android instalable pendiente.** `app.json`, `plugins/withAndroidDevelopmentHttp.js`, `docs/08-configuracion-ejecucion.md` y criterio 5: configuración portátil conforme, sin APK ni instalación real verificada. Reviewer reprodujo `CI=1 npm run android:build -- --no-bundler`: exit 1, SDK ausente en `/home/ivcontreras/Android/Sdk` y `spawn adb ENOENT`. Con entorno autorizado disponible, configurar JDK/SDK/adb, compilar e instalar debug y aportar evidencia de paquete/esquema `gdes` y permisos GPS/cámara/pickers. Mantener bloqueo explícito hasta entonces.
2. **Externo — aceptación Android físico/LAN pendiente.** `docs/09-verificacion-y-qa.md`, matriz Android y criterio 6: faltan teléfono autorizado y API LAN disponible para comprobar `/health`, `/api/v1/catalogs` y caída/recuperación de red desde runtime nativo; registrar dispositivo/build, requests/status/error y permisos/lifecycle reales. `/workplaces` autenticado corresponde a M-02. Pruebas fetch inyectadas/VM, manifiestos y curl PC no certifican esta aceptación. Mantener pendiente sin cerrar F-011.
