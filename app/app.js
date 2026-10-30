const state = {
  partidos: [],
  arbitros: [],
  jugadores: {},
  actas: []
};

const actasKey = 'liga-veteranos-valles-actas';

async function initApp() {
  try {
    const [partidosResponse, arbitrosResponse, jugadoresResponse] = await Promise.all([
      fetch('../data/partidos.json'),
      fetch('../data/arbitros.json'),
      fetch('../data/jugadores.json')
    ]);

    if (!partidosResponse.ok || !arbitrosResponse.ok || !jugadoresResponse.ok) {
      throw new Error('No se pudieron cargar los datos del partido.');
    }

    const partidosData = await partidosResponse.json();
    const arbitrosData = await arbitrosResponse.json();
    const jugadoresData = await jugadoresResponse.json();

    state.partidos = partidosData.partidos || [];
    state.arbitros = arbitrosData.arbitros || [];
    state.jugadores = buildJugadoresMap(jugadoresData.jugadores || []);
    state.actas = JSON.parse(localStorage.getItem(actasKey) || '[]');

    populateArbitros();
    populateJornadas();
    addIncidenciaRow();
    bindEvents();
    renderSavedActas();
  } catch (error) {
    console.error(error);
    alert('No se pudieron cargar los datos. Comprueba que la app se esté ejecutando desde un servidor local.');
  }
}

function buildJugadoresMap(jugadores) {
  const mapa = {};

  jugadores.forEach((jugador) => {
    const equipo = jugador.equipo;
    if (!mapa[equipo]) {
      mapa[equipo] = [];
    }

    mapa[equipo].push({
      dorsal: jugador.dorsal,
      nombre: jugador.nombre
    });
  });

  return mapa;
}

function populateArbitros() {
  const arbitroSelect = document.getElementById('arbitroSelect');
  arbitroSelect.innerHTML = '<option value="">Selecciona árbitro</option>';

  state.arbitros.forEach((arbitro) => {
    const option = document.createElement('option');
    option.value = arbitro.nombre;
    option.textContent = arbitro.nombre;
    arbitroSelect.appendChild(option);
  });
}

function populateJornadas() {
  const jornadaSelect = document.getElementById('jornadaSelect');
  jornadaSelect.innerHTML = '<option value="">Selecciona jornada</option>';

  const jornadas = [...new Set(state.partidos.map((partido) => partido.jornada))].sort((a, b) => a - b);

  jornadas.forEach((jornada) => {
    const option = document.createElement('option');
    option.value = String(jornada);
    option.textContent = `Jornada ${jornada}`;
    jornadaSelect.appendChild(option);
  });

  jornadaSelect.addEventListener('change', (event) => {
    const jornada = Number(event.target.value);
    populatePartidosByJornada(jornada);
  });
}

function populatePartidosByJornada(jornada) {
  const partidoSelect = document.getElementById('partidoSelect');
  partidoSelect.innerHTML = '<option value="">Selecciona partido</option>';

  const partidos = state.partidos.filter((partido) => partido.jornada === jornada);

  partidos.forEach((partido) => {
    const option = document.createElement('option');
    option.value = partido.id;
    option.textContent = `${partido.local} vs ${partido.visitante}`;
    partidoSelect.appendChild(option);
  });

  if (partidos.length > 0) {
    partidoSelect.value = partidos[0].id;
    cargarPartidoSeleccionado();
  }
}

function cargarPartidoSeleccionado() {
  const partidoId = document.getElementById('partidoSelect').value;
  const partido = state.partidos.find((item) => item.id === partidoId);

  if (!partido) {
    resetPartidoFields();
    return;
  }

  document.getElementById('localEquipo').textContent = partido.local;
  document.getElementById('visitanteEquipo').textContent = partido.visitante;
  document.getElementById('localLabel').textContent = partido.local;
  document.getElementById('visitanteLabel').textContent = partido.visitante;

  document.getElementById('fechaInput').value = partido.fecha;
  document.getElementById('horaInput').value = partido.hora;
  document.getElementById('campoInput').value = partido.campo || '';

  renderJugadores(partido.local, 'local');
  renderJugadores(partido.visitante, 'visitante');
}

