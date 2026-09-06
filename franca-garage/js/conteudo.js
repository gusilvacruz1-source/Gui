/* =========================================================================
   FRANÇA GARAGE — O ARQUIVO PARA MEXER

   É AQUI que você põe os carros, as fotos, os números e os depoimentos.
   Não precisa mexer em mais nada. A página se monta a partir daqui.

   Regra das fotos:
   1. Jogue a foto dentro da pasta  img/
   2. Escreva o caminho aqui, começando com  img/
   3. Nome do arquivo sem espaço e sem acento:
        certo  ->  img/gol-prata-antes.jpg
        errado ->  img/Gol Prata Antes.JPG
   ========================================================================= */


/* -------------------------------------------------------------------------
   1) FOTOS DE FUNDO  (decoração — pode ser qualquer carro bonito)

   Estas fotos são só enfeite. Não afirmam nada, não dizem que o carro passou
   pela oficina. É o lugar certo para foto de banco de imagem, foto de carro
   da internet ou foto que você achou bonita.

   'escuridao' é o quanto a foto escurece por baixo do texto: 0 mostra a foto
   inteira e o texto some, 1 apaga a foto. 0.72 é um bom meio-termo — suba
   para 0.85 se a foto for clara e o texto ficar difícil de ler.
   ------------------------------------------------------------------------- */
const FUNDOS = {
  hero:      'img/vectra-preto.jpg',      // Foto do topo (também é o cartaz do vídeo)

  // VÍDEO NO TOPO — opcional. Deixe '' para ficar só a foto.
  // Suba o arquivo em img/ e escreva o caminho aqui. Ex.: 'img/drift.mp4'
  // Leia o aviso do vídeo no README antes: peso, formato e direitos.
  hero_video: '',
  chamada:   'img/chevette-dourado.jpg', // Chevette dourado — fundo da faixa final
  escuridao: 0.72,   // 0 a 1

  // A faixa final tem texto por cima da foto inteira, então precisa escurecer
  // mais. Se apagar esta linha, ela usa a escuridão acima + 0.14.
  escuridao_chamada: 0.86,

  // O site é preto e branco. Deixe true que a foto entra sem cor e combina
  // com o resto. Troque para false se quiser a cor original da foto.
  preto_e_branco: true,
};


/* -------------------------------------------------------------------------
   2) O PORTFÓLIO — ATENÇÃO

   Esta seção diz "Antes e depois, sem retoque de foto" e mostra o veículo e
   o serviço. Ela afirma que aquele carro passou pela França Garage.

   Por isso ela nasce DESLIGADA. Só ligue quando tiver foto de trabalho de
   verdade — carro que a oficina atendeu, antes e depois. Foto decorativa
   não entra aqui; vai em FUNDOS, ali em cima.

   Para ligar: troque false por true.
   ------------------------------------------------------------------------- */
const MOSTRAR_PORTFOLIO = false;


/* -------------------------------------------------------------------------
   3) OS CARROS DO PORTFÓLIO  (só valem se MOSTRAR_PORTFOLIO estiver true)

   Cada bloco { ... } é um carro. Para adicionar outro, copie um bloco
   inteiro, cole embaixo e troque as informações. Pode ter quantos quiser.
   Para tirar um do ar, apague o bloco ou ponha // na frente das linhas.
   ------------------------------------------------------------------------- */
const TRABALHOS = [
  {
    veiculo: 'Trocar pelo veículo',      // Ex.: 'Gol G6 2014'
    servico: 'Funilaria e pintura',      // O que foi feito
    antes:   '',                         // Ex.: 'img/gol-antes.jpg'
    depois:  '',                         // Ex.: 'img/gol-depois.jpg'
  },
  {
    veiculo: 'Trocar pelo veículo',
    servico: 'Solda e lataria',
    antes:   '',
    depois:  '',
  },
  {
    veiculo: 'Trocar pelo veículo',
    servico: 'Pintura completa',
    antes:   '',
    depois:  '',
  },
];


/* -------------------------------------------------------------------------
   4) AS FOTOS DOS SERVIÇOS  (os quatro cards de cima)

   Aqui pode ser foto decorativa também — os cards não dizem que o carro é
   cliente da oficina, só ilustram o serviço. Deixe '' que fica o fundo
   listrado.
   ------------------------------------------------------------------------- */
const FOTOS_SERVICOS = {
  funilaria: '',    // Ex.: 'img/funilaria.jpg'
  pintura:   '',
  solda:     '',
  orcamento: '',    // Foto de um orçamento impresso, ou da oficina
};


/* -------------------------------------------------------------------------
   5) OS NÚMEROS DA OFICINA

   Só ponha número que seja verdade. Se não souber, deixe '' que o card
   some da página — melhor sumir do que mentir.
   ------------------------------------------------------------------------- */
const NUMEROS = [
  { valor: '', rotulo: 'Carros entregues',  nota: 'Quantos carros já saíram daqui.' },
  { valor: '', rotulo: 'Anos de oficina',   nota: 'Há quanto tempo a França Garage trabalha.' },
  { valor: '', rotulo: 'Cidades atendidas', nota: 'Imbaú e as cidades da região.' },
];


/* -------------------------------------------------------------------------
   6) OS DEPOIMENTOS

   Use só comentário real de cliente, e peça autorização antes de publicar.
   Deixe a lista vazia assim  ->  const DEPOIMENTOS = [];
   que a seção inteira some da página.
   ------------------------------------------------------------------------- */
const DEPOIMENTOS = [
  // {
  //   texto:   'Levei meu carro depois de uma batida e voltou igual novo.',
  //   nome:    'Nome do cliente',
  //   veiculo: 'Gol G6 2014',
  // },
];


/* -------------------------------------------------------------------------
   7) OS DADOS DA OFICINA

   ATENÇÃO NO TELEFONE: o número precisa ser  55 + DDD + número, só dígitos.
   O contato que você mandou aparece como (42) 9918-1070 — 8 dígitos depois
   do DDD, e celular no Brasil tem 9. Se o certo for 99918-1070, troque
   '554299181070' por '5542999181070' aqui embaixo.
   ------------------------------------------------------------------------- */
const CONTATO = {
  whatsapp:  '554299181070',
  mensagem:  'Olá! Vim pelo site da França Garage. Queria um orçamento — vou mandar a foto do dano, o modelo e o ano do carro.',
  instagram: 'https://www.instagram.com/franca_garage_/',
  mapa:      'https://maps.app.goo.gl/7gZPCvxCB3j1DCh47',
};
