---
name: rs-full-stack-o-projeto-que-vamos-trabalhar
description: "Enforces frontend project scaffolding best practices when setting up a React application with route-based architecture, page components, and profile-based navigation before implementing functionality. Use when user asks to 'scaffold a project', 'set up routes', 'create page structure', 'organize frontend folders', or 'prepare a project for API integration'. Make sure to use this skill whenever starting a new frontend project that will later connect to a backend API. Not for backend API implementation, database setup, or CSS styling."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: react-project-structure
  tags: [react, routing, scaffolding, project-structure, frontend]
---

# Estrutura de Projeto Frontend para Integração com API

> Construa primeiro o visual completo com rotas e páginas antes de implementar qualquer funcionalidade ou conexão com API.

## Key concept

Um projeto frontend bem estruturado separa visual de funcionalidade. Primeiro, crie todas as páginas, componentes e rotas com dados simulados. Depois, implemente as funcionalidades e integração com o backend. Essa abordagem permite validar o fluxo de navegação e o layout antes de lidar com complexidade de API.

## Decision framework

| Quando encontrar | Aplicar |
|-----------------|---------|
| Novo projeto frontend que vai consumir API | Criar visual completo primeiro, funcionalidades depois |
| Múltiplos perfis de usuário (admin, employee, guest) | Simular perfis no código para testar rotas antes da auth real |
| Página não existente acessada | Criar página NotFound com redirecionamento ao início |
| Muitas páginas com layouts diferentes | Separar rotas em grupos (auth, app, public) |

## Estrutura de pastas recomendada

```
src/
├── components/       # Componentes reutilizáveis
├── pages/            # Páginas da aplicação
│   ├── SignIn/
│   ├── SignUp/
│   ├── Dashboard/
│   ├── Confirmation/
│   └── NotFound/
├── routes/           # Definição de rotas
│   ├── auth-routes.tsx
│   ├── app-routes.tsx
│   └── index.tsx     # Router principal com simulação de perfil
└── styles/           # Estilos globais
```

## How to organize

### Três grupos de rotas

```typescript
// routes/index.tsx
// Simular perfil antes de ter autenticação real
const profile = "admin" // "admin" | "employee" | null

// null → rotas públicas (SignIn, SignUp)
// "admin" → rotas de administração (Dashboard com controle total)
// "employee" → rotas de funcionário (Dashboard com visão limitada)
```

### Páginas como ponto de partida visual

```typescript
// Cada página existe como componente visual puro
// Sem lógica de negócio, sem chamadas a API
// Apenas estrutura HTML + estilos + estados visuais

// pages/Dashboard/index.tsx
export function Dashboard() {
  return (
    // Layout completo com dados hardcoded
    // Funcionalidades serão adicionadas depois
  )
}
```

## Heuristics

| Situação | Fazer |
|----------|-------|
| Projeto novo que vai ter API | Visual primeiro, funcionalidade depois |
| Precisa testar navegação entre perfis | Trocar variável de perfil no index e salvar |
| Rota inexistente acessada | Redirecionar para NotFound, que volta ao início |
| Componente será reutilizado em múltiplas páginas | Colocar em `components/`, não dentro de `pages/` |

## Anti-patterns

| Nunca faça | Faça instead |
|------------|-------------|
| Implementar API e visual ao mesmo tempo | Completar visual → depois integrar API |
| Criar rotas sem página NotFound | Sempre ter fallback para rotas inexistentes |
| Hardcodar perfil em vários arquivos | Centralizar simulação de perfil no router principal |
| Começar funcionalidades sem todas as páginas prontas | Garantir que todo o fluxo visual está navegável |

## Troubleshooting

| Problema | Causa | Solucao |
|----------|-------|---------|
| Rota inexistente mostra pagina em branco | Faltou pagina NotFound com fallback | Crie componente NotFound e redirecione rotas invalidas |
| Perfil de usuario nao muda ao trocar variavel | Variavel hardcoded em multiplos arquivos | Centralize simulacao de perfil no router principal |
| Componente aparece em pagina errada | Componente dentro de `pages/` em vez de `components/` | Mova componentes reutilizaveis para `components/` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre a abordagem visual-first e organizacao de projeto
- [code-examples.md](references/code-examples.md) — Exemplos de estrutura de rotas, simulacao de perfil e organizacao de paginas