/* =========================================================================
   França Garage — site público
   Este arquivo MONTA a página. O que você edita é o js/conteudo.js.
   ========================================================================= */

const $ = (sel) => document.querySelector(sel);

/* Escapa texto do conteudo.js antes de virar HTML. */
function escapa(texto) {
  const d = document.createElement('div');
  d.textContent = String(texto ?? '');
  return d.innerHTML;
}

/* Um "lado" do comparador: a foto, ou o fundo listrado quando não tem foto. */
function lado(caminho, classe, alternativo, aviso) {
  if (caminho) {
    return `<div class="antes-depois__lado ${classe}"><img src="${escapa(caminho)}" alt="${escapa(alternativo)}" loading="lazy"></div>`;
  }
  return `<div class="antes-depois__lado ${classe}">${aviso}</div>`;
}

/* ---------- Fotos de fundo (decorativas) ---------- */
function montaFundos() {
  if (typeof FUNDOS === 'undefined') return;

  document.documentElement.style.setProperty('--escuridao', String(FUNDOS.escuridao ?? 0.72));
  document.documentElement.style.setProperty('--pb', FUNDOS.preto_e_branco === false ? '0' : '1');

  // A faixa final tem texto sobre a foto inteira: se não vier valor próprio,
  // escurece mais que o topo, senão o texto some em foto clara.
  const escuroChamada = FUNDOS.escuridao_chamada ?? Math.min((FUNDOS.escuridao ?? 0.72) + 0.14, 0.92);
  document.documentElement.style.setProperty('--escuridao-chamada', String(escuroChamada));

  const poe = (id, caminho) => {
    const el = document.getElementById(id);
    if (!el || !caminho) return;
    // encodeURI protege caminho com espaço ou acento que tenha escapado.
    el.style.backgroundImage = `url("${encodeURI(caminho)}")`;
    el.hidden = false;
  };

  poe('heroFundo', FUNDOS.hero);
  poe('chamadaFundo', FUNDOS.chamada);

  montaVideoDoTopo();
}

/* O vídeo do topo entra por cima da foto — e a foto vira o cartaz que
   aparece antes de o vídeo carregar. */
function montaVideoDoTopo() {
  const video = document.getElementById('heroVideo');
  if (!video || !FUNDOS.hero_video) return;

  // Quem pediu menos movimento no sistema fica só com a foto.
  const quietinho = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (quietinho) return;

  // Em rede economizando dados, também fica só a foto.
  const rede = navigator.connection;
  if (rede && (rede.saveData || /^(slow-)?2g$/.test(rede.effectiveType || ''))) return;

  document.getElementById('heroFundo').hidden = false;

  video.src = encodeURI(FUNDOS.hero_video);
  if (FUNDOS.hero) video.poster = encodeURI(FUNDOS.hero);

  // Só mostra depois que há imagem para mostrar, senão pisca preto.
  video.addEventListener('loadeddata', () => { video.hidden = false; }, { once: true });

  // Se o vídeo não carregar, a foto continua lá e ninguém percebe.
  video.addEventListener('error', () => { video.hidden = true; }, { once: true });

  const tocar = video.play();
  if (tocar && tocar.catch) tocar.catch(() => { video.hidden = true; });
}

/* ---------- Fotos dos cards de serviço ---------- */
function montaFotosServicos() {
  if (typeof FOTOS_SERVICOS !== 'object') return;

  document.querySelectorAll('[data-foto]').forEach((figura) => {
    const caminho = FOTOS_SERVICOS[figura.dataset.foto];
    if (!caminho) return;
    figura.textContent = '';
    figura.style.padding = '0';
    const img = document.createElement('img');
    img.src = caminho;
    img.alt = `França Garage — ${figura.dataset.foto}`;
    img.loading = 'lazy';
    img.style.cssText = 'width:100%;height:100%;object-fit:cover;border-radius:inherit';
    figura.appendChild(img);
  });
}

