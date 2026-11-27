(() => {
  'use strict';
  const el = id => document.getElementById(id);
  const run = () => {
    const p = Number(el('dephasing').value);
    const points = Quantum.unravelings(p);
    const path = key => points.map((v, i) => `${i ? 'L' : 'M'}${45 + 29.5 * i},${220 - 180 * v[key]}`).join(' ');
    const grid = [0,.5,1].map(y => `<line x1="45" x2="635" y1="${220-180*y}" y2="${220-180*y}" stroke="#ffffff18"/><text x="8" y="${225-180*y}">${y}</text>`).join('');
    el('ensembleChart').innerHTML = `<g fill="#a4b5b0" font-size="12" font-family="sans-serif">${grid}<text x="45" y="18">S₂ médio / bits</text><text x="45" y="247">0</text><text x="585" y="247">20 ciclos</text></g><path d="${path('kick')}" stroke="#d7bd83" fill="none" stroke-width="3"/><path d="${path('measurement')}" stroke="#afe1ca" fill="none" stroke-width="3"/>`;
    const last = points.at(-1);
    el('ensembleResult').textContent = `Após 20 ciclos: S₂ projetivo ${last.measurement.toFixed(3)} bits (esperança ${last.expected.toFixed(3)}); pulsos Z ${last.kick.toFixed(3)} bits. Distância entre médias amostradas: ${last.distance.toFixed(3)}.`;
  };
  el('dephasing').oninput = e => el('dephasingValue').textContent = Number(e.target.value).toFixed(2);
  el('runExperiment').onclick = run;
  el('experimentButton').onclick = () => { el('experimentDialog').showModal(); run(); };
})();
