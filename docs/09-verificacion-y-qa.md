# Verificación y QA

## Estado de automatización

`npm test` ejecuta suites `utils/*.test.cjs` y `services/*.test.cjs` mediante node:test y transpilación TypeScript. El runner agregado puede reportar archivos como unidades; las ejecuciones directas enumeran cada caso. `npm run typecheck` verifica TypeScript strict; no hay lint configurado.

Transporte: base/prefijo/path/query, JSON/headers, listado/paginación, 202/204, error contractual/status, respuestas inválidas, red, timeout (fetch/body), cancelación previa/durante request, URL insegura en release y body no serializable. Fetch se inyecta, sin servidor ni teléfono: esto no acredita conectividad LAN.

## Smoke test

- [ ] Sin URL API válida, arranque muestra error de configuración accionable y bloquea login/home incluso con sesión persistida.
- [ ] Con URL válida, arranque espera lectura segura y validación /profile antes de mostrar home. Sin sesión termina en login.
- [ ] Login inválido muestra error sin autenticar.
- [ ] Login real entrega challenge sin autenticar; solo OTP correcto instala identidad EMPLOYEE.
- [ ] Logout confirmado vuelve al login; cancelar mantiene sesión.
- [ ] Tabs cambian entre Home, Documentos y Perfil.

## Matriz funcional

### Autenticación

- [ ] Login vacío bloqueado; legajo alfanumérico y contraseña existente llegan al servidor sin imponer política de alta.
- [ ] Email o legajo reales → challenge MOBILE → OTP incorrecto/correcto, vencimiento y cooldown.
- [ ] Google indica no configurado y nunca instala identidad falsa.
- [ ] OTP login rechaza formato inválido localmente y requiere verificación backend; registro conserva OTP mock hasta M-03.
- [ ] Registro bloquea cada campo inválido y no persiste datos.
- [ ] Recuperación sin red muestra error; online muestra confirmación mock.

### Marcación

- [ ] Lugares cargan y se pueden reintentar ante error.
- [ ] Sin lugar/acción se bloquea.
- [ ] Permiso GPS denegado y timeout muestran alternativa de planilla física.
- [ ] Sin Internet se rechaza y no crea cola offline.
- [ ] Entrada cambia indicador a “En horario laboral”; salida a “Fuera”.
- [ ] Ausencia no cambia `isWorking`.
- [ ] Éxito vuelve a Home a los 2 s y resetea selección/observación.
- [ ] Lugar reciente se preselecciona por franja; favoritos y usados ordenan correctamente.

### Documentos

- [ ] Cámara/galería denegadas muestran mensaje.
- [ ] Planilla requiere imagen; comprobar que hoy no exige lugar.
- [ ] Contingencia acepta PDF/JPG/JPEG/PNG/DOC/DOCX/TXT y avisa por inválidos.
- [ ] Archivos seleccionados pueden eliminarse.
- [ ] Sin Internet bloquea ambas cargas.
- [ ] Éxito mock limpia formulario y abre confirmación.
- [ ] Probar archivo grande/múltiples: registrar falta de límites como deuda.

### Perfil

- [ ] Confirmar que muestra Gina Tini independientemente del login (defecto conocido).
- [ ] Todos los campos son de solo lectura.

## Pruebas de persistencia

1. Marcar favorito, cerrar/reabrir con la misma cuenta: debe persistir; otra cuenta no hereda preferencias legacy ni propias.
2. Registrar en mañana y tarde: cada franja conserva su lugar.
3. Logout/reinicio: sesión permanece cerrada; probar borrado SecureStore fallido y marca de invalidación, sin publicar credenciales.
4. `isWorking` se pierde al reiniciar (comportamiento actual).
5. Cola offline solo se prueba llamando servicios directamente; no tiene entrada UI.

## Verificaciones técnicas

```bash
npm ci
node node_modules/typescript/bin/tsc --noEmit
node utils/registration.test.cjs
```

### Evidencia portátil vigente (2026-11-05)