/* ---------- Números ---------- */
function montaNumeros() {
  const caixa = $('#listaNumeros');
  if (!caixa || typeof NUMEROS === 'undefined') return;

  const comValor = NUMEROS.filter((n) => String(n.valor).trim() !== '');

  // Nada preenchido: a seção inteira sai do ar em vez de mostrar zeros.
  if (!comValor.length) { $('#secaoNumeros').hidden = true; return; }

  caixa.innerHTML = comValor.map((n) => `
    <article class="cartao cartao--meio surge">
      <p class="cartao__numero">${escapa(n.valor)}</p>
      <h3 class="cartao__titulo">${escapa(n.rotulo)}</h3>
      ${n.nota ? `<p class="cartao__texto">${escapa(n.nota)}</p>` : ''}
    </article>
  `).join('');
}

/* ---------- Portfólio ---------- */
function montaTrabalhos() {
  const caixa = $('#listaTrabalhos');
  if (!caixa || typeof TRABALHOS === 'undefined') return;

  // A seção afirma que o carro passou pela oficina. Sem trabalho real,
  // ela não vai ao ar.
  if (typeof MOSTRAR_PORTFOLIO !== 'undefined' && !MOSTRAR_PORTFOLIO) {
    $('#trabalhos').hidden = true;
    return;
  }

  caixa.innerHTML = TRABALHOS.map((t) => `
    <article class="trabalho surge">
      <div class="antes-depois" data-antes-depois tabindex="0" role="slider"
           aria-label="Antes e depois — ${escapa(t.veiculo)}"
           aria-valuemin="0" aria-valuemax="100" aria-valuenow="50">
        ${lado(t.antes, 'antes-depois__antes', `${t.veiculo} antes do serviço`, 'Foto antes')}
        ${lado(t.depois, 'antes-depois__depois', `${t.veiculo} depois do serviço`, 'Foto depois')}
        <span class="antes-depois__alca" aria-hidden="true"></span>
        <span class="antes-depois__etiqueta antes-depois__etiqueta--a">Antes</span>
        <span class="antes-depois__etiqueta antes-depois__etiqueta--d">Depois</span>
      </div>
      <div class="trabalho__pe">
        <span class="trabalho__nome">${escapa(t.veiculo)}</span>
        <span class="trabalho__tipo">${escapa(t.servico)}</span>
      </div>
    </article>
  `).join('');
}

/* ---------- Depoimentos ---------- */
function montaDepoimentos() {
  const caixa = $('#listaDepoimentos');
  if (!caixa || typeof DEPOIMENTOS === 'undefined') return;

  // Sem depoimento real, a seção não vai ao ar.
  if (!DEPOIMENTOS.length) { $('#secaoDepoimentos').hidden = true; return; }

  caixa.innerHTML = DEPOIMENTOS.map((d) => {
    const inicial = (d.nome || '?').trim().charAt(0).toUpperCase();
    return `
      <article class="depoimento surge">
        <p>${escapa(d.texto)}</p>
        <div class="depoimento__pessoa">
          <span class="depoimento__avatar">${escapa(inicial)}</span>
          <span>
            <span class="depoimento__nome">${escapa(d.nome)}</span><br>
            <span class="depoimento__de">${escapa(d.veiculo || '')}</span>
          </span>
        </div>
      </article>
    `;
  }).join('');
}

/* ---------- Links de contato ---------- */
function montaContato() {
  if (typeof CONTATO === 'undefined') return;

  const link = `https://wa.me/${CONTATO.whatsapp}?text=${encodeURIComponent(CONTATO.mensagem)}`;
  document.querySelectorAll('#zap, #zapRodape').forEach((a) => { a.href = link; });
  document.querySelectorAll('a[href*="instagram.com"]').forEach((a) => { a.href = CONTATO.instagram; });
  document.querySelectorAll('a[href*="maps.app.goo.gl"]').forEach((a) => { a.href = CONTATO.mapa; });
}

