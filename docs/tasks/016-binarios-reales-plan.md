# Plan F-016

Spec autorizado: `016-binarios-reales.md`. Sin mutaciones Git; UNA feature por implementer. Secuencia red-green-refactor para pruebas de comportamiento.

1. Inspeccionar DocumentosScreen y servicios/types actuales; SelectedFile.type actual es extensión, no MIME. Crear representación con URI/name/MIME/size reales desde picker/cámara; no derivar MIME ciegamente de un type legacy ambiguo. Unificar selector lugares M-04.
2. Servicios usan FormData nativo files repetidos, boundary automático sin header JSON. Planilla ordinaria workplaceId/month/year escalar; document type y lugar opcional exactos. Envelopes EMPLOYEE, sin created Admin. Tests capturan FormData mediante adaptador de prueba.
3. Mantener contingencia null confirmada; inspeccionar B-04 antes de enviar forma aún no publicada. Registrar discrepancia del DTO/modelo como bloqueo parcial sin asignar lugar ni mover silenciosamente a otro endpoint.
4. Validar 1–10 archivos/20MiB inclusive y extensiones; manejar cancelación/permiso/URI ilegible y conservar selección en errores. POST incierto no se repite por interceptor de refresh ni retry genérico; usuario recibe estado sin fingir éxito/fracaso definitivo. Semántica final de reintento perdido sigue G-01.
5. Si UI acepta múltiples meses, emitir por período con resultado individual y preservar períodos fallidos. Sin promesa de atomicidad entre requests.
6. Tests multipart/períodos/envelopes/límites/errores/sesión más typecheck. Android imagen/PDF→Admin descarga/hash bytes, storage caído/rechazo atómico como aceptación externa pendiente si falta entorno; docs 05/09 y handoff.
