/* =========================================================================
   França Garage — montador de orçamento (uso interno da oficina)
   Sem dependências. Os dados ficam no navegador desta máquina (localStorage).
   ========================================================================= */

const OFICINA = {
  nome: 'França Garage',
  ramo: 'Funilaria, Pintura e Solda',
  endereco: 'Rua Políbio Meira Cotrim, 303 — Bela Vista, Imbaú-PR',
  // Confira este número: o contato veio como "+55 42 9918-1070".
  telefone: '(42) 9918-1070',
  instagram: '@franca_garage_',
};

/* Serviços que a oficina repete. Preço fica em branco de propósito —
   funilaria depende do estrago. A oficina preenche e o valor é guardado. */
const CATALOGO_PADRAO = [
  { tipo: 'mao',  descricao: 'Funilaria — reparo de amassado', valor: 0 },
  { tipo: 'mao',  descricao: 'Funilaria — troca de painel/lateral', valor: 0 },
  { tipo: 'mao',  descricao: 'Pintura — peça avulsa', valor: 0 },
  { tipo: 'mao',  descricao: 'Pintura — lateral completa', valor: 0 },
  { tipo: 'mao',  descricao: 'Pintura — veículo completo', valor: 0 },
  { tipo: 'mao',  descricao: 'Polimento', valor: 0 },
  { tipo: 'mao',  descricao: 'Solda — estrutura/suporte', valor: 0 },
  { tipo: 'mao',  descricao: 'Alinhamento de lataria', valor: 0 },
  { tipo: 'mao',  descricao: 'Desmontagem e montagem', valor: 0 },
  { tipo: 'peca', descricao: 'Para-choque', valor: 0 },
  { tipo: 'peca', descricao: 'Farol', valor: 0 },
  { tipo: 'peca', descricao: 'Retrovisor', valor: 0 },
  { tipo: 'peca', descricao: 'Massa e lixa', valor: 0 },
  { tipo: 'peca', descricao: 'Tinta e verniz', valor: 0 },
];

const CHAVE = {
  rascunho: 'fg:orcamento:rascunho',
  salvos:   'fg:orcamentos',
  contador: 'fg:contador',
  catalogo: 'fg:catalogo',
};

/* ===================== Armazenamento ===================== */
/* Sempre em try/catch: navegador anônimo ou site data bloqueado joga erro. */
const guardar = (chave, valor) => {
  try { localStorage.setItem(chave, JSON.stringify(valor)); return true; }
  catch { return false; }
};

const ler = (chave, padrao) => {
  try {
    const cru = localStorage.getItem(chave);
    return cru ? JSON.parse(cru) : padrao;
  } catch { return padrao; }
};

