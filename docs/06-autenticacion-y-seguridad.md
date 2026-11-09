# Autenticación y seguridad

> Implementación portátil M-02: login y OTP consumen API, identidad inglesa EMPLOYEE, tokens en SecureStore y validación de sesión contra servidor. La aceptación con API/fixture B-03 y Android físico sigue pendiente; pruebas Node/VM no certifican proveedores ni almacenamiento nativo real.

## Ciclo de sesión

`app/index.tsx` valida primero la URL y ejecuta `bootstrapSession` una vez configurada. `authStore` solo contiene estado de UI en memoria; no expone acción para instalar usuario ni rehidrata un booleano. Se elimina `gdes-auth-session` de AsyncStorage. La identidad es `{id,firstName,lastName,email,employeeId,role:'EMPLOYEE'}`.

1. Login envía identifier/password/client MOBILE por el cliente HTTP común. Email o legajo se envían sin imponer formato numérico ni política de alta a una contraseña existente. Challenge 202 no autentica.
2. Verify envía challengeId/code a OTP; solo un 200 con usuario EMPLOYEE y tokens válidos instala sesión. Errores de email, estado, rol, OTP vencido/incorrecto, límite y proveedor conservan mensaje/código HTTP; OTP inválido nunca dispara refresh. Reenvío usa el mismo challenge; UI aplica cooldown de 60 s y maneja OTP_RESEND_COOLDOWN.
3. Reinicio carga el par seguro y consulta GET /profile. El recurso protegido por JwtAuthGuard y Roles(EMPLOYEE) valida identidad/rol vigente; se contrasta id y forma de los campos ingleses. El perfil no devuelve role: no se exige un campo inventado ni se decodifica JWT como prueba de autenticación. Antes de esta verificación no se muestra navegación autenticada. Un fallo de bootstrap termina en login con error, sin spinner infinito.
4. `authenticatedRequest` es el punto de acceso a recursos protegidos para las siguientes migraciones. Dos 401 comparten una sola rotación JSON; respuestas 401 tardías usan el nuevo access sin otra rotación. Un GET se repite una vez tras renovar. Una mutación nunca se reenvía implícitamente: con 401 definitivo se renueva pero se devuelve SESSION_RETRY_REQUIRED; timeout/red ambiguos no se reintentan.
5. Logout limpia inmediatamente identidad y estado de marcación, aborta las solicitudes de la generación previa y revoca con el bearer previo si existe. No refresca para cerrar sesión. Fallo remoto se informa como revocación no confirmada; fallo de limpieza segura se informa y permite reintentar. Epoch y escritura serializada impiden que login/verify/bootstrap/refresh anteriores reinstalen sesión o borren una cuenta posterior.

## Persistencia y rotación

`tokenRepository` conserva versión, identidad y par access/refresh en un único JSON SecureStore (`gdes.secure-session.v1`), con WHEN_UNLOCKED_THIS_DEVICE_ONLY. `expo-secure-store ~57.0.4` coincide con metadata Expo57. No hay tokens en AsyncStorage ni logs de credenciales.

Antes de consumir un refresh se invalida durablemente el par anterior. Timeout, respuesta perdida, DTO malformado o guardado fallido exigen relogin, sin reutilizar refresh consumido. Las operaciones de storage están serializadas para que un logout quede detrás de un guardado ya iniciado.

AsyncStorage guarda únicamente una marca no sensible de invalidación (`gdes.secure-session.invalidated.v1`). Impide restaurar un par anterior si falla el borrado nativo tras logout o la persistencia de una rotación. La marca solo se retira después de guardar completamente un par nuevo. Fallos de ambos almacenamientos se reportan; no se promete persistencia cuando ambos rechazan escrituras. SecureStore debe validarse en el development build recompilado; web no certifica estas garantías nativas.

## Aislamiento de cuenta

La instalación y el cierre reemplazan el scope por user.id y reinician por completo `useAppStore`, incluyendo isWorking/selección/acción/observación. La navegación autenticada se monta con key de usuario para evitar conservar estado local de otra cuenta. Además, Home captura el objeto de generación y la vida de la pantalla al iniciar carga/registro/favorito: comprueba ambos después de cada await y antes de guardar preferencias, publicar estado, limpiar observación o navegar, incluidos catch/finally. La comparación por identidad de generación invalida también A→logout→A; no depende de que React ya haya desmontado la pantalla. Favoritos/usados/recientes usan namespace `gdes-account-v1:<ownerId>:<preferencia>`; las lecturas tardías se descartan y las escrituras conservan su propietario capturado. Keys legacy sin dueño permanecen intactas y no se adjudican a la cuenta siguiente.

La infraestructura offline aún inactiva separa entradas nuevas por propietario y marca ownerId. `offline-registers` legacy se conserva fuera del consumidor porque su dueño no puede verificarse. Sync exige mismo scope antes y después de cada operación; no procesa pendientes ajenos. DTO definitivo, IDs durables, semántica ACK perdido, terminales y activación de la cola pertenecen a M-05.

## Flujos pendientes

- Google muestra “no configurado”; el modal con cuentas falsas está inactivo y ningún camino instala sesión sin OTP. OAuth real corresponde a M-03.
- Registro y recuperación siguen mock y no instalan sesión. El OTP de registro sigue validación local hasta M-03; sus pantallas no prueban alta ni entrega real. No confundir ese flujo con OTP de login real.
- Perfil visible sigue mock; el GET /profile de bootstrap valida únicamente sesión. La pantalla y estado laboral servidor se integran en M-04.
- GPS/payloads de marcación mock mantienen logs previos pendientes de migración; esta tarea no agregó secretos ni coordenadas a logs.

Contratos HTTP y decisiones vigentes: [doc 05](05-servicios-datos-y-contratos.md) y [contrato común](arquitectura/contratos-api.md). Evidencia y aceptación externa: [QA](09-verificacion-y-qa.md).
