/* =========================================================================
   França Garage — site público
   Sem dependências. Tudo o que muda de oficina está em CONTATO, logo abaixo.
   ========================================================================= */

const CONTATO = {
  // Número no formato do link do WhatsApp: 55 + DDD + número, só dígitos.
  // ATENÇÃO: confira este número. O contato enviado aparece como
  // "+55 42 9918-1070" (8 dígitos após o DDD). Celular no Brasil costuma ter
  // 9 dígitos — se o certo for 99918-1070, troque para "5542999181070".
  whatsapp: '554299181070',
  mensagem: 'Olá! Vim pelo site da França Garage. Queria um orçamento — vou mandar a foto do dano, o modelo e o ano do carro.',
};

/* ---------- Links do WhatsApp ---------- */
const linkZap = `https://wa.me/${CONTATO.whatsapp}?text=${encodeURIComponent(CONTATO.mensagem)}`;
document.querySelectorAll('#zap, #zapRodape').forEach((a) => { a.href = linkZap; });

/* ---------- Ano do rodapé ---------- */
const ano = document.getElementById('ano');
if (ano) ano.textContent = new Date().getFullYear();

/* ---------- Cabeçalho ganha fundo ao rolar ---------- */
const cab = document.getElementById('cab');
const marcaRolagem = () => cab.classList.toggle('rolou', window.scrollY > 12);
marcaRolagem();
window.addEventListener('scroll', marcaRolagem, { passive: true });

/* ---------- Menu no celular ---------- */
const hamburguer = document.getElementById('hamburguer');
const menu = document.getElementById('menu');

hamburguer.addEventListener('click', () => {
  const aberto = menu.classList.toggle('aberto');
  hamburguer.setAttribute('aria-expanded', String(aberto));
  hamburguer.setAttribute('aria-label', aberto ? 'Fechar menu' : 'Abrir menu');
});

menu.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    menu.classList.remove('aberto');
    hamburguer.setAttribute('aria-expanded', 'false');
    hamburguer.setAttribute('aria-label', 'Abrir menu');
  });
});

/* ---------- Entrada ao rolar ---------- */
const aSurgir = document.querySelectorAll('.surge');

if ('IntersectionObserver' in window) {
  const observador = new IntersectionObserver((entradas) => {
    entradas.forEach((entrada, i) => {
      if (!entrada.isIntersecting) return;
      // Escadinha curta entre irmãos que entram juntos.
      entrada.target.style.transitionDelay = `${Math.min(i, 4) * 70}ms`;
      entrada.target.classList.add('visivel');
      observador.unobserve(entrada.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

  aSurgir.forEach((el) => observador.observe(el));
} else {
  aSurgir.forEach((el) => el.classList.add('visivel'));
}

/* ---------- Comparador antes / depois ---------- */
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

  // Teclado: setas movem a linha.
  caixa.addEventListener('keydown', (e) => {
    const atual = Number(caixa.getAttribute('aria-valuenow')) || 50;
    const passo = e.shiftKey ? 10 : 4;
    if (e.key === 'ArrowLeft')  { posicionar(atual - passo); e.preventDefault(); }
    if (e.key === 'ArrowRight') { posicionar(atual + passo); e.preventDefault(); }
    if (e.key === 'Home')       { posicionar(0);  e.preventDefault(); }
    if (e.key === 'End')        { posicionar(100); e.preventDefault(); }
  });
});
