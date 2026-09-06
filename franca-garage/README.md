# França Garage

Site da França Garage — funilaria, pintura e solda em Imbaú-PR.
HTML, CSS e JS puros, sem build.

## Duas páginas, dois públicos

| Arquivo | Para quem | O que faz |
|---|---|---|
| `index.html` | cliente | Landing com serviços, portfólio antes/depois, FAQ e contato no WhatsApp. |
| `orcamento.html` | oficina | Monta o orçamento (peça e mão de obra separadas) e manda no WhatsApp ou em PDF. |

O `orcamento.html` é ferramenta interna — está com `noindex` e não é linkado
na landing de propósito. Quem precisa dele acessa pelo endereço direto.

## Ferramenta de orçamento

- Peça e mão de obra viram linhas separadas, e o total sai separado também.
- Desconto em reais ou em porcentagem.
- **Mandar no WhatsApp**: monta a mensagem com os itens e abre a conversa do
  cliente. Sem o número preenchido, abre o WhatsApp para escolher o contato.
- **PDF / Imprimir**: gera um orçamento A4 com timbre, itens, total, condições
  e linhas de assinatura.
- **Salvos**: histórico de orçamentos, para reabrir e reenviar.
- **Tabela de preços**: guarda o valor dos serviços que se repetem, e eles
  entram prontos nos próximos orçamentos.

Tudo fica no `localStorage` **do aparelho que montou o orçamento**. Não sobe
para servidor nenhum: o que foi montado no celular não aparece no computador,
e limpar os dados do navegador apaga o histórico.

## Onde você põe os carros

Tudo o que muda está em **um arquivo só: `js/conteudo.js`**. Não precisa mexer
no HTML nem no CSS.

1. Jogue as fotos dentro da pasta `img/`
2. Abra `js/conteudo.js` e escreva o caminho da foto começando com `img/`
3. Salve e suba — o site se monta sozinho

Nome de arquivo **sem espaço e sem acento**:
`img/gol-prata-antes.jpg` funciona, `img/Gol Prata Antes.JPG` não.

O arquivo tem sete partes numeradas:

| Parte | O que é |
|---|---|
| 1. `FUNDOS` | **Foto de fundo decorativa** do topo e da faixa final. Pode ser qualquer carro bonito — não afirma nada. |
| 2. `MOSTRAR_PORTFOLIO` | Liga/desliga a seção antes-e-depois. Nasce `false`. |
| 3. `TRABALHOS` | Os carros do portfólio. Só valem com o item 2 em `true`. |
| 4. `FOTOS_SERVICOS` | As fotos dos quatro cards de cima. Também aceita foto decorativa. |
| 5. `NUMEROS` | Carros entregues, anos de oficina, cidades atendidas. |
| 6. `DEPOIMENTOS` | Comentários de clientes. Começa vazio. |
| 7. `CONTATO` | WhatsApp, Instagram e mapa. |

### Foto decorativa × foto de trabalho

São lugares diferentes de propósito:

- **`FUNDOS` e `FOTOS_SERVICOS`** são decoração. Ilustram, não afirmam. Foto de
  banco de imagem entra aqui sem problema.
- **`TRABALHOS`** é a seção que diz *"Antes e depois, sem retoque de foto"* e
  mostra o veículo e o serviço — ela **afirma** que aquele carro passou pela
  França Garage. Por isso `MOSTRAR_PORTFOLIO` nasce `false`: enquanto não
  houver foto de serviço real, a seção não vai ao ar, e o link "Trabalhos"
  some do menu sozinho.

Em `FUNDOS`, o valor `escuridao` (de 0 a 1) controla o quanto a foto escurece
por baixo do texto. `0.72` é o padrão; suba para `0.85` se a foto for clara e
o texto ficar difícil de ler.

**Campo vazio não vira buraco na página.** Sem foto, fica o fundo listrado.
Sem número, o card some. Sem depoimento, a seção inteira sai do ar. É de
propósito: melhor faltar do que publicar `00` ou depoimento inventado.

### Aviso sobre o telefone

O contato recebido aparece como **+55 42 9918-1070** — 8 dígitos depois do DDD.
Celular no Brasil tem 9. Se o número certo for 99918-1070, troque
`554299181070` por `5542999181070` em `js/conteudo.js` e em `js/orcamento.js`.

## Rodar local

Sem build. Abra o `index.html` no navegador, ou sirva a pasta:

```bash
python3 -m http.server 8000
# http://localhost:8000/           landing
# http://localhost:8000/orcamento.html
```

## Design

Direção monocromática: preto quase puro, sem cor de destaque, tipografia
grande e apertada, cards de borda fina. Tudo sai dos tokens no topo de
`css/site.css` e `css/orcamento.css` — para mudar o visual, mexa só lá.
