# F-017 — Compatibilidad Expo SDK 58

**Estado:** in_progress
**App(s):** mobile
**Creada:** 2026-11-08

Artefacto temporal: consolidar decisión y evidencia en docs oficiales al cerrar y retirar spec.

## Contexto

El usuario pide actualizar Expo Go a versión 58. Se actualiza el proyecto SDK 57 para compatibilidad SDK 58. La instalación de Expo Go en el teléfono depende de su tienda/dispositivo.

## Alcance

Dependencias y lockfile, ajustes mínimos por APIs incompatibles y configuración Expo, documentación técnica vigente. Preservar todos los cambios previos del checkout. No cambiar auth/producto/contratos, ni mutaciones git, ni archivos SYNCED.

## Referencias

- docs/README.md, docs/03-arquitectura-tecnica.md, docs/08-configuracion-ejecucion.md, docs/09-verificacion-y-qa.md
- docs/convenciones/superpowers.md, docs/convenciones/flujo-de-trabajo.md
- .agents/skills/react-native-skills/SKILL.md
- https://expo.dev/changelog/sdk-58
- https://docs.expo.dev/workflow/upgrading-expo-sdk-walkthrough/

## Criterios de aceptación

- [ ] Expo SDK 58 estable y dependencias alineadas con metadata oficial; lock reproducible sin force ni legacy-peer-deps.
- [ ] npm ci, npm test y npm run typecheck exitosos; expo install --check y expo-doctor revisados. Bloqueos externos deben registrarse con evidencia concreta.
- [ ] Configuración pública y export Android correctos; prebuild Android si procede al ser generado/ignorado, conservando permisos y cleartext solo debug.
- [ ] Docs canónicos reflejan versiones, prerrequisitos y límites: no confundir export con APK/prueba Android/Expo Go física.
- [ ] Preservación de cambios anteriores y sin modificaciones SYNCED ni contratos de negocio.

## Notas de implementación

Node actual 24.19.0. node_modules existente. android/ es generado e ignorado. Usar metadata de paquetes instalados para alinear versiones. Si falta acceso registry, solicitar escalación concreta con exec_command y reportar cualquier rechazo. No instalar skills externas ni hacer npm audit fix.

## Registro de implementación

Pendiente.

## Review

Pendiente.
