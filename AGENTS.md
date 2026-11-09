# GdeS Mobile — contexto para agentes

App Expo/React Native para empleados: autenticación, registro de entrada/salida/ausencia con geolocalización, carga de planillas y documentos, perfil. Login email/legajo y OTP consumen la API; sesión/refresh usan SecureStore y validación servidor, con aceptación API/Android aún pendiente. Lugares, marcaciones, alta/recuperación y cargas siguen mock. Preferencias AsyncStorage se aíslan por cuenta; Google muestra no configurado sin instalar identidad falsa.

## Fuente de verdad

`docs/` de este repo (leer `docs/README.md` primero — tiene ruta de lectura y la leyenda Implementado/Mock/Parcial/Inactivo/Pendiente). El código es la fuente de verdad última; estas docs describen el estado relevado.

## Stack

Expo ~57 + expo-router, React 19.2, RN 0.86 (New Architecture), NativeWind 4 + Tailwind 3, Zustand 4, TypeScript estricto (alias `@/*`).

## Reglas

- Este repo es parte del sistema GdeS; los contratos entre apps viven en `docs/arquitectura/contratos-api.md` (SYNCED, manda sobre supuestos locales).
- Las skills específicas de este stack están en `.agents/skills/` — leerlas antes de implementar. Las skills del plugin superpowers se rigen por `docs/convenciones/superpowers.md` (las apagadas tienen stub en `.agents/skills/`).
- Este repo es autocontenido: tiene su propio `leader` (`kimi --agent leader`), `reviewer` e `implementer-mobile` en `.agents/agents/`, su backlog en `feature_list.json` y su estado en `progress/`.
- Los archivos marcados `SYNCED-FROM-TEMPLATE` son de solo lectura: los cambios se proponen en `docs/changes_proposals/` y los propaga el orchestrator de GdesProject.
- Auth/sesión consumen backend; los dominios restantes siguen mock. Disponibilidad real y brechas en `docs/05-servicios-datos-y-contratos.md`; no equiparar tests portátiles con prueba Android/API.
- Aplicar `docs/convenciones/flujo-de-trabajo.md`: docs por tema, decisión vigente y racional breve, código como evidencia real; requisitos aprobados pendientes identificados. Sin historiales/changelogs; propuestas temporales eliminadas tras consolidación y sync verificado; tasks e inbox solo activos.
