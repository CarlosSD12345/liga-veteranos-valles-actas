const tabs = document.querySelectorAll('.tab');
const contentPane = document.getElementById('contentPane');

const localPlayers = [
  { number: 1, name: 'Miquel Serra', status: 'Titular' },
  { number: 7, name: 'Andreu Vidal', status: 'Titular' },
  { number: 10, name: 'Marc López', status: 'Suplent' },
  { number: 12, name: 'Joan Roca', status: 'Titular' },
  { number: 18, name: 'Pau Moreno', status: 'Suplent' }
];

const visitorPlayers = [
  { number: 2, name: 'Sergi Matas', status: 'Titular' },
  { number: 5, name: 'Arnau Cuesta', status: 'Titular' },
  { number: 9, name: 'Dídac Soler', status: 'Titular' },
  { number: 14, name: 'Jordi Pascual', status: 'Suplent' },
  { number: 21, name: 'Pau Llorens', status: 'Suplent' }
];

const infoTemplate = `
  <section class="match-header">
    <div class="match-header__meta">
      <span>JUVENIL SEGONA DIVISIÓ, GRUP 30 - Jornada 5</span>
      <span>Temporada: 2026-2027</span>
    </div>

    <div class="teams-row">
      <div class="team-box">
        <div class="team-crest"></div>
        <div class="team-name">Sant Pere Nord</div>
      </div>

      <div class="score-box">
        <span>31-10-2026</span>
        <strong>18:00</strong>
      </div>

      <div class="team-box">
        <div class="team-crest team-crest--visitant"></div>
        <div class="team-name">Òlimpic Can Fatjó</div>
      </div>
    </div>
  </section>

  <section class="card">
    <div class="field-grid">
      <div class="field">
        <label>Data</label>
        <input class="input" type="date" value="2026-10-31" />
      </div>

      <div class="field">
        <label>Hora</label>
        <div class="field-grid">
          <div class="field">
            <label>1a part</label>
            <input class="input" type="time" value="18:00" />
          </div>
          <div class="field">
            <label>2a part</label>
            <input class="input" type="time" value="18:00" />
          </div>
        </div>
      </div>
    </div>

    <div class="subheader">Suspès</div>
    <div class="toggle-wrap">
      <div class="toggle" aria-label="Suspès" aria-pressed="false">
        <span class="toggle-value">No</span>
      </div>
    </div>

    <div class="inline-row">
      <div class="result-label">Resultat provisional</div>
      <button class="result-plus" type="button" aria-label="Afegir resultat">＋</button>
    </div>

    <div class="info-list">
      <div class="info-row">
        <span class="label">Camp</span>
        <button class="icon-action" type="button" aria-label="Buscar camp">⌕</button>
      </div>
      <div class="info-row">
        <span class="label">CAMP DE FUTBOL MPAL. DE SANT PERE NORD</span>
      </div>
      <div class="info-row">
        <span class="label">Formular Inst. Espo...</span>
        <button class="icon-action" type="button" aria-label="Formulario">☰</button>
      </div>
    </div>
  </section>

  <section class="card">
    <div class="subheader">Àrbitres</div>
    <div class="field" style="margin-top: 8px;">
      <input class="input" type="text" value="SANCHEZ RODRIGUEZ, ORIOL" />
    </div>
    <div class="field" style="margin-top: 12px;">
      <input class="input" type="text" value="" placeholder="Nom de l'àrbitre" />
    </div>
  </section>
`;

function renderPlayers(players, title) {
  return `
    <section class="card">
      <div class="subheader">${title}</div>
      <div class="player-list">
        ${players
          .map(
            (player) => `
              <div class="player-row">
                <div class="player-number">${player.number}</div>
                <div class="player-name">${player.name}</div>
                <div class="player-badge player-badge--${player.status === 'Titular' ? 'titular' : 'suplent'}">
                  ${player.status}
                </div>
              </div>
            `
          )
          .join('')}
      </div>
    </section>
  `;
}

const altresTemplate = `
  <section class="card">
    <div class="subheader">Altres dades</div>
    <div class="small-cards">
      <div class="mini-card">
        <span class="mini-card__label">Targetes</span>
        <strong>3</strong>
      </div>
      <div class="mini-card">
        <span class="mini-card__label">Expulsions</span>
        <strong>1</strong>
      </div>
      <div class="mini-card">
        <span class="mini-card__label">Canvis</span>
        <strong>5</strong>
      </div>
      <div class="mini-card">
        <span class="mini-card__label">Observacions</span>
        <strong>2</strong>
      </div>
    </div>
  </section>
`;

function renderTab(tabName) {
  switch (tabName) {
    case 'informacio':
      contentPane.innerHTML = infoTemplate;
      break;
    case 'local':
      contentPane.innerHTML = renderPlayers(localPlayers, 'Local');
      break;
    case 'visitant':
      contentPane.innerHTML = renderPlayers(visitorPlayers, 'Visitant');
      break;
    case 'altres':
      contentPane.innerHTML = altresTemplate;
      break;
    default:
      contentPane.innerHTML = infoTemplate;
  }

  const toggle = document.querySelector('.toggle');
  if (toggle) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('is-on');
      const value = toggle.querySelector('.toggle-value');
      const isOn = toggle.classList.contains('is-on');
      value.textContent = isOn ? 'Sí' : 'No';
      toggle.setAttribute('aria-pressed', String(isOn));
    });
  }
}

tabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    tabs.forEach((item) => {
      const isActive = item === tab;
      item.classList.toggle('is-active', isActive);
      item.setAttribute('aria-selected', String(isActive));
    });
    renderTab(tab.dataset.tab);
  });
});

renderTab('informacio');
