# ruflo-novo

Base para sites estáticos: HTML, CSS e JS puros, sem build, publicação no Netlify.

## Estrutura

```
index.html        página inicial
css/style.css     estilos (tokens de cor/espaçamento no :root)
js/script.js      interações (menu mobile, ano do rodapé, reveal on scroll)
img/              imagens do projeto
netlify.toml      configuração de publicação
```

## Rodar localmente

Não há build. Abra o `index.html` no navegador, ou sirva a pasta:

```bash
python3 -m http.server 8000
# depois abra http://localhost:8000
```

## Publicar no Netlify

1. No Netlify: **Add new site → Import an existing project** e escolha este repositório.
2. Build command: deixe vazio. Publish directory: `.` (já definido no `netlify.toml`).
3. Cada push na branch `main` republica o site.

## Convenções

- Sem framework e sem dependências: só HTML, CSS e JS.
- Cores, fontes e espaçamentos ficam nas variáveis CSS no topo do `style.css`.
- Textos em pt-BR.