/* ===================== Números e datas ===================== */
const dinheiro = (n) =>
  (Number(n) || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

/* Aceita "1.234,56", "1234,56" e "1234.56". */
const paraNumero = (texto) => {
  if (typeof texto === 'number') return texto;
  const limpo = String(texto ?? '').trim().replace(/[^\d,.-]/g, '');
  if (!limpo) return 0;
  const n = limpo.includes(',')
    ? Number(limpo.replace(/\./g, '').replace(',', '.'))
    : Number(limpo);
  return Number.isFinite(n) ? n : 0;
};

const hoje = () => new Date().toISOString().slice(0, 10);

const dataBR = (iso) => {
  if (!iso) return '';
  const [a, m, d] = iso.split('-');
  return `${d}/${m}/${a}`;
};

const somaDias = (iso, dias) => {
  const d = new Date(`${iso}T12:00:00`);
  d.setDate(d.getDate() + Number(dias));
  return d.toISOString().slice(0, 10);
};

const soDigitos = (t) => String(t ?? '').replace(/\D/g, '');

const formataFone = (t) => {
  const d = soDigitos(t).slice(0, 11);
  if (d.length <= 2) return d;
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
};

/* ===================== Estado ===================== */
const orcamentoVazio = () => ({
  numero: String(ler(CHAVE.contador, 1)).padStart(4, '0'),
  data: hoje(),
  validade: '15',
  cliente: { nome: '', fone: '' },
  veiculo: { modelo: '', ano: '', cor: '', placa: '' },
  itens: [],
  condicoes: { descontoValor: '', descontoTipo: 'reais', prazo: '', pagamento: '', observacoes: '' },
});

let orc = ler(CHAVE.rascunho, null) || orcamentoVazio();
let catalogo = ler(CHAVE.catalogo, CATALOGO_PADRAO);

/* ===================== Atalhos de DOM ===================== */
const $ = (sel) => document.querySelector(sel);
const corpoItens = $('#corpoItens');

/* ===================== Cálculo ===================== */
function totais() {
  const soma = (tipo) => orc.itens
    .filter((i) => i.tipo === tipo)
    .reduce((t, i) => t + paraNumero(i.qtd) * paraNumero(i.valor), 0);

  const pecas = soma('peca');
  const mao = soma('mao');
  const bruto = pecas + mao;

  const d = paraNumero(orc.condicoes.descontoValor);
  const desconto = orc.condicoes.descontoTipo === 'porcento'
    ? bruto * (Math.min(d, 100) / 100)
    : Math.min(d, bruto);

  return { pecas, mao, bruto, desconto, total: bruto - desconto };
}

/* ===================== Desenho da tabela ===================== */
function desenhaItens() {
  corpoItens.textContent = '';

  orc.itens.forEach((item, i) => {
    const tr = document.createElement('tr');

    tr.innerHTML = `
      <td>
        <select data-i="${i}" data-c="tipo" aria-label="Tipo do item ${i + 1}">
          <option value="peca">Peça</option>
          <option value="mao">Mão de obra</option>
        </select>
      </td>
      <td><input type="text" data-i="${i}" data-c="descricao" placeholder="O que é" aria-label="Descrição do item ${i + 1}"></td>
      <td><input type="text" class="num" data-i="${i}" data-c="qtd" inputmode="decimal" aria-label="Quantidade do item ${i + 1}"></td>
      <td><input type="text" class="num" data-i="${i}" data-c="valor" inputmode="decimal" placeholder="0,00" aria-label="Valor unitário do item ${i + 1}"></td>
      <td class="col-total"><span class="subtotal"></span></td>
      <td><button type="button" class="remover" data-remove="${i}" aria-label="Remover item ${i + 1}">×</button></td>
    `;

    tr.querySelector('[data-c="tipo"]').value = item.tipo;
    tr.querySelector('[data-c="descricao"]').value = item.descricao;
    tr.querySelector('[data-c="qtd"]').value = item.qtd;
    tr.querySelector('[data-c="valor"]').value = item.valor;
    tr.querySelector('.subtotal').textContent =
      dinheiro(paraNumero(item.qtd) * paraNumero(item.valor));

    corpoItens.appendChild(tr);
  });

  $('#itensVazio').hidden = orc.itens.length > 0;
}

function desenhaTotais() {
  const t = totais();
  $('#totPecas').textContent = dinheiro(t.pecas);
  $('#totMao').textContent = dinheiro(t.mao);
  $('#totGeral').textContent = dinheiro(t.total);
  $('#linhaDesconto').hidden = t.desconto <= 0;
  $('#totDesconto').textContent = `− ${dinheiro(t.desconto)}`;
}

function desenhaCabecalho() {
  $('#numero').value = orc.numero;
  $('#data').value = orc.data;
  $('#validade').value = orc.validade;
  $('#clienteNome').value = orc.cliente.nome;
  $('#clienteFone').value = orc.cliente.fone;
  $('#veicModelo').value = orc.veiculo.modelo;
  $('#veicAno').value = orc.veiculo.ano;
  $('#veicCor').value = orc.veiculo.cor;
  $('#veicPlaca').value = orc.veiculo.placa;
  $('#descontoValor').value = orc.condicoes.descontoValor;
  $('#descontoTipo').value = orc.condicoes.descontoTipo;
  $('#prazo').value = orc.condicoes.prazo;
  $('#pagamento').value = orc.condicoes.pagamento;
  $('#observacoes').value = orc.condicoes.observacoes;
}

function desenhaTudo() {
  desenhaCabecalho();
  desenhaItens();
  desenhaTotais();
}

const salvaRascunho = () => guardar(CHAVE.rascunho, orc);

/* ===================== Aviso rápido ===================== */
let tempoAviso;
function avisa(texto) {
  const el = $('#aviso');
  el.textContent = texto;
  el.hidden = false;
  clearTimeout(tempoAviso);
  tempoAviso = setTimeout(() => { el.hidden = true; }, 2600);
}

/* ===================== Campos do cabeçalho ===================== */
document.querySelectorAll('[data-campo]').forEach((campo) => {
  campo.addEventListener('input', () => {
    const caminho = campo.dataset.campo.split('.');
    let alvo = orc;
    while (caminho.length > 1) alvo = alvo[caminho.shift()];
    alvo[caminho[0]] = campo.value;

    if (campo.id === 'descontoValor' || campo.id === 'descontoTipo') desenhaTotais();
    salvaRascunho();
  });
});

$('#clienteFone').addEventListener('blur', (e) => {
  e.target.value = formataFone(e.target.value);
  orc.cliente.fone = e.target.value;
  const d = soDigitos(e.target.value);
  $('#notaFone').textContent =
    (d.length && d.length < 10) ? 'Número curto — confira o DDD.' : '';
  salvaRascunho();
});

$('#veicPlaca').addEventListener('blur', (e) => {
  e.target.value = e.target.value.toUpperCase().trim();
  orc.veiculo.placa = e.target.value;
  salvaRascunho();
});

/* ===================== Itens ===================== */
function addItem(tipo, descricao = '', valor = '') {
  orc.itens.push({ tipo, descricao, qtd: '1', valor: valor ? String(valor) : '' });
  desenhaItens();
  desenhaTotais();
  salvaRascunho();

  const linhas = corpoItens.querySelectorAll('tr');
  const ultima = linhas[linhas.length - 1];
  if (ultima) ultima.querySelector('[data-c="descricao"]').focus();
}

$('#btnAddPeca').addEventListener('click', () => addItem('peca'));
$('#btnAddMao').addEventListener('click', () => addItem('mao'));

corpoItens.addEventListener('input', (e) => {
  const campo = e.target.closest('[data-i]');
  if (!campo) return;

  orc.itens[Number(campo.dataset.i)][campo.dataset.c] = campo.value;

  const linha = campo.closest('tr');
  const item = orc.itens[Number(campo.dataset.i)];
  linha.querySelector('.subtotal').textContent =
    dinheiro(paraNumero(item.qtd) * paraNumero(item.valor));

  desenhaTotais();
  salvaRascunho();
});

corpoItens.addEventListener('click', (e) => {
  const botao = e.target.closest('[data-remove]');
  if (!botao) return;
  orc.itens.splice(Number(botao.dataset.remove), 1);
  desenhaItens();
  desenhaTotais();
  salvaRascunho();
});

/* Enter no valor abre a próxima linha do mesmo tipo. */
corpoItens.addEventListener('keydown', (e) => {
  if (e.key !== 'Enter') return;
  const campo = e.target.closest('[data-c="valor"]');
  if (!campo) return;
  e.preventDefault();
  addItem(orc.itens[Number(campo.dataset.i)].tipo);
});

/* ===================== Painel lateral ===================== */
const painel = $('#painel');
const veu = $('#veu');

function abrePainel(titulo, montaCorpo) {
  $('#painelTitulo').textContent = titulo;
  const corpo = $('#painelCorpo');
  corpo.textContent = '';
  montaCorpo(corpo);
  painel.hidden = false;
  veu.hidden = false;
  $('#painelFechar').focus();
}

function fechaPainel() {
  painel.hidden = true;
  veu.hidden = true;
}

$('#painelFechar').addEventListener('click', fechaPainel);
veu.addEventListener('click', fechaPainel);
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !painel.hidden) fechaPainel();
});

