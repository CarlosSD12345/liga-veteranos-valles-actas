const actasKey = 'liga-veteranos-valles-actas';

const partidos = [
  {
    id: "j1-p1",
    jornada: 1,
    local: "U.E. Sabadellenca",
    visitante: "A.V. L'Ametlla del Vallés",
    campo: "Mpal Sabadell",
    fecha: "2026-10-18",
    hora: "08:15"
  },
  {
    id: "j2-p1",
    jornada: 2,
    local: "U.E. Castellar",
    visitante: "U.E. Sabadellenca",
    campo: "Mpal Castellar",
    fecha: "2026-10-25",
    hora: "08:00"
  }
];

const arbitros = [
  { nombre: "Duran" },
  { nombre: "Molina" },
  { nombre: "Puibert" },
  { nombre: "Fabregas" },
  { nombre: "Salva" }
];

const jugadores = [
  { equipo: "U.E. Sabadellenca", dorsal: 1, nombre: "Uri" },
  { equipo: "U.E. Sabadellenca", dorsal: 2, nombre: "Abel" },
  { equipo: "U.E. Sabadellenca", dorsal: 3, nombre: "Dídac" },
  { equipo: "U.E. Sabadellenca", dorsal: 7, nombre: "Xavi" },

  { equipo: "A.V. L'Ametlla del Vallés", dorsal: 7, nombre: "Torito" },
  { equipo: "A.V. L'Ametlla del Vallés", dorsal: 9, nombre: "Kaña" },
  { equipo: "A.V. L'Ametlla del Vallés", dorsal: 10, nombre: "Javi" },

  { equipo: "U.E. Castellar", dorsal: 1, nombre: "Jaime" },
  { equipo: "U.E. Castellar", dorsal: 7, nombre: "Xavi" },
  { equipo: "U.E. Castellar", dorsal: 9, nombre: "Pepe" }
];

const state = {
  partidos,
  arbitros,
  jugadores: {},
  actas: JSON.parse(localStorage.getItem(actasKey) || '[]')
};

function buildJugadoresMap() {
  const mapa = {};
  jugadores.forEach((jugador) => {
    if (!mapa[jugador.equipo]) mapa[jugador.equipo] = [];
    mapa[jugador.equipo].push({
      dorsal: jugador.dorsal,
      nombre: jugador.nombre
    });
  });
  state.jugadores = mapa;
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

  const jornadas = [...new Set(state.partidos.map((p) => p.jornada))].sort((a, b) => a - b);

  jornadas.forEach((jornada) => {
    const option = document.createElement('option');
    option.value = String(jornada);
    option.textContent = `Jornada ${jornada}`;
    jornadaSelect.appendChild(option);
  });

  jornadaSelect.addEventListener('change', (event) => {
    const numero = Number(event.target.value);
    populatePartidosByJornada(numero);
  });
}

function populatePartidosByJornada(jornada) {
  const partidoSelect = document.getElementById('partidoSelect');
  partidoSelect.innerHTML = '<option value="">Selecciona partido</option>';

  const partidosJornada = state.partidos.filter((p) => p.jornada === jornada);

  partidosJornada.forEach((partido) => {
    const option = document.createElement('option');
    option.value = partido.id;
    option.textContent = `${partido.local} vs ${partido.visitante}`;
    partidoSelect.appendChild(option);
  });

  if (partidosJornada.length > 0) {
    partidoSelect.value = partidosJornada[0].id;
    cargarPartidoSeleccionado();
  }
}

function cargarPartidoSeleccionado() {
  const id = document.getElementById('partidoSelect').value;
  const partido = state.partidos.find((p) => p.id === id);

  if (!partido) return;

  document.getElementById('localEquipo').textContent = partido.local;
  document.getElementById('visitanteEquipo').textContent = partido.visitante;
  document.getElementById('localLabel').textContent = partido.local;
  document.getElementById('visitanteLabel').textContent = partido.visitante;

  document.getElementById('fechaInput').value = partido.fecha;
  document.getElementById('horaInput').value = partido.hora;
  document.getElementById('campoInput').value = partido.campo;

  renderJugadores(partido.local, 'local');
  renderJugadores(partido.visitante, 'visitante');
}