- `npm ci --fetch-retries=0 --fetch-timeout=15000 --cache /tmp/gdes-mobile-npm-cache`: exit 0, 682 packages instalados sin force/legacy-peer-deps, con acceso autorizado al registry. El primer intento sandbox falló `ENOTFOUND registry.npmjs.org`; el bloqueo de red se superó sin cambiar peers. npm informa 26 vulnerabilidades (3 low/13 moderate/9 high/1 critical), sin evaluación o corrección en esta tarea.
- `node utils/registration.test.cjs`: 7/7. Se corrigió `keyboardTop * 0.95`, que restaba 24 extra a 480 y sumaba overlap 320 en lugar de 296. Se conserva separación fija de 24; tras resize overlap es 0. Los dos tests que imponían altura 144 se ajustan al alcance aprobado: UI domicilio conserva 90; se verifica foco/navegación y visibilidad completa por geometría (campos de 90 y 144), no un rediseño visual arbitrario.
- `node services/httpClient.test.cjs`: 13/13; `node services/runtimeStartup.test.cjs`: 15/15. Render inicial del App real transpílado, con primitivas RN y store controlados: URL ausente, inválida, sin prefijo o con credenciales bloquea navegación antes/después de hidratación y con/sin sesión; muestra alerta con variable, prefijo y reinicio sin realizar fetch. URLs LAN dev/HTTPS mantienen navegación e hidratación; HTTP release queda bloqueado. Los 13 casos negativos fallaron antes de agregar el guard. Estas pruebas portátiles no equivalen a arranque físico.
- `npx expo config --type public` y prebuild Android exit 0. Inspección de manifiestos generados: permisos GPS/cámara, esquema gdes, cleartext main=false/debug=true. No equivale a APK.
- Build debug bloqueado por SDK ausente y `spawn adb ENOENT`; Java/sdkmanager tampoco disponibles. Comandos/prerrequisitos en [configuración](08-configuracion-ejecucion.md).

### Sesión M-02 — verificación portátil y límites

Suites: `node services/sessionCoordinator.test.cjs` (15 casos), `node services/tokenRepository.test.cjs` (2), `node services/authRuntime.test.cjs` (2), `node services/authScreens.test.cjs` (3), `node services/accountPreferences.test.cjs` (2), `node services/offlineOwnership.test.cjs` (1) y `node services/homeAccountIsolation.test.cjs` (15). Junto con registro/transporte/arranque suman 75 casos en 10 archivos. Comandos finales y resultado vigente quedan también en el Registro de implementación F-012 mientras sigue pendiente de aceptación externa.

Cubren challenge/OTP inválido y correcto, no EMPLOYEE/DTO malformado, restricciones email/estado/rol, mock inválido, reinicio /profile sin role y con identidad distinta, refresh simultáneo y 401 tardío, timeout ambiguo/expirado, persistencia fallida, logout durante OTP/guardado/refresh, cambio A→B durante bootstrap, no repetición de mutaciones inciertas, cooldown, aislamiento A/B/A y evidencia offline legacy preservada. Tests de repositorio reproducen error de borrado nativo y verifican marca no sensible de invalidación; integración ejecuta servicio/store/repositorio reales con módulos nativos controlados. UI transpilada ejecuta handlers de login/OTP y muestra errores servidor.

Verificación final F-012: `npm test` exit 0 (10 archivos), `npm run typecheck` exit 0 y `git diff --check` exit 0. `CI=1 node node_modules/expo/bin/cli prebuild --platform android --no-install` exit 0: main conserva HTTP deshabilitado, debug habilitado y reglas de backup/extracción excluyen SecureStore. Aviso previo de expo-system-ui pendiente, sin afectar esta integración. `CI=1 EXPO_NO_TELEMETRY=1 node node_modules/expo/bin/cli export --platform android --output-dir /tmp/gdes-mobile-f012-export --max-workers 2` exit 0 con bundle Hermes (1773 módulos); esto verifica empaquetado JS Android y resolución del módulo, no compilación APK. Warning NO_COLOR/FORCE_COLOR de Metro sin fallo.

La regresión Home ejecuta el consumidor y servicios de preferencias/recientes/usados/accountScope reales, con lógica de useAppStore sobre Zustand vanilla y un puente de hooks controlado. GPS, red, registro y storage se difieren para cambiar generación antes de resolver: A→B y A→logout→A antes del cleanup React; se comprueban isWorking/observación/selección, ausencia de navegación/publicaciones y de escrituras bajo B. También cubre desmontaje sin cambio de cuenta, carga inicial tardía exitosa/fallida y favorito tardío exitoso/fallido, con control positivo del éxito vigente. Una escritura nativa ya iniciada conserva su key de A; no se promete cancelarla, y su continuación no ejecuta otras escrituras ni efectos sobre la nueva generación.

No son pruebas HTTP con backend real ni rendering/Keystore físicos. OTP/roles/perfil son fixtures deterministas; no se afirma entrega WhatsApp, revocación DB o persistencia nativa real. SecureStore exige recompilar el development build tras instalar la dependencia y validar reinicio/bloqueo del dispositivo.

**Smoke real B-03 bloqueado:** no existe `.env`, EXPO_PUBLIC_API_BASE_URL no está definida, `/home/ivcontreras/Android/Sdk` no existe y `adb` no está en PATH. No se aportaron teléfono autorizado, build instalable ni fixture B-03. No se conocen identifier/OTP/rol de prueba autorizados. Completar sesión de la matriz Q-01 con fixture backend y OTP log dev, sin inventar credenciales ni interpretar fixtures VM como evidencia externa.

La revisión independiente de F-011 confirma conformidad portátil sin defectos locales pendientes; la aceptación integral sigue bloqueada por los criterios nativos siguientes.

