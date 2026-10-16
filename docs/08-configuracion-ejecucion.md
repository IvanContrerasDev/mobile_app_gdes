# Configuración y ejecución

## Requisitos

- Node.js LTS y npm (hay `package-lock.json`).
- Expo CLI vía `npx`.
- Dispositivo/emulador iOS o Android, o navegador para web.
- Para GPS, cámara y galería se requieren permisos del dispositivo.

## Scripts (`package.json`)

| Script | Comando | Uso |
|---|---|---|
| start | `expo start` | Servidor de desarrollo. |
| android | `expo start --android` | Abrir en Android. |
| ios | `expo start --ios` | Abrir en iOS. |
| web | `expo start --web` | Abrir en web (Metro). |

No hay scripts de test, lint ni typecheck definidos.

## Puesta en marcha

```bash
npm install
npx expo start
```

Luego elegir plataforma desde el panel de Expo. El README enlaza esta configuración.

## Configuración Expo (`app.json`)

- `name: gdes`, `slug: gdes-mobile`, `scheme: gdes`, orientación portrait, UI light.
- New Architecture habilitada; splash con fondo `#EDF2F5`.
- iOS `com.gdes.mobile` con soporte tablet; Android `com.gdes.mobile` con adaptive icon.
- Web con bundler Metro y salida estática.
- Plugins: `expo-router` y `expo-status-bar`.

**Permisos:** no se declaran cadenas de uso (`NSLocationWhenInUseUsageDescription`, cámara, etc.). En builds nativos de producción convendrá declararlas; en desarrollo los permisos se piden en runtime.

## TypeScript y build (`tsconfig.json`, `babel.config.js`, `metro.config.js`)

- Extiende `expo/tsconfig.base`, `strict: true`, alias `@/*`.
- Babel con `babel-preset-expo` (jsxImportSource nativewind) y `nativewind/babel`.
- Tailwind 3 con preset NativeWind y tokens de color propios; `global.css` importado en el layout.

## Variables de entorno

No hay referencias a `process.env`, `EXPO_PUBLIC_*` ni `NEXT_PUBLIC_*` en el código de aplicación. No existe configuración consumida de URL de API ni integración Supabase; los datos de negocio siguen simulados.

## Verificación rápida de arranque

1. `npm install` sin errores.
2. `npx expo start` levanta Metro.
3. La app abre en login (sin sesión previa).
4. Login mock con las credenciales de desarrollo lleva a Home.
5. Home solicita permiso de ubicación al marcar.

## Limitaciones de entorno

- Sin integración con API de negocio, los flujos “exitosos” son simulados.
- El lockfile contiene `react-dom@19.3.0` con peer `react@^19.3.0`, mientras React está fijado en `19.2.3`. La instalación limpia no está verificada; ver QA y deuda.
- GPS/cámara requieren dispositivo real o emulador con soporte; el navegador web limita estas capacidades.
