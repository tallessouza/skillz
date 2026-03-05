# Deep Explanation: Refatorando Casos de Uso com Either

## Por que refatorar todos os use cases de uma vez

O instrutor enfatiza que essa refatoracao e um "trabalhinho manual" mas necessario. A ideia e que **todos** os use cases sigam o mesmo contrato — Either como tipo de retorno. Isso garante que o consumidor (controller, outro use case) sempre lida com o resultado da mesma forma, sem precisar saber se aquele use case especifico usa throw ou return.

## O padrao Either aplicado

O Either e um tipo algebrico com dois lados:
- **Left**: representa falha (erro tipado)
- **Right**: representa sucesso (valor de retorno)

Isso transforma erros em **valores** em vez de **excecoes**. O beneficio principal e que o compilador TypeScript forca o consumidor a lidar com ambos os casos.

## Mapeamento de erros

O instrutor mostra que cada ponto de falha no use case recebe uma classe de erro semantica:
- `ResourceNotFoundError` — quando um recurso buscado no repositorio nao existe
- `NotAllowedError` — quando a acao e proibida (ex: usuario nao e o autor)

Essa separacao permite que o controller retorne HTTP 404 vs 403 sem logica condicional complexa.

## Casos sem erro

Quando um use case nao tem nenhum caminho de falha previsivel (ex: `CreateQuestion` que so cria e salva), o tipo de erro e `null`. Isso documenta explicitamente: "esse use case nao falha no nivel de dominio".

## Casos sem retorno de sucesso

Use cases como `DeleteAnswer` nao retornam payload no sucesso. O padrao e usar `{}` (objeto vazio) como tipo de sucesso, porque o Either precisa de um tipo no lado Right.

## Testes vao quebrar

O instrutor avisa que apos essa refatoracao, os testes existentes vao falhar porque testavam erros via `expect().rejects.toThrow()`. Agora, os testes precisam verificar o Either — `result.isLeft()`, `result.isRight()`, e o tipo do valor dentro.

## Dica de produtividade do instrutor

O instrutor menciona que configurou o VS Code para auto-import ao salvar. Isso acelera a refatoracao porque ao digitar `Either`, `left`, `right` e as classes de erro, o save automaticamente resolve os imports. Tambem sugere usar Find & Replace para partes repetitivas quando os erros sao iguais entre use cases.