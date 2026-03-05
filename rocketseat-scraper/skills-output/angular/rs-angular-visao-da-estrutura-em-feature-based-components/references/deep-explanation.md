# Deep Explanation: Feature Based Components — Estrutura Angular

## Por que tres pastas e nao uma estrutura plana?

O instrutor enfatiza que a separacao em Core, Features e Shared nao e apenas organizacional — ela **impoe regras de dependencia**. Quando voce coloca algo na pasta `core/`, voce esta dizendo: "isso nao depende de nada do meu dominio de negocio". Quando coloca em `shared/`, esta dizendo: "isso e reutilizavel e independente de qualquer feature especifica".

A consequencia pratica: se voce precisa importar algo de outra feature, e um **sinal de que algo esta no lugar errado**. Ou o service/componente deveria estar em `shared/`, ou voce esta acoplando features que deveriam ser independentes.

## As regras de dependencia como grafo direcionado

O instrutor desenhou no Miro um diagrama de dependencias:

```
Features → Core ✓
Features → Shared ✓
Features → Features ✗ (PROIBIDO)
Shared → Core ✓
Shared → Features ✗ (PROIBIDO)
Core → ninguem (base pura)
```

Ele reconhece que em projetos complexos pode ser dificil seguir 100%, mas o **ideal e sempre tentar**. A regra mais importante e: **Features nunca dependem de outras Features**. Isso garante que cada feature pode ser desenvolvida, testada e eventualmente removida de forma independente.

## A analogia Layout vs Page vs Component

O instrutor usa tres exemplos concretos para diferenciar:

### Header (Layout em Core)
O header e **fixo e estruturante**. Ele nao e reutilizavel no sentido de "colocar em varios lugares" — ele simplesmente **esta la** em toda a aplicacao. Nao e um widget, nao e uma page. Ele **segura** a estrutura visual.

### AuthenticationScreen (Layout em Feature)
O AuthenticationScreen e um container que **segura** o logo e o fundo, enquanto os formularios de login e registro **trocam dentro dele** via router-outlet. Ele "fica parado, segurando o fundo e o logo, enquanto apenas o formulario filho troca". Isso e o conceito chave de Layout dentro de uma feature.

### MoviesList (Component em Shared)
O MoviesList e usado tanto em ExploreMovies quanto em FavoriteMovies. Ele e um **widget** — um pedaco de UI que preenche parte da tela. O instrutor destaca: "da para ver que o MoviesList e de fato um componente para ser reutilizavel" porque aparece em multiplas features.

### ExploreMovies (Page em Feature)
ExploreMovies e uma Page porque: "ele nao segura ninguem, ele carrega a lista de filmes e se voce navegar para detalhes ele vai desaparecer completamente da tela". O criterio e: **se muda de rota, ele some? Entao e Page**.

## Front espelhando o backend

O instrutor mostra que as features do frontend (authentication, movies, favorites) espelham os endpoints do backend separados no Insomnia. "E legal o front refletir um pouco o backend". Quando ambos usam feature-based, a navegacao do sistema fica intuitiva.

## Subjetividade reconhecida

O instrutor honestamente diz: "Algumas coisas podem parecer um pouquinho subjetivas, isso e normal, mas com a pratica, quanto mais projetos voce for criando nessa estrutura, mais voce vai pegando o jeito". Ele pede para **entender as ideias, nao decorar**.

## Regra de decisao rapida

Para classificar qualquer componente:

1. **Ele esta presente em TODA a aplicacao?** → Core
2. **Ele e reutilizado entre features?** → Shared
3. **Ele pertence a uma funcionalidade especifica?** → Features
4. Dentro de Features:
   - **Segura outros componentes/router-outlet?** → Layout
   - **E destino final de uma rota?** → Page
   - **E widget de UI reutilizavel?** → Component