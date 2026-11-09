# Despacho preparado — implementer-mobile F-012

Repo /home/ivcontreras/GdesProject/mobile_app_gdes. Rol .agents/agents/implementer-mobile.md. Task docs/tasks/012-sesion-real.md y plan 012-sesion-real-plan.md.

Activar únicamente después de review portátil F-011 sin defectos locales pendientes. Leer AGENTS.md/docs/README.md/skills locales, referencias del spec, httpClient y docs backend exactas indicadas por contrato. UNA feature M-02: login+OTP, identidad inglesa, SecureStore, refresh/logout/aislamiento; no implementar M-03/M-04 completo ni inventar endpoints/DTO. Si algún flujo mock todavía activo pudiera instalar sesión saltando OTP, impedir ese bypass aunque su migración completa sea F-013.

HTTP único disponible httpClient.request<T> → {status,data,pagination}, HttpError code/message/retryable/status. No transporte paralelo. Arranque exige URL válida tras F-011. Agregar dependencia expo-secure-store compatible con SDK, nunca tokens en AsyncStorage. Bootstrap puede verificar con recurso protegido publicado /profile, sin endpoint inventado de sesión mobile; validar forma/identidad y rol por contrato real, sin confiar en booleano local ni claims decodificados sin validación servidor. Par de tokens rotativo no debe restaurar refresh consumido tras error de persistencia.

Pruebas deterministas de operaciones asíncronas/single-flight/logout/epoch/cambio cuenta/timeout ambiguo; no certificar fixture/API/teléfono si no disponibles. Mantener evidencia offline ajena, no borrar cola heredada sin dueño. Quitar credenciales mock del flujo de sesión. Actualizar progress/implementer/current.md mientras trabaja y Registro del spec al entregar. Sin Git/SYNCED/otros repos/subagentes; devolver solo task_spec,progress_file,status done|blocked. Comunicación por archivos.
