# Plan F-014

Spec autorizado: `014-asistencia-online.md`. Sin mutaciones Git; UNA feature por implementer. Secuencia red-green-refactor para pruebas de comportamiento.

1. Types/workplace y servicios: DTO EMPLOYEE exacto sin paginación ni active ficticio; lista retornada ya es activa. Agregar profile y status; fixtures contractuales en tests. Inspeccionar nombre vs ID en Home (hoy selectedWorkplace guarda name) y migrar selección a UUID sin lookup ambiguo por nombre.
2. Unificar lugares Home/Documentos; M-06 completa los uploads. Parametrizar favoritos/usados/recientes por propietario y filtrar IDs no retornados al preseleccionar. Error persistencia revierte optimismo o informa fallo; nunca mezcla cuentas.
3. Registrar intención con clientRequestId durable antes POST, fingerprint de payload y propietario. Timeout/reinicio conserva ID para la misma intención, nueva intención no reutiliza ID; M-05 ampliará la cola. Tests reinicio tras ACK perdido y error al persistir.
4. Home usa GPS/errores y catálogo ausencia, POST campos exactos sin userId/clientSentAt online. Backend decide occurredAt online; status refresca después ACK y foreground. Precisión insuficiente aceptada como PENDING backend no se convierte en rechazo inventado. Sin representación franco acordada se mantiene bloqueo parcial, no mapping VACATION/LEAVE.
5. Perfil real, nullable mostrados sin datos inventados. Guards generation/cancel evitan renderizar cuenta anterior. Quitar logs de GPS/payload de módulos tocados.
6. Tests integración de servicios/Home/status/preferencias/IDs y typecheck. Smoke real Android lugar creado Admin→evento→matriz como aceptación externa; conservar pendiente hasta evidencia.
