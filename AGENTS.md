# GdeS Mobile — contexto para agentes

App Expo/React Native para empleados: autenticación, registro de entrada/salida/ausencia con geolocalización, carga de planillas y documentos, perfil. Hoy TODO el backend es mock (auth, lugares, marcaciones, cargas); solo sesión, favoritos y señales de uso se persisten en AsyncStorage.

## Fuente de verdad

`docs/` de este repo (leer `docs/README.md` primero — tiene ruta de lectura y la leyenda Implementado/Mock/Parcial/Inactivo/Pendiente). El código es la fuente de verdad última; estas docs describen el estado relevado.

## Stack

Expo ~55 + expo-router, React 19.2, RN 0.83 (New Architecture), NativeWind 4 + Tailwind 3, Zustand 4, TypeScript estricto (alias `@/*`).

## Reglas

- Este repo es parte del sistema GdeS; la orquestación y los contratos entre apps viven en el repo raíz (`../docs/arquitectura/contratos-api.md`, que manda sobre supuestos locales).
- Las skills específicas de este stack están en `.agents/skills/` — leerlas antes de implementar.
- Quien trabaja acá es `implementer-mobile`, despachado por el leader del repo raíz. Documentar el trabajo en `../progress/mobile/current.md`.
- No hay backend real: los servicios simulan latencia para facilitar el reemplazo por API (`docs/05-servicios-datos-y-contratos.md`).
