# Liga Veteranos Vallès - Actas

Este repositorio nace para gestionar las actas de los partidos de la liga desde un formulario estructurado, sin depender de PDFs manuales.

Objetivo:
- Que el árbitro rellene la acta directamente en la web.
- Que la acta se guarde en JSON con estructura clara.
- Que esos datos sirvan para generar resumenes, clasificaciones, goleadores, tarjetas y expulsiones de forma automática.

Estructura del proyecto:
- `app/` : frontend con el formulario de acta
- `data/` : datos maestros y plantilla de actas
- `scripts/` : utilidades para validar y preparar datos
- `README.md` : documentación del proyecto

Modelo de acta recomendado:
```json
{
  "jornada": 6,
  "partido": {
    "id": "j6-p2",
    "local": "U.E. Canovelles",
    "visitante": "A.V. L'Ametlla del Vallés",
    "campo": "MPAL CANOVELLES",
    "fecha": "2026-10-25",
    "hora": "08:00"
  },
  "arbitro": "Duran",
  "resultado": {
    "golesLocal": 3,
    "golesVisitante": 1
  },
  "convocados": {
    "local": [
      { "dorsal": 1, "nombre": "Pepe" },
      { "dorsal": 7, "nombre": "Luis" }
    ],
    "visitante": [
      { "dorsal": 9, "nombre": "Kaña" }
    ]
  },
  "incidencias": [
    {
      "minuto": 22,
      "equipo": "local",
      "tipo": "gol",
      "jugador": "Pepe",
      "descripcion": "Gol de Pepe"
    }
  ],
  "amonestaciones": [
    {
      "minuto": 35,
      "equipo": "local",
      "jugador": "Luis",
      "tipo": "amarilla"
    }
  ],
  "expulsiones": [
    {
      "minuto": 68,
      "equipo": "visitante",
      "jugador": "X",
      "tipo": "roja directa"
    }
  ],
  "observaciones": "Partido disputado con normalidad."
}
```

Flujo ideal:
1. El árbitro elige jornada y partido.
2. Entra árbitro, fecha, resultado y convocados.
3. Añade incidencias, amarillas, rojas, cambios y observaciones.
4. Guarda el acta en JSON.
5. Ese JSON se usa para generar resúmenes, goleadores y resultados.

Siguientes pasos recomendados:
- Añadir autenticación básica para árbitros.
- Exportar a PDF con plantilla fija.
- Validar que el resultado y los datos no contradicen la acta.
- Vincular con la base de datos de la liga.

Status actual:
- Estructura base preparada.
- Plantilla de datos cargada.
- Formulario inicial de acta disponible.
