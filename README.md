# GdeS Mobile

App Expo/React Native para empleados. Autenticación, asistencia y cargas aún usan mocks; GPS, selección de archivos y persistencia local sí operan en el dispositivo.

Para ejecutar: `npm install` y `npx expo start`. Requisitos y limitaciones en [configuración](docs/08-configuracion-ejecucion.md); validación actual en [QA](docs/09-verificacion-y-qa.md).

La documentación empieza en [docs/README.md](docs/README.md). [Servicios e integración](docs/05-servicios-datos-y-contratos.md) distingue el código mock del diseño aprobado; los acuerdos entre apps viven en el [contrato común](docs/arquitectura/contratos-api.md).

Se aplica la [política documental común](docs/convenciones/flujo-de-trabajo.md): documentación por tema con decisión vigente y racional breve; código como evidencia del comportamiento real y requisitos aprobados pendientes expresamente identificados. No mantener historiales ni changelogs; propuestas temporales se eliminan tras consolidación y sincronización verificada; tasks e inbox solo mientras estén activos.
