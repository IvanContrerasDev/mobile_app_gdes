# Documentación integral — GdeS Mobile

> Estado relevado del código en la rama `feature/update_harness`. El código es la fuente de verdad.

## Propósito

Este directorio concentra el contexto funcional y técnico necesario para trabajar sobre la aplicación sin releer todo el repositorio. Describe el comportamiento observable actual y separa expresamente los mocks, implementaciones parciales, código no conectado y visión objetivo.

## Leyenda

| Estado | Significado |
|---|---|
| Implementado | Ejecutable desde la UI y conectado a su implementación actual. |
| Mock | Ejecutable, pero simula backend, identidad o datos. |
| Parcial | Existe una parte del flujo, pero faltan validaciones, persistencia o integración. |
| Inactivo | Existe código, pero ningún flujo activo lo invoca. |
| Pendiente | Intención explícita en TODO/comentario o siguiente paso recomendado. |

## Ruta de lectura

1. [Producto y alcance funcional](01-producto-y-alcance-funcional.md)
2. [Flujos de usuario](02-flujos-de-usuario.md)
3. [Arquitectura técnica](03-arquitectura-tecnica.md)
4. [Navegación y pantallas](04-navegacion-y-pantallas.md)
5. [Servicios, datos y contratos](05-servicios-datos-y-contratos.md)
6. [Autenticación y seguridad](06-autenticacion-y-seguridad.md)
7. [Convenciones de desarrollo](07-convenciones-de-desarrollo.md)
8. [Configuración y ejecución](08-configuracion-ejecucion.md)
9. [Verificación y QA](09-verificacion-y-qa.md)
10. [Deuda técnica y roadmap](10-deuda-tecnica-y-roadmap.md)
11. [Mapa del codebase](11-mapa-del-codebase.md)

## Resumen ejecutivo

GdeS Mobile es una aplicación Expo/React Native para empleados que permite autenticarse, registrar entrada/salida/ausencia con geolocalización, cargar planillas y documentación, consultar un perfil y cerrar sesión. La experiencia está construida y navegable, pero no hay backend real: autenticación, lugares, marcaciones, recuperación y cargas son mocks. Solo sesión, favoritos y señales de relevancia se persisten localmente con AsyncStorage. Existe infraestructura de cola/sincronización offline, pero no está conectada al flujo de marcación.

## Metodología y límites

Se inspeccionaron entrypoints, navegación, pantallas, componentes, stores, servicios, tipos, utilidades y configuración. Las afirmaciones incluyen rutas fuente. No se presupone API, base de datos, contratos externos ni reglas no presentes en código. Los assets binarios y archivos generados bajo `.expo/` no contienen lógica de negocio.
