# Deep Explanation: Filtro Reativo com Signal Model e LinkedSignal

## Por que model() e nao signal()?

O instrutor explica que o `model()` e um signal especial que funciona como input E output ao mesmo tempo. Enquanto um `signal()` normal so guarda valor localmente, o `model()` permite:

1. **Two-way data binding com ngModel** — o valor digitado no input vai para o model, e se voce fizer `.set()` programaticamente, o input reflete o novo valor
2. **Two-way data binding com o componente pai** — usando a syntax "banana in the box" `[(prop)]`, o valor flui do filho para o pai e vice-versa
3. **Disparo de recomputacao no LinkedSignal** — quando o model muda (porque o usuario digitou), qualquer LinkedSignal ou computed que referencia o signal linkado ao model sera recomputado

### A cadeia reativa completa

```
Usuario digita no input
    → ngModel atualiza model() do componente filho
    → model() propaga para signal() do componente pai via [(prop)]
    → linkedSignal detecta mudanca no signal do pai
    → linkedSignal recomputa, gerando lista filtrada
    → template atualiza automaticamente
```

Tudo isso acontece sem nenhum subscribe, sem EventEmitter, sem callback manual.

## Template Driven Forms vs Reactive Forms vs Signal Forms

O instrutor escolheu Template Driven Forms (ngModel) deliberadamente para mostrar que signals funcionam com qualquer abordagem de forms no Angular. A chave e o `FormsModule` que exporta a diretiva `ngModel`.

## Por que nunca alterar a lista original?

O instrutor enfatiza: "se voce perder a lista original, no primeiro filter ele funciona, porem se voce tentar filtrar novamente, voce nao vai ter mais a lista original, voce vai ter a lista do primeiro filtro apenas."

Isso e critico em filtros reativos. O LinkedSignal recomputa do zero toda vez que um signal muda. Se ele referencia `moviesResource.value()` (a lista original da API), cada recomputacao parte da lista completa. Se voce mutasse a lista, cada filtragem subsequente seria sobre um subconjunto cada vez menor.

## O papel do LinkedSignal na recomputacao

O LinkedSignal, assim como o computed, reexecuta sua funcao toda vez que QUALQUER signal referenciado dentro dele muda de valor. Os signals referenciados sao:

- `this.moviesResource.value()` — muda quando a API retorna dados
- `this.moviesResource.error()` — muda se ocorre erro
- `this.movieTitleFilter()` — muda a cada caractere digitado no input de titulo
- `this.movieCategoryFilter()` — muda a cada caractere digitado no input de categoria

Cada digitacao de caractere dispara uma recomputacao completa do filtro. Por isso a normalizacao e o early return para filtros vazios sao importantes para performance.

## "Banana in the box" — a syntax [(prop)]

O instrutor usa o termo "banana in the box" para a syntax `[( )]`. Os colchetes `[ ]` sao a "box" (property binding / input), e os parenteses `( )` sao a "banana" (event binding / output). Juntos, fazem two-way data binding.