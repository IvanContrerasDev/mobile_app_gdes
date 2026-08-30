# Producto y alcance funcional

## Propósito observable

Aplicación móvil para que una persona empleada gestione registros de jornada y documentación operativa. El nombre visible es **GdeS**; paquete Expo `gdes-mobile` (`app.json`).

## Actor

- **Empleado autenticado**: único rol observable. Puede marcar jornada, adjuntar documentación, consultar perfil y cerrar sesión.
- No existen roles administrativos, supervisores ni autorización por permisos.

## Capacidades actuales

| Capacidad | Estado | Realidad del código |
|---|---|---|
| Login email/contraseña | Mock | Solo acepta credenciales fijas (`services/authService.ts`). |
| Login por legajo | Parcial | UI valida números, pero el servicio compara exclusivamente email. |
| Google login | Mock | Selector local; cualquier cuenta produce el mismo usuario Google. |
| Registro de cuenta | Parcial/mock | Valida formulario, pero no envía ni conserva datos. |
| OTP WhatsApp | Mock | Acepta cualquier código numérico de 6 dígitos; no se envía ni verifica. |
| Recuperación | Mock | Valida email/red y siempre responde éxito; no envía correo. |
| Persistencia de sesión | Implementado local | Zustand persist + AsyncStorage. |
| Entrada/salida/ausencia | Mock | Requiere GPS e Internet; respuesta siempre exitosa. |
| Estado laboral | Implementado en memoria | Entrada activa y salida desactiva; ausencia no lo cambia; se pierde al reiniciar. |
| Lugares | Mock | Tres lugares fijos. |
| Favoritos/relevancia | Implementado local | AsyncStorage y ordenamiento local. |
| Marcación offline | Inactivo | Servicios existen, UI rechaza falta de Internet. |
| Carga de planilla | Mock | Selección/cámara real; envío simulado. |
| Documentación de contingencia | Mock | Selección/cámara real; envío simulado. |
| Perfil | Mock | Datos fijos distintos del usuario autenticado. |
| Logout | Implementado local | Limpia usuario/sesión persistida. |

## Reglas de negocio codificadas

1. Una marcación requiere lugar, acción, ubicación actual de alta precisión e Internet (`HomeScreen.handleSubmit`).
2. Acciones permitidas: `entrada`, `salida`, `ausencia` (`store/useAppStore.ts`, `types/api.ts`).
3. Motivos de ausencia visibles: enfermedad, franco y otros; el motivo queda en estado local y **no integra el payload**.
4. El lugar reciente se guarda por franja: mañana 06:00–11:59; todo otro horario se considera tarde (`recentWorkplaceService.ts`).
5. Orden de lugares: reciente de franja, favoritos, usados, restantes (`workplaceSorting.ts`).
6. Planilla: al menos una imagen; el lugar se muestra pero no forma parte de `canUploadPlanilla`.
7. Contingencia: al menos un archivo; extensiones PDF/JPG/JPEG/PNG/DOC/DOCX/TXT; sin límite de tamaño/cantidad.
8. Password: mínimo 8, mayúscula, minúscula, número, símbolo y sin espacios.
9. OTP: exactamente seis dígitos.

## Vocabulario

- **Marcación/registro**: evento de entrada, salida o ausencia.
- **Lugar de trabajo / workplace**: establecimiento asociado al evento.
- **Planilla**: una o más imágenes de una planilla física.
- **Documentación de contingencia**: archivos libres permitidos por extensión.
- **Franja**: mañana o tarde, usada para recordar lugar.
- **Sesión**: `AuthUser` persistido localmente; no existe token.

## Fuera del alcance actual

Backend, base de datos, emisión/verificación de tokens, Google OAuth, WhatsApp, correo, upload multipart, asociación documental a usuario/lugar, edición de perfil, historial de marcaciones/documentos, sincronización activa y control de duplicados no están implementados.