function renderJugadores(equipo, tipo) {
  const container = document.getElementById(tipo === 'local' ? 'convocadosLocal' : 'convocadosVisitante');
  const jugadores = state.jugadores[equipo] || [];

  container.innerHTML = '';

  jugadores.forEach((jugador) => {
    const row = document.createElement('label');
    row.className = 'player-item';

    const input = document.createElement('input');
    input.type = 'checkbox';
    input.checked = true;
    input.name = `${tipo}-${jugador.dorsal}`;
    input.value = JSON.stringify({
      dorsal: jugador.dorsal,
      nombre: jugador.nombre
    });

    const dorsal = document.createElement('strong');
    dorsal.textContent = jugador.dorsal;

    const nombre = document.createElement('span');
    nombre.textContent = jugador.nombre;

    row.appendChild(input);
    row.appendChild(dorsal);
    row.appendChild(nombre);
    container.appendChild(row);
  });
}

function bindEvents() {
  document.getElementById('partidoSelect').addEventListener('change', cargarPartidoSeleccionado);
  document.getElementById('addIncidencia').addEventListener('click', addIncidenciaRow);
  document.getElementById('guardarActa').addEventListener('click', guardarActa);
}

function addIncidenciaRow() {
  const container = document.getElementById('incidenciasContainer');
  const row = document.createElement('div');
  row.className = 'incidencia-row';

  row.innerHTML = `
    <input type="number" min="0" max="120" placeholder="Min." aria-label="Minuto" />
    <select aria-label="Tipo de incidencia">
      <option value="gol">Gol</option>
      <option value="amarilla">Amarilla</option>
      <option value="roja">Roja</option>
      <option value="cambio">Cambio</option>
      <option value="lesion">Lesión</option>
      <option value="otra">Otra</option>
    </select>
    <select aria-label="Equipo">
      <option value="local">Local</option>
      <option value="visitante">Visitante</option>
    </select>
    <input type="text" placeholder="Jugador" aria-label="Jugador" />
    <input type="text" placeholder="Detalle" aria-label="Detalle" />
    <button type="button" class="remove-btn">Eliminar</button>
  `;

  const removeBtn = row.querySelector('.remove-btn');
  removeBtn.addEventListener('click', () => row.remove());

  container.appendChild(row);
}

function obtenerJugadoresMarcados(tipo) {
  const selector = tipo === 'local' ? '#convocadosLocal input:checked' : '#convocadosVisitante input:checked';
  return [...document.querySelectorAll(selector)].map((input) => {
    const value = JSON.parse(input.value);
    return {
      dorsal: value.dorsal,
      nombre: value.nombre
    };
  });
}

function obtenerIncidencias() {
  return [...document.querySelectorAll('.incidencia-row')].map((row) => {
    const inputs = row.querySelectorAll('input, select');

    return {
      minuto: inputs[0].value,
      tipo: inputs[1].value,
      equipo: inputs[2].value,
      jugador: inputs[3].value,
      detalle: inputs[4].value
    };
  });
}

function guardarActa() {
  const partidoId = document.getElementById('partidoSelect').value;
  const partido = state.partidos.find((item) => item.id === partidoId);

  if (!partido) {
    alert('Primero selecciona un partido.');
    return;
  }

  const acta = {
    id: `${partido.id}-${Date.now()}`,
    jornada: partido.jornada,
    fecha: document.getElementById('fechaInput').value,
    hora: document.getElementById('horaInput').value,
    campo: document.getElementById('campoInput').value,
    arbitro: document.getElementById('arbitroSelect').value,
    partido: {
      id: partido.id,
      local: partido.local,
      visitante: partido.visitante,
      fecha: partido.fecha,
      hora: partido.hora,
      campo: partido.campo
    },
    resultado: {
      local: Number(document.getElementById('golesLocal').value || 0),
      visitante: Number(document.getElementById('golesVisitante').value || 0)
    },
    convocados: {
      local: obtenerJugadoresMarcados('local'),
      visitante: obtenerJugadoresMarcados('visitante')
    },
    incidencias: obtenerIncidencias(),
    observaciones: document.getElementById('observaciones').value.trim(),
    creadaEn: new Date().toISOString()
  };

  state.actas = [acta, ...state.actas];
  localStorage.setItem(actasKey, JSON.stringify(state.actas));
  renderSavedActas();
  alert('Acta guardada correctamente.');
}

