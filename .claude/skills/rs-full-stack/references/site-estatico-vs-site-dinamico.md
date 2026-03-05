---
name: rs-full-stack-site-estatico-vs-dinamico
description: "Applies the static vs dynamic site mental model when designing web architectures. Use when user asks to 'create a website', 'build a page', 'choose between static and dynamic', 'design a web app', or discusses server rendering strategies. Guides decisions on whether content should be static (pre-built HTML/CSS/JS) or dynamic (database-driven, personalized). Make sure to use this skill whenever the user is deciding between static site generators and server-rendered apps. Not for CSS styling, layout design, or JavaScript runtime behavior."
---

# Site Estático vs Site Dinâmico

> Escolha estático quando o conteúdo é o mesmo para todos; escolha dinâmico quando o conteúdo se adapta ao usuário.

## Key concept

Um site estático entrega HTML, CSS e JavaScript prontos — o servidor responde com uma página definitiva que não busca dados adicionais. Um site dinâmico recebe o pedido do usuário, consulta um banco de dados, e constrói uma página personalizada para aquela pessoa. A mesma URL pode gerar páginas diferentes dependendo de quem acessa.

## Decision framework

| Quando você encontra | Aplique |
|---------------------|---------|
| Conteúdo igual para todos os visitantes | Site estático — HTML/CSS/JS pré-construído |
| Conteúdo que depende de quem está acessando | Site dinâmico — servidor + banco de dados |
| Landing page, blog, documentação | Estático (pode usar SSG) |
| Dashboard, perfil de usuário, feed personalizado | Dinâmico (servidor consulta banco) |
| Página que muda só via interação no browser (clique, JS local) | Ainda é estático — a resposta do servidor não mudou |

## How to think about it

### O fluxo estático
```
Cliente → Request GET /pagina → Servidor → Response (HTML/CSS/JS fixo)
```
O servidor envia sempre o mesmo arquivo. Não importa quem pediu — a resposta é idêntica.

### O fluxo dinâmico
```
Cliente → Request GET /perfil/mikebrito → Servidor → Consulta banco de dados
  → Monta HTML personalizado → Response (página única para mikebrito)
```
O servidor identifica o usuário, busca dados no banco, e constrói a página sob demanda. Cada pessoa vê conteúdo diferente.

### Interação no browser não torna o site dinâmico
Um site estático pode ter JavaScript que responde a cliques e muda a interface. Isso não o torna dinâmico — porque o conteúdo que veio do servidor já era definitivo. Dinâmico significa que o **servidor** adapta a resposta com base no pedido.

## Common misconceptions

| Pessoas pensam | Realidade |
|---------------|-----------|
| "Se tem JavaScript é dinâmico" | JS no browser é interatividade, não dinamismo do servidor |
| "Estático = sem interação" | Estático pode ter animações, cliques, formulários — o que não muda é a resposta do servidor |
| "Dinâmico = melhor" | Estático é mais rápido, barato e simples quando o conteúdo não precisa personalização |

## When to apply

- Ao iniciar um novo projeto web: decidir se precisa de servidor + banco ou se um build estático resolve
- Ao escolher ferramentas: SSG (Next.js static, Astro, Hugo) vs SSR (Next.js server, Express + templates)
- Ao otimizar performance: páginas que podem ser estáticas devem ser estáticas, mesmo em apps dinâmicos

## Limitations

- A maioria dos apps reais é híbrida: partes estáticas (homepage, docs) + partes dinâmicas (dashboard, perfil)
- Este modelo é simplificado — existem estratégias intermediárias como ISR, SSG com revalidação, e edge rendering

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-site-estatico-vs-site-dinamico/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-site-estatico-vs-site-dinamico/references/code-examples.md)
