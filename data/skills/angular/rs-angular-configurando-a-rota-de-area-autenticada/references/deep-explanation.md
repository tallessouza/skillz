# Deep Explanation: Rotas de Area Autenticada com Main Layout

## Por que nao colocar o header no AppComponent?

O instrutor explica um problema fundamental: se voce coloca o `<app-header>` no `app.component.html`, ele aparece em **todas** as rotas — incluindo login e registro. Isso quebra a experiencia porque o header com navegacao nao faz sentido antes do usuario estar logado.

A solucao e criar um componente intermediario (MainLayout) que agrupa o header e um `<router-outlet>` proprio. Esse componente so e carregado quando o usuario acessa a area autenticada.

## Analogia: componente estruturante vs reutilizavel

O instrutor faz uma distincao importante sobre onde colocar o componente:

- **core/layout/** — componentes estruturantes que sao necessarios para a aplicacao funcionar. Sao usados uma vez, em um lugar especifico. Exemplo: MainLayoutComponent, DedicationScreenComponent.
- **shared/** — componentes reutilizaveis que podem aparecer em multiplos lugares. Exemplo: botoes, inputs, cards.

O MainLayout e claramente estruturante — ele existe uma vez e define a estrutura da area autenticada inteira.

## Como o Angular resolve children

Quando voce define `children` em uma rota, o Angular procura um `<router-outlet>` **dentro do componente pai** (MainLayout) para renderizar os componentes filhos. Isso e diferente do `<router-outlet>` do AppComponent — sao outlets aninhados.

Fluxo:
1. Usuario acessa `localhost:4200`
2. Angular encontra a rota com `path: ''` e `component: MainLayoutComponent`
3. Renderiza MainLayout no router-outlet do AppComponent
4. Dentro do MainLayout, encontra `children` e ve `redirectTo: 'explore'`
5. Redireciona para `localhost:4200/explore`
6. Renderiza ExploreMoviesComponent no router-outlet do MainLayout

## Rotas dinamicas com :id

O instrutor mostra `details/:id` como rota dinamica. Quando o usuario acessa `/details/1`, `/details/2`, etc., o mesmo componente MovieDetails e carregado, mas o parametro `id` muda. Isso permite carregar dados diferentes baseado no ID do filme.

## O papel do pathMatch: 'full'

O `pathMatch: 'full'` e obrigatorio quando se usa `redirectTo` com path vazio. Sem ele, o Angular faria match parcial e redirecionaria qualquer rota que comeca com string vazia (ou seja, todas). Com `'full'`, so redireciona quando o path e exatamente vazio.

## Comando usado para gerar o componente

O instrutor abriu o terminal integrado **na pasta core/layout** e rodou:
```bash
ng generate component main-layout --skip-tests=true
```

O `--skip-tests=true` evita gerar o arquivo `.spec.ts` de testes unitarios, ja que o projeto nao implementa testes nessa fase.

## Visao futura mencionada

O instrutor menciona que futuramente essas rotas serao protegidas com guards para que apenas usuarios logados possam acessa-las. Neste momento, a estrutura de rotas esta pronta mas sem protecao real — qualquer um pode acessar `/explore`, `/favorites`, etc.