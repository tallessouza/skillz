# Deep Explanation: Mensagem de Sucesso com Computed Signals

## Por que computed e nao tap?

O instrutor explica que a abordagem com `tap` e valida — voce poderia fazer `pipe(tap(() => signal.set('mensagem')))` e funcionaria. Porem, isso e imperativo: voce esta manualmente populando um signal dentro de um callback.

A abordagem com `computed` e mais reativa porque:
- O computed **reage automaticamente** a mudancas no signal que ele referencia internamente
- Nao ha necessidade de chamar `.set()` manualmente
- O fluxo de dados e unidirecional e declarativo: resource muda → computed recalcula → template atualiza

## O papel do hasValue no rxResource

O `rxResource` (ou `resource`) do Angular expoe varios signals derivados automaticamente:
- **`hasValue()`** — retorna `true` se o observable retornou sucesso, `false` caso contrario
- **`error()`** — guarda o erro caso o observable tenha falhado
- **`value()`** — guarda o valor retornado pelo observable em caso de sucesso

O instrutor destaca: "O rxResource guarda informacoes de acordo com o retorno do Observable. Se retornar sucesso, hasValue e true e value guarda o retorno. Se retornar erro, error guarda o erro."

## Signal tracking no Angular — armadilha importante

O instrutor demonstrou ao vivo uma armadilha: ele criou um `console.log(this.registerResource.hasValue())` dentro do computed, mas **nada aconteceu** ao clicar no botao.

A razao: **signals e computeds so sao executados quando referenciados no template**. O Angular precisa "ver" o signal sendo usado (via interpolacao `{{ }}`, property binding `[prop]`, etc.) para manter o tracking reativo.

Solucao: o instrutor adicionou `{{ registerResource.hasValue() }}` temporariamente no template para ativar o tracking, e entao o console.log passou a funcionar.

Essa e uma diferenca fundamental em relacao a outros frameworks — signals no Angular sao lazy por design.

## Encadeamento de @if/@else if/@else

O instrutor usou a nova sintaxe de controle de fluxo do Angular (`@if`, `@else if`, `@else`) para encadear tres estados:
1. Se tem erro → mostra mensagem vermelha
2. Se tem sucesso → mostra mensagem verde
3. Senao → mostra paragrafo vazio (para nao quebrar o layout)

O paragrafo vazio no `@else` e um detalhe pratico: manter o espaco no layout mesmo quando nao ha mensagem, evitando "pulos" visuais.

## Programacao reativa vs imperativa — a escolha do instrutor

O instrutor resume: "Essa solucao e mais reativa ao inves daquela utilizando o tap. O tap e valido sim, mas essa daqui e melhor para praticar programacao reativa."

A mensagem central: quando voce tem um `rxResource` que ja rastreia estado internamente, derive informacoes dele com `computed()` ao inves de duplicar o tracking com `tap` + `signal.set()`.