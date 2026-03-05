---
name: rs-angular-visao-geral-projeto
description: "Applies the AB Filmes project architecture when building Angular movie manager apps. Use when user asks to 'create angular project', 'build movie app', 'implement film manager', or 'start AB Filmes project'. Provides the full feature map, route structure, and component breakdown for the movie manager. Make sure to use this skill whenever scaffolding or planning the AB Filmes Angular project. Not for generic Angular theory, non-movie-app projects, or backend implementation."
---

# Visao Geral do Projeto AB Filmes

> O projeto AB Filmes e um gerenciador de filmes completo que cobre signals, roteamento, HTTP, guards e interceptors no Angular.

## Arquitetura de Telas

| Tela | Rota | Funcionalidades |
|------|------|-----------------|
| Login/Cadastro | `/` | Formulario com Reactive Forms, validacao de campos, comparacao de senhas |
| Explorar | `/explore` | Listagem de filmes, filtros por nome e categoria, adicionar favoritos |
| Detalhes do Filme | `/details/:uid` | Info completa, sistema de avaliacao 1-5 estrelas, media dinamica |
| Favoritos | `/favorites` | Lista de favoritos do usuario, remocao de favoritos |
| Adicionar Filme | `/add` | Upload de imagem, formulario de criacao |

## Funcionalidades Cobertas

### Autenticacao
- Cadastro com validacao (nome obrigatorio, email valido, senha = confirmacao)
- Login com token armazenado em `Application Storage`
- Logout limpa token e redireciona para login
- Rotas protegidas — usuario nao logado e redirecionado para login

### Filmes
- Listagem de todos os filmes do backend (independente do usuario)
- Filtro por nome e categoria (concatenaveis)
- Botao limpar filtro
- Criacao de filme com upload de imagem
- Avaliacao de 1-5 estrelas com calculo de media no backend

### Favoritos
- Adicionar/remover filme dos favoritos (icone de coracao)
- Tela dedicada para listar favoritos

## Conceitos Angular Aplicados

| Conceito | Onde e usado |
|----------|-------------|
| **Signals** | Logica interna de filtros, estado reativo dos filmes |
| **Reactive Forms** | Telas de login e cadastro (validacao, disable de botao) |
| **Roteamento** | Navegacao entre telas, rota dinamica `/details/:uid` |
| **Guards** | Protecao de rotas (apenas usuario logado) |
| **Interceptors HTTP** | Injecao de token nas requisicoes |
| **Middlewares** | Controle de acesso as rotas |
| **Requisicoes HTTP** | CRUD de filmes, avaliacoes, favoritos, autenticacao |

## Estrutura de Componentes Esperada

```
src/app/
├── pages/
│   ├── login/           # Login + Cadastro (mesmo componente ou toggle)
│   ├── explore/         # Listagem + Filtros
│   ├── details/         # Detalhes + Avaliacao
│   ├── favorites/       # Lista de favoritos
│   └── add-movie/       # Formulario de criacao
├── components/
│   ├── movie-card/      # Card com titulo, imagem, avaliacao, categoria, ano
│   ├── star-rating/     # Componente de estrelas 1-5
│   └── menu/            # Navegacao (Explorar, Favoritos, Sair)
├── guards/
│   └── auth.guard.ts    # Protecao de rotas
├── interceptors/
│   └── auth.interceptor.ts  # Injeta token no header
└── services/
    ├── auth.service.ts      # Login, cadastro, logout, token
    ├── movies.service.ts    # CRUD filmes, filtros
    ├── ratings.service.ts   # Avaliacoes
    └── favorites.service.ts # Favoritos
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Iniciando o projeto do zero | Comece pela autenticacao (login/cadastro) |
| Implementando filtros | Use signals para reatividade, concatene filtros |
| Avaliacao de filmes | Backend calcula a media, frontend apenas envia e exibe |
| Protecao de rotas | Guard verifica token no storage, redireciona se ausente |
| Logout | Limpe o token do storage E redirecione para login |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
