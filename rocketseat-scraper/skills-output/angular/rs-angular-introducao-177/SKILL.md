---
name: rs-angular-introducao-177
description: "Guides building Angular movie detail pages with rating, favorites, and URL params. Use when user asks to 'create detail page', 'implement star rating', 'add favorite toggle', 'get route params in Angular', or 'build movie detail component'. Applies patterns: signals, computed, linkedSignal, rxResource, route param extraction. Make sure to use this skill whenever building detail views with interactive features in Angular. Not for list pages, routing setup, or Angular project scaffolding."
---

# Tela de Detalhes de Filme — Angular

> Componentes de detalhe combinam data binding, interacoes do usuario (rating, favoritos) e leitura de parametros da URL em um unico componente coeso.

## Funcionalidades do componente de detalhes

1. **Exibir informacoes do filme** — buscar dados via HTTP e fazer binding no template
2. **Sistema de rating (1-5 estrelas)** — requisicao HTTP com o nivel selecionado + logica visual de preenchimento das estrelas
3. **Favoritar/desfavoritar** — toggle do icone de coracao com estado visual (preenchido/vazio)
4. **Checar se ja e favorito** — ao carregar, verificar se o filme ja esta na lista de favoritos para exibir estado inicial correto

## Ferramentas Angular utilizadas

| Ferramenta | Uso neste componente |
|------------|---------------------|
| `signal` | Estado reativo do filme, rating, favorito |
| `computed` | Derivar estado visual (estrelas preenchidas, icone do coracao) |
| `linkedSignal` | Sincronizar estado dependente de outros signals |
| `rxResource` | Buscar dados do filme via HTTP de forma reativa |
| Route params | Extrair ID do filme da URL (`/details/:id`) |

## Heuristics

| Situacao | Faca |
|----------|------|
| Precisa exibir dados de uma entidade por ID | Extraia o ID da rota, use `rxResource` para buscar |
| Estado visual depende de selecao do usuario | Use `computed` derivado de um `signal` de estado |
| Toggle binario (favorito sim/nao) | Um `signal<boolean>` com toggle + requisicao HTTP |
| Rating com preenchimento visual | `computed` que gera array de estrelas baseado no valor do signal |
| Componente precisa saber estado inicial do servidor | Verifique no carregamento (ex: filme ja esta nos favoritos?) |

## Decision framework

| Pergunta | Resposta |
|----------|----------|
| Como pegar o ID da URL? | Injete `ActivatedRoute` ou use `input()` com `withComponentInputBinding()` |
| Onde armazenar o rating selecionado? | `signal<number>` local, enviado via HTTP ao confirmar |
| Como mostrar estrelas preenchidas? | `computed` que retorna array de 5 booleans baseado no rating |
| Como saber se filme ja e favorito? | Requisicao ao carregar componente, resultado em `signal<boolean>` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
