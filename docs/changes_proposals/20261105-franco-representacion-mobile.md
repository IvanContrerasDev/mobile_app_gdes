# Pendiente común — representación técnica de franco

## Decisión vigente

Franco significa día o jornada libre sin obligación de prestar servicios. No equivale automáticamente a vacaciones, licencia o incumplimiento. Definición de negocio ratificada en docs/arquitectura/contratos-api.md, sin necesidad de consultarla otra vez.

## Brecha comprobada para M-04

Mobile screens/HomeScreen.tsx ofrece enfermedad/franco/otros. Backend prisma/schema.prisma enum AbsenceReason y src/modules/files/catalogs.controller.ts publican ILLNESS/VACATION/LEAVE/ART/OTHER; no hay valor específico publicado para franco. La API requiere enum válido. No se debe mapear franco a VACATION/LEAVE/OTHER ni mandarlo como string nuevo sin acordar transporte.

## Solicitud al orchestrator

Concretar y propagar en contrato común la representación wire de franco (valor/campo y semántica de registro/visualización), coordinando backend y Admin. No se propone aquí un DTO ni se ratifica un nuevo enum. Después los leaders locales podrán implementar su parte; mobile conserva este bloqueo parcial de M-04 y avanza auth, lugares/perfil y los eventos ya contratados.

## Cierre

Propuesta temporal: eliminar después de incorporar resolución al contrato canónico y verificar sync, actualizando referencias. No hay cambios de producto ni SYNCED desde mobile.
