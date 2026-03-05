# Deep Explanation: RouterLink para Navegacao em Angular

## Por que RouterLink e nao href?

Em uma SPA (Single Page Application) Angular, usar `href` causa um reload completo da pagina, perdendo todo o estado da aplicacao. O `RouterLink` intercepta o clique e usa o Router do Angular para trocar apenas o componente renderizado, mantendo o estado e proporcionando navegacao instantanea.

## String vs Colchetes — A diferenca fundamental

O instrutor explica uma distincao crucial do Angular que se aplica a qualquer binding, nao apenas ao RouterLink:

- **Sem colchetes** (`routerLink="/rota"`): Angular interpreta o valor como uma **string literal**. O que voce escreveu e exatamente o que sera usado.
- **Com colchetes** (`[routerLink]="expressao"`): Angular interpreta o valor como **codigo TypeScript**. Pode ser uma variavel, um array, uma expressao.

Essa e a mesma regra para qualquer property binding no Angular: colchetes = expressao TypeScript, sem colchetes = string.

## Por que array ao inves de string concatenada?

Quando a rota tem partes dinamicas, o instrutor recomenda usar um array:

```typescript
[routerLink]="['/certificados', id]"
```

Cada item do array e um segmento da URL. O Angular concatena com `/` automaticamente. Isso e mais seguro que concatenar strings manualmente (`'/certificados/' + id`) porque:
1. O Angular escapa valores automaticamente
2. Nao ha risco de barras duplas ou faltantes
3. E mais legivel quando ha multiplos segmentos dinamicos

## Import obrigatorio no componente standalone

O Angular moderno usa componentes standalone por padrao. Diferente do antigo sistema de NgModules onde RouterLink ficava disponivel ao importar `RouterModule` uma vez, agora **cada componente** que usa RouterLink precisa importa-lo explicitamente no seu array de `imports`. Se esquecer, o Angular simplesmente ignora o atributo sem dar erro — um bug silencioso comum para iniciantes.

## RouterLink em componentes customizados

O instrutor demonstra que RouterLink funciona em qualquer elemento, incluindo componentes customizados como `<app-card>`. Internamente, o Angular aplica uma diretiva que escuta o evento de clique do elemento host e executa a navegacao. Isso significa que voce pode transformar qualquer componente em um link navegavel.

## Cursor pointer — detalhe de UX

O instrutor corrige um detalhe de UX: quando um elemento nao-link (como uma `div`) recebe RouterLink, o cursor do mouse nao muda automaticamente para pointer. E necessario adicionar `cursor: pointer` no CSS para indicar visualmente que o elemento e clicavel.

## Convencao do logo

O instrutor menciona uma convencao de UX universal: clicar no logo de um site redireciona para a pagina inicial. Essa e uma expectativa dos usuarios que deve ser implementada com `routerLink="/"` no elemento do logo.