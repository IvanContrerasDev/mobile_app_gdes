# Reviewer — F-012/M-02

Task: docs/tasks/012-sesion-real.md. Veredicto: **cambios requeridos — únicamente aceptación externa pendiente**. Pendientes vigentes: **1 externo, 0 defectos locales**. **Parte portátil conforme**, sin aprobación integral ni cambios del backlog.

## Pendiente vigente

1. docs/09-verificacion-y-qa.md Q-01/Sesión: aportar API LAN/fixture B-03/OTP log y development build Android físico con SecureStore. Verificar login email/legajo y restricciones→OTP, reinicio/Keystore, expiración y refresh concurrente/ambiguo, logout/revocación DB y respuestas tardías/cambio de cuenta. No .env/API env, SDK ausente y adb fuera de PATH comprobados de nuevo; fixture/teléfono no suministrados. Preparación: docs 08/09, adb devices, npm run android:build -- --device y npm run start:dev con URL LAN. Son bloqueos externos, incluidos los heredados de F-011; no defectos nuevos de M-02.

## Evidencia independiente vigente

- npm test: exit 0, 10 archivos, 0 fallos.
- npm run typecheck: exit 0.
- git diff --check: exit 0.
- node services/homeAccountIsolation.test.cjs: 15/15, 0 fallos.
- CI=1 EXPO_NO_TELEMETRY=1 node node_modules/expo/bin/cli export --platform android --output-dir /tmp/gdes-mobile-review012-export --max-workers 2: exit 0, 1773 módulos/bundle Hermes. No APK ni ejecución nativa.

Home comprobado con generación por objeto y vida de pantalla; validación tras awaits y antes de persistir/publicar/navegar/limpiar estado, también catch/finally. Regresión reproduce consumidor/store/scope/preferencias reales con red/nativos controlados, A→B/A→logout→A antes del cleanup React y unmount independiente, carga/favorito tardíos y control positivo. No se observó contaminación de B. Escrituras ya iniciadas conservan dueño original; no se promete cancelarlas. docs/02 logout y docs04/06/09/Registro/handoff concuerdan con código y límites. Criterios locales de sesión/contrato/persistencia/aislamiento conformes; detalle en Review.

Leader puede evaluar dependencias no bloqueadas con esta conformidad local; no certificar API/OTP/Keystore/teléfono por VM/export. Sin ediciones de producto, backlog, SYNCED ni otros repos; sin mutaciones Git ni subagentes. No se inicia otra feature.
