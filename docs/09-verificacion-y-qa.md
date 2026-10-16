# Verificación y QA

## Estado de automatización

Existe `utils/registration.test.cjs` con `node:test`, aserciones Node y transpilación TypeScript para fecha, confirmación de password, formulario, `InputWithError` y geometría simulada de teclado Android/iOS. No hay scripts `test`, `lint` ni `typecheck`, ni configuración ESLint; TypeScript está en strict.

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
node node_modules/typescript/bin/tsc --noEmit
node utils/registration.test.cjs
```

### Resultado del relevamiento

La comprobación actual con dependencias ya instaladas da `tsc --noEmit` exitoso (exit 0). `node utils/registration.test.cjs` ejecuta **7 tests: 3 pasan y 4 fallan** (exit 1). En geometría Android/iOS se espera `bottomOverlap=296` pero resulta `320` (`registration.test.cjs:103`); el hook usa `keyboardTop * 0.95`. En formulario Android/iOS se espera altura de domicilio `144` pero el componente define `90` (`registration.test.cjs:194`, `RegisterScreen.tsx`). No modificar expectativas ni código sin resolver la intención de UI con el leader.

La instalación limpia no se ejecutó: el lockfile actual contiene `react-dom@19.3.0` que exige `react@^19.3.0`, mientras el proyecto y lock fijan `react@19.2.3`. Es una divergencia estática por resolver; no presentar un fallo antiguo de `npm ci` como prueba de las versiones actuales.

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