/* ---------- Comparador antes / depois ---------- */
function ligaComparadores() {
  document.querySelectorAll('[data-antes-depois]').forEach((caixa) => {
    const depois = caixa.querySelector('.antes-depois__depois');
    const alca = caixa.querySelector('.antes-depois__alca');
    let arrastando = false;

    const posicionar = (porcento) => {
      const p = Math.max(0, Math.min(100, porcento));
      depois.style.clipPath = `inset(0 0 0 ${p}%)`;
      alca.style.left = `${p}%`;
      caixa.setAttribute('aria-valuenow', Math.round(p));
    };

    const pelaPagina = (clienteX) => {
      const area = caixa.getBoundingClientRect();
      posicionar(((clienteX - area.left) / area.width) * 100);
    };

    caixa.addEventListener('pointerdown', (e) => {
      arrastando = true;
      caixa.setPointerCapture(e.pointerId);
      pelaPagina(e.clientX);
    });

    caixa.addEventListener('pointermove', (e) => {
      if (arrastando) pelaPagina(e.clientX);
    });

    const soltar = (e) => {
      if (!arrastando) return;
      arrastando = false;
      if (e.pointerId !== undefined && caixa.hasPointerCapture(e.pointerId)) {
        caixa.releasePointerCapture(e.pointerId);
      }
    };
    caixa.addEventListener('pointerup', soltar);
    caixa.addEventListener('pointercancel', soltar);

    caixa.addEventListener('keydown', (e) => {
      const atual = Number(caixa.getAttribute('aria-valuenow')) || 50;
      const passo = e.shiftKey ? 10 : 4;
      if (e.key === 'ArrowLeft')  { posicionar(atual - passo); e.preventDefault(); }
      if (e.key === 'ArrowRight') { posicionar(atual + passo); e.preventDefault(); }
      if (e.key === 'Home')       { posicionar(0);   e.preventDefault(); }
      if (e.key === 'End')        { posicionar(100); e.preventDefault(); }
    });
  });
}

/* ---------- Entrada ao rolar ---------- */
function ligaEntrada() {
  const aSurgir = document.querySelectorAll('.surge');

  if (!('IntersectionObserver' in window)) {
    aSurgir.forEach((el) => el.classList.add('visivel'));
    return;
  }

  const observador = new IntersectionObserver((entradas) => {
    entradas.forEach((entrada, i) => {
      if (!entrada.isIntersecting) return;
      entrada.target.style.transitionDelay = `${Math.min(i, 4) * 70}ms`;
      entrada.target.classList.add('visivel');
      observador.unobserve(entrada.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

  aSurgir.forEach((el) => observador.observe(el));
}

/* ---------- Some com link que aponta para seção fora do ar ----------
   Vale para o menu, o rodapé e os botões do topo: link para seção
   escondida vira um clique que não sai do lugar. */
function limpaLinksMortos() {
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    const destino = a.getAttribute('href');
    if (destino === '#' || destino === '#topo') return;

    const alvo = document.querySelector(destino);
    if (!alvo || !alvo.hidden) return;

    const item = a.closest('li');
    if (item) item.hidden = true; else a.hidden = true;
  });
}

/* ---------- Cabeçalho e menu ---------- */
function ligaCabecalho() {
  const cab = $('#cab');
  const marcaRolagem = () => cab.classList.toggle('rolou', window.scrollY > 12);
  marcaRolagem();
  window.addEventListener('scroll', marcaRolagem, { passive: true });

  const hamburguer = $('#hamburguer');
  const menu = $('#menu');

  hamburguer.addEventListener('click', () => {
    const aberto = menu.classList.toggle('aberto');
    hamburguer.setAttribute('aria-expanded', String(aberto));
    hamburguer.setAttribute('aria-label', aberto ? 'Fechar menu' : 'Abrir menu');
  });

  menu.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', () => {
      menu.classList.remove('aberto');
      hamburguer.setAttribute('aria-expanded', 'false');
      hamburguer.setAttribute('aria-label', 'Abrir menu');
    });
  });
}

/* ===================== Monta a página ===================== */
montaFundos();
montaFotosServicos();
montaNumeros();
montaTrabalhos();
montaDepoimentos();
montaContato();

ligaComparadores();   // depois de montar o portfólio
ligaEntrada();        // depois de tudo estar na página
ligaCabecalho();
limpaLinksMortos();

const ano = $('#ano');
if (ano) ano.textContent = new Date().getFullYear();
