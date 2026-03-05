---
name: rs-angular-revisando-conceitos-gotask
description: "Enforces Angular component architecture principles when building Angular applications. Use when user asks to 'create angular component', 'build angular app', 'organize angular project', 'manage state in angular', or 'structure angular code'. Applies rules: single responsibility components, decoupled communication via services, immutable state, mobile-first styling, consistent file naming. Make sure to use this skill whenever scaffolding or reviewing Angular project architecture. Not for React, Vue, or non-Angular frameworks."
---

# Arquitetura de Componentes Angular — GoTask

> Componentes devem ser desacoplados, com responsabilidade unica, comunicando-se via services e estado imutavel.

## Key concept

Um projeto Angular bem estruturado trata componentes como unidades isoladas com responsabilidade minima. A comunicacao entre componentes nao deve depender de cadeias de `@Input`/`@Output` — use services como intermediarios. O estado da aplicacao (fonte de verdade) vive em services com BehaviorSubject, e componentes recebem copias imutaveis para evitar mutacoes acidentais.

## Rules

1. **Responsabilidade unica por componente** — cada componente faz UMA coisa, porque componentes com muitas responsabilidades sao dificeis de manter e testar
2. **Desacople com services, nao com @Input/@Output em cadeia** — use services para comunicacao entre componentes distantes, porque cadeias de input/output geram acoplamento que dificulta refatoracao
3. **Estado imutavel** — nunca passe a referencia original da fonte de verdade para componentes, porque eles podem mutar o objeto e causar bugs inesperados
4. **Mobile-first com Tailwind** — estilize pensando primeiro no mobile e expanda para desktop, porque garante responsividade desde o inicio
5. **Padronize nomes e organizacao** — trate o codigo como documentacao: propriedades primeiro, depois funcoes, nomes consistentes em arquivos/classes/metodos, porque projetos que crescem sem padrao viram caos
6. **Use a nova sintaxe de controle** — prefira `@if`, `@for`, `@let` sobre `*ngIf`/`*ngFor`, porque sao a direcao do framework

## Decision framework

| Situacao | Abordagem |
|----------|-----------|
| Componente A precisa de dados de componente B (irmaos) | Service compartilhado com BehaviorSubject |
| Componente pai passa config simples para filho | `@Input` e aceitavel |
| Cadeia de 3+ niveis de @Input/@Output | Refatore para service |
| Lista de itens e fonte de verdade | Service gerencia estado, componentes recebem copia via `async` pipe |
| Componente precisa de variavel temporaria no template | Use `@let` |
| Precisa abrir modal ou drag-and-drop | Angular Material CDK (Dialog, DragDrop) |

## How to think about it

### Fonte de verdade e imutabilidade

O service e o dono do estado. Quando um componente precisa da lista de tarefas, ele recebe uma copia (spread ou slice), nunca a referencia direta. Isso previne que um componente filho mude o array original sem passar pelo fluxo correto.

### Desacoplamento via services

Imagine que voce precisa mover a posicao de um componente na arvore. Se ele depende de @Input/@Output em cadeia, voce precisa refatorar todos os componentes intermediarios. Com um service injetado via `inject()`, o componente funciona em qualquer lugar da arvore.

### Codigo como documentacao

Arquivos seguem padrao: `nome.component.ts`, `nome.service.ts`. Dentro do arquivo: propriedades primeiro, lifecycle hooks, depois metodos. Nomes descritivos. Um projeto bem organizado se le como documentacao — voce sabe onde cada coisa esta sem precisar buscar.

## Common misconceptions

| Pessoas pensam | Realidade |
|---------------|-----------|
| @Input/@Output resolve tudo | Gera acoplamento em projetos medios/grandes |
| Posso passar a referencia do array direto | Componentes podem mutar o estado acidentalmente |
| Mobile-first e opcional | E a abordagem mais eficiente — expandir e mais facil que comprimir |
| RxJS e so para HTTP | BehaviorSubject e operadores (tap, map) sao essenciais para gerenciamento de estado |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Cadeia de @Input em 3+ niveis | Service com BehaviorSubject |
| Passar referencia original do estado | Passar copia com spread/slice |
| Componente com 5+ responsabilidades | Quebrar em componentes menores |
| `*ngIf` / `*ngFor` em projeto novo | `@if` / `@for` (nova sintaxe) |
| Estilos desktop-first | Mobile-first com Tailwind breakpoints |
| Nomes genericos (`data.service.ts`) | Nomes descritivos (`task-list.service.ts`) |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
