# Verificación y QA

## Estado de automatización

No existen tests, framework de testing, ESLint ni scripts `test`, `lint` o `typecheck`. TypeScript está en strict, por lo que puede verificarse con `npx tsc --noEmit` aunque no esté declarado como script.

## Smoke test

- [ ] Arranque muestra spinner solo durante rehidratación y luego login/home.
- [ ] Login inválido muestra error sin autenticar.
- [ ] Credenciales mock autentican y sobreviven reinicio.
- [ ] Logout confirmado vuelve al login; cancelar mantiene sesión.
- [ ] Tabs cambian entre Home, Documentos y Perfil.

## Matriz funcional

### Autenticación

- [ ] Vacío, email inválido, legajo alfanumérico y password débil muestran errores.
- [ ] Login por legajo se registra como defecto conocido: valida pero no autentica.
- [ ] Las tres cuentas Google siguen el mismo flujo mock.
- [ ] OTP rechaza menos/más de 6 dígitos y letras; acepta cualquier 6 dígitos.
- [ ] Registro bloquea cada campo inválido y no persiste datos.
- [ ] Recuperación sin red muestra error; online muestra confirmación mock.

### Marcación

- [ ] Lugares cargan y se pueden reintentar ante error.
- [ ] Sin lugar/acción se bloquea.
- [ ] Permiso GPS denegado y timeout muestran alternativa de planilla física.
- [ ] Sin Internet se rechaza y no crea cola offline.
- [ ] Entrada cambia indicador a “En horario laboral”; salida a “Fuera”.
- [ ] Ausencia no cambia `isWorking`.
- [ ] Éxito vuelve a Home a los 2 s y resetea selección/observación.
- [ ] Lugar reciente se preselecciona por franja; favoritos y usados ordenan correctamente.

### Documentos

- [ ] Cámara/galería denegadas muestran mensaje.
- [ ] Planilla requiere imagen; comprobar que hoy no exige lugar.
- [ ] Contingencia acepta PDF/JPG/JPEG/PNG/DOC/DOCX/TXT y avisa por inválidos.
- [ ] Archivos seleccionados pueden eliminarse.
- [ ] Sin Internet bloquea ambas cargas.
- [ ] Éxito mock limpia formulario y abre confirmación.
- [ ] Probar archivo grande/múltiples: registrar falta de límites como deuda.

### Perfil

- [ ] Confirmar que muestra Gina Tini independientemente del login (defecto conocido).
- [ ] Todos los campos son de solo lectura.

## Pruebas de persistencia

1. Marcar favorito, cerrar/reabrir: debe persistir.
2. Registrar en mañana y tarde: cada franja conserva su lugar.
3. Logout/reinicio: sesión debe permanecer cerrada.
4. `isWorking` se pierde al reiniciar (comportamiento actual).
5. Cola offline solo se prueba llamando servicios directamente; no tiene entrada UI.

## Verificaciones técnicas

```bash
npm ci
npx tsc --noEmit
```

### Resultado del relevamiento

La verificación fue intentada el 2026-08-30. `npm ci` no pudo resolver el árbol: `react-dom@19.2.8` exige `react@^19.2.8`, mientras el proyecto fija `react@19.2.0`. Como la instalación falló, TypeScript no quedó disponible y `tsc --noEmit` no pudo ejecutarse de forma válida. No se alteraron dependencias para forzar la instalación; esta incompatibilidad queda registrada como deuda.

Para evitar afirmar cobertura inexistente, no considerar un build exitoso equivalente a validación funcional. Probar al menos Android/iOS para permisos; web solo sirve para navegación y formularios básicos.

## Regresión mínima antes de merge

- [ ] TypeScript sin errores.
- [ ] Arranque Android/iOS.
- [ ] Login/logout.
- [ ] GPS autorizado y denegado.
- [ ] Marcación online y rechazo offline.
- [ ] Cámara/galería/document picker autorizados y denegados.
- [ ] Persistencia tras reinicio.
- [ ] No se agregaron logs con credenciales, archivos o coordenadas.

## Criterios futuros

Al integrar backend, añadir tests unitarios para validaciones/ranking, integración para servicios y E2E de auth/marcación/upload; cubrir expiración de sesión, duplicados, idempotencia, reintentos y sincronización parcial.