/* ---------- Serviços frequentes ---------- */
$('#btnCatalogo').addEventListener('click', () => {
  abrePainel('Serviços frequentes', (corpo) => {
    const nota = document.createElement('p');
    nota.className = 'painel__nota';
    nota.textContent = 'Toque para jogar no orçamento. O valor salvo vem junto.';
    corpo.appendChild(nota);

    const lista = document.createElement('div');
    lista.className = 'lista';

    catalogo.forEach((s) => {
      const item = document.createElement('button');
      item.type = 'button';
      item.className = 'lista__item';
      item.innerHTML = `
        <span class="lista__texto">
          <span class="lista__titulo"></span>
          <span class="lista__sub">${s.tipo === 'peca' ? 'Peça' : 'Mão de obra'}</span>
        </span>
        <span class="lista__valor">${s.valor ? dinheiro(s.valor) : 'sem valor'}</span>
      `;
      item.querySelector('.lista__titulo').textContent = s.descricao;
      item.addEventListener('click', () => {
        addItem(s.tipo, s.descricao, s.valor || '');
        fechaPainel();
      });
      lista.appendChild(item);
    });

    corpo.appendChild(lista);
  });
});

/* ---------- Tabela de preços ---------- */
$('#btnTabela').addEventListener('click', () => {
  abrePainel('Tabela de preços', (corpo) => {
    const nota = document.createElement('p');
    nota.className = 'painel__nota';
    nota.textContent = 'Preencha o que já tem valor fechado. Fica salvo neste aparelho e aparece nos próximos orçamentos.';
    corpo.appendChild(nota);

    const caixa = document.createElement('div');
    caixa.className = 'tabela-preco';

    catalogo.forEach((s, i) => {
      const linha = document.createElement('div');
      linha.className = 'tabela-preco__linha';

      const nome = document.createElement('span');
      nome.textContent = s.descricao;

      const valor = document.createElement('input');
      valor.type = 'text';
      valor.className = 'num';
      valor.inputMode = 'decimal';
      valor.placeholder = '0,00';
      valor.value = s.valor ? String(s.valor).replace('.', ',') : '';
      valor.setAttribute('aria-label', `Valor de ${s.descricao}`);
      valor.addEventListener('input', () => {
        catalogo[i].valor = paraNumero(valor.value);
        guardar(CHAVE.catalogo, catalogo);
      });

      linha.append(nome, valor);
      caixa.appendChild(linha);
    });

    corpo.appendChild(caixa);
  });
});

