# Deep Explanation: Atualizando Registros em Banco File-based

## Por que findIndex e nao find?

O instrutor explica a diferenca crucial: `find` retorna o **objeto** encontrado, mas para atualizar um registro em um array, voce precisa saber **onde** ele esta (o indice). Com o indice, voce consegue fazer a atribuicao direta `array[index] = novoValor`.

O `findIndex` percorre cada elemento (`row`) e retorna o indice do primeiro que satisfaz a condicao `row.id === id`. Se nao encontrar nenhum, retorna `-1`.

### Demonstracao do instrutor

O instrutor mostrou no console que:
- Registro na posicao 0: primeiro ticket criado
- Registro na posicao 1: segundo ticket (ID terminando em `009`)
- Arrays sempre comecam a contar do zero

Ele tambem demonstrou o comportamento do `-1`: ao adicionar um "X" no final do ID (tornando-o invalido), o `findIndex` retornou `-1`, provando que o registro nao foi encontrado.

## Spread operator para merge parcial

A tecnica `{ ...objetoAtual, ...novosDados }` e fundamental. O instrutor explica o mecanismo:

1. Primeiro, espalha todas as propriedades atuais do registro (id, equipamento, descricao, created_at, status, etc.)
2. Depois, espalha as novas propriedades

Se uma propriedade ja existe (ex: `equipamento` era "computador"), e o novo dado traz `equipamento: "mouse"`, a segunda declaracao **sobrescreve** a primeira. Propriedades que nao estao nos novos dados permanecem intactas.

### Analogia do instrutor
O instrutor usa o exemplo concreto: se antes `equipamento` era "computador" e dentro de `data` vem `equipamento: "mouse"`, o spread faz a sobrescrita. Campos como `created_at` e `id` que nao estao em `data` permanecem inalterados.

## Separacao created_at vs updated_at

O instrutor enfatiza que `created_at` **nunca muda** — e o registro historico de quando o item foi criado. Ja `updated_at` e atualizado a cada modificacao, usando `new Date()`.

Ele demonstra visualmente: antes do update, ambos os campos tinham a mesma data. Apos o update, `updated_at` mudou enquanto `created_at` permaneceu igual.

> "E bem comum ter essa propriedade, essa informacao nos registros, nos bancos de dados."

## Persistencia apos mutacao

O padrao do banco file-based e:
1. Modificar o array em memoria (`this.#database`)
2. Chamar `this.#persist()` para salvar no arquivo JSON

Sem o passo 2, a alteracao existe apenas em memoria e se perde ao reiniciar o servidor. O `persist()` e chamado **dentro do if**, ou seja, so persiste se realmente encontrou e atualizou o registro.

## Fluxo completo da atualizacao

```
Request PUT → Controller extrai body → 
  Chama database.update(table, id, data) →
    findIndex localiza registro →
      Se encontrou (> -1): spread merge + persist →
        Arquivo JSON atualizado
      Se nao encontrou (-1): nada acontece
```