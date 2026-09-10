/* =========================================================================
   França Garage — site público
   Este arquivo MONTA a página. O que você edita é o js/conteudo.js.
   ========================================================================= */

const $ = (sel) => document.querySelector(sel);

/* ===================== Modo oficina =====================
   O mesmo endereço serve os dois públicos. Terminando em #oficina, o site
   sai da tela e entra o montador de orçamento. O cliente nunca chega aqui:
   nada da ferramenta vem no HTML, e não há link para ela em lugar nenhum. */

const SENHA_DA_PORTA = 'oficina';

/* Sobe este número sempre que mexer em js/orcamento.js ou css/orcamento.css.
   Ele entra no endereço do arquivo e força o navegador a buscar a versão
   nova em vez de usar a que ele guardou. Sem isso, quem abriu a ferramenta
   antes continua com o arquivo velho — e o velho declara os mesmos nomes
   que este arquivo, o que quebra a página em silêncio (tela preta). */
const VERSAO_OFICINA = '2';

function ehModoOficina() {
  return location.hash.replace('#', '') === SENHA_DA_PORTA
      || location.search.replace('?', '') === SENHA_DA_PORTA;
}

let oficinaAberta = false;

/* Nunca deixa tela preta: se a ferramenta não subir, o site volta e a
   pessoa lê o que aconteceu, em vez de olhar para o nada. */
function desisteDaOficina(motivo) {
  document.querySelectorAll('.cab, main, .rodape').forEach((el) => { el.hidden = true; });

  const raiz = document.getElementById('appOficina');
  raiz.hidden = false;
  raiz.innerHTML =
    '<div style="min-height:100vh;display:grid;place-items:center;padding:32px;text-align:center;font-family:system-ui,sans-serif;color:#fff">'
    + '<div style="max-width:34ch">'
    + '<p style="font-size:1.1rem;font-weight:600;margin:0 0 10px">Não deu para abrir a ferramenta.</p>'
    + '<p style="color:#a2a2aa;margin:0 0 22px">' + motivo + '</p>'
    + '<a href="?recarregar=' + Date.now() + '#' + SENHA_DA_PORTA + '" '
    + 'style="display:inline-block;padding:12px 24px;border-radius:99px;background:#fff;color:#000;font-weight:600;text-decoration:none">Tentar de novo</a>'
    + '</div></div>';
}

function abreModoOficina() {
  if (oficinaAberta) return;
  oficinaAberta = true;

  // O site sai de cena — inclusive da impressão, porque [hidden] é display:none.
  document.querySelectorAll('.cab, main, .rodape').forEach((el) => { el.hidden = true; });

  document.title = 'Orçamento · França Garage';

  const estilo = document.createElement('link');
  estilo.rel = 'stylesheet';
  estilo.href = 'css/orcamento.css?v=' + VERSAO_OFICINA;
  document.head.appendChild(estilo);

  // O CSS e o JS da ferramenta só são baixados agora. Quem só quer ver o
  // site não paga por eles.
  carregaFerramenta('js/orcamento.js?v=' + VERSAO_OFICINA, true);
}

function carregaFerramenta(endereco, podeTentarDeNovo) {
  const script = document.createElement('script');
  script.src = endereco;

  script.onerror = () => desisteDaOficina('O arquivo não chegou. Verifique a internet.');

  script.onload = () => {
    // O arquivo pode ter chegado e mesmo assim não valer: se for uma versão
    // antiga guardada pelo navegador, ela não cria esta função.
    if (typeof window.abreOrcamento !== 'function') {
      if (podeTentarDeNovo) {
        // Segunda tentativa furando qualquer cache.
        carregaFerramenta('js/orcamento.js?nocache=' + Date.now(), false);
      } else {
        desisteDaOficina('Seu navegador guardou uma versão antiga do arquivo.');
      }
      return;
    }

    try {
      window.abreOrcamento();
    } catch (erro) {
      desisteDaOficina('A ferramenta carregou mas não abriu: ' + erro.message);
    }
  };

  document.body.appendChild(script);
}

if (ehModoOficina()) {
  abreModoOficina();
} else {
  // Se digitar #oficina com a página já aberta, também entra.
  window.addEventListener('hashchange', () => { if (ehModoOficina()) abreModoOficina(); });
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
   aparece antes de o vídeo carregar.

   Celular é o caso difícil. iOS e Android só deixam tocar sozinho se o
   vídeo estiver mudo E marcado para tocar dentro da página (playsinline).
   No iOS não basta o atributo no HTML: a propriedade precisa estar ligada
   no objeto antes do play. E mesmo assim o Modo de Baixo Consumo bloqueia
   — por isso existe a segunda tentativa no primeiro toque. */
function montaVideoDoTopo() {
  const video = document.getElementById('heroVideo');
  if (!video || !FUNDOS.hero_video) return;

  // Quem pediu menos movimento no sistema fica só com a foto.
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Só respeita quem LIGOU a economia de dados no aparelho. Sinal fraco não
  // bloqueia mais: o vídeo demora, mas a foto segura a tela enquanto isso.
  const rede = navigator.connection;
  if (rede && rede.saveData && FUNDOS.video_com_economia_de_dados !== true) return;

  document.getElementById('heroFundo').hidden = false;

  // Tudo o que o celular exige, na propriedade e no atributo.
  video.muted = true;
  video.defaultMuted = true;
  video.playsInline = true;
  video.setAttribute('muted', '');
  video.setAttribute('playsinline', '');
  video.setAttribute('webkit-playsinline', '');   // iOS antigo
  video.setAttribute('autoplay', '');
  video.disablePictureInPicture = true;
  video.controls = false;

  if (FUNDOS.hero) video.poster = encodeURI(FUNDOS.hero);
  video.src = encodeURI(FUNDOS.hero_video);

  // Só aparece quando há imagem para mostrar, senão pisca preto.
  video.addEventListener('loadeddata', () => { video.hidden = false; }, { once: true });

  // Se o arquivo falhar, a foto continua lá e ninguém percebe.
  video.addEventListener('error', () => { video.hidden = true; }, { once: true });

  tentaTocar(video, true);
}

/* iOS com Baixo Consumo, e alguns Android, recusam o play automático. Nesse
   caso a foto fica, e a gente tenta de novo no primeiro toque da pessoa —
   aí o navegador considera que houve gesto e libera. */
function tentaTocar(video, primeiraVez) {
  const tocar = video.play();
  if (!tocar || !tocar.catch) return;

  tocar
    .then(() => { video.hidden = false; })
    .catch(() => {
      video.hidden = true;
      if (!primeiraVez) return;

      const deNovo = () => tentaTocar(video, false);
      document.addEventListener('touchstart', deNovo, { once: true, passive: true });
      document.addEventListener('click', deNovo, { once: true });
      document.addEventListener('scroll', deNovo, { once: true, passive: true });
    });
}

/* ---------- Mídia dos cards de serviço ----------
   Aceita foto ou vídeo. Vídeo entra mudo, em laço e sem controles: é
   ilustração, não filme para assistir. */
const EH_VIDEO = /\.(mp4|webm|mov|m4v)$/i;

function montaFotosServicos() {
  if (typeof FOTOS_SERVICOS !== 'object') return;

  document.querySelectorAll('[data-foto]').forEach((figura) => {
    const caminho = FOTOS_SERVICOS[figura.dataset.foto];
    if (!caminho) return;

    figura.textContent = '';
    figura.style.padding = '0';

    if (EH_VIDEO.test(caminho)) {
      const video = document.createElement('video');
      video.src = encodeURI(caminho);
      video.muted = true;
      video.defaultMuted = true;
      video.loop = true;
      video.playsInline = true;
      video.setAttribute('muted', '');
      video.setAttribute('loop', '');
      video.setAttribute('playsinline', '');
      video.setAttribute('webkit-playsinline', '');
      video.preload = 'metadata';
      video.className = 'cartao__midia';

      // Se o navegador não souber tocar, volta o fundo listrado do card.
      video.addEventListener('error', () => {
        figura.textContent = 'Vídeo não suportado neste navegador';
        figura.style.padding = '';
      }, { once: true });

      figura.appendChild(video);

      // Só começa quando o card aparece na tela — não gasta dados de quem
      // nem chegou lá.
      if ('IntersectionObserver' in window) {
        const olho = new IntersectionObserver((e) => {
          e.forEach((x) => {
            if (x.isIntersecting) { video.play().catch(() => {}); olho.unobserve(x.target); }
          });
        }, { threshold: 0.25 });
        olho.observe(figura);
      } else {
        video.play().catch(() => {});
      }
      return;
    }

    const img = document.createElement('img');
    img.src = encodeURI(caminho);
    img.alt = 'França Garage — ' + figura.dataset.foto;
    img.loading = 'lazy';
    img.className = 'cartao__midia';
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

/* ---------- Crédito de quem fez o site ---------- */
function montaCredito() {
  const caixa = document.getElementById('credito');
  if (!caixa || typeof CRIACAO === 'undefined' || !CRIACAO.nome) return;

  const insta = document.getElementById('creditoInsta');
  insta.textContent = CRIACAO.nome;
  insta.href = CRIACAO.instagram;

  document.getElementById('creditoZap').href =
    `https://wa.me/${CRIACAO.whatsapp}?text=${encodeURIComponent(CRIACAO.mensagem)}`;

  caixa.hidden = false;
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


/* ---------- Cursor de bolinha ----------
   Duas peças: o ponto, que gruda no mouse, e o anel, que chega atrasado.
   O atraso é o que dá a sensação de peso — sem ele parecem dois adesivos.

   Só é criado em quem tem mouse de verdade (pointer: fine). Em celular, em
   tablet e para quem pediu menos movimento, nada disso existe e o cursor do
   sistema fica intacto. */
function ligaBolinha() {
  const temMouse = window.matchMedia('(pointer: fine)').matches;
  const quietinho = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!temMouse || quietinho) return;

  // Na ferramenta de orçamento o cursor do sistema faz falta: são campos
  // para digitar, com barra de texto e seleção.
  if (ehModoOficina()) return;

  const ponto = document.createElement('div');
  ponto.className = 'bolinha sumiu';
  const anel = document.createElement('div');
  anel.className = 'bolinha__anel sumiu';
  document.body.append(ponto, anel);

  let alvoX = innerWidth / 2, alvoY = innerHeight / 2;
  let anelX = alvoX, anelY = alvoY;
  let apareceu = false;

  document.addEventListener('pointermove', (e) => {
    if (e.pointerType && e.pointerType !== 'mouse') return;
    alvoX = e.clientX;
    alvoY = e.clientY;

    if (!apareceu) {
      apareceu = true;
      ponto.classList.remove('sumiu');
      anel.classList.remove('sumiu');
      // Só agora esconde o cursor do sistema. Se algo tivesse falhado antes
      // daqui, a pessoa continuaria com o cursor normal em vez de ficar sem
      // nenhum.
      document.documentElement.classList.add('com-bolinha');
    }

    ponto.style.transform = `translate(${alvoX}px, ${alvoY}px)`;
  }, { passive: true });

  // Some quando o mouse sai da janela, senão fica um ponto parado na borda.
  document.addEventListener('mouseleave', () => {
    ponto.classList.add('sumiu');
    anel.classList.add('sumiu');
  });
  document.addEventListener('mouseenter', () => {
    if (!apareceu) return;
    ponto.classList.remove('sumiu');
    anel.classList.remove('sumiu');
  });

  // O anel persegue o ponto: 18% da distância por quadro.
  (function persegue() {
    anelX += (alvoX - anelX) * 0.18;
    anelY += (alvoY - anelY) * 0.18;
    anel.style.transform = `translate(${anelX}px, ${anelY}px)`;
    requestAnimationFrame(persegue);
  })();

  // Sobre o que dá para clicar, o anel abre. Sobre o comparador, abre mais.
  const clicavel = 'a, button, summary, input, select, textarea, .plano, .faq__item';
  document.addEventListener('pointerover', (e) => {
    if (!e.target.closest) return;
    anel.classList.toggle('pegando', !!e.target.closest(clicavel));
    anel.classList.toggle('arrastando', !!e.target.closest('[data-antes-depois]'));
  });

  // Aperto do botão do mouse encolhe o anel por um instante.
  document.addEventListener('pointerdown', () => anel.classList.add('arrastando'));
  document.addEventListener('pointerup', () => {
    anel.classList.remove('arrastando');
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
montaCredito();

ligaComparadores();   // depois de montar o portfólio
ligaEntrada();        // depois de tudo estar na página
ligaCabecalho();
ligaBolinha();
limpaLinksMortos();

const ano = $('#ano');
if (ano) ano.textContent = new Date().getFullYear();
