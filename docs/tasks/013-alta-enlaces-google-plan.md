# Plan F-013

Spec autorizado: `013-alta-enlaces-google.md`. Sin mutaciones Git; UNA feature por implementer. Secuencia red-green-refactor para pruebas de comportamiento.

1. Revisar DTOs reales de registro/catálogos/Google y política password backend. Cubrir mapeo formulario→diez campos ingleses, fecha civil, siteId UUID sin usar etiqueta provincial como ID. Mantener confirmación de password solo cliente.
2. RegisterScreen entrega payload, authService crea challenge REGISTER y VerifyCodeScreen comparte OTP por propósito: 202 sin tokens muestra email pendiente y reenvío neutro. Tests distinguen REGISTER de LOGIN incluso con body inesperado.
3. Crear ruta app/email-verified.tsx y manejar link inicial/caliente mediante Expo Router/Linking soportado; success query solo informa verificación, login decide autenticación. Tests link frío/caliente y sesión previa ajena.
4. passwordRecoveryService hace POST neutro. UI conserva confirmación genérica; documentar URL Admin /password-reset LAN y smoke compartido requerido.
5. Quitar GoogleModal con cuentas falsas del flujo activo. Integrar AuthSession/PKCE con configuración pública de cliente compatible y canje idToken, phone requerido por API, OTP GOOGLE_LOGIN. No credenciales→estado explícito no configurado; cancelación y error no autentican. No inventar clientId/audience/redirect.
6. Tests/typecheck más correo real/magic link/reset/Google cuando existan proveedores; evidencia externa separada y bloqueos concretos. Actualizar docs 02/06/09; handoff.