/* ---------- Orçamentos salvos ---------- */
$('#btnHistorico').addEventListener('click', () => {
  abrePainel('Orçamentos salvos', (corpo) => {
    const salvos = ler(CHAVE.salvos, []);

    if (!salvos.length) {
      const vazio = document.createElement('p');
      vazio.className = 'painel__vazio';
      vazio.textContent = 'Nenhum orçamento salvo ainda.';
      corpo.appendChild(vazio);
      return;
    }

    const lista = document.createElement('div');
    lista.className = 'lista';

    salvos.slice().reverse().forEach((s) => {
      const item = document.createElement('button');
      item.type = 'button';
      item.className = 'lista__item';
      item.innerHTML = `
        <span class="lista__texto">
          <span class="lista__titulo"></span>
          <span class="lista__sub"></span>
        </span>
        <span class="lista__valor">${dinheiro(s.total)}</span>
      `;
      item.querySelector('.lista__titulo').textContent =
        `Nº ${s.numero} — ${s.cliente.nome || 'sem nome'}`;
      item.querySelector('.lista__sub').textContent =
        `${dataBR(s.data)} · ${s.veiculo.modelo || 'veículo não informado'}`;

      item.addEventListener('click', () => {
        orc = JSON.parse(JSON.stringify(s.dados));
        desenhaTudo();
        salvaRascunho();
        fechaPainel();
        avisa(`Orçamento nº ${s.numero} aberto`);
      });

      lista.appendChild(item);
    });

    corpo.appendChild(lista);
  });
});

/* ===================== Salvar / novo ===================== */
$('#btnSalvar').addEventListener('click', () => {
  if (!orc.itens.length) { avisa('Adicione ao menos um item'); return; }

  const salvos = ler(CHAVE.salvos, []);
  const registro = {
    numero: orc.numero,
    data: orc.data,
    cliente: orc.cliente,
    veiculo: orc.veiculo,
    total: totais().total,
    dados: JSON.parse(JSON.stringify(orc)),
  };

  const jaTem = salvos.findIndex((s) => s.numero === orc.numero);
  if (jaTem >= 0) salvos[jaTem] = registro; else salvos.push(registro);

  avisa(guardar(CHAVE.salvos, salvos) ? 'Orçamento salvo' : 'Não deu para salvar neste navegador');
});

$('#btnNovo').addEventListener('click', () => {
  if (orc.itens.length && !confirm('Começar um orçamento novo? O atual some se não estiver salvo.')) return;

  const proximo = Number(ler(CHAVE.contador, 1)) + 1;
  guardar(CHAVE.contador, proximo);

  orc = orcamentoVazio();
  orc.numero = String(proximo).padStart(4, '0');
  desenhaTudo();
  salvaRascunho();
  avisa(`Orçamento nº ${orc.numero}`);
});

/* ===================== WhatsApp ===================== */
function mensagem() {
  const t = totais();
  const linhas = [];

  linhas.push(`*${OFICINA.nome}* — ${OFICINA.ramo}`);
  linhas.push(`Orçamento nº ${orc.numero} · ${dataBR(orc.data)}`);
  linhas.push('');

  if (orc.cliente.nome) linhas.push(`Cliente: ${orc.cliente.nome}`);

  const veic = [orc.veiculo.modelo, orc.veiculo.ano, orc.veiculo.cor].filter(Boolean).join(' · ');
  if (veic) linhas.push(`Veículo: ${veic}${orc.veiculo.placa ? ` (${orc.veiculo.placa})` : ''}`);
  if (veic || orc.cliente.nome) linhas.push('');

  const bloco = (titulo, tipo) => {
    const itens = orc.itens.filter((i) => i.tipo === tipo && (i.descricao || paraNumero(i.valor)));
    if (!itens.length) return;
    linhas.push(`*${titulo}*`);
    itens.forEach((i) => {
      const qtd = paraNumero(i.qtd) || 1;
      const sub = qtd * paraNumero(i.valor);
      linhas.push(`• ${i.descricao || 'item'} — ${qtd}x ${dinheiro(paraNumero(i.valor))} = ${dinheiro(sub)}`);
    });
    linhas.push('');
  };

  bloco('Peças', 'peca');
  bloco('Mão de obra', 'mao');

  if (t.desconto > 0) {
    linhas.push(`Subtotal: ${dinheiro(t.bruto)}`);
    linhas.push(`Desconto: − ${dinheiro(t.desconto)}`);
  }
  linhas.push(`*TOTAL: ${dinheiro(t.total)}*`);
  linhas.push('');

  if (orc.condicoes.prazo) linhas.push(`Prazo: ${orc.condicoes.prazo}`);
  if (orc.condicoes.pagamento) linhas.push(`Pagamento: ${orc.condicoes.pagamento}`);
  if (orc.validade) linhas.push(`Validade: até ${dataBR(somaDias(orc.data, orc.validade))}`);
  if (orc.condicoes.observacoes) { linhas.push(''); linhas.push(orc.condicoes.observacoes); }

  linhas.push('');
  linhas.push(`${OFICINA.endereco}`);
  linhas.push(`${OFICINA.telefone} · ${OFICINA.instagram}`);

  return linhas.join('\n');
}

$('#btnWhats').addEventListener('click', () => {
  if (!orc.itens.length) { avisa('Adicione ao menos um item'); return; }

  const destino = soDigitos(orc.cliente.fone);
  const texto = encodeURIComponent(mensagem());

  // Sem número do cliente, abre o WhatsApp para escolher o contato na hora.
  const url = destino.length >= 10
    ? `https://wa.me/55${destino}?text=${texto}`
    : `https://wa.me/?text=${texto}`;

  window.open(url, '_blank', 'noopener');
});

/* ===================== Impressão / PDF ===================== */
function montaImpressao() {
  const t = totais();

  const linhasDe = (tipo, titulo) => {
    const itens = orc.itens.filter((i) => i.tipo === tipo && (i.descricao || paraNumero(i.valor)));
    if (!itens.length) return '';
    const corpo = itens.map((i) => {
      const qtd = paraNumero(i.qtd) || 1;
      return `<tr>
        <td>${escapa(i.descricao || 'item')}</td>
        <td class="n">${qtd}</td>
        <td class="n">${dinheiro(paraNumero(i.valor))}</td>
        <td class="n">${dinheiro(qtd * paraNumero(i.valor))}</td>
      </tr>`;
    }).join('');
    return `<tr class="doc__grupo"><td colspan="4">${titulo}</td></tr>${corpo}`;
  };

  const veic = [orc.veiculo.modelo, orc.veiculo.ano, orc.veiculo.cor].filter(Boolean).join(' · ');

  $('#impressao').innerHTML = `
    <div class="doc__topo">
      <div class="doc__marca">
        <h1>${OFICINA.nome}</h1>
        <p>${OFICINA.ramo}<br>${OFICINA.endereco}<br>${OFICINA.telefone} · ${OFICINA.instagram}</p>
      </div>
      <div class="doc__meta">
        <strong>Orçamento nº ${escapa(orc.numero)}</strong><br>
        ${dataBR(orc.data)}
        ${orc.validade ? `<br>Válido até ${dataBR(somaDias(orc.data, orc.validade))}` : ''}
      </div>
    </div>

    <div class="doc__secao">
      <p class="doc__rotulo">Cliente</p>
      <p class="doc__par">${escapa(orc.cliente.nome || '—')}${orc.cliente.fone ? ` · ${escapa(orc.cliente.fone)}` : ''}</p>
    </div>

    <div class="doc__secao">
      <p class="doc__rotulo">Veículo</p>
      <p class="doc__par">${escapa(veic || '—')}${orc.veiculo.placa ? ` · Placa ${escapa(orc.veiculo.placa)}` : ''}</p>
    </div>

    <div class="doc__secao">
      <table class="doc__tabela">
        <thead>
          <tr><th>Descrição</th><th class="n">Qtd</th><th class="n">Valor unit.</th><th class="n">Subtotal</th></tr>
        </thead>
        <tbody>
          ${linhasDe('peca', 'Peças')}
          ${linhasDe('mao', 'Mão de obra')}
        </tbody>
      </table>

      <div class="doc__totais">
        <div><span>Peças</span><span>${dinheiro(t.pecas)}</span></div>
        <div><span>Mão de obra</span><span>${dinheiro(t.mao)}</span></div>
        ${t.desconto > 0 ? `<div><span>Desconto</span><span>− ${dinheiro(t.desconto)}</span></div>` : ''}
        <div class="tot"><span>Total</span><span>${dinheiro(t.total)}</span></div>
      </div>
    </div>

    ${(orc.condicoes.prazo || orc.condicoes.pagamento || orc.condicoes.observacoes) ? `
    <div class="doc__secao">
      <p class="doc__rotulo">Condições</p>
      <p class="doc__par">
        ${orc.condicoes.prazo ? `Prazo de execução: ${escapa(orc.condicoes.prazo)}<br>` : ''}
        ${orc.condicoes.pagamento ? `Pagamento: ${escapa(orc.condicoes.pagamento)}<br>` : ''}
        ${orc.condicoes.observacoes ? escapa(orc.condicoes.observacoes).replace(/\n/g, '<br>') : ''}
      </p>
    </div>` : ''}

    <div class="doc__assina">
      <div>${OFICINA.nome}</div>
      <div>${escapa(orc.cliente.nome || 'Cliente')}</div>
    </div>

    <p class="doc__rodape">
      Orçamento sujeito a revisão caso apareça dano não visível na avaliação inicial.
    </p>
  `;
}

/* Escapa o que o usuário digitou antes de virar HTML do documento. */
function escapa(texto) {
  const d = document.createElement('div');
  d.textContent = String(texto ?? '');
  return d.innerHTML;
}

$('#btnImprimir').addEventListener('click', () => {
  if (!orc.itens.length) { avisa('Adicione ao menos um item'); return; }
  montaImpressao();
  window.print();
});

window.addEventListener('beforeprint', montaImpressao);

/* ===================== Início ===================== */
desenhaTudo();
