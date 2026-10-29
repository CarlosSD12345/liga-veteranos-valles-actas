const baseData = {
  jornadas: [],
  partidos: [],
  arbitros: []
};

const state = {
  selectedPartido: null
};

async function init() {
  const [jornadas, partidos, arbitros] = await Promise.all([
    fetch('../data/jornadas.json').then(r => r.json()),
    fetch('../data/partidos.json').then(r => r.json()),
    fetch('../data/arbitros.json').then(r => r.json())
  ]);

  baseData.jornadas = jornadas.jornadas;
  baseData.partidos = partidos.partidos;
  baseData.arbitros = arbitros.arbitros;

  populateJornadas();
  populateArbitros();
  bindEvents();
  populatePartidosByJornada();
  setDefaultFormValues();
}

function populateJornadas() {
  const select = document.getElementById('jornadaSelect');
  select.innerHTML = baseData.jornadas
    .map(j => `<option value="${j.id}">${j.nombre}</option>`)
    .join('');
}

function populateArbitros() {
  const select = document.getElementById('arbitroSelect');
  select.innerHTML = baseData.arbitros
    .map(a => `<option value="${a}">${a}</option>`)
    .join('');
}

function bindEvents() {
  document.getElementById('jornadaSelect').addEventListener('change', populatePartidosByJornada);
  document.getElementById('partidoSelect').addEventListener('change', onPartidoChange);
  document.getElementById('guardarActa').addEventListener('click', guardarActa);
  document.getElementById('addIncidencia').addEventListener('click', addIncidenciaField);
}

function populatePartidosByJornada() {
  const jornadaId = Number(document.getElementById('jornadaSelect').value);
  const partidos = baseData.partidos.filter(p => p.jornada === jornadaId);
  const partidoSelect = document.getElementById('partidoSelect');

  partidoSelect.innerHTML = partidos
    .map(p => `<option value="${p.id}">${p.local} vs ${p.visitante}</option>`)
    .join('');

  if (partidos.length) {
    state.selectedPartido = partidos[0];
    onPartidoChange();
  }
}

function onPartidoChange() {
  const partidoId = document.getElementById('partidoSelect').value;
  const partido = baseData.partidos.find(p => p.id === partidoId);
  if (!partido) return;

  state.selectedPartido = partido;
  document.getElementById('localEquipo').textContent = partido.local;
  document.getElementById('visitanteEquipo').textContent = partido.visitante;
  document.getElementById('campoInput').value = partido.campo || '';
  document.getElementById('fechaInput').value = partido.fecha || '';
  document.getElementById('horaInput').value = partido.hora || '';
}

function setDefaultFormValues() {
  const defaultPartido = baseData.partidos[0];
  if (!defaultPartido) return;

  document.getElementById('jornadaSelect').value = String(defaultPartido.jornada);
  document.getElementById('partidoSelect').value = defaultPartido.id;
  onPartidoChange();
}

function addIncidenciaField() {
  const container = document.getElementById('incidenciasContainer');
  const index = container.children.length;

  const block = document.createElement('div');
  block.className = 'incidencia-item';
  block.innerHTML = `
    <div class="row">
      <label>
        Minuto
        <input type="number" min="0" value="0" />
      </label>
      <label>
        Equipo
        <select>
          <option value="local">Local</option>
          <option value="visitante">Visitante</option>
        </select>
      </label>
      <label>
        Tipo
        <select>
          <option value="gol">Gol</option>
          <option value="amonestacion">Amonestación</option>
          <option value="expulsion">Expulsión</option>
          <option value="cambio">Cambio</option>
          <option value="otro">Otro</option>
        </select>
      </label>
      <label>
        Jugador
        <input type="text" placeholder="Nombre jugador" />
      </label>
      <label>
        Acción
        <button type="button" class="btn-remove" data-index="${index}">Eliminar</button>
      </label>
    </div>
    <label>
      Descripción
      <input type="text" placeholder="Detalles de la incidencia" />
    </label>
  `;

  const removeBtn = block.querySelector('.btn-remove');
  removeBtn.addEventListener('click', () => block.remove());

  container.appendChild(block);
}

function guardarActa() {
  const partido = state.selectedPartido || baseData.partidos[0];

  const acta = {
    jornada: Number(document.getElementById('jornadaSelect').value),
    partido: {
      id: partido.id,
      local: partido.local,
      visitante: partido.visitante,
      campo: document.getElementById('campoInput').value,
      fecha: document.getElementById('fechaInput').value,
      hora: document.getElementById('horaInput').value
    },
    arbitro: document.getElementById('arbitroSelect').value,
    resultado: {
      golesLocal: Number(document.getElementById('golesLocal').value || 0),
      golesVisitante: Number(document.getElementById('golesVisitante').value || 0)
    },
    convocados: {
      local: parseLista(document.getElementById('convocadosLocal').value),
      visitante: parseLista(document.getElementById('convocadosVisitante').value)
    },
    incidencias: buildIncidencias(),
    amonestaciones: buildIncidencias().filter(i => i.tipo === 'amonestacion'),
    expulsiones: buildIncidencias().filter(i => i.tipo === 'expulsion'),
    observaciones: document.getElementById('observaciones').value.trim()
  };

  const json = JSON.stringify(acta, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `acta-j${acta.jornada}-${partido.id}.json`;
  link.click();
  URL.revokeObjectURL(url);

  console.log(json);
}

function parseLista(value) {
  return (value || '')
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean)
    .map(line => {
      const match = line.match(/^\s*(\d+)\s*[-:]\s*(.+)$/);
      if (!match) {
        return { dorsal: null, nombre: line };
      }
      return { dorsal: Number(match[1]), nombre: match[2].trim() };
    });
}

function buildIncidencias() {
  const items = [...document.querySelectorAll('.incidencia-item')];
  return items.map(item => {
    const inputs = item.querySelectorAll('input, select');
    const values = [...inputs].map(input => input.value);

    return {
      minuto: Number(values[0] || 0),
      equipo: values[1],
      tipo: values[2],
      jugador: values[3],
      descripcion: values[4] || ''
    };
  })
  .filter(item => item.jugador || item.descripcion || item.minuto > 0);
}

init();
