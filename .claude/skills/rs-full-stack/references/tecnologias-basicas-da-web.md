---
name: rs-full-stack-tecnologias-basicas-da-web
description: "Applies web technology stack mental model when user asks to 'choose a stack', 'what technology should I use', 'frontend vs backend', 'start a web project', or 'learn web development'. Maps HTML/CSS/JS roles on frontend and language/database choices on backend. Make sure to use this skill whenever the user needs guidance on web technology selection or architecture decisions for web projects. Not for deep implementation details, framework comparisons, or DevOps/deployment topics."
---

# Tecnologias Basicas da Web

> Cada tecnologia web tem um papel especifico: estrutura, estilo, inteligencia no frontend; linguagem de programacao e banco de dados no backend.

## Key concept

A web se divide em duas camadas: **frontend** (o que o usuario ve e interage no navegador) e **backend** (o que roda no servidor, processa dados e os armazena). No frontend, tres tecnologias sao fundamentais e insubstituiveis. No backend, ha liberdade de escolha entre diversas linguagens, mas sempre sera necessaria uma linguagem de consulta a banco de dados.

A armadilha mais comum e tentar aprender tudo ao mesmo tempo. Cada tecnologia tem seu **momento oportuno** — domine uma antes de partir para a proxima.

## Decision framework

| Quando voce encontrar | Aplique |
|----------------------|---------|
| Precisa estruturar conteudo (texto, links, imagens, video) | HTML — linguagem de marcacao, transforma texto puro em conteudo navegavel |
| Precisa estilizar e tornar bonito | CSS — linguagem de estilo, controla aparencia do HTML |
| Precisa de interatividade e logica no navegador | JavaScript — linguagem de programacao nativa do browser |
| Precisa rodar JS fora do navegador | Node.js ou Bun — runtimes que executam JS no servidor |
| Precisa de backend com outra linguagem | Java, Python, C#, PHP — escolha UMA e domine |
| Precisa armazenar e consultar dados com seguranca | SQL (relacional) ou NoSQL (nao-relacional) |
| Quer aprender tudo ao mesmo tempo | PARE — escolha uma tecnologia por camada e aprofunde |

## How to think about it

### Frontend: a triade obrigatoria

HTML e como a pagina de um livro — so que ao inves de texto puro, voce pode criar links que levam a outras paginas, inserir imagens e videos. E a **estrutura**.

CSS e o que transforma essa estrutura em algo bonito ou feio. Um site sem CSS e funcional mas visualmente cru. HTML + CSS juntos determinam a **aparencia** de qualquer site.

JavaScript e a **inteligencia**. Ele ja vive dentro do navegador (Chrome, Firefox, Safari). Sem ele, o site e estatico — com ele, voce tem interacao, animacoes, logica.

**Analogia do instrutor:** HTML = estrutura, CSS = beleza, JavaScript = inteligencia. Tres papeis distintos que se complementam.

### Backend: liberdade de escolha

No backend, diferente do frontend, nao existe uma unica resposta. Voce escolhe a linguagem que melhor se adapta ao seu contexto. O JavaScript, que normalmente vive no navegador, pode rodar no servidor atraves do Node.js ou Bun.

Alem da linguagem de programacao, voce precisara de uma **linguagem de consulta a banco de dados** (SQL ou NoSQL) para armazenar e recuperar dados de forma segura.

### O principio do momento oportuno

Nao estude Java, Python, PHP e C# ao mesmo tempo para fazer a mesma coisa no backend. Escolha UMA linguagem, entenda profundamente como o backend funciona com ela. Depois, se necessario, migre ou adicione outra. O mesmo vale para bancos de dados — comece com SQL ou NoSQL, nao ambos simultaneamente.

## Common misconceptions

| As pessoas pensam | Realidade |
|-------------------|-----------|
| Preciso aprender todas as linguagens de backend | Domine UMA primeiro; os conceitos transferem entre linguagens |
| JavaScript so funciona no navegador | Com Node.js ou Bun, JS roda no servidor como qualquer linguagem backend |
| HTML e uma linguagem de programacao | HTML e linguagem de **marcacao** — estrutura conteudo, nao tem logica |
| CSS e opcional | Sem CSS, qualquer site e visualmente cru; HTML + CSS sao inseparaveis na pratica |
| SQL e NoSQL competem entre si | Sao abordagens diferentes para problemas diferentes; nao sao mutuamente exclusivos |
| Quanto mais tecnologias eu souber, melhor | Profundidade numa stack vence amplitude superficial em todas |

## When to apply

- Ao iniciar um novo projeto web e precisar definir a stack
- Ao orientar alguem que esta comecando na programacao web
- Ao avaliar se uma tecnologia e de frontend ou backend
- Ao decidir qual linguagem de backend adotar
- Ao planejar uma trilha de aprendizado em desenvolvimento web

## Limitations

- Este modelo nao cobre frameworks especificos (React, Next.js, Django, Spring)
- Nao aborda DevOps, deploy, CI/CD ou infraestrutura
- Nao detalha as diferencas entre bancos SQL vs NoSQL
- Nao substitui a necessidade de aprofundamento em cada tecnologia individualmente

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo do instrutor, analogias e contexto de cada tecnologia
- [code-examples.md](references/code-examples.md) — Exemplos praticos de cada tecnologia e como se relacionam

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-tecnologias-basicas-da-web/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-tecnologias-basicas-da-web/references/code-examples.md)