function renderJugadores(equipo, tipo) {
  const container = document.getElementById(tipo === 'local' ? 'convocadosLocal' : 'convocadosVisitante');
  container.innerHTML = '';

  const lista = state.jugadores[equipo] || [];

  lista.forEach((jugador) => {
    const row = document.createElement('label');
    row.className = 'player-item';

    const input = document.createElement('input');
    input.type = 'checkbox';
    input.checked = true;
    input.value = JSON.stringify({
      dorsal: jugador.dorsal,
      nombre: jugador.nombre
    });

    const dorsal = document.createElement('strong');
    dorsal.textContent = String(jugador.dorsal);

    const nombre = document.createElement('span');
    nombre.textContent = jugador.nombre;

    row.appendChild(input);
    row.appendChild(dorsal);
    row.appendChild(nombre);
    container.appendChild(row);
  });
}

function addIncidenciaRow() {
  const container = document.getElementById('incidenciasContainer');
  const row = document.createElement('div');
  row.className = 'incidencia-row';

  row.innerHTML = `
    <input type="number" min="0" max="120" placeholder="Min." />
    <select>
      <option value="gol">Gol</option>
      <option value="amarilla">Amarilla</option>
      <option value="roja">Roja</option>
      <option value="cambio">Cambio</option>
      <option value="lesion">Lesión</option>
      <option value="otra">Otra</option>
    </select>
    <select>
      <option value="local">Local</option>
      <option value="visitante">Visitante</option>
    </select>
    <input type="text" placeholder="Jugador" />
    <input type="text" placeholder="Detalle" />
    <button type="button" class="remove-btn">Eliminar</button>
  `;

  const remove = row.querySelector('.remove-btn');
  remove.addEventListener('click', () => row.remove());

  container.appendChild(row);
}

function obtenerJugadoresMarcados(tipo) {
  const selector = tipo === 'local' ? '#convocadosLocal input:checked' : '#convocadosVisitante input:checked';
  return [...document.querySelectorAll(selector)].map((input) => {
    const value = JSON.parse(input.value);
    return { dorsal: value.dorsal, nombre: value.nombre };
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
  const partido = state.partidos.find((p) => p.id === partidoId);

  if (!partido) {
    alert('Selecciona un partido');
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
      local: partido.local,
      visitante: partido.visitante
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
  alert('Acta guardada');
}

function renderSavedActas() {
  const list = document.getElementById('actasGuardadas');
  list.innerHTML = '';

  if (!state.actas.length) {
    list.innerHTML = '<li>Todavía no hay actas guardadas.</li>';
    return;
  }

  state.actas.forEach((acta) => {
    const li = document.createElement('li');
    li.className = 'acta-item';

    const meta = document.createElement('div');
    meta.className = 'acta-meta';
    meta.innerHTML = `
      <strong>${acta.partido.local} ${acta.resultado.local} - ${acta.resultado.visitante} ${acta.partido.visitante}</strong>
      <span>Jornada ${acta.jornada}</span>
    `;

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = 'Cargar';
    btn.addEventListener('click', () => cargarActaGuardada(acta));

    li.appendChild(meta);
    li.appendChild(btn);
    list.appendChild(li);
  });
}

function cargarActaGuardada(acta) {
  const partidoSelect = document.getElementById('partidoSelect');
  const partido = state.partidos.find((p) => p.local === acta.partido.local && p.visitante === acta.partido.visitante);

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
  localChecks.forEach((input) => {
    const val = JSON.parse(input.value);
    const encontrado = (acta.convocados?.local || []).some((p) => p.dorsal === val.dorsal && p.nombre === val.nombre);
    input.checked = encontrado;
  });

  const visitanteChecks = document.querySelectorAll('#convocadosVisitante input');
  visitanteChecks.forEach((input) => {
    const val = JSON.parse(input.value);
    const encontrado = (acta.convocados?.visitante || []).some((p) => p.dorsal === val.dorsal && p.nombre === val.nombre);
    input.checked = encontrado;
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

function bindEvents() {
  document.getElementById('partidoSelect').addEventListener('change', cargarPartidoSeleccionado);
  document.getElementById('addIncidencia').addEventListener('click', addIncidenciaRow);
  document.getElementById('guardarActa').addEventListener('click', guardarActa);
}

buildJugadoresMap();
populateArbitros();
populateJornadas();
bindEvents();
addIncidenciaRow();
renderSavedActas();
