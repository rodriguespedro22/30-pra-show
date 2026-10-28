# 30 pra Show

Site de venda de ingressos para shows. Este é o **remaster** de um projeto acadêmico: a primeira versão era uma aplicação em PHP e MySQL, e esta foi refeita do zero com as tecnologias e o cuidado de design de hoje.

> Projeto de demonstração. Artistas, turnês e locais são **fictícios**, e nenhuma compra é real. Tudo fica salvo no `localStorage` do navegador.

## O que o site faz

- **Página inicial com animações de rolagem:** título que entra por linhas, pôsteres que se abrem conforme a rolagem, programação em rolagem horizontal fixa (_Em cartaz_), contadores e um ingresso de chamada final.
- **Catálogo** com busca por texto e filtros de cidade, gênero e mês. Os filtros ficam na URL, então a busca pode ser compartilhada.
- **Página do show** com setores (pista, cadeira, camarote), disponibilidade em tempo real, quantidade e total.
- **Compra** com confirmação animada e controle de estoque por setor.
- **Meus ingressos** com ingresso em formato de canhoto, código e opção de imprimir ou salvar em PDF.
- **Conta** de demonstração (entrar e criar conta) com validação.
- **Administração** (entre com `admin@30prashow.demo`): indicadores, ocupação por show, cadastro e remoção de shows, exportação CSV e relatório para impressão.

## O que mudou em relação à versão original

| | Original (acadêmico) | Remaster |
| --- | --- | --- |
| Front-end | Páginas PHP com jQuery, Bootstrap e Semantic UI | React 19, TypeScript e Tailwind CSS 4 |
| Roteamento | Router PHP no servidor | React Router, com URLs compartilháveis |
| Animações | Plugins jQuery (carrossel, popup) | Motion: animações ligadas à rolagem e transições de layout |
| Visual | Template pronto com fotos de artistas | Pôsteres gerados em SVG, tipografia própria, paleta própria |
| Acessibilidade | Não tratada | Foco visível, rótulos, `aria-live`, "pular para o conteúdo" e respeito a "reduzir movimento" |
| Qualidade | Sem verificação | TypeScript estrito e CI no GitHub Actions |

## Decisões de design

- **Pôsteres como identidade.** Cada show tem cor e forma próprias, desenhadas em SVG. Isso evita fotos de terceiros e dá ao catálogo uma cara única.
- **Canhoto de ingresso** como forma recorrente (cartões e ingressos), com recortes laterais feitos em CSS.
- **Movimento com propósito.** As animações explicam o que mudou (a lista que se reorganiza, o ingresso que cai na tela). Com "reduzir movimento" ativado no sistema, elas diminuem.
- **Tipografia.** Big Shoulders Display nos títulos, como em cartazes de show, e Figtree no texto. As duas são servidas pelo próprio site.

## Como rodar

Precisa do Node.js 20 ou mais novo.

```bash
npm install
npm run dev        # desenvolvimento
npm run build      # build de produção em dist/
npm run typecheck  # verificação de tipos
```

## Estrutura

```
src/
  components/   Poster, ShowCard, Ticket, QR, Nav, Footer, Reveal
  pages/        Home, Shows, ShowDetail, Tickets, Auth, Admin
  data/         shows fictícios e tipos
  lib/          formatação e estado (localStorage)
```

## Tecnologias

React · TypeScript · Vite · Tailwind CSS · Motion · React Router

## Autor

Pedro Rodrigues da Cunha · [LinkedIn](https://www.linkedin.com/in/pedrorodrigues2) · [GitHub](https://github.com/rodriguespedro22)
