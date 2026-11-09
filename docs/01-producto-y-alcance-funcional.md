# Producto y alcance funcional

## Propósito observable

Aplicación móvil para que una persona empleada gestione registros de jornada y documentación operativa. El nombre visible es **GdeS**; paquete Expo `gdes-mobile` (`app.json`).

## Actor

- **Empleado autenticado**: único rol observable. Puede marcar jornada, adjuntar documentación, consultar perfil y cerrar sesión.
- Mobile admite solo EMPLOYEE validado por backend; no ofrece pantallas administrativas.

## Capacidades actuales

| Capacidad | Estado | Realidad del código |
|---|---|---|
| Login email/contraseña | Implementado portátil | POST login MOBILE→challenge→OTP backend; aceptación real pendiente. |
| Login por legajo | Implementado portátil | Envía identifier al backend sin comparación fija local. |
| Google login | Pendiente | Muestra no configurado; no instala identidad falsa. |
| Registro de cuenta | Parcial/mock | Valida formulario, pero no envía ni conserva datos. |
| OTP WhatsApp | Parcial | LOGIN verifica challenge backend; entrega/proveedor real pendiente. OTP de registro sigue mock. |
| Recuperación | Mock | Valida email/red y siempre responde éxito; no envía correo. |
| Persistencia de sesión | Implementado portátil | SecureStore, bootstrap servidor y refresh rotativo coordinado; Keystore/Android pendiente. |
| Entrada/salida/ausencia | Mock | Requiere GPS e Internet; respuesta siempre exitosa. |
| Estado laboral | Implementado en memoria | Entrada activa y salida desactiva; ausencia no lo cambia; se pierde al reiniciar. |
| Lugares | Mock | Tres lugares fijos. |
| Favoritos/relevancia | Implementado local | AsyncStorage con namespace por cuenta y ordenamiento local. |
| Marcación offline | Inactivo | Servicios existen, UI rechaza falta de Internet. |
| Carga de planilla | Mock | Selección/cámara real; envío simulado. |
| Documentación de contingencia | Mock | Selección/cámara real; envío simulado. |
| Perfil | Mock | Datos fijos distintos del usuario autenticado. |
| Logout | Implementado portátil | Limpieza inmediata, invalidación durable y revocación servidor con error/reintento visible; aceptación real pendiente. |

## Reglas de negocio codificadas

1. Una marcación requiere lugar, acción, ubicación actual de alta precisión e Internet (`HomeScreen.handleSubmit`).
2. Acciones permitidas: `entrada`, `salida`, `ausencia` (`store/useAppStore.ts`, `types/api.ts`).
3. Motivos de ausencia visibles: enfermedad, franco y otros; el motivo queda en estado local y **no integra el payload**.
4. El lugar reciente se guarda por franja: mañana 06:00–11:59; todo otro horario se considera tarde (`recentWorkplaceService.ts`).
5. Orden de lugares: reciente de franja, favoritos, usados, restantes (`workplaceSorting.ts`).
6. Planilla: al menos una imagen; el lugar se muestra pero no forma parte de `canUploadPlanilla`.
7. Contingencia: al menos un archivo; extensiones PDF/JPG/JPEG/PNG/DOC/DOCX/TXT; sin límite de tamaño/cantidad.
8. El formulario de registro aún mock conserva su validación local; login solo exige contraseña existente no vacía y deja validación al backend. Política aprobada de alta real pendiente en doc 06.
9. OTP LOGIN: seis dígitos enviados al backend con challenge; el formato local no autentica.

## Vocabulario

- **Marcación/registro**: evento de entrada, salida o ausencia.
- **Lugar de trabajo / workplace**: establecimiento asociado al evento.
- **Planilla**: una o más imágenes de una planilla física.
- **Documentación de contingencia**: archivos libres permitidos por extensión.
- **Franja**: mañana o tarde, usada para recordar lugar.
- **Sesión**: identidad inglesa EMPLOYEE y par de tokens SecureStore; authStore solo mantiene estado de UI en memoria.

## Fuera del alcance actual

Auth/sesión tienen integración portátil implementada, pendiente aceptación API/OTP/Android real. Google OAuth, alta/email/reset reales, dominios de negocio, multipart, perfil visible real y offline activo siguen pendientes; no se consideran cubiertos por la sesión.
