# Deep Explanation: Listando Filmes no Template

## Por que duas listas (original e filtrada)?

O instrutor enfatiza a necessidade de manter duas listas separadas:

1. **Lista original** — armazenada no `moviesResource.value()`, nunca e modificada. E o "source of truth" que veio do backend.
2. **Lista filtrada** (`moviesFiltered`) — e a que aparece na tela. Quando o usuario digita filtros, essa lista muda, mas a original permanece intacta para permitir refiltragem.

Essa separacao e fundamental porque se voce filtrar a lista original, perde os itens removidos e nao consegue "desfiltrar".

## RxResource: params como gatilho de execucao

O comportamento do `params` no RxResource e sutil:
- `params: () => true` — executa o stream imediatamente quando o componente carrega
- `params: () => undefined` — NAO executa. O stream fica "dormindo" ate que params retorne algo diferente de undefined.

Isso e util para cenarios onde voce quer controlar quando a chamada HTTP acontece (ex: so apos o usuario clicar em um botao).

## LinkedSignal vs Computed

O instrutor explica a escolha do `linkedSignal` ao inves de `computed`:
- `computed` e read-only — voce nao consegue setar um valor manualmente
- `linkedSignal` permite tanto computacao automatica (quando signals referenciados mudam) quanto set manual

No caso da lista filtrada, futuramente o instrutor vai precisar fazer `moviesFiltered.set(novaLista)` quando o usuario digitar um filtro. Com `computed`, isso seria impossivel.

### Duas formas de usar LinkedSignal

O instrutor mostra que existem duas formas:

1. **Com `source` e `computation`** (usada anteriormente no header do curso):
```typescript
linkedSignal({
  source: () => someSignal(),
  computation: (value) => transform(value),
});
```

2. **Com callback simples** (usada nesta aula):
```typescript
linkedSignal(() => {
  // referencia signals aqui dentro
  // re-executa quando qualquer signal referenciado mudar
  return valorCalculado;
});
```

A segunda forma e mais concisa quando voce so precisa de um callback que reage a mudancas em signals.

## Tratamento de erro com consistencia de tipos

O instrutor enfatiza a importancia de SEMPRE retornar o mesmo tipo:
- Sucesso → retorna `Movie[]`
- Erro → retorna `[]` (array vazio, que tambem e `Movie[]`)

Nunca retorne `null`, `undefined`, ou uma string de erro. Isso quebraria a tipagem e causaria problemas no template e nos componentes filhos.

A verificacao `!!this.moviesResource.error()` converte o erro (que pode ser um objeto de erro HTTP) em booleano. Se existir erro, e `true`.

O `moviesList ?? []` e uma garantia adicional: mesmo que `value()` retorne `undefined` (o que pode acontecer antes do response chegar), o componente recebe um array vazio.

## Signal Input vs @Input decorator

O instrutor mostra a evolucao do Angular:
- **Antes:** `@Input() movies: Movie[] = []` — decorator classico
- **Agora:** `movies = input<MoviesListResponse>([])` — signal-based

Vantagens do signal input:
- Integra nativamente com o sistema de signals
- O valor e acessado como `this.movies()` (funcao), consistente com outros signals
- Type-safe com generics
- Valor inicial obrigatorio, evitando undefined acidental

## JsonPipe para debug

O instrutor usa `{{ signal() | json }}` repetidamente para debugar valores no template. Lembrete: o `JsonPipe` precisa ser importado explicitamente no array de `imports` do componente standalone.