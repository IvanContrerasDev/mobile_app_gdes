# Despacho preparado — reviewer mobile F-011

Repo: /home/ivcontreras/GdesProject/mobile_app_gdes
Rol: .agents/agents/reviewer.md
Task: docs/tasks/011-runtime-api.md
Plan: docs/tasks/011-runtime-api-plan.md

Revisá la implementación contra cada criterio del spec, docs/README.md, docs/05-servicios-datos-y-contratos.md, docs/07-convenciones-de-desarrollo.md, docs/08-configuracion-ejecucion.md, docs/09-verificacion-y-qa.md, docs/arquitectura/contratos-api.md y convenciones. Leé progress/implementer/current.md. Podés correr pruebas/build/checks, no escribir código ni despachar subagentes. Registrar veredicto/evidencia frescos en progress/reviewer/current.md y Review del task spec.

Distinguir defectos locales accionables de aceptación externa bloqueada: Android real, LAN/backend/catálogo y development build no se certifican por tests de mocks ni curl en PC. No aprobar integralmente criterios sin evidencia. Podés declarar parte portátil conforme y mantener cambios requeridos externos concretos para permitir al leader preparar tareas independientes. No editar estados/backlog/SYNCED/otros repos ni mutar Git. Comunicación por archivos. Devolver solo task_spec, veredicto, n_items, progress_file.

Atención contractual para review: el paquete M-01 del plan autorizado exige validación de base URL al arrancar. Verificar que la resolución diferida del cliente satisface el requisito o registrar corrección local concreta; no equiparar test de request rechazado con arranque validado. Probar configuración inválida/ausente sin permitir éxito mock en modo integrado.
