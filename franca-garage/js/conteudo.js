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
   1) OS CARROS DO PORTFÓLIO  (antes e depois)

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
   2) AS FOTOS DOS SERVIÇOS  (os quatro cards de cima)

   Uma foto boa de cada coisa. Deixe '' que fica o fundo listrado.
   ------------------------------------------------------------------------- */
const FOTOS_SERVICOS = {
  funilaria: '',    // Ex.: 'img/funilaria.jpg'
  pintura:   '',
  solda:     '',
  orcamento: '',    // Foto de um orçamento impresso, ou da oficina
};


/* -------------------------------------------------------------------------
   3) OS NÚMEROS DA OFICINA

   Só ponha número que seja verdade. Se não souber, deixe '' que o card
   some da página — melhor sumir do que mentir.
   ------------------------------------------------------------------------- */
const NUMEROS = [
  { valor: '', rotulo: 'Carros entregues',  nota: 'Quantos carros já saíram daqui.' },
  { valor: '', rotulo: 'Anos de oficina',   nota: 'Há quanto tempo a França Garage trabalha.' },
  { valor: '', rotulo: 'Cidades atendidas', nota: 'Imbaú e as cidades da região.' },
];


/* -------------------------------------------------------------------------
   4) OS DEPOIMENTOS

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
   5) OS DADOS DA OFICINA

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
