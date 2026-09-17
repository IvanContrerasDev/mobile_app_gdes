# GdeS Mobile — contexto para agentes

App Expo/React Native para empleados: autenticación, registro de entrada/salida/ausencia con geolocalización, carga de planillas y documentos, perfil. Hoy TODO el backend es mock (auth, lugares, marcaciones, cargas); solo sesión, favoritos y señales de uso se persisten en AsyncStorage.

## Fuente de verdad

`docs/` de este repo (leer `docs/README.md` primero — tiene ruta de lectura y la leyenda Implementado/Mock/Parcial/Inactivo/Pendiente). El código es la fuente de verdad última; estas docs describen el estado relevado.

## Stack

Expo ~57 + expo-router, React 19.2, RN 0.86 (New Architecture), NativeWind 4 + Tailwind 3, Zustand 4, TypeScript estricto (alias `@/*`).

## Reglas

- Este repo es parte del sistema GdeS; los contratos entre apps viven en `docs/arquitectura/contratos-api.md` (SYNCED, manda sobre supuestos locales).
- Las skills específicas de este stack están en `.agents/skills/` — leerlas antes de implementar. Las skills del plugin superpowers se rigen por `docs/convenciones/superpowers.md` (las apagadas tienen stub en `.agents/skills/`).
- Este repo es autocontenido: tiene su propio `leader` (`kimi --agent leader`), `reviewer` e `implementer-mobile` en `.agents/agents/`, su backlog en `feature_list.json` y su estado en `progress/`.
- Los archivos marcados `SYNCED-FROM-TEMPLATE` son de solo lectura: los cambios se proponen en `docs/changes_proposals/` y los propaga el orchestrator de GdesProject.
- No hay backend real: los servicios simulan latencia para facilitar el reemplazo por API (`docs/05-servicios-datos-y-contratos.md`).
