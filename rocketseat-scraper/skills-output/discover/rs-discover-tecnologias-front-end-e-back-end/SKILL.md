---
name: rs-discover-tecnologias-front-back
description: "Applies mental model of front-end vs back-end technology separation when user asks to 'explain web stack', 'what is HTML CSS JS', 'difference between frontend and backend', 'how websites work', or 'what technology should I use'. Clarifies the role of HTML (structure), CSS (style), JavaScript (interactivity) and back-end (business logic, data). Make sure to use this skill whenever a beginner asks about web technologies or needs guidance on where code runs. Not for framework-specific questions, deployment, or advanced architecture decisions."
---

# Tecnologias Front-end e Back-end

> Toda aplicacao web se divide em duas camadas: front-end (o que o usuario ve e interage no navegador) e back-end (onde os dados sao armazenados e as regras de negocio executadas).

## Key concept

Quando um navegador faz uma requisicao (ex: acessar google.com), o servidor responde com tres tipos de arquivo que trabalham juntos no front-end:

- **HTML** — estrutura e conteudo (textos, links, imagens, sons, videos)
- **CSS** — aparencia e estilo (centralizar, colorir, fontes, layout)
- **JavaScript** — interatividade (cliques, abrir/fechar elementos, acoes dinamicas)

O back-end e o "outro lado" — um computador em algum lugar do mundo que guarda dados em banco de dados, verifica senhas, executa regras de negocio. O usuario nunca ve o back-end diretamente.

## Decision framework

| Quando o usuario pergunta | Responda com |
|--------------------------|-------------|
| "Como organizo conteudo na pagina?" | HTML — linguagem de marcacao que estrutura textos, links, midia |
| "Como deixo bonito/estilizado?" | CSS — controla cores, fontes, posicionamento, layout |
| "Como faco algo acontecer ao clicar?" | JavaScript — linguagem de programacao que roda no navegador |
| "Onde guardo dados do usuario?" | Back-end — banco de dados protegido, nunca exposto no front |
| "Posso usar JS no servidor?" | Sim — Node.js permite rodar JavaScript fora do navegador |

## How to think about it

### Analogia do restaurante
- **HTML** = o cardapio impresso (conteudo estruturado)
- **CSS** = o design do cardapio (cores, fontes, layout bonito)
- **JavaScript** = o garcom interativo (responde quando voce aponta, traz coisas)
- **Back-end** = a cozinha (onde a comida e preparada, o cliente nao ve)

### Fluxo de uma requisicao
```
Usuario digita URL → Navegador faz pedido → Servidor responde com HTML + CSS + JS
                                                      ↓
                                              Navegador renderiza (front-end)
                                                      ↓
                                    Usuario interage → JS executa no navegador
                                                      ↓
                                    Se precisa de dados → JS pede ao back-end
                                                      ↓
                                    Back-end verifica no banco → responde
```

### Por que a senha nao fica no front-end?
Tudo no front-end e visivel para o usuario (basta abrir DevTools). Dados sensiveis como senhas e regras de negocio ficam no back-end, protegidos. O front-end apenas envia login/senha, e o back-end verifica no banco de dados.

## Common misconceptions

| Pessoas pensam | Realidade |
|---------------|-----------|
| HTML e uma linguagem de programacao | HTML e uma linguagem de **marcacao** — estrutura conteudo, nao tem logica |
| CSS e opcional | Sem CSS, HTML e funcional mas visualmente cru — CSS e essencial para UX |
| JavaScript so funciona no navegador | Com Node.js, JavaScript roda em qualquer computador (back-end incluso) |
| Front-end e back-end sao independentes | Trabalham juntos — front-end exibe, back-end processa e armazena |

## When to apply

- Ao explicar conceitos web para iniciantes
- Ao decidir onde colocar uma funcionalidade (front vs back)
- Ao responder "que tecnologia eu uso para X?"
- Ao estruturar um projeto web do zero

## Limitations

- Este modelo nao cobre frameworks (React, Next.js, Express)
- Nao aborda SSR, SSG ou arquiteturas hibridas
- Nao substitui decisoes de arquitetura para aplicacoes complexas
- Aplicacoes modernas borram a linha front/back (ex: server components)

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes