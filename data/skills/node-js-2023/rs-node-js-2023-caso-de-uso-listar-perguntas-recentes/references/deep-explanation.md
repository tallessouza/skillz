# Deep Explanation: Caso de Uso de Listagem com Paginacao

## Por que `fetch` e nao `get`?

O instrutor faz uma distincao semantica importante: `Get` retorna uma informacao unica (GetQuestionBySlug), enquanto `Fetch` traz uma listagem. Alternativas aceitas incluem `List`. A chave e consistencia — escolha uma convencao e siga.

## Por que PaginationParams e uma interface separada em `core/`?

O campo `page` nao e um dado de dominio — e um metadado de consulta. Ao extrair para `core/repositories/pagination-params.ts`, voce:
- Reutiliza em todos os repositorios que fazem listagem
- Permite adicionar `perPage`, filtros, etc. sem alterar assinaturas de N repositorios
- Mantem o dominio limpo de preocupacoes de infraestrutura

O instrutor enfatiza: "page nao e nem muito uma informacao, e mais um metadado para retornar somente um tanto de paginas."

## Como funciona o sort do JavaScript

O `.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())` usa epoch timestamps (numero de milissegundos desde 1 de janeiro de 1970). A funcao de comparacao do sort espera:
- Numero negativo: `a` vem antes de `b`
- Numero positivo: `b` vem antes de `a`
- Zero: mantem ordem

Ao fazer `b - a`, itens mais recentes (timestamps maiores) ficam primeiro.

## Matematica da paginacao com slice

```
slice((page - 1) * 20, page * 20)
```

| page | inicio | fim | itens |
|------|--------|-----|-------|
| 1 | 0 | 20 | 0-19 |
| 2 | 20 | 40 | 20-39 |
| 3 | 40 | 60 | 40-59 |

O `page - 1` e necessario porque paginas sao 1-indexed mas arrays sao 0-indexed.

## Armadilha do createdAt na factory

O instrutor encontrou um bug ao vivo: o teste falhava porque a factory `makeQuestion` sempre criava `new Date()` no campo `createdAt`, ignorando o valor passado via props. A correcao:

```typescript
// ANTES (bug): sempre sobrescreve com data atual
createdAt: new Date()

// DEPOIS (correto): usa props se fornecido, senao data atual
createdAt: props.createdAt ?? new Date()
```

Isso e um padrao recorrente em factories de teste — campos com defaults devem ser overridable.

## Estrategia de teste: separar preocupacoes

O instrutor cria dois testes distintos:
1. **Ordenacao**: 3 itens com datas especificas, valida ordem
2. **Paginacao**: 22 itens genericos, valida que pagina 2 tem 2 itens

Isso isola falhas — se o teste de paginacao quebra, voce sabe que nao e problema de ordenacao.

## Convencao de prefixos no repositorio

| Prefixo | Cardinalidade | Exemplo |
|---------|---------------|---------|
| `findBy` | Um registro | `findBySlug`, `findById` |
| `findMany` | Varios registros | `findManyRecent`, `findManyByAuthor` |
| `create` | Criacao | `create(entity)` |
| `save` | Atualizacao | `save(entity)` |
| `delete` | Remocao | `delete(entity)` |