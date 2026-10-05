(() => {
'use strict';
const $ = (s, e = document) => e.querySelector(s);
const $$ = (s, e = document) => [...e.querySelectorAll(s)];
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const norm = (s) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
const byId = (id) => FILMES.find((f) => f.id === id);

/* ===== Camada de dados =====
   Hoje tudo fica no localStorage do navegador. Para ligar a um servidor (PHP/MySQL, etc.),
   troque apenas get/set por chamadas fetch(); o resto do código não muda. */
const db = {
  get(k, d) { try { const v = JSON.parse(localStorage.getItem('tm:' + k)); return v ?? d; } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem('tm:' + k, JSON.stringify(v)); } catch (e) { toast('Não foi possível salvar neste navegador.'); } },
};
let me = null, atual = null;
const st = { q: '', g: 'Todos', v: 'home' };
const ud = (k, d) => (me ? db.get(k, {})[me.email] ?? d : d);
const setUd = (k, v) => { const a = db.get(k, {}); a[me.email] = v; db.set(k, a); };

/* ===== Utilidades ===== */
let tt;
function toast(msg) {
  const t = $('#toast'); t.textContent = msg; t.classList.add('on');
  clearTimeout(tt); tt = setTimeout(() => t.classList.remove('on'), 2600);
}
async function hash(email, senha) {
  const s = 'tm|' + email + '|' + senha;
  if (window.crypto && crypto.subtle) {
    const b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s));
    return [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, '0')).join('');
  }
  let h = 5381; for (const c of s) h = ((h << 5) + h + c.charCodeAt(0)) | 0; return 'f' + h; // alternativa em contextos sem crypto
}
const poster = (f) => f.p || 'https://i.ytimg.com/vi/' + f.yt + '/hqdefault.jpg';
const stars = (n) => '★'.repeat(Math.round(n)) + '☆'.repeat(5 - Math.round(n));

/* ===== Conta ===== */
const PERGUNTAS = ['Qual o nome do seu primeiro pet?', 'Em que cidade você nasceu?', 'Qual era o seu apelido de infância?', 'Qual o nome da sua escola primária?'];
$('#perg').innerHTML = PERGUNTAS.map((p, i) => `<option value="${i}">${p}</option>`).join('');
const resp = (x) => norm((x || '').trim());

function topo() {
  $('#entrar').hidden = !!me; $('#userOn').hidden = !me;
  $('#uNome').textContent = me ? 'Olá, ' + me.nome.split(' ')[0] : '';
}
function painel(p) {
  const ids = { entrar: 'fEntrar', criar: 'fCriar', esqueci: 'fEsqueci' };
  Object.entries(ids).forEach(([k, v]) => { $('#' + v).hidden = k !== p; });
  $('#tabEntrar').setAttribute('aria-selected', p === 'entrar'); $('#tabCriar').setAttribute('aria-selected', p === 'criar');
  $('.abas').hidden = p === 'esqueci';
  $$('.erro').forEach((e) => { e.textContent = ''; });
  if (p === 'esqueci') { $('#passo1').hidden = false; $('#passo2').hidden = true; $('#fEsqueci button[type=submit]').textContent = 'Continuar'; }
}
function pedeLogin(msg, p) {
  $('#authMsg').textContent = msg || ''; painel(p || 'entrar');
  if (!$('#dAuth').open) $('#dAuth').showModal();
}
function entrar(email) {
  const u = db.get('users', {})[email]; if (!u) return;
  me = { email, nome: u.nome, plano: u.plano };
  db.set('sessao', email); $('#dAuth').close(); topo(); render();
  if ($('#dPlanos').open) planos();
  if (atual) info();
  toast('Bem-vindo(a), ' + u.nome.split(' ')[0] + '!');
}
function sair() {
  me = null; db.set('sessao', null); $('#dPlanos').close(); topo(); render(); if (atual) info();
  toast('Você saiu da conta.');
}
$('#sair').onclick = sair;
$$('[data-olho]').forEach((c) => c.addEventListener('change', () => {
  $$('input[name=senha], input[name=nova]', c.closest('form')).forEach((i) => { i.type = c.checked ? 'text' : 'password'; });
}));

