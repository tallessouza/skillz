# Deep Explanation: ConcurrentDictionary em Servicos .NET

## O problema fundamental: race condition em Singleton

O instrutor usa uma analogia excelente com um **contador** para explicar o problema:

Imagine um contador com valor 7 em um servico Singleton. Duas conexoes pedem o valor ao mesmo tempo:
- Ambas recebem 7
- Ambas incrementam para 8
- Resultado: 8 (deveria ser 9)

Uma das operacoes **sobrescreve** a outra silenciosamente. Nao ha erro, nao ha excecao — apenas dados incorretos.

## Por que Singleton e o centro do problema

O instrutor enfatiza: **"Tome muito cuidado com servicos do tipo Singleton."**

Em Singleton, o container de DI reutiliza o **mesmo objeto** para todas as conexoes. Isso e intencional — e exatamente o que permite compartilhar estado (como mapear codigos a conexoes). Mas compartilhar estado significa que qualquer propriedade mutavel esta sujeita a acessos simultaneos.

## Como ConcurrentDictionary resolve

O instrutor explica que o `ConcurrentDictionary` e **thread-safe**: quando multiplas conexoes tentam acessar ao mesmo tempo, ele internamente organiza as operacoes em fila — "um de cada vez". 

Operacoes thread-safe incluem:
- `TryAdd` — adicionar
- `TryRemove` — remover
- `ContainsKey` — verificar existencia

## A mudanca de API: Add → TryAdd

Um ponto pratico importante: `ConcurrentDictionary` **nao tem metodo `Add()`**. Ele tem `TryAdd()` que retorna `bool`. Isso e por design — em contexto concorrente, a operacao pode falhar (chave ja adicionada por outra thread), e o codigo precisa lidar com isso.

## Contexto da aplicacao

O cenario e um **Hub SignalR** onde:
- Usuarios se conectam e geram codigos
- O codigo e a chave do dicionario
- O valor e um DTO com `UserId` e `UserConnectionId`
- Na proxima etapa, outro usuario le o codigo e o sistema precisa encontrar quem gerou

Isso exige que o dicionario seja confiavel sob concorrencia — multiplos usuarios podem gerar codigos simultaneamente.