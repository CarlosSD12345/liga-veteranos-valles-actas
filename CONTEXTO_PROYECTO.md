# Contexto del proyecto: Liga Veteranos Vallès - Actas

Este documento sirve como registro persistente del hilo del proyecto para que no se pierda el contexto entre conversaciones, decisiones y cambios.

## Objetivo

Crear una aplicación web para gestionar las actas de los partidos de la Liga Veteranos Vallès sin depender de formularios en PDF o de procesos manuales.

La idea es que el árbitro pueda rellenar la acta en una interfaz web y que la información quede guardada en un formato estructurado (JSON) que luego pueda reutilizarse para:

- resúmenes de partido
- clasificaciones
- goleadores
- tarjetas y expulsiones
- exportación a PDF o impresión
- validación de datos

## Alcance actual

El repositorio ya incluye una base funcional de prototipo:

- app/: interfaz de usuario para completar la acta
- data/: datos maestros y plantillas de ejemplo
- scripts/: utilidades de validación y preparación de datos
- README.md: documentación principal del proyecto

## Estructura actual del repo

- `app/` : frontend para formularios y pantallas de acta
- `data/` : jornadas, partidos, equipos, jugadores, árbitros y plantilla de acta
- `scripts/` : validación y semillas de datos
- `package.json` : scripts del proyecto

## Decisiones de diseño

1. El formato principal de la acta será JSON.
2. La web será un front-end ligero, sin depender de un backend complejo en esta primera fase.
3. El usuario principal es el árbitro o el responsable de completar la acta.
4. La validación debe comprobar que el resultado, los datos y las incidencias no sean inconsistentes.
5. El proyecto debe evolucionar hacia un flujo más completo con base de datos y exportación.

## Estado actual

- Estructura base creada.
- Plantilla de acta preparada.
- Formulario inicial disponible.
- Datos de ejemplo cargados.

## Próximos pasos recomendados

- consolidar el modelo definitivo de acta
- validar reglas de negocio (goles, expulsiones, cambios)
- preparar flujo de guardado/exportación
- añadir autenticación básica para árbitros o responsables
- vincular con una base de datos real
- exportar a PDF y resumir resultados

## Regla de trazabilidad

Cuando se tome una decisión importante del proyecto, debe quedar reflejada aquí o en el README para evitar perder el hilo de trabajo.

Este archivo es la referencia principal de contexto del proyecto.
