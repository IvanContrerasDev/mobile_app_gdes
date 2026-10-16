# Documentación integral — GdeS Mobile

> Documentación vigente contrastada con el código local. El código evidencia comportamiento real; el contrato común conserva los requisitos aprobados pendientes.

## Propósito

Este directorio concentra el contexto funcional y técnico necesario para trabajar sobre la aplicación sin releer todo el repositorio. Describe el comportamiento observable actual y separa expresamente los mocks, implementaciones parciales, código no conectado y visión objetivo.

## Leyenda

| Estado | Significado |
|---|---|
| Implementado | Ejecutable desde la UI y conectado a su implementación actual. |
| Mock | Ejecutable, pero simula backend, identidad o datos. |
| Parcial | Existe una parte del flujo, pero faltan validaciones, persistencia o integración. |
| Inactivo | Existe código, pero ningún flujo activo lo invoca. |
| Pendiente | Requisito aprobado aún no implementado; recomendaciones se identifican por separado. |

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

GdeS Mobile es una aplicación Expo/React Native para empleados que permite autenticarse, registrar entrada/salida/ausencia con geolocalización, cargar planillas y documentación, consultar un perfil y cerrar sesión. La experiencia está construida y navegable, pero no consume API real: autenticación, lugares, marcaciones, recuperación y cargas son mocks. El backend existente solo registra health e infraestructura común, sin endpoints de negocio (`backend_api_gdes/src/app.module.ts`). Solo sesión, favoritos y señales de relevancia se persisten localmente con AsyncStorage. Existe infraestructura de cola/sincronización offline, pero no está conectada al flujo de marcación.

## Organización vigente

Cada decisión se mantiene en su tema con racional breve conforme a [flujo de trabajo](convenciones/flujo-de-trabajo.md). [05](05-servicios-datos-y-contratos.md) concentra la brecha de integración y [10](10-deuda-tecnica-y-roadmap.md) sus pendientes. No guardar historiales ni changelogs; consolidar propuestas antes de retirarlas, con sync verificado; conservar tasks e inbox solo activos.

## Metodología y límites

Se inspeccionaron entrypoints, navegación, pantallas, componentes, stores, servicios, tipos, utilidades y configuración. Las afirmaciones incluyen rutas fuente. No se presupone API, base de datos, contratos externos ni reglas no presentes en código. Los assets binarios y archivos generados bajo `.expo/` no contienen lógica de negocio.