function renderSavedActas() {
  const actasList = document.getElementById('actasGuardadas');
  actasList.innerHTML = '';

  if (!state.actas.length) {
    const empty = document.createElement('li');
    empty.textContent = 'Todavía no hay actas guardadas.';
    actasList.appendChild(empty);
    return;
  }

  state.actas.forEach((acta) => {
    const item = document.createElement('li');
    item.className = 'acta-item';

    const meta = document.createElement('div');
    meta.className = 'acta-meta';
    meta.innerHTML = `
      <strong>${acta.partido.local} ${acta.resultado.local} - ${acta.resultado.visitante} ${acta.partido.visitante}</strong>
      <span>Jornada ${acta.jornada} • ${acta.fecha || acta.partido.fecha}</span>
    `;

    const cargarBtn = document.createElement('button');
    cargarBtn.type = 'button';
    cargarBtn.textContent = 'Cargar';
    cargarBtn.addEventListener('click', () => cargarActaGuardada(acta));

    item.appendChild(meta);
    item.appendChild(cargarBtn);
    actasList.appendChild(item);
  });
}

function cargarActaGuardada(acta) {
  const partidoSelect = document.getElementById('partidoSelect');
  const partido = state.partidos.find((item) => item.id === acta.partido.id);

  if (!partido) return;

  partidoSelect.value = partido.id;
  cargarPartidoSeleccionado();

  document.getElementById('fechaInput').value = acta.fecha || partido.fecha;
  document.getElementById('horaInput').value = acta.hora || partido.hora;
  document.getElementById('campoInput').value = acta.campo || partido.campo || '';
  document.getElementById('arbitroSelect').value = acta.arbitro || '';
  document.getElementById('golesLocal').value = acta.resultado.local || 0;
  document.getElementById('golesVisitante').value = acta.resultado.visitante || 0;
  document.getElementById('observaciones').value = acta.observaciones || '';

  const localChecks = document.querySelectorAll('#convocadosLocal input');
  localChecks.forEach((checkbox) => {
    const value = JSON.parse(checkbox.value);
    checkbox.checked = !!(acta.convocados?.local || []).find(
      (player) => player.dorsal === value.dorsal && player.nombre === value.nombre
    );
  });

  const visitanteChecks = document.querySelectorAll('#convocadosVisitante input');
  visitanteChecks.forEach((checkbox) => {
    const value = JSON.parse(checkbox.value);
    checkbox.checked = !!(acta.convocados?.visitante || []).find(
      (player) => player.dorsal === value.dorsal && player.nombre === value.nombre
    );
  });

  const incidenciasContainer = document.getElementById('incidenciasContainer');
  incidenciasContainer.innerHTML = '';

  (acta.incidencias || []).forEach(() => addIncidenciaRow());

  const rows = [...document.querySelectorAll('.incidencia-row')];
  rows.forEach((row, index) => {
    const entry = acta.incidencias[index];
    if (!entry) return;

    const inputs = row.querySelectorAll('input, select');
    inputs[0].value = entry.minuto || '';
    inputs[1].value = entry.tipo || 'gol';
    inputs[2].value = entry.equipo || 'local';
    inputs[3].value = entry.jugador || '';
    inputs[4].value = entry.detalle || '';
  });
}

function resetPartidoFields() {
  document.getElementById('fechaInput').value = '';
  document.getElementById('horaInput').value = '';
  document.getElementById('campoInput').value = '';
  document.getElementById('golesLocal').value = 0;
  document.getElementById('golesVisitante').value = 0;
  document.getElementById('observaciones').value = '';
  document.getElementById('convocadosLocal').innerHTML = '';
  document.getElementById('convocadosVisitante').innerHTML = '';
}

initApp();
