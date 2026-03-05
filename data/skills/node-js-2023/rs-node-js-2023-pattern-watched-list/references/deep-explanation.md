# Deep Explanation: Pattern WatchedList

## O que e uma WatchedList

A WatchedList e como um Array turbinado. Alem de manter os itens atuais (`currentItems`), ela rastreia automaticamente tres informacoes adicionais:

- **`initial`**: os itens com que a lista foi criada (snapshot inicial)
- **`new`**: itens adicionados apos a criacao
- **`removed`**: itens removidos apos a criacao

### Analogia do instrutor

Imagine que voce criou uma pergunta com anexos 1, 2 e 3. Quando o usuario edita essa pergunta:
- `initial` = [1, 2, 3] (o que existia antes)
- Se adicionou 4 e 5: `new` = [4, 5]
- Se removeu 2 e 3: `removed` = [2, 3]
- `currentItems` = [1, 4, 5] (estado atual apos todas as operacoes)

## Por que isso importa para o banco de dados

O ponto central e **otimizacao de performance**. Sem WatchedList, a abordagem ingênua e:
1. Deletar todos os anexos existentes
2. Recriar todos os anexos da nova lista

Com WatchedList:
1. Criar apenas os novos (`getNewItems()`)
2. Deletar apenas os removidos (`getRemovedItems()`)
3. Ignorar os que nao mudaram

Se a lista tem 100 itens e o usuario removeu 1 e adicionou 1, sem WatchedList voce faz 101 operacoes (100 deletes + 101 inserts). Com WatchedList, faz 2 operacoes (1 delete + 1 insert).

## Comportamentos especiais

### Add apos Remove (e vice-versa)

Se voce remove o item 2 e depois adiciona o 2 de volta:
- `removed` fica vazio (o add detecta que o item estava em removed e o tira de la)
- `new` fica vazio (porque o item ja existia no initial)
- `currentItems` volta ao estado original

Isso e inteligente porque evita operacoes desnecessarias: nao faz sentido deletar e recriar o mesmo item no banco.

O mesmo acontece ao contrario: se voce adiciona o 4 e depois remove o 4, ambas as listas ficam vazias.

### O metodo `update()` — o mais usado

O `update()` recebe a lista final completa e calcula automaticamente:
- `newItems` = itens na nova lista que nao existiam na lista atual
- `removedItems` = itens na lista atual que nao estao na nova lista

Esse e o caso mais comum: o frontend envia a lista completa de IDs e o backend precisa calcular o diff.

## Classe abstrata com `compareItems`

A WatchedList e abstrata porque cada dominio compara itens de forma diferente:
- Numeros: `a === b`
- Entities: `a.id.equals(b.id)`
- Value Objects: comparacao por propriedades

O `compareItems` e usado internamente em todos os metodos de verificacao (`isCurrentItem`, `isNewItem`, `isRemovedItem`, `wasAddedInitially`).

## Onde se encaixa no DDD

WatchedList e o pattern para gerenciar colecoes filhas dentro de Agregados. No DDD, quando um agregado (ex: Question) tem uma colecao de entidades filhas (ex: QuestionAttachment), a WatchedList permite:
1. Rastrear mudancas na colecao durante a vida do agregado
2. Persistir apenas as diferencas quando o repositorio salva o agregado
3. Manter a consistencia do agregado sem depender do banco de dados