La revisión independiente de F-012 confirma conformidad portátil con 0 defectos locales: suite de 10 archivos, TypeScript, regresión Home 15/15 y export Android exit 0. Solo queda aceptación externa Q-01/Sesión; no hay aprobación integral ni prueba de Keystore/proveedor/API en físico.

### Aceptación Android físico LAN pendiente

1. Instalar development build en teléfono real (no Expo Go), registrar modelo/Android, IP API y versión build, sin secretos. Abrir vía Metro LAN y comprobar intent `gdes://` en frío y con app abierta (semántica de email en M-03).
2. Desde teléfono comprobar `http://<IP-LAN-PC>:3000/health` (health fuera de `/api/v1`, según publicación del backend) y `http://<IP-LAN-PC>:3000/api/v1/catalogs`, público. Registrar status/cuerpo real; provincias/tipos fijos no son lugares.
3. En React Native DevTools del build ejecutar `await fetch('http://<IP-LAN-PC>:3000/api/v1/catalogs').then(r => r.json())` y registrar respuesta desde runtime nativo. Tras M-02/M-04, verificar también el servicio real autenticado `/workplaces`, que es distinto del catálogo público. No publicar tokens.
4. Desconectar Wi-Fi/datos o detener API y repetir la solicitud nativa: registrar error y recuperar red/reintentar. Validar integración de mensajes del cliente al migrar servicios, además de la clasificación portátil de errores. No certificar por curl PC ni por navegador de PC.
5. Probar GPS/cámara/galería y document picker autorizados, denegados y cancelados; volver de background y reiniciar. Guardar evidencia por criterio. Esta matriz permanece pendiente porque no hay SDK/adb/teléfono accesible.

## Regresión mínima antes de merge

- [ ] TypeScript sin errores.
- [ ] Arranque Android/iOS.
- [ ] Login/logout.
- [ ] GPS autorizado y denegado.
- [ ] Marcación online y rechazo offline.
- [ ] Cámara/galería/document picker autorizados y denegados.
- [ ] Persistencia tras reinicio.
- [ ] No se agregaron logs con credenciales, archivos o coordenadas.

## Criterios futuros

Al integrar backend, añadir tests unitarios para validaciones/ranking, integración para servicios y E2E de auth/marcación/upload; cubrir expiración de sesión, duplicados, idempotencia, reintentos y sincronización parcial.

## Aceptación local compartida (Q-01)

Pendiente de ejecución con teléfono y servicios reales; los checks Node/VM no satisfacen esta matriz. Registrar evidencia vigente en este documento por escenario al disponer de entorno, sin tokens, OTP, URLs firmadas ni coordenadas personales en logs/reportes. Un requisito externo no probado queda pendiente aunque pase la implementación local.

| Escenario | Evidencia requerida | Dependencias | Estado |
|---|---|---|---|
| Instalación y LAN | Build debug instalado; paquete/esquema/permisos; health y catálogo desde runtime Android, caída y recuperación de red | B-01, Android SDK/JDK/adb/teléfono | Pendiente |
| Sesión | Email/legajo→challenge→OTP backend; error de rol/email; reinicio, expiración/refresh, logout y respuesta tardía sin restaurar sesión | M-02, B-03/OTP log dev | Pendiente |
| Alta/email | Registro sin cuenta antes OTP y sin tokens después; magic link en bandeja local→retorno frío/caliente; login tras verificación servidor | M-03, B-02 | Pendiente |
| Recuperación | Link Admin accesible desde teléfono; token usado/vencido; contraseña nueva funciona y sesión anterior revocada | M-03, A-03, B-02 | Pendiente |
| Google | PKCE/idToken con audience/redirect reales→OTP; cancelación/error/config ausente sin éxito falso | M-03, credenciales proveedor | Pendiente separado |
| Organización | Lugar creado en Admin en ubicación de prueba explícita aparece con mismo UUID en Android; inactivo no seleccionable | M-04, A-02, B-03 | Pendiente |
| Asistencia | Entrada/salida/ausencia Android persisten y aparecen en matriz Admin; status servidor tras reinicio; mismo ID reintentado sin duplicación | M-04, A-04, B-03 | Pendiente |
| Offline | ACK perdido, reinicio, reconexión, parcial e inserción concurrente; una ficha servidor; 24h inclusive/>24h y skew; error terminal visible y sin cruce de cuentas | M-05, backend disponible | Pendiente |
| Binarios | Imagen/PDF Android→Admin descarga exactamente mismos bytes; período/lugar/tipo reales; límites/atomicidad/storage caído sin éxito falso | M-06, A-05, B-01/B-03 | Pendiente |
| Contingencia | Carga con lugar null conforme al transporte B-04 publicado, sin lugar ficticio; lectura/descarga Admin conserva contexto | M-06, A-05, B-04 | Pendiente |

No cerrar F-010 ni certificar integración integral hasta revisar los criterios aplicables con evidencia real; decisiones abiertas del contrato común permanecen abiertas. iOS y proveedores externos tienen validación separada del circuito local Android.
