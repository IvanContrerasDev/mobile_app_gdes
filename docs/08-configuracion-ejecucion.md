# Configuración y ejecución

## Runtime reproducible

Node >=22.13 (ver [matriz oficial Expo](https://docs.expo.dev/versions/latest/)), npm y lockfile. Expo 57.0.22, React y React DOM 19.2.3 y RN 0.86.3 están alineados con `expo/bundledNativeModules.json` y el [release SDK 57](https://expo.dev/changelog/sdk-57). No usar `--force` ni `--legacy-peer-deps`. `expo-dev-client` y `expo-build-properties` usan el rango SDK 57; el lock fija su versión exacta.

```bash
npm ci
npm test
npm run typecheck
cp .env.example .env
```

Editar `.env`: `EXPO_PUBLIC_API_BASE_URL=http://<IP-LAN-PC>:3000/api/v1`. El teléfono usa la IP LAN de la PC, nunca localhost. EXPO_PUBLIC se incorpora al bundle y no admite secretos. Reiniciar Metro y la app al cambiarla. El render inicial comprueba la configuración antes de habilitar login/home: si falta, es inválida o usa HTTP en release, muestra “Configuración de API pendiente” con instrucciones sobre EXPO_PUBLIC_API_BASE_URL, `.env`, `/api/v1` y reinicio. Ni una sesión mock guardada omite ese bloqueo. La validación inicial es local y no consulta la API. Login/OTP/sesión consumen esa API; el resto de servicios de negocio sigue mock. URL válida no prueba disponibilidad de servidor.

## Scripts

| Script | Uso |
|---|---|
| `start` | Metro (`expo start`). |
| `start:dev` | Metro LAN para development client. |
| `android` / `ios` | Compilar/abrir localmente con `expo run:*`. |
| `android:build` | Compilar Android debug e instalar/abrir dispositivo seleccionado. |
| `web` | Metro web; no certifica funcionalidades nativas. |
| `test` | Suites Node de registro, transporte, sesión, UI y aislamiento. |
| `typecheck` | TypeScript strict, sin emitir archivos. |

SecureStore usa `expo-secure-store ~57.0.4`, alineado con la metadata SDK57 instalada. Plugin SecureStore habilita exclusión Android backup y no solicita Face ID. Recompilar el development build para incorporar el módulo nativo; pruebas Node/VM y Metro web no certifican Keychain/Keystore.

## Development build Android local

Seguir [compilación local Expo](https://docs.expo.dev/guides/local-app-development/) y configurar Android Studio/SDK, JDK 17, `JAVA_HOME`, `ANDROID_HOME` y `platform-tools` en PATH. El template generado SDK 57 determina compile/target SDK y Gradle. Se necesita acceso de red para descargar template/dependencias/Gradle la primera vez, teléfono con depuración USB habilitada y autorizado en `adb devices`.

```bash
java -version
adb devices
npx expo prebuild --platform android --no-install
npm run android:build -- --device
```

Seleccionar el teléfono físico. Para compilar APK sin instalación desde el proyecto generado:

```bash
cd android
./gradlew :app:assembleDebug
adb install -r app/build/outputs/apk/debug/app-debug.apk
cd ..
npm run start:dev
```

No guardar `android/` ni `ios/`: son generados e ignorados. La instalación local usa `com.gdes.mobile`; esquema `gdes`. Para verificar el intent nativo:

```bash
adb shell am start -W -a android.intent.action.VIEW -d 'gdes://email-verified?success=true' com.gdes.mobile
```

Esto comprueba despacho al paquete; el flujo de magic link frío/caliente queda en M-03. Expo Go no verifica el esquema del development build.

## Transporte y permisos nativos

`app.json` configura plugins de ubicación foreground, image/document picker y dev client. Declara ubicación aproximada/precisa y cámara; ImagePicker aporta permisos de imágenes según Android y cadenas iOS en español, con micrófono deshabilitado. DocumentPicker usa el selector del sistema; no necesita permiso de acceso general a todos los archivos. Los servicios/pantallas siguen solicitando permisos runtime. Ver [permisos Expo](https://docs.expo.dev/guides/permissions/), [ImagePicker](https://docs.expo.dev/versions/latest/sdk/imagepicker/) y [Location](https://docs.expo.dev/versions/latest/sdk/location/).

`expo-build-properties` deja `usesCleartextTraffic=false` en el manifiesto principal; `plugins/withAndroidDevelopmentHttp.js` reserva el override HTTP para `src/debug/AndroidManifest.xml`. El template Expo tiene también variante `debugOptimized` de desarrollo. Release conserva el rechazo HTTP; `httpClient` exige HTTPS cuando `__DEV__` es falso. No se amplía la política productiva por el smoke LAN. Ver [BuildProperties](https://docs.expo.dev/versions/latest/sdk/build-properties/).

TypeScript extiende `expo/tsconfig.base`, con alias `@/*`; Babel/Metro mantienen NativeWind y Tailwind 3.

## Evidencia y bloqueos actuales

Instalación limpia del lock corregido y prebuild Android ejecutados el 2026-11-05. Prebuild generó permisos, esquema `gdes` y cleartext main=false/debug=true; advierte que falta `expo-system-ui` para aplicar `userInterfaceStyle` nativo. Esto no equivale a compilar un APK.

`CI=1 npm run android:build -- --no-bundler` falla: `Failed to resolve the Android SDK path ... /home/ivcontreras/Android/Sdk` y `Error: spawn adb ENOENT`. `java`, `adb` y `sdkmanager` no están en PATH. No hay APK, instalación ni prueba en teléfono; completar prerrequisitos y la matriz de [QA](09-verificacion-y-qa.md).
