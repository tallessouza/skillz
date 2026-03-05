# Deep Explanation: Problemas com Error Handling

## O dilema central

O instrutor apresenta um dilema que todo desenvolvedor backend enfrenta: como comunicar para a funcao chamadora que algo deu errado dentro de um use case ou entidade?

A questao nao e "como lancar um erro" — e "como representar um erro de forma que qualquer camada da aplicacao consiga tomar decisoes inteligentes com aquela informacao".

## Por que null/undefined sao ruins

O instrutor e categorico: "Nulo e algo muito vazio, porque nulo nao vem nenhuma informacao junto com essa informacao."

Quando uma funcao retorna `null`, quem consome sabe apenas que "algo deu errado". Nao sabe:
- Que TIPO de erro aconteceu
- Se e um erro recuperavel ou nao
- Que informacao adicional existe sobre o erro
- Qual HTTP status code mapear

## O problema do throw

O throw parece ser a solucao natural no JavaScript/TypeScript porque existe a classe global `Error`. Mas o instrutor aponta problemas fundamentais:

### 1. Propagacao imprevisivel
O throw funciona como um return — interrompe a execucao. Mas diferente do return, ele "propaga" pela call stack. Se nenhum try/catch captura a excecao em NENHUM lugar da aplicacao, ela bate no error handler global do framework.

O resultado? Provavelmente um Internal Server Error generico enviado ao frontend — uma resposta inesperada que nao ajuda ninguem.

### 2. Impossibilidade de diferenciar erros
Com `throw new Error('mensagem')`, o unico dado disponivel e a string da mensagem. O instrutor da um exemplo concreto:

- **Question not found** → deveria retornar HTTP 400 (informacao nao encontrada no banco)
- **Not allowed (autor diferente)** → deveria retornar HTTP 401 (nao autorizado)

Ambos sao `throw new Error(string)`. Como diferenciar? Parseando a string? Isso e fragil e impossivel de manter em escala.

### 3. Inconsistencia entre camadas

O instrutor expande o problema para alem dos use cases. E quando um Value Object precisa reportar um erro? Por exemplo, `Slug.createFromText` recebendo uma string com apenas espacos em branco.

Cada camada (entity, value object, use case) acaba inventando sua propria forma de reportar erros:
- Use case: throw
- Entity: return null?
- Value object: throw tambem? Ou algo diferente?

Essa inconsistencia e o verdadeiro problema de manutencao e escalabilidade.

## A conexao com DDD

No contexto de DDD (Domain-Driven Design), o dominio deveria ser puro e expressivo. Erros de dominio (como "slug invalido" ou "autor nao autorizado") sao regras de negocio — precisam ser representados com a mesma riqueza que as entidades.

Usar `throw new Error(string)` para erros de dominio e como usar `any` para tipagem: tecnicamente funciona, mas perde toda a expressividade e seguranca.

## O que o instrutor prepara

O instrutor fecha dizendo que existem "muitas abordagens" mas vai mostrar uma especifica nas proximas aulas. Pelo contexto (Node.js com DDD), a abordagem provavel e o Either pattern (Left/Right) ou um Result type — padroes funcionais que:
- Forcam o tratamento do erro no ponto de chamada
- Carregam dados tipados sobre o erro
- Sao consistentes em todas as camadas
- Nao dependem de propagacao imprevisivel (try/catch)