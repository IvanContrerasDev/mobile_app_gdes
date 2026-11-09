# Estado actual — leader mobile

## F-017 — solicitud activa

Usuario solicita actualizar Expo Go/compatibilidad proyecto a SDK58. Task activo docs/tasks/017-expo-sdk-58.md, implementer asignado. Alcance: dependencias/lock, APIs mínimas, configuración y docs; sin mutaciones git. Revisión independiente pendiente. Se preserva la aceptación externa pendiente F-011/F-012 descrita abajo.

**Resultado F-012/M-02: conforme local por reviewer independiente; aceptación integral bloqueada únicamente por recursos externos.** Continuación humana limitada a M-02 cumplida hasta conformidad local; no se inician M-03–M-06 ni tareas Admin.

## Entrega vigente

- Login email/legajo MOBILE→challenge→OTP backend; identidad inglesa solo EMPLOYEE. Sesión mock invalidada, bootstrap /profile protegido y estado UI en memoria.
- Tokens/identidad en SecureStore, refresh JSON rotativo single-flight, invalidación durable y protección de respuestas/escrituras tardías. Logout limpia identidad/marcación; revocación no confirmada y fallos de borrado se muestran para reintentar.
- Preferencias y cola inactiva aisladas por propietario; legacy sin dueño preservada fuera de sync. Home valida generación y vida de pantalla en continuaciones: respuesta de A no altera estado, selección, observación, preferencias ni navegación de B ni de una nueva sesión A.
- Google falso no instala identidad. Alta/registro OTP/reset, dominios, perfil visible real, offline activo y binarios permanecen fuera de esta continuación.

## Revisión y evidencia

Veredicto en progress/reviewer/current.md y Review de docs/tasks/012-sesion-real.md: 0 defectos locales, 1 pendiente externo. Reviewer ejecutó npm test (10 archivos, 0 fallos), TypeScript exit 0, homeAccountIsolation 15/15, git diff --check exit 0 y export Android exit 0 (bundle Hermes 1773 módulos, sin APK/runtime físico). Implementer documenta 75 casos directos y prebuild/reglas SecureStore en el spec y progress/implementer/current.md.

Docs canónicos consolidados: README y docs 01–11, especialmente docs 06/09, más AGENTS local. Sin producto escrito por leader, mutaciones Git, skills nuevas ni ediciones SYNCED/otros repos.

## Backlog y artefactos

F-012 pending con review_status approved_local_integral_blocked; spec/plan retenidos solo por aceptación externa. F-011 permanece pending con conformidad portátil y bloqueos Android previos. F-010 pending como agregador. F-013–F-016 pending, sin iniciar; no hay feature in_progress. Inbox general de integración se conserva por pendientes del alcance amplio; instrucción de continuación exclusiva incorporada y retirada. Feedback local resuelto retirado.

## Único siguiente paso de M-02

Aportar .env/API LAN real (EXPO_PUBLIC_API_BASE_URL), fixture autorizado B-03/OTP log, SDK/JDK/adb y teléfono/development build con SecureStore recompilado. Ejecutar matriz Q-01/Sesión en docs 09: email/legajo/rol/estado→OTP, reinicio/Keystore, expiración/dos 401, refresh ambiguo, logout/revocación DB y cambio de cuenta. Sin estos recursos no se certifican API/WhatsApp/Keystore/Android con Node/VM/export. SDK /home/ivcontreras/Android/Sdk ausente y adb fuera de PATH comprobados por reviewer; no .env/API env ni fixture/teléfono suministrados.

Límite de persistencia explícito: si ambos almacenamientos rechazan toda escritura/borrado no puede garantizarse cierre durable; se informa error/reintento. La marca no sensible evita restauración cuando falla el borrado nativo.
