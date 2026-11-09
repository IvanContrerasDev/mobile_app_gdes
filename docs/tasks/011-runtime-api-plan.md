# Plan F-011 — Runtime/API

Plan local sobre alcance autorizado; sin commits. Spec: 011-runtime-api.md.

1. Diagnóstico reproducible: revisar package/lock/peers y versiones oficiales Expo; correr suite actual/typecheck y registrar causa de fallas. Leer app.json y configuración de build antes de elegir dependencias compatibles. No instalar con peers forzados.
2. Transporte: crear services/httpClient.ts y configuración base (módulo pequeño separado si ayuda). Pruebas node:test en services/httpClient.test.cjs con fetch inyectado para URL, headers/body, envelope, 202/204, error/red/respuesta inválida, timeout y abort caller. Primero fallo observable, luego implementación mínima; no migrar auth en esta tarea.
3. Runtime: ajustar package.json/package-lock.json y scripts test/typecheck. Configurar .env.example, permisos/dev client/esquema y HTTP solo desarrollo con configuración Expo soportada. Añadir SecureStore compatible para M-02 si necesario. Verificar que configuración pública no contiene secretos.
4. Registro: resolver causas observadas sin maquillar tests. Geometría respeta 24 px de separación existente sin multiplicar coordenada por 0.95 ni compensar teclado dos veces; domicilio actual 90 px no implica requisito nuevo 144 px. Pruebas deben justificar semántica de visibilidad y foco. Si evidencia contradice esto, documentar bloqueo antes de rediseñar UX.
5. Verificación portátil: npm ci, npm test, npm run typecheck y configuración Expo/build local según toolchain presente. Documentar comandos exactos y salidas; fallos de entorno separados de defectos propios.
6. Android: build local instalable, teléfono en LAN, URL API con IP LAN, comprobar health sin prefijo publicado y catálogo autenticado solo cuando M-02 esté disponible; no confundir GET /catalogs público con GET /workplaces autenticado. Probar permisos/red caída/deep link. Si no existe dispositivo/SDK/API accesible, registrar criterio bloqueado y prerequisitos concretos.
7. Handoff en progress/implementer/current.md + Registro de implementación del spec; reviewer independiente verifica criterios uno por uno. Parte portátil aprobada permite preparar M-02, sin cerrar aceptación física pendiente.
