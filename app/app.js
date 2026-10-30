const actasKey = 'liga-veteranos-valles-actas';

const partidos = [
  {
    id: 'j1-p1',
    jornada: 1,
    local: 'U.E. Sabadellenca',
    visitante: 'A.V. L\'Ametlla del Vallés',
    campo: 'Mpal Sabadell',
    fecha: '2026-10-18',
    hora: '08:15'
  },
  {
    id: 'j1-p2',
    jornada: 1,
    local: 'C.E. Santa Eulàlia de Ronçana',
    visitante: 'Penya Decano',
    campo: 'Mpal Santa Eulàlia',
    fecha: '2026-10-18',
    hora: '09:00'
  },
  {
    id: 'j2-p1',
    jornada: 2,
    local: 'U.E. Castellar',
    visitante: 'U.E. Sabadellenca',
    campo: 'Mpal Castellar',
    fecha: '2026-10-25',
    hora: '08:00'
  }
];

const arbitros = [
  { nombre: 'Duran' },
  { nombre: 'Molina' },
  { nombre: 'Puibert' },
  { nombre: 'Fabregas' },
  { nombre: 'Salva' }
];

const jugadores = [
  { equipo: 'U.E. Sabadellenca', dorsal: 1, nombre: 'Uri' },
  { equipo: 'U.E. Sabadellenca', dorsal: 2, nombre: 'Abel' },
  { equipo: 'U.E. Sabadellenca', dorsal: 3, nombre: 'Dídac' },
  { equipo: 'U.E. Sabadellenca', dorsal: 7, nombre: 'Xavi' },
  { equipo: 'U.E. Sabadellenca', dorsal: 9, nombre: 'Pau' },

  { equipo: 'A.V. L\'Ametlla del Vallés', dorsal: 7, nombre: 'Torito' },
  { equipo: 'A.V. L\'Ametlla del Vallés', dorsal: 9, nombre: 'Kaña' },
  { equipo: 'A.V. L\'Ametlla del Vallés', dorsal: 10, nombre: 'Javi' },
  { equipo: 'A.V. L\'Ametlla del Vallés', dorsal: 11, nombre: 'Miki' },

  { equipo: 'C.E. Santa Eulàlia de Ronçana', dorsal: 1, nombre: 'Borja' },
  { equipo: 'C.E. Santa Eulàlia de Ronçana', dorsal: 7, nombre: 'Dani' },
  { equipo: 'C.E. Santa Eulàlia de Ronçana', dorsal: 10, nombre: 'Miquel' },

  { equipo: 'Penya Decano', dorsal: 4, nombre: 'Sergio' },
  { equipo: 'Penya Decano', dorsal: 8, nombre: 'Miki' },
  { equipo: 'Penya Decano', dorsal: 9, nombre: 'Andreu' },

  { equipo: 'U.E. Castellar', dorsal: 1, nombre: 'Jaime' },
  { equipo: 'U.E. Castellar', dorsal: 7, nombre: 'Xavi' },
  { equipo: 'U.E. Castellar', dorsal: 9, nombre: 'Pepe' }
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

function renderPlayerRows(tipo, jugadoresEquipo) {
  const container = document.getElementById(tipo === 'local' ? 'convocadosLocal' : 'convocadosVisitante');
  container.innerHTML = '';

  const table = document.createElement('div');
  table.className = 'player-table';

  const thead = document.createElement('div');
  thead.className = 'player-table-head';
  thead.innerHTML = '<span>NIF</span><span>Dorsal</span><span>Nombre y apellidos</span><span>Titular</span>';
  table.appendChild(thead);

  const filas = jugadoresEquipo && jugadoresEquipo.length ? jugadoresEquipo : [
    { nif: '', dorsal: '', nombreCompleto: '', titular: true },
    { nif: '', dorsal: '', nombreCompleto: '', titular: false },
    { nif: '', dorsal: '', nombreCompleto: '', titular: true },
    { nif: '', dorsal: '', nombreCompleto: '', titular: false }
  ];

  filas.forEach((jugador) => {
    const row = document.createElement('div');
    row.className = 'player-row';

    const nifInput = document.createElement('input');
    nifInput.type = 'text';
    nifInput.value = jugador.nif || '';
    nifInput.placeholder = 'NIF';
    nifInput.setAttribute('aria-label', 'NIF del jugador');

    const dorsalInput = document.createElement('input');
    dorsalInput.type = 'number';
    dorsalInput.min = '1';
    dorsalInput.max = '99';
    dorsalInput.value = jugador.dorsal || '';
    dorsalInput.placeholder = 'Dorsal';
    dorsalInput.setAttribute('aria-label', 'Dorsal del jugador');

    const nombreInput = document.createElement('input');
    nombreInput.type = 'text';
    nombreInput.value = jugador.nombreCompleto || '';
    nombreInput.placeholder = 'Nombre y apellidos';
    nombreInput.setAttribute('aria-label', 'Nombre y apellidos del jugador');

    const titularWrap = document.createElement('label');
    titularWrap.className = 'titular-check';

    const titularInput = document.createElement('input');
    titularInput.type = 'checkbox';
    titularInput.checked = Boolean(jugador.titular);

    titularWrap.appendChild(titularInput);

    row.appendChild(nifInput);
    row.appendChild(dorsalInput);
    row.appendChild(nombreInput);
    row.appendChild(titularWrap);
    table.appendChild(row);
  });

  container.appendChild(table);
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
  document.getElementById('fechaInput').value = partido.fecha;
  document.getElementById('horaInput').value = partido.hora;
  document.getElementById('campoInput').value = partido.campo;

  const jugadoresLocal = (state.jugadores[partido.local] || []).map((jugador) => ({
    nif: '',
    dorsal: jugador.dorsal,
    nombreCompleto: jugador.nombre,
    titular: true
  }));

  const jugadoresVisitante = (state.jugadores[partido.visitante] || []).map((jugador) => ({
    nif: '',
    dorsal: jugador.dorsal,
    nombreCompleto: jugador.nombre,
    titular: true
  }));

  renderPlayerRows('local', jugadoresLocal);
  renderPlayerRows('visitante', jugadoresVisitante);
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

  const removeBtn = row.querySelector('.remove-btn');
  removeBtn.addEventListener('click', () => row.remove());

  container.appendChild(row);
}

function obtenerJugadoresMarcados(tipo) {
  const container = document.getElementById(tipo === 'local' ? 'convocadosLocal' : 'convocadosVisitante');
  const rows = container.querySelectorAll('.player-row');

  return [...rows].map((row) => {
    const inputs = row.querySelectorAll('input');
    const nif = inputs[0]?.value?.trim() || '';
    const dorsal = inputs[1]?.value?.trim() || '';
    const nombreCompleto = inputs[2]?.value?.trim() || '';
    const titular = inputs[3]?.checked || false;

    if (!nif && !dorsal && !nombreCompleto) return null;

    return {
      nif,
      dorsal,
      nombreCompleto,
      titular
    };
  }).filter(Boolean);
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
  const partido = state.partidos.find(
    (p) => p.local === acta.partido.local && p.visitante === acta.partido.visitante
  );

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

  const localContainer = document.getElementById('convocadosLocal');
  const localRows = localContainer.querySelectorAll('.player-row');
  const localData = acta.convocados?.local || [];

  localRows.forEach((row, index) => {
    const inputs = row.querySelectorAll('input');
    const entry = localData[index] || {};
    inputs[0].value = entry.nif || '';
    inputs[1].value = entry.dorsal || '';
    inputs[2].value = entry.nombreCompleto || '';
    inputs[3].checked = Boolean(entry.titular);
  });

  const visitanteContainer = document.getElementById('convocadosVisitante');
  const visitanteRows = visitanteContainer.querySelectorAll('.player-row');
  const visitanteData = acta.convocados?.visitante || [];

  visitanteRows.forEach((row, index) => {
    const inputs = row.querySelectorAll('input');
    const entry = visitanteData[index] || {};
    inputs[0].value = entry.nif || '';
    inputs[1].value = entry.dorsal || '';
    inputs[2].value = entry.nombreCompleto || '';
    inputs[3].checked = Boolean(entry.titular);
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

const localContainer = document.getElementById('convocadosLocal');
const visitanteContainer = document.getElementById('convocadosVisitante');

if (localContainer) renderPlayerRows('local', []);
if (visitanteContainer) renderPlayerRows('visitante', []);

const partidoSelect = document.getElementById('partidoSelect');
if (partidoSelect && partidoSelect.options.length > 0) {
  partidoSelect.value = partidoSelect.options[0].value;
  cargarPartidoSeleccionado();
}

window.addEventListener('load', () => {
  const selector = document.getElementById('jornadaSelect');
  if (selector && selector.options.length > 0) {
    selector.value = selector.options[0].value;
    populatePartidosByJornada(Number(selector.value));
  }
});

