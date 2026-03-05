# Deep Explanation: Angular Router — Navegacao Programatica

## Constructor vs ngOnInit

O instrutor enfatiza uma distincao fundamental que muitos iniciantes confundem:

- **Constructor**: executado no momento que o componente e instanciado. Ideal para injecao de dependencias (servicos como Router) e inicializacao de variaveis simples.
- **ngOnInit**: executado DEPOIS que o Angular inicializa o componente e o DOM. Ideal para logica que depende de inputs, dados do template, ou chamadas assincronas.

A confusao acontece porque ambos "rodam no inicio". A regra pratica: se e injecao de servico, vai no constructor. Se e logica de inicializacao, vai no ngOnInit. Se nao precisa do ngOnInit, remova a implementacao de OnInit — codigo limpo.

## navigate() vs navigateByUrl()

O instrutor demonstra ambos os metodos e explica a analogia com RouterLink:

| Metodo | Equivalente no template | Aceita |
|--------|------------------------|--------|
| `router.navigate(['path', param])` | `[routerLink]="['path', param]"` (com colchetes) | Array de segmentos |
| `router.navigateByUrl('/path')` | `routerLink="/path"` (sem colchetes) | String fixa |

A regra de ouro: **se tem variavel, use navigate()**. O navigate monta a URL a partir dos segmentos do array, entao `['certificados', 2]` vira `/certificados/2` automaticamente.

## Por que nao concatenar strings

O instrutor mostra explicitamente o anti-pattern de concatenacao:

```typescript
// O instrutor mostra isso como exemplo do que voce ENCONTRA em codigos
// mas NAO e a boa pratica
this.router.navigateByUrl('certificados/' + this.id);
```

Ele reconhece que voce vai encontrar codigo assim em projetos reais, mas recomenda usar o `navigate` com array porque:
1. E o recurso proprio do Angular para rotas dinamicas
2. O Angular cuida da composicao da URL
3. Evita erros de barra faltando ou duplicada

## Escopo do this

O instrutor refroca varias vezes: "nunca se esqueca do `this`". Em TypeScript/Angular, `this.router` referencia o servico injetado no componente. Sem `this`, voce estaria tentando acessar uma variavel local que nao existe.

## Onde colocar o Router

O instrutor comete um erro proposital na aula: primeiro injeta o Router no componente pai (certificados), depois percebe que precisa dele no componente filho (item-certificado) onde esta o botao. Isso ensina que o Router deve ser injetado no componente que efetivamente dispara a navegacao, nao no pai.

## Event binding (click)

O `(click)` e o event binding do Angular. O instrutor menciona que funciona na maioria das tags HTML e ate em componentes customizados. A funcao chamada no click e onde voce coloca a logica de navegacao.