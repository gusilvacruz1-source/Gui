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

## O que falta preencher

Ficou marcado no código, é só procurar:

- `data-foto` — os lugares onde entram as fotos (serviços e antes/depois).
- `data-conferir="numero"` — os três números da seção "Resultado" estão em `00`.
- `data-conferir="depoimento"` — os três depoimentos são texto de espera.
- `CONTATO.whatsapp` em `js/site.js` e `OFICINA` em `js/orcamento.js` — dados
  da oficina, inclusive o número do WhatsApp (ver aviso abaixo).

### Aviso sobre o telefone

O contato recebido aparece como **+55 42 9918-1070** — 8 dígitos depois do DDD.
Celular no Brasil tem 9. Se o número certo for 99918-1070, troque
`554299181070` por `5542999181070` nos dois arquivos JS.

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
