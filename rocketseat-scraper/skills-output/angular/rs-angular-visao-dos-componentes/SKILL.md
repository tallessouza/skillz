---
name: rs-angular-visao-dos-componentes
description: "Applies Angular component architecture patterns from the AB Filmes project when structuring Angular apps. Use when user asks to 'create angular component', 'structure angular project', 'organize components', 'feature based components', or 'angular component hierarchy'. Enforces feature-based organization, component composition, and separation between layout and functional components. Make sure to use this skill whenever scaffolding or restructuring Angular component trees. Not for Angular signals, routing configuration, or HTTP/backend integration."
---

# Visao dos Componentes — Arquitetura Angular

> Organize componentes Angular por feature, separando containers (layout) de componentes funcionais (formularios, listas).

## Rules

1. **Separe componentes de layout dos funcionais** — `AuthenticationScreen` contem o background e layout, `LoginForm` e `RegisterUserForm` sao intercambiaveis dentro dele, porque isso permite trocar o conteudo sem alterar a estrutura visual
2. **Agrupe por feature, nao por tipo** — pasta `auth/`, `movies/`, `favorites/` em vez de `components/`, `services/`, porque Feature Based Components escalam melhor e isolam contexto
3. **Componentes de lista sao reutilizaveis** — `MoviesList` e usado tanto em `ExploreMovies` quanto em `FavoriteMovies`, porque evita duplicacao de renderizacao de cards
4. **Header e responsivo e independente** — componente de header gerencia seu proprio layout responsivo, menu mobile e estado de logout, porque e compartilhado entre todas as rotas protegidas
5. **Comece estatico, adicione logica depois** — componentes iniciam com dados chumbados e campos sem interacao, porque permite validar estrutura visual antes de conectar signals e HTTP

## Arvore de componentes

```
AppComponent (app.html)
├── AuthenticationScreen        # Layout: background + slot para form
│   ├── LoginForm               # Funcional: email, senha, entrar
│   └── RegisterUserForm        # Funcional: campos de cadastro
├── Header                      # Compartilhado: menu, logout, responsivo
├── ExploreMovies               # Feature: filtro + adicionar + MoviesList
│   └── MoviesList              # Reutilizavel: renderiza cards de filmes
├── FavoriteMovies              # Feature: lista favoritos (sem filtro)
│   └── MoviesList              # Mesmo componente reutilizado
├── MovieDetails                # Feature: detalhes, avaliacoes, favoritar
└── CreateMovie                 # Feature: form de criacao com upload
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Tela com layout fixo e conteudo variavel | Crie container (layout) + componentes filhos intercambiaveis |
| Mesmo card/lista em multiplas telas | Extraia componente reutilizavel (`MoviesList`) |
| Componente precisa de menu responsivo | Encapsule logica responsiva dentro do proprio componente |
| Dados ainda nao vem do backend | Use dados estaticos chumbados, mesma interface que a API retornara |
| Tela precisa de protecao | Planeje como rota protegida com AuthGuard desde o inicio |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Colocar background e form no mesmo componente | Separar `AuthenticationScreen` (layout) de `LoginForm` (funcional) |
| Criar `MovieCardExplore` e `MovieCardFavorite` separados | Criar um `MoviesList` reutilizavel para ambos |
| Pasta `components/` com tudo junto | Organizar por feature: `auth/`, `movies/`, `favorites/` |
| Implementar logica antes de validar estrutura visual | Chumbar dados estaticos primeiro, conectar signals/HTTP depois |
| Header que depende de estado externo para responsividade | Header autocontido com seu proprio controle de layout |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
