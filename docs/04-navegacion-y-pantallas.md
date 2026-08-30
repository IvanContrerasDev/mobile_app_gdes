# Navegación y pantallas

## Modelo de navegación

No hay stack por archivos más allá de `app/index.tsx`. Cada navegador mantiene un `step` local (`useState`) y renderiza condicionalmente. No hay historial nativo ni parámetros de ruta; el botón atrás del sistema no navega entre pasos.

```mermaid
flowchart TD
 root[app/index.tsx] -->|no auth| auth[AuthNavigator]
 root -->|auth| app[AppNavigator]

 subgraph auth
  login --> register --> vcr[verifyCodeRegister] --> emailSent --> rs[registerSuccess] --> login
  login --> forgotPassword --> login
  login -->|Google| gs[googleSuccess] --> vcg[verifyCodeGoogle] -->|login store| app
 end

 subgraph app
  home --> homeSuccess --> home
  home <--> documentos
  home <--> perfil
  perfil -->|logout| auth
 end
```

## AuthNavigator (`navigation/AuthNavigator.tsx`)

Pasos: `login`, `register`, `verifyCodeRegister`, `emailSent`, `registerSuccess`, `googleSuccess`, `verifyCodeGoogle`, `forgotPassword`. `GoogleModal` se controla con estado propio. El login email/contraseña se resuelve dentro de `LoginScreen` (callback `onLogin` vacío) y el login Google inyecta un usuario fijo vía `completeGoogleAuth`.

## AppNavigator (`navigation/AppNavigator.tsx`)

Pasos: `home`, `homeSuccess`, `documentos`, `perfil`. `AppHeader` se muestra solo en home. `BottomTabs` se oculta en `homeSuccess`. `homeSuccess` usa `selectedAction` del store y resetea la marcación al continuar. Logout llama a `authStore.logout()`.

## Catálogo de pantallas

| Pantalla | Archivo | Rol | Estado |
|---|---|---|---|
| Login | `screens/LoginScreen.tsx` | Identificador + password, Google, links | Mock auth |
| Registro | `screens/RegisterScreen.tsx` | Alta con provincia y site modales | Parcial |
| Verificación OTP | `screens/VerifyCodeScreen.tsx` | Código WhatsApp | Mock |
| Recuperación | `screens/ForgotPasswordScreen.tsx` | Solicitud por email | Mock |
| Éxitos | `screens/SuccessScreens.tsx` | Confirmaciones temporizadas y correo | Mixto |
| Home | `screens/HomeScreen.tsx` | Marcación con GPS/red | Mock backend |
| Documentos | `screens/DocumentosScreen.tsx` | Planillas y contingencia | Mock upload |
| Perfil | `screens/PerfilScreen.tsx` | Datos fijos + logout | Mock datos |

## Catálogo de componentes

| Componente | Archivo | Función |
|---|---|---|
| AppHeader | `components/AppHeader.tsx` | Logo en home. |
| BottomTabs | `components/BottomTabs.tsx` | Tabs manuales; solo iconos. |
| GoogleModal | `components/GoogleModal.tsx` | Cuentas Google mock. |
| InputWithError | `components/InputWithError.tsx` | Campo con etiqueta y error. |
| OTPInput | `components/OTPInput.tsx` | Entrada de código. |
| Icons | `components/Icons.tsx` | Íconos SVG del sistema. |
| button / input-field / login-form / login-header / google-icon | `components/*` | Piezas de formulario. Verificar uso real antes de reutilizar. |

`SuccessScreens.LoginSuccessScreen` y `ForgotSuccessScreen` están definidas pero no referenciadas por los navegadores. `components/login-form.tsx`, `login-header.tsx`, `input-field.tsx`, `button.tsx` y `google-icon.tsx` conviven con la versión activa `InputWithError`/`Icons`; confirmar cuál se usa antes de editar.

## Estados transversales

- **Carga**: spinners e `ActivityIndicator` con mensajes de fase en Home.
- **Error**: cuadros rojos inline y, en lugares, botón Reintentar.
- **Éxito**: pantallas dedicadas con auto-avance temporizado.
- **Permisos**: cámara, galería y ubicación se solicitan en el momento de uso.
