# Deep Explanation: Feature vs Tela

## O raciocínio central do instrutor

A pergunta-chave que o instrutor propõe é: **"O que a área de negócio que cuida desse projeto vai estar gerenciando?"**

Essa pergunta muda completamente a forma de pensar sobre organização de código. Em vez de olhar para o sistema como um conjunto de telas (login, listagem, edição, criação), você olha como um conjunto de **domínios de negócio** que a empresa gerencia.

No exemplo do desafio Angular da Skillz (um Marketplace), o sistema tinha:
- Tela de login
- Tela de listagem e filtro de produtos
- Tela de criação de produto

A pergunta ingênua seria: "Cada tela é uma feature?" A resposta é **não**. O que o negócio gerencia são **produtos**. Login, listagem, edição, criação — são todas operações (sub-recursos) sobre o domínio "produtos".

## Conexão com DDD (Domain Driven Design)

O instrutor menciona explicitamente DDD como base conceitual. Os conceitos aplicados:

- **Domínio**: O centro do negócio. No exemplo: Produtos.
- **Sub-recursos**: Operações dentro do domínio. No exemplo: listar, filtrar, editar, adicionar.
- **Bounded Context**: Cada feature é um contexto delimitado com seus próprios componentes e serviços.

O instrutor reconhece que DDD "não é fácil" e "precisa de bastante treino", mas enfatiza que mesmo uma aplicação básica desse conceito já resulta em projetos mais organizados.

## Por que essa abordagem é superior

O instrutor destaca o contraste entre duas formas de organizar:

1. **Por tipo** (zona de conforto): `components/`, `services/`, `pipes/` — organiza pelo que a coisa É
2. **Por contexto/domínio** (feature-based): `feature/products/` — organiza pelo que a coisa FAZ no negócio

A segunda abordagem escala melhor porque:
- Quando o domínio cresce, tudo relacionado está junto
- Quando um dev novo entra, ele entende o que o sistema faz olhando as pastas
- Services específicos de um domínio não poluem o escopo global

## A honestidade do instrutor

Um ponto notável é que o instrutor admite: "Isso me tira da zona de conforto também, porque eu não estou acostumado a criar aplicações assim." Isso reforça que é uma mudança de paradigma real, não apenas uma preferência estética.

## Estrutura completa do exemplo

O instrutor construiu ao vivo a seguinte estrutura:

```
app/
├── feature/
│   └── products/           # Domínio
│       ├── list/           # Sub-recurso (componente)
│       ├── edit/           # Sub-recurso (componente)
│       ├── create/         # Sub-recurso (componente)
│       └── data/
│           └── products-api.service.ts  # Service do domínio
├── shared/
│   └── button/             # Componente reutilizável
└── core/                   # Funcionalidades fundamentais
```

Pontos-chave:
- O service HTTP fica em `data/` dentro do domínio, não numa pasta global `services/`
- `shared/` é para componentes usados por múltiplos domínios (ex: botão)
- O componente `products.component.ts` na raiz do domínio é opcional (container/layout)