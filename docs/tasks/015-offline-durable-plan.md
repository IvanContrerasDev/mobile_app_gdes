# Plan F-015

Spec autorizado: `015-offline-durable.md`. Sin mutaciones Git; UNA feature por implementer. Secuencia red-green-refactor para pruebas de comportamiento.

1. Definir esquema local versionado de cola con propietario, request original, estado pendiente/terminal y error visible. No es DTO nuevo de API. Legacy sin dueño se aísla sin borrarlo ni enviarlo. Lectura inválida conserva bytes/evidencia y bloquea escritura que los sobrescriba.
2. Repositorio serializa read-modify-write; pruebas de Promise.all altas/remociones y fallos lectura/escritura. Persistir antes de notificar pendiente; nunca retornar [] tras corrupción ni remover todos tras éxito parcial.
3. Sync single-flight por cuenta activa y proceso secuencial. clientSentAt generado por intento; id/occurredAt/GPS originales constantes. ACK real o replay permite remover; fallo al remover conserva posibilidad de replay seguro. Abort/epoch impide enviar pendientes del usuario anterior.
4. Clasificar 429/5xx/red para reintento acotado y errores terminales visibles; no inventar reglas temporales cliente ni convertir 403/422 en éxito. Logout conserva evidencia asociada; sin botón de descarte hasta acuerdo de retención.
5. Home/bootstrap/lifecycle subscriben reconexión y foreground con cleanup; estado pendiente separado de servidor, recuperar lista al reabrir.
6. Tests ACK perdido/restart/cola parcial/inserción concurrente/duplicado sync/cuenta distinta/corrupción/24h/skew; verificar fixture backend cuando disponible. Tests de cliente prueban clasificación, no sustituyen reloj/ventana de servidor. Docs 05/09 y handoff.
