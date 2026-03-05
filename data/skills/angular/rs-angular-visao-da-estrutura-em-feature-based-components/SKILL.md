---
name: rs-angular-feature-based-structure
description: "Enforces Feature Based Components folder structure when organizing Angular projects. Use when user asks to 'create a component', 'organize project', 'structure Angular app', 'add a feature', or 'where should I put this component'. Applies rules: Core/Features/Shared separation, dependency direction (Features→Core/Shared, Shared→Core, Core→nobody), Layout vs Pages vs Components classification. Make sure to use this skill whenever scaffolding or reorganizing Angular project folders. Not for backend structure, state management, or routing configuration."
---

# Feature Based Components — Estrutura de Pastas Angular

> Organize componentes Angular em Core, Features e Shared, respeitando regras de dependencia unidirecionais e classificando cada componente como Layout, Page ou Component.

## Rules

1. **Tres pastas raiz dentro de src/** — `core/`, `features/`, `shared/`, porque essa separacao forca responsabilidades claras e dependencias previsiveis
2. **Features depende de Core e Shared, nunca de outras Features** — um service ou componente de uma feature nao importa de outra feature, porque isso cria acoplamento entre funcionalidades independentes
3. **Shared depende apenas de Core** — nunca importa de Features, porque shared contem componentes reutilizaveis que devem ser independentes de qualquer funcionalidade especifica
4. **Core nao depende de ninguem** — nem de Features nem de Shared, porque Core e a base da aplicacao (services singletons, componentes estruturantes globais)
5. **Classifique cada componente como Layout, Page ou Component** — Layout = fixo e estruturante, Page = destino final de rota, Component = widget reutilizavel de UI, porque essa classificacao determina onde o arquivo mora na arvore de pastas
6. **Features espelham funcionalidades do backend** — `features/authentication/`, `features/movies/`, `features/favorites/`, porque facilita navegacao e leitura do sistema como um todo

## Dependency Direction

```
Core ← Shared ← Features
  ↑               ↑
  └───────────────┘

Features ✗→ Features  (PROIBIDO)
Shared   ✗→ Features  (PROIBIDO)
Core     ✗→ Shared    (PROIBIDO)
Core     ✗→ Features  (PROIBIDO)
```

## Folder Structure

```
src/
├── core/
│   └── layout/
│       └── header/              # Componente fixo, presente em toda app
│
├── features/
│   ├── authentication/
│   │   ├── layout/
│   │   │   └── authentication-screen/  # Container estruturante com router-outlet
│   │   └── pages/
│   │       ├── login/                  # Rota /login
│   │       └── register-user-form/     # Rota /register
│   │
│   ├── favorites/
│   │   └── pages/
│   │       └── favorite-movies/        # Rota /favorites (usa MoviesList da Shared)
│   │
│   └── movies/
│       └── pages/
│           ├── create-movie/           # Rota /create
│           ├── explore-movies/         # Rota /explore
│           └── movie-details/          # Rota /details
│
└── shared/
    └── components/
        └── movies-list/               # Widget reutilizavel em multiplas features
```

## Layout vs Pages vs Components

| Classificacao | Onde mora | Comportamento | Exemplo |
|---------------|-----------|---------------|---------|
| **Layout** | `layout/` | Fixo, estruturante, segura router-outlet, nao desaparece ao trocar rota filha | Header, Sidebar, AuthenticationScreen |
| **Page** | `pages/` | Destino final de rota, desaparece ao navegar para outra rota | LoginForm, ExploreMovies, FavoriteMovies |
| **Component** | `components/` | Widget de UI reutilizavel, preenchendo parte da tela | MoviesList, FilterBar |

## Heuristics

| Situacao | Faca |
|----------|------|
| Componente aparece em TODAS as telas | `core/layout/` |
| Componente e container com router-outlet dentro de feature | `features/{feature}/layout/` |
| Componente carregado por uma rota especifica | `features/{feature}/pages/` |
| Componente reutilizado entre features | `shared/components/` |
| Service singleton global | `core/services/` |
| Service especifico de uma feature | `features/{feature}/services/` |

## Anti-patterns

| Nunca faca | Faca assim |
|------------|------------|
| Importar service de `features/auth/` em `features/movies/` | Mova o service compartilhado para `shared/` ou `core/` |
| Colocar MoviesList dentro de `features/movies/` | Coloque em `shared/components/` se e reutilizavel |
| Colocar Header na Shared | Header e fixo e estruturante → `core/layout/` |
| Criar pasta `features/common/` | Use `shared/` para componentes reutilizaveis |
| Page com router-outlet segurando filhos | Isso e Layout, mova para `layout/` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