async function envia(ev, criar) {
  ev.preventDefault();
  const f = ev.target, erro = $('.erro', f), d = Object.fromEntries(new FormData(f));
  const email = (d.email || '').trim().toLowerCase();
  const falha = (m) => { erro.textContent = m; };
  if (!/^\S+@\S+\.\S+$/.test(email)) return falha('Digite um e-mail válido.');
  const users = db.get('users', {});
  if (criar) {
    if ((d.nome || '').trim().length < 2) return falha('Digite seu nome.');
    if (d.senha.length < 6) return falha('A senha precisa ter pelo menos 6 caracteres.');
    if (resp(d.resp).length < 2) return falha('Digite a resposta da pergunta de segurança.');
    if (users[email]) return falha('Este e-mail já tem uma conta. Use a aba Entrar.');
    users[email] = { nome: d.nome.trim(), hash: await hash(email, d.senha), plano: null, perg: +d.perg, rh: await hash(email, 'r|' + resp(d.resp)) };
    db.set('users', users);
  } else if (!users[email] || users[email].hash !== await hash(email, d.senha)) {
    return falha('E-mail ou senha incorretos.');
  }
  f.reset(); entrar(email);
}
$('#fEntrar').addEventListener('submit', (e) => envia(e, false));
$('#fCriar').addEventListener('submit', (e) => envia(e, true));

// Recuperação de senha por pergunta de segurança (não há servidor de e-mail neste protótipo)
let tentativas = 0, bloqueioAte = 0;
$('#fEsqueci').addEventListener('submit', async (ev) => {
  ev.preventDefault();
  const f = ev.target, erro = $('.erro', f), d = Object.fromEntries(new FormData(f));
  const email = (d.email || '').trim().toLowerCase(), users = db.get('users', {}), u = users[email];
  const falha = (m) => { erro.textContent = m; };
  if ($('#passo2').hidden) {
    if (!u) return falha('Não encontramos uma conta com este e-mail.');
    if (u.rh === undefined) return falha('Esta conta foi criada sem pergunta de segurança e não pode ser recuperada por aqui.');
    erro.textContent = ''; $('#pergTxt').textContent = PERGUNTAS[u.perg];
    $('#passo1').hidden = true; $('#passo2').hidden = false; f.querySelector('button[type=submit]').textContent = 'Redefinir senha';
    return;
  }
  if (Date.now() < bloqueioAte) return falha('Muitas tentativas. Aguarde ' + Math.ceil((bloqueioAte - Date.now()) / 1000) + ' segundos.');
  if ((d.nova || '').length < 6) return falha('A nova senha precisa ter pelo menos 6 caracteres.');
  if (!u || u.rh !== await hash(email, 'r|' + resp(d.resp))) {
    if (++tentativas >= 3) { tentativas = 0; bloqueioAte = Date.now() + 60000; }
    return falha('Resposta incorreta.');
  }
  u.hash = await hash(email, d.nova); db.set('users', users); tentativas = 0; f.reset();
  painel('entrar'); $('#fEntrar [name=email]').value = email; toast('Senha redefinida. Entre com a nova senha.');
});

/* ===== Telas ===== */
const card = (f) => `<button class="card" data-id="${f.id}" aria-label="${esc(f.t)}"><span class="card__t">${esc(f.t)}</span><img src="${poster(f)}" alt="" loading="lazy" onerror="this.remove()">${f.yt ? '' : '<i class="card__tag">Em breve</i>'}</button>`;
const fila = (tit, lista) => `<section class="blk"><h2>${tit}</h2><div class="fila"><button class="seta seta--e" data-rolar="-1" aria-label="Voltar">&lsaquo;</button><div class="trilho">${lista.map(card).join('')}</div><button class="seta seta--d" data-rolar="1" aria-label="Avançar">&rsaquo;</button></div></section>`;
const grade = (tit, lista, vazio) => `<section class="blk pad"><h2>${tit}</h2>${lista.length ? `<div class="grade">${lista.map(card).join('')}</div>` : `<p class="vazio">${vazio}</p>`}</section>`;

function render() {
  $$('.top__nav button').forEach((b) => b.classList.toggle('on', b.dataset.ir === st.v));
  const lista = ud('lista', []).map(byId).filter(Boolean), q = norm(st.q.trim());
  let h = '';
  if (q) {
    h = grade('Resultados para “' + esc(st.q.trim()) + '”', FILMES.filter((f) => norm(f.t + ' ' + f.g + ' ' + f.s).includes(q)), 'Nenhum título encontrado. Tente outro nome ou gênero.');
  } else if (st.v === 'lista') {
    h = grade('Minha lista', lista, 'Sua lista está vazia. Abra um título e toque em “Minha lista” para salvá-lo aqui.');
  } else {
    const d = byId(DESTAQUE), na = lista.some((f) => f.id === d.id);
    h = `<section class="hero"><div class="hero__in"><p class="hero__g">${esc(d.g)}</p><h1>${esc(d.t)}</h1><p>${esc(d.s)}</p><div class="acoes"><button class="btn btn--ac" data-id="${d.id}" data-play>Assistir agora</button><button class="btn btn--vz" data-lista="${d.id}">${na ? '✓ Na minha lista' : '+ Minha lista'}</button></div></div></section>`;
    h += `<div class="chips" role="group" aria-label="Filtrar por gênero">${['Todos', ...GENEROS].map((g) => `<button class="chip" data-g="${g}" aria-pressed="${g === st.g}">${g}</button>`).join('')}</div>`;
    const hist = Object.entries(ud('hist', {})).sort((a, b) => b[1] - a[1]).map(([id]) => byId(id)).filter(Boolean);
    if (st.g === 'Todos' && hist.length) h += fila('Continue assistindo', hist);
    if (st.g === 'Todos' && lista.length) h += fila('Minha lista', lista);
    (st.g === 'Todos' ? GENEROS : [st.g]).forEach((g) => { const l = FILMES.filter((f) => f.g === g); if (l.length) h += fila(g, l); });
  }
  $('#view').innerHTML = h;
}

/* ===== Detalhe do título ===== */
const notas = (id) => Object.values(db.get('notas', {})[id] || {});
function abrir(id, tocar) {
  const f = byId(id); if (!f) return;
  atual = f;
  if (f.yt && me) { const h = ud('hist', {}); h[id] = Date.now(); setUd('hist', h); }
  $('#player').innerHTML = f.yt
    ? `<iframe src="https://www.youtube-nocookie.com/embed/${f.yt}?rel=0${tocar ? '&autoplay=1' : ''}" title="${esc(f.t)}" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>`
    : `<div class="player__off"><img src="${f.p}" alt=""><p>Este título estará disponível em breve.</p></div>`;
  info();
  if (!$('#dlg').open) $('#dlg').showModal();
  history.replaceState(null, '', '#filme=' + id);
}
function info() {
  const f = atual, n = notas(f.id), media = n.length ? n.reduce((a, b) => a + b, 0) / n.length : 0;
  const minha = me ? (db.get('notas', {})[f.id] || {})[me.email] || 0 : 0;
  const na = ud('lista', []).includes(f.id);
  const url = location.href.split('#')[0] + '#filme=' + f.id, txt = 'Assista “' + f.t + '” na TechMovies';
  const e = encodeURIComponent, u = e(url), tx = e(txt);
  const redes = [
    ['whatsapp', 'WhatsApp', 'https://wa.me/?text=' + e(txt + ' ' + url)],
    ['telegram', 'Telegram', 'https://t.me/share/url?url=' + u + '&text=' + tx],
    ['facebook', 'Facebook', 'https://www.facebook.com/sharer/sharer.php?u=' + u],
    ['twitter', 'X', 'https://twitter.com/intent/tweet?text=' + tx + '&url=' + u],
    ['linkedin', 'LinkedIn', 'https://www.linkedin.com/sharing/share-offsite/?url=' + u],
  ].map(([i, nm, h]) => `<a href="${h}" target="_blank" rel="noopener" aria-label="Compartilhar no ${nm}"><img src="img/social/${i}.png" alt="" width="34" height="34"></a>`).join('');
  const cs = db.get('coments', {})[f.id] || [];
  $('#info').innerHTML = `
    <h2>${esc(f.t)}</h2>
    <p class="meta"><span class="tag">${esc(f.g)}</span> <span>${n.length ? `<b class="est">${stars(media)}</b> ${media.toFixed(1).replace('.', ',')} (${n.length} ${n.length > 1 ? 'avaliações' : 'avaliação'})` : 'Sem avaliações ainda'}</span></p>
    <p>${esc(f.s)}</p>
    <div class="acoes"><button class="btn ${na ? 'btn--vz' : 'btn--ac'}" data-lista="${f.id}">${na ? '✓ Na minha lista' : '+ Minha lista'}</button></div>
    <div class="linha"><span>Sua nota</span><div class="nota" role="group" aria-label="Sua nota">${[1, 2, 3, 4, 5].map((i) => `<button data-nota="${i}" class="${i <= minha ? 'on' : ''}" aria-label="${i} de 5" aria-pressed="${i === minha}">★</button>`).join('')}</div></div>
    <div class="linha"><span>Compartilhar</span><div class="redes">${redes}<button class="btn btn--vz" data-copia="${esc(url)}">Copiar link</button></div></div>
    ${f.elenco ? `<h3>Elenco</h3><ul class="elenco">${f.elenco.map((a) => `<li><img src="img/elenco/${a.f}.jpg" alt="${esc(a.n)}" width="90" height="120" loading="lazy"><b>${esc(a.n)}</b><small>${esc(a.c)}</small></li>`).join('')}</ul>` : ''}
    <h3>Comentários (${cs.length})</h3>
    ${me ? '<form id="fCom" class="com"><label class="sr" for="txCom">Seu comentário</label><textarea id="txCom" rows="3" maxlength="500" placeholder="O que você achou?" required></textarea><button class="btn btn--ac" type="submit">Comentar</button></form>' : '<div class="com"><p class="vazio">Entre na sua conta para comentar e avaliar.</p><button class="btn btn--ac" data-entrar>Entrar</button></div>'}
    <ul class="coms">${cs.length ? cs.map((c, i) => `<li><b>${esc(c.nome)}</b> <small>${new Date(c.ts).toLocaleDateString('pt-BR')}</small>${me && c.email === me.email ? `<button class="x" data-del="${i}" aria-label="Apagar comentário">Apagar</button>` : ''}<p>${esc(c.txt)}</p></li>`).join('') : '<li class="vazio">Seja o primeiro a comentar.</li>'}</ul>`;
}
function fechaDetalhe() { $('#player').innerHTML = ''; history.replaceState(null, '', location.pathname + location.search); atual = null; render(); }
$('#dlg').addEventListener('close', fechaDetalhe);

function planos() {
  $('#planosBox').innerHTML = `<h2>Escolha seu plano</h2><p>${!me ? 'Entre na sua conta para assinar um plano.' : me.plano ? 'Seu plano atual: <b>' + esc(PLANOS.find((p) => p.id === me.plano).n) + '</b>.' : 'Você ainda não escolheu um plano.'}</p><div class="planos">${PLANOS.map((p) => `<article class="plano ${me && p.id === me.plano ? 'on' : ''}"><h3>${p.n}</h3><p class="preco">R$ ${p.preco}<small>/mês</small></p><ul>${p.itens.map((i) => `<li>${i}</li>`).join('')}</ul><button class="btn ${me && p.id === me.plano ? 'btn--vz' : 'btn--ac'}" data-plano="${p.id}" ${me && p.id === me.plano ? 'disabled' : ''}>${me && p.id === me.plano ? 'Plano atual' : 'Assinar'}</button></article>`).join('')}</div><p class="aviso">Protótipo: nenhuma cobrança é realizada.</p>`;
  if (!$('#dPlanos').open) $('#dPlanos').showModal();
}

/* ===== Eventos ===== */
document.addEventListener('click', (ev) => {
  const t = ev.target.closest('button, a[data-ir]'); if (!t) return;
  const d = t.dataset;
  if (d.fechar !== undefined) return t.closest('dialog').close();
  if (d.painel) {
    const em = $('#fEntrar [name=email]').value; painel(d.painel);
    if (d.painel === 'esqueci' && em) $('#fEsqueci [name=email]').value = em;
    return;
  }
  if (d.entrar !== undefined) return pedeLogin();
  if (d.ir) {
    ev.preventDefault();
    if (d.ir === 'planos') return planos();
    if (d.ir === 'lista' && !me) return pedeLogin('Entre na sua conta para ver sua lista.');
    st.v = d.ir; st.q = ''; $('#busca').value = ''; render(); return window.scrollTo({ top: 0 });
  }
  if (d.id) return abrir(d.id, d.play !== undefined);
  if (d.g) { st.g = d.g; return render(); }
  if (d.rolar) { const r = t.parentElement.querySelector('.trilho'); return r.scrollBy({ left: d.rolar * r.clientWidth * .85, behavior: 'smooth' }); }
  if (d.lista) {
    if (!me) return pedeLogin('Entre na sua conta para salvar títulos na sua lista.');
    let l = ud('lista', []); const tem = l.includes(d.lista);
    l = tem ? l.filter((x) => x !== d.lista) : [d.lista, ...l]; setUd('lista', l);
    toast(tem ? 'Removido da sua lista.' : 'Adicionado à sua lista.');
    return atual ? (info(), 0) : render();
  }
  if (d.nota) {
    if (!me) return pedeLogin('Entre na sua conta para avaliar este título.');
    const all = db.get('notas', {}); all[atual.id] = all[atual.id] || {};
    if (all[atual.id][me.email] === +d.nota) delete all[atual.id][me.email]; else all[atual.id][me.email] = +d.nota;
    db.set('notas', all); return info();
  }
  if (d.copia) {
    const ok = () => toast('Link copiado.');
    return navigator.clipboard ? navigator.clipboard.writeText(d.copia).then(ok, () => toast(d.copia)) : toast(d.copia);
  }
  if (d.del !== undefined) {
    const all = db.get('coments', {}); all[atual.id].splice(+d.del, 1); db.set('coments', all); return info();
  }
  if (d.plano) {
    if (!me) return pedeLogin('Entre na sua conta para assinar um plano.');
    const us = db.get('users', {}); us[me.email].plano = d.plano; db.set('users', us); me.plano = d.plano;
    toast('Plano ' + PLANOS.find((p) => p.id === d.plano).n + ' selecionado.'); return planos();
  }
});
document.addEventListener('submit', (ev) => {
  if (ev.target.id !== 'fCom') return;
  ev.preventDefault();
  const txt = $('#txCom').value.trim(); if (!txt) return;
  const all = db.get('coments', {}); (all[atual.id] = all[atual.id] || []).unshift({ email: me.email, nome: me.nome, txt, ts: Date.now() });
  db.set('coments', all); info(); toast('Comentário publicado.');
});
$('#busca').addEventListener('input', (e) => { st.q = e.target.value; render(); });
$$('dialog').forEach((d) => d.addEventListener('click', (e) => { if (e.target === d) d.close(); }));

/* ===== Início: a home abre para qualquer visitante ===== */
const s0 = db.get('sessao', null), u0 = s0 && db.get('users', {})[s0];
if (u0) me = { email: s0, nome: u0.nome, plano: u0.plano };
topo(); render();
const dl = location.hash.match(/filme=([\w-]+)/);
if (dl && byId(dl[1])) abrir(dl[1]);
})();
