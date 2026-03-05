# Deep Explanation: Testes de Repository Prisma — Update e FindById

## Por que testar campos parciais independentemente?

O instrutor destaca um insight importante: quando o usuario atualiza um prompt, ele pode enviar apenas o titulo OU apenas o conteudo. O repository nao deve enviar campos que nao foram passados para o Prisma. Se voce testa apenas o update com todos os campos, perde a garantia de que campos ausentes nao sao enviados com valores undefined ou null.

A tecnica usada e acessar `mock.calls[0][0]` para pegar o objeto exato passado ao Prisma e verificar:
1. Que o campo enviado esta presente com o valor correto
2. Que o campo NAO enviado nao existe no objeto (`"field" in call.data` retorna false)

Isso evita falsos positivos — o instrutor demonstra ao vivo que se adicionar um campo extra, o teste quebra corretamente.

## A estrutura where/data do Prisma

O `update` do Prisma recebe um objeto com `where` (identificacao do registro) e `data` (campos a atualizar). O teste deve validar AMBOS separadamente:
- `where` garante que o registro correto sera atualizado
- `data` garante que apenas os campos corretos sao enviados

## findUnique vs findFirst

Para `findById`, o Prisma usa `findUnique` (nao `findFirst`), porque o ID e unico por definicao. O mock precisa refletir isso — usar `findFirst` no mock quando o repository usa `findUnique` criaria um teste que nao verifica a chamada real.

## Cenario null no findById

O instrutor cria um teste "bem simplesinho" mas essencial: quando o ID nao existe, o repository retorna null. Sem esse teste, voce nao garante que o repository propaga corretamente o retorno null do Prisma sem transformacao ou erro.

## Organizacao dos mocks

Os mocks ficam no topo do arquivo de teste, compartilhados entre todos os `describe`. Cada operacao do Prisma (create, update, findUnique, findFirst) tem seu proprio `jest.fn()` com tipagem. Isso permite que cada teste configure o `mockResolvedValue` apropriado sem interferir nos outros.

## Coverage como guia

O instrutor usa `--coverage` para identificar que as linhas 35-40 (findById) nao estavam cobertas. Coverage nao e o objetivo, mas e um guia util para encontrar metodos sem teste. Ao final, "tudo verdinho" confirma cobertura completa do repository.