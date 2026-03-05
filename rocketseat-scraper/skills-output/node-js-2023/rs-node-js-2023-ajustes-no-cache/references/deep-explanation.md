# Deep Explanation: Ajustes no Cache — NestJS com Domain Classes

## O problema fundamental: classes nao sobrevivem a serializacao JSON

Quando voce tem uma arquitetura com Domain Entities (DDD) e usa um cache como Redis, existe um problema silencioso: classes JavaScript/TypeScript nao sao reconstruidas pelo `JSON.parse`.

O ciclo e:
1. `toDomain(rawData)` cria uma instancia de `QuestionDetails` com `props`, metodos, `UniqueEntityID`
2. `JSON.stringify(questionDetails)` converte para string — mas so preserva propriedades enumeraveis
3. `JSON.parse(jsonString)` retorna um **objeto plano** — nao uma instancia da classe
4. Qualquer codigo que espera metodos da classe (`.props`, `.id.toValue()`) quebra

O instrutor identificou isso ao perceber que o cache estava salvando a entidade de dominio (pos-conversao) e ao recuperar, o objeto nao tinha mais a estrutura da classe.

## A solucao: inverter a ordem cache ↔ toDomain

A insight do instrutor e simples mas poderosa: **salve no cache ANTES de converter para dominio**.

Dados raw do Prisma sao objetos planos com tipos primitivos (strings, numbers, arrays de objetos planos). Esses dados sobrevivem perfeitamente ao ciclo `JSON.stringify` → `JSON.parse`. Entao:

- **Salvar:** raw do Prisma → `JSON.stringify` → Redis ✅
- **Recuperar:** Redis → `JSON.parse` → raw → `toDomain()` → classe ✅

## Estrategia de teste isolado com `.only`

O instrutor demonstrou uma tecnica pratica: quando multiplos testes quebram apos uma mudanca estrutural, use `it.only` para isolar um teste por vez. Isso evita confusao com multiplos erros simultaneos e permite resolver cada caso metodicamente.

## Cuidados com IDs e tipos

Ao verificar dados no cache, lembre que `UniqueEntityID` precisa de `.toString()` ou `.toValue()` para comparar com o valor raw (que e uma string). O instrutor encontrou esse erro durante o teste — o `questionId` precisava ser convertido para string antes da comparacao.

## Verificacao em Redis

O instrutor abriu o Redis (Database 1, usado para testes) e limpou as chaves para garantir um estado limpo. Isso e importante: testes de cache devem comecar com estado vazio para serem determinísticos.

## Padrao de teste cache completo

O teste ideal verifica o ciclo completo:
1. Cache esta vazio (`expect(cached).toBeNull()`)
2. Executa a query (popula cache internamente)
3. Cache agora tem dados (`expect(cached).not.toBeNull()`)
4. Dados no cache estao no formato correto (`objectContaining`)

Isso e mais robusto do que setar o cache manualmente no teste, porque testa o comportamento real do repositorio.