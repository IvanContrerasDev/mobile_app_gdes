# Plan F-012

Spec autorizado: `012-sesion-real.md`. Sin mutaciones Git; UNA feature por implementer. Secuencia red-green-refactor para pruebas de comportamiento.

1. Inspeccionar authService/authStore/AuthNavigator/LoginScreen/VerifyCodeScreen/app/index.tsx y DTO real backend (`auth.controller.ts`, DTOs publicados en docs/03). Reproducir sesión mock actual; tests nuevos no deben autenticar usando booleano AsyncStorage.
2. Types/session: Usar el cliente común createHttpClient/httpClient.request<T> → {status,data,pagination}; errores HttpError contienen code/message/retryable/status. No multiplicar transporte paralelo. Instalar SecureStore compatible según metadata Expo actual antes de token repository.

Types/session: identidad inglesa, challenge LOGIN, tokens/expiresIn exactos. Crear repositorio SecureStore y servicio/session coordinator testeables con dependencias inyectadas. Pruebas de guardado fallido, mock inválido y arranque antes de hidratar.
3. Bootstrap: GET /profile publicado está protegido con @Roles(EMPLOYEE) en backend src/modules/users/users.controller.ts; permite validar sesión/rol actual contra servidor sin inventar GET /auth/session mobile. El DTO profile no trae role; no exigir campo inexistente ni autenticar solo decodificando JWT.

Servicios: POST login {identifier,password,client:MOBILE}; OTP verify/resend; logout 204; refresh {refreshToken} devuelve {tokens}. Implementar single-flight y epoch de cuenta; abortar o descartar respuesta tardía. Pruebas dos 401/una rotación, timeout ambiguo/relogin sin reutilización, logout/relogin cruzados. No reintentar automáticamente mutation POST cuyo resultado es incierto.
4. UI: Login pasa challenge al OTP y solo verify instala sesión EMPLOYEE. Mensajes servidor/cooldown y botones recuperables; mocks de registro/Google no pueden instalar identidad porque evitaría el gate OTP. Su migración completa pertenece a F-013.
5. Limpiar estado de marcación/preferencias cargadas al cambiar cuenta sin borrar evidencia offline. Definir propietario estable para consumidor F-015. Preferencias legacy sin propietario no se adjudican automáticamente a nuevo usuario.
6. Correr suite/typecheck y smoke con fixture B-03 cuando API esté accesible; registrar faltantes concretos. Actualizar docs 06/09 y handoff. No certificar teléfono sin prueba real.
