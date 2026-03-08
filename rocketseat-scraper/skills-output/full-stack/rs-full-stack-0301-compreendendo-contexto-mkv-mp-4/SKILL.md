---
name: rs-full-stack-0301-compreendendo-contexto
description: "Enforces React Context usage over Prop Drilling when sharing global state across components. Use when user asks to 'share state between components', 'pass data to nested components', 'create a context', 'avoid prop drilling', or 'manage global state in React'. Applies the pattern: create a context, define shared data, wrap components with provider, access directly. Make sure to use this skill whenever building multi-page React apps that share user data, auth state, or theme across routes. Not for Redux/Zustand state management, server-side state, or single-component local state."
---

# Context vs Prop Drilling

> Compartilhe estado global via Context — nunca perfure propriedades componente por componente.

## Key concept

Context e um recurso para compartilhar informacoes de forma global entre componentes. Em vez de passar propriedades manualmente de componente em componente (Prop Drilling), crie um contexto que disponibiliza dados diretamente para qualquer componente que precise acessar.

## Decision framework

| Quando voce encontrar | Aplique |
|----------------------|---------|
| Dado usado em 2+ componentes nao-adjacentes | Context |
| Dado usado apenas no componente filho direto | Props normais (sem context) |
| Propriedade passando por componente intermediario que nao a usa | Context — sinal classico de Prop Drilling |
| Estado de autenticacao (nome, token, role) | Context — caso canonico |
| Tema (dark/light mode) | Context |
| Estado local de um formulario | useState local, sem context |

## How to think about it

### Prop Drilling (o problema)

Login recupera dados do usuario → passa nome como prop para Home → Home passa como prop para Profile → Profile passa para EditForm. Cada componente intermediario recebe props que nao usa, apenas repassa. Com 3 componentes parece aceitavel. Com 10+ componentes vira confusao: propriedades desnecessarias poluem componentes, fica facil se perder, dificil de manter.

### Context (a solucao)

Crie um contexto com os dados do usuario. Envolva os componentes que precisam acessar esses dados com o Provider do contexto. Qualquer componente dentro do Provider acessa os dados diretamente — sem depender de nenhum componente intermediario.

```
[UserContext.Provider]
  ├── Login (define os dados)
  ├── Home (acessa nome direto do contexto)
  └── Profile (acessa dados direto do contexto)
```

## Rules

1. **Identifique estado compartilhado antes de criar componentes** — se dois ou mais componentes em rotas diferentes precisam do mesmo dado, planeje um contexto, porque prop drilling em apps multi-pagina escala mal
2. **Envolva apenas os componentes que precisam** — o Provider deve cobrir a arvore de componentes que acessa o contexto, nao necessariamente a aplicacao inteira, porque contexto amplo demais causa re-renders desnecessarios
3. **Nao passe propriedades que o componente intermediario nao usa** — se um componente recebe uma prop apenas para repassar ao filho, isso e Prop Drilling e deve ser substituido por Context

## Heuristics

| Situacao | Faca |
|----------|------|
| Dados do usuario apos login (nome, email, role) | Context |
| Props passando por 3+ niveis sem uso intermediario | Refatore para Context |
| Componente recebe props que nao renderiza | Remova a prop, use Context |
| Estado de um unico input/form | useState local |
| Funcoes/metodos compartilhados globalmente | Context com funcoes no value |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Passar `userName` por 5 componentes ate chegar no destino | Criar UserContext e acessar direto |
| Adicionar props em componentes intermediarios so para repassar | Envolver com Provider e consumir via useContext |
| Criar um unico Context gigante com tudo | Separar contextos por dominio (AuthContext, ThemeContext) |
| Usar Context para estado local de um componente | Usar useState ou useReducer local |

## Common misconceptions

| Pessoas pensam | Realidade |
|---------------|-----------|
| Prop Drilling funciona para apps pequenas | Ate em apps pequenas, se o dado cruza rotas, Context e mais limpo |
| Context substitui todas as props | Props continuam ideais para comunicacao pai-filho direto |
| Context e a mesma coisa que Redux | Context e nativo do React e resolve compartilhamento simples; Redux/Zustand adicionam controle de fluxo e middleware |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre Prop Drilling vs Context, analogias do instrutor e edge cases
- [code-examples.md](references/code-examples.md) — Exemplos praticos de criacao e consumo de Context em React