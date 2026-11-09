# F-012 — M-02 — Identidad, OTP y sesión segura

**Estado:** blocked
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

Código a inspeccionar: `stores/authStore.ts`, `store/useAppStore.ts`, `services/authService.ts`, `navigation/AuthNavigator.tsx`, `screens/LoginScreen.tsx`, `screens/VerifyCodeScreen.tsx`, `app/index.tsx`.

## Dependencias

F-011 Consultar DTO exacto publicado en documentación/backend indicado por el contrato; no inventar campos. Los prerrequisitos externos B-01/B-02/B-03/B-04, Admin y teléfono se prueban con evidencia real; ausencia bloquea su aceptación, no el trabajo portátil independiente.

## Criterios de aceptación

- [ ] Migrar usuario a id,firstName,lastName,email,employeeId,role; invalidar sesión mock AsyncStorage y nunca autenticar por booleano persistido; solo EMPLOYEE.
- [ ] Login identifier/password client=MOBILE → challenge 202; verify OTP real → tokens/usuario. Reenvío, estado/email/role y errores según DTO exacto publicado; no aceptar cualquier OTP.
- [ ] SecureStore para tokens; bootstrap valida sesión; refresh JSON rotativo single-flight ante dos 401; respuesta ambigua invalida sesión sin reutilizar refresh consumido.
- [ ] Logout revoca con API cuando corresponde y limpia credenciales/estado; generation/abort impide resurrección por respuestas tardías. Aislar preferencias/cache por cuenta y conservar cola ligada a propietario para M-05.
- [ ] Pruebas de login OTP inválido/éxito, no-EMPLOYEE, reinicio/rehidratación, mock inválido, refresh concurrente/expirado/ambiguo, logout tardío y cambio de cuenta. Registrar smoke real B-03 separado si bloqueado.

Plan detallado: `docs/tasks/012-sesion-real-plan.md`.

## Notas de implementación

Implementer hace UNA feature. Leer rol y skills locales; TDD/debugging para suite existente; ejecutar verificaciones frescas. No editar backlog ni autoaprobarse. Arquitectura incremental sobre services/types/stores actuales: cliente común → sesión → flujos → cola/uploads; evita reescritura monolítica y mantiene dependencia explícita. Dependencias externas no validadas quedan como bloqueo, nunca como éxito. Continuación humana vigente limitada a M-02: no iniciar otras features. Parte portátil conforme por reviewer; queda únicamente aceptación real externa, sin certificarla por pruebas portátiles.

## Registro de implementación

Implementación portátil completada para revisión independiente (2026-11-05). No se declara aprobación integral ni aceptación externa.

**Archivos de producto:** `services/sessionCoordinator.ts`, `services/tokenRepository.ts`, `services/authService.ts`, `stores/authStore.ts`, `store/useAppStore.ts`, `app/index.tsx`, `navigation/AuthNavigator.tsx`, `navigation/AppNavigator.tsx`, `screens/LoginScreen.tsx`, `screens/VerifyCodeScreen.tsx`, `screens/HomeScreen.tsx`; aislamiento en `services/accountPreferences.ts`, `services/accountScope.ts`, `services/localPreferences.ts`, servicios favoritos/usados/recientes, `services/offlineRegisterService.ts` y `services/syncService.ts`. Dependencia/lock `expo-secure-store ~57.0.4`; plugin backup seguro en `app.json`. No se modificaron SYNCED, backlog, otros repos ni Git.

**Decisiones:** login MOBILE 202→challenge→OTP API 200 instala exclusivamente identidad inglesa EMPLOYEE. AuthStore es memoria, sin setter de login ni booleano rehidratado. Bootstrap elimina mock AsyncStorage, valida DTO/identidad con /profile protegido EMPLOYEE y no exige role ausente ni decodifica JWT. Tokens/par/identidad en único JSON SecureStore; AsyncStorage solo marca no sensible de invalidación, además de preferencias por cuenta. Refresh JSON single-flight invalida durablemente el par antes de consumirlo; timeout/guardado fallido exige relogin. Epoch/abort y storage serializado descartan respuestas viejas. Logout exige 204 para confirmar revocación; limpia sesión y marcación incluso si no se confirma el servidor, expone error de limpieza y reintento. GET se repite una vez tras renovar; POST incierto nunca se repite automáticamente. Preferencias y nuevas entradas offline quedan ligadas a user.id, sin atribuir ni borrar keys legacy. Google fake está inactivo y no instala sesión; alta/reset/OTP registro siguen mock hasta F-013. Perfil visible y marcación siguen alcance M-04, cola activa M-05.

**Verificación fresca:** `npm test` exit 0, 10 archivos; ejecuciones directas totalizan 75 casos (15 Home, 15 coordinador, 2 repositorio, 2 runtime store/servicio, 3 UI, 2 preferencias, 1 ownership, 13 transporte, 15 arranque, 7 registro). `npm run typecheck` exit 0; `git diff --check` exit 0. TDD rojo→verde para núcleo de sesión/persistencia/aislamiento; integración adicional ejecuta módulos reales transpilados con nativos/red controlados. No equivalen a API real ni UI física. `CI=1 node node_modules/expo/bin/cli prebuild --platform android --no-install` exit 0, reglas SecureStore backup/extracción y main HTTP false/debug true inspeccionadas. Export Android final `CI=1 EXPO_NO_TELEMETRY=1 node node_modules/expo/bin/cli export --platform android --output-dir /tmp/gdes-mobile-f012-export --max-workers 2` exit 0, 1773 módulos/bundle Hermes. Artefacto de verificación en /tmp, no APK. Instalación SecureStore sin force/legacy peers; npm informó 26 avisos del árbol sin aplicar upgrades fuera de alcance.

**Corrección local para nueva revisión:** Home captura generación por identidad de objeto y vida de pantalla para carga inicial, favorito y registro; valida tras GPS/red/registro/cada persistencia y antes de cualquier publicación, navegación o limpieza, también catch/finally. No basta la key AppNavigator ni el namespace al invocar un servicio desde una closure vieja. `services/homeAccountIsolation.test.cjs` reproduce el consumidor real con store/servicios locales reales y async controlado: 10 fallos del defecto observados antes del cambio, luego 15/15 verdes incluyendo A→B/A→logout→A antes del cleanup React, unmount sin cambio de cuenta, carga/favorito tardíos y control positivo. No se migra asistencia ni se activa offline; API de registro sigue mock. docs/02 queda bajo ownership del leader. No se modifica el veredicto vigente: se solicita revisión independiente de estas correcciones.

**Documentación:** docs 05/06/07/08/09/10 y README describen estado vigente y límites; evidencia y smoke reproducible en doc09. `progress/implementer/current.md` contiene handoff y archivos por grupo. No se cambian estados/aprobaciones/dependencias del backlog.

**Aceptación externa bloqueada:** no `.env` ni EXPO_PUBLIC_API_BASE_URL, sin SDK Android/adb/teléfono/build ni fixture B-03 suministrado. Faltan OTP log backend, API LAN y verificación real de login/email/rol, revocación DB, refresh y SecureStore tras reinicio en teléfono. No certificar WhatsApp ni B-03/API/Android por fixtures Node/VM. Continúan bloqueos externos heredados de F-011; el reviewer debe distinguirlos de conformidad portátil.

**Límites técnicos explícitos:** si ambos almacenamientos rechazan todas las escrituras/borrados no se puede garantizar persistencia del cierre; se informa error y se solicita reintentar. La marca evita restauración cuando falla únicamente SecureStore. El logout remoto offline no se presenta como revocación confirmada. Cola existente sin dueño se conserva fuera del sync y su resolución pertenece a M-05.

## Review

**Veredicto: cambios requeridos — únicamente aceptación externa pendiente.** Revisión independiente 2026-11-05. **Parte portátil conforme, sin defectos locales pendientes identificados.** No se certifica aceptación integral API/OTP/Android ni se cambian estados/aprobaciones/dependencias del backlog.

1. **[Aceptación externa; no defecto local ni nuevo bloqueo de F-011] `docs/09-verificacion-y-qa.md`, matriz Q-01/Sesión:** aportar API LAN/fixture B-03 autorizado, OTP log dev y development build Android con SecureStore recompilado. Ejecutar login email/legajo→202→OTP incorrecto/correcto, restricciones email/estado/rol, reinicio físico, expiración y dos 401/una rotación, refresh ambiguo sin reutilización, logout/revocación DB y cambio de cuenta con respuestas tardías. Registrar evidencia real sin secretos. Prerrequisitos comprobados por reviewer: no `.env`, EXPO_PUBLIC_API_BASE_URL ausente, SDK `/home/ivcontreras/Android/Sdk` ausente y `adb` fuera de PATH; no fixture/teléfono suministrados. Preparación según docs 08/09: configurar URL LAN, `adb devices`, `npm run android:build -- --device`, `npm run start:dev`. Mantener bloqueos Android heredados de F-011; VM/export no satisfacen aceptación externa.

**Evidencia fresca del reviewer:** `npm test` exit 0 (10 archivos/0 fallos); `npm run typecheck` exit 0; `git diff --check` exit 0. `node services/homeAccountIsolation.test.cjs` 15/15, 0 fallos. `CI=1 EXPO_NO_TELEMETRY=1 node node_modules/expo/bin/cli export --platform android --output-dir /tmp/gdes-mobile-review012-export --max-workers 2` exit 0, 1773 módulos y bundle Hermes; no APK ni ejecución física.

**Conformidad portátil:** Home captura el objeto de generación y la vida de pantalla; comprueba su vigencia tras GPS/red/registro/persistencia y antes de publicar, limpiar estado o navegar, también en catch/finally. La regresión ejecutada reproduce Home, scope, store y preferencias reales con fronteras nativas controladas: A→B y A→logout→A antes del cleanup React, carga/favorito tardíos y desmontaje sin cambio de cuenta; preserva estado/observación/selección y no escribe bajo B ni navega desde A. Escrituras nativas ya iniciadas conservan su key original sin prometer cancelación. El control positivo conserva el éxito de la operación vigente. docs 02 describe authService/coordinador/resetAccount; docs 04/06/09 y Registro/handoff reflejan el alcance y las pruebas actuales sin equiparar mocks con integración.

**Criterios de aceptación:** identidad/migración mock, LOGIN/OTP contractual, SecureStore/bootstrap/refresh y logout/generación/aislamiento tienen evidencia portátil favorable. Tests requeridos pasan con la regresión del consumidor incluida. Continúan pendientes los aspectos reales de API/OTP, revocación DB, persistencia nativa y teléfono del ítem 1. Contrato mantenido: login MOBILE202/challenge, OTP200 user/tokens EMPLOYEE, resend202/sent, refresh200/tokens JSON, logout204 y `/profile` protegido EMPLOYEE sin role en DTO; no `/auth/session` inventado ni repetición automática de POST incierto. La conformidad local permite al leader evaluar dependencias no bloqueadas sin declarar aprobación integral F-012.
