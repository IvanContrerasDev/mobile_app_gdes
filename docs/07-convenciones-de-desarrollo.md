# Convenciones de desarrollo

Convenciones observadas en el código; úsalas para extender el proyecto de forma consistente.

## Estructura de carpetas

```
app/          Entrypoint expo-router (layout + index)
navigation/   Navegadores por estado (Auth/App)
screens/      Pantallas de negocio
components/   UI reutilizable
store/        useAppStore (marcación, en memoria)
stores/       authStore (sesión persistida)
services/     Acceso a datos/dispositivo (hoy mocks + locales)
types/        Contratos TypeScript
utils/        Validaciones y ordenamiento
constants/    Datos mock y catálogos
assets/       Imágenes
```

Nota: coexisten `store/` y `stores/`. Mantener el destino correcto: sesión en `stores/authStore`, marcación en `store/useAppStore`.

## Nomenclatura

- Componentes y pantallas en PascalCase con export nombrado (`export function HomeScreen`).
- Servicios en camelCase por dominio (`favoriteWorkplaceService`).
- Tipos/interfaces en PascalCase; acciones en literales string union.
- Claves de AsyncStorage en kebab-case (`favorite-workplaces`).
- Comentarios y textos de UI en español; parte del código y logs en inglés.

## Patrones de pantalla

- Estado local con `useState`; carga inicial con `useEffect`.
- Estados explícitos de carga, error y éxito por pantalla.
- Validar antes de invocar servicios; mostrar errores inline con `InputWithError`.
- Efectos secundarios (GPS, red, upload) siempre en handlers async con try/catch/finally.

## Estilos

- NativeWind con `className`; se usan valores de color hex directos además de tokens de `tailwind.config.js` (primary `#0D80AE`, success `#62882B`, warning `#ED701E`).
- Preferir flex y `gap`; no mezclar `gap` con margin/padding en el mismo contenedor.
- Escapar `<`, `>`, `{`, `}` y comillas en JSX mediante strings.

## Estado global

- `authStore` solo maneja sesión y expone `hydrated`; respetar `partialize`.
- `useAppStore` maneja la marcación en memoria; llamar `resetRegistration` tras completar.
- No introducir un tercer store sin unificar el modelo de usuario.

## Servicios

- Firma `async` que retorna una `Promise` tipada del contrato en `types/`.
- Simular latencia mientras sea mock; al integrar API conservar la firma pública.
- Servicios locales encapsulan AsyncStorage y degradan a valores neutros ante error.

## Extensión recomendada

- Nuevos endpoints: definir tipo en `types/`, servicio en `services/`, consumo en pantalla.
- Reutilizar `utils/validations.ts` en lugar de duplicar reglas.
- Al reemplazar mocks, mantener contratos y unificar catálogos de lugares.

## Convenciones React Native aplicables

Se cuenta con la guía `vercel-react-native-skills`. Prioridades al crecer: virtualizar listas grandes con FlashList, memoizar ítems, animar solo `transform`/`opacity`, preferir `Pressable`, `expo-image` para imágenes y navegadores nativos si se migra el ruteo.
