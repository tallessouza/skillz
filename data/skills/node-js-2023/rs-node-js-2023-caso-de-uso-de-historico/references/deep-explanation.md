# Deep Explanation: Caso de Uso de Historico com Paginacao

## Semantica de nomenclatura: Fetch vs Get

O instrutor explica uma convencao pessoal que traz clareza imediata ao codigo:

- **Fetch** = "quero trazer mais de uma informacao, e uma lista"
- **Get** = "e uma unica informacao"

Essa convencao se propaga para o repositorio:
- **findMany** = retorna lista (array)
- **findBy** = retorna unico registro

A logica e: ao ler o nome do use case ou metodo, voce ja sabe o formato do retorno sem precisar abrir o arquivo. Isso e especialmente valioso em projetos SOLID onde ha dezenas de use cases.

## Por que array vazio e nao null

O instrutor enfatiza: "Mesmo que nao tenha nenhum check-in feito, continua sendo uma lista, so que vazia." Isso elimina null checks em toda a cadeia de consumo. Quem chama o use case sabe que sempre recebe um array — pode fazer `.map()`, `.length`, etc. sem verificacoes defensivas.

## Paginacao por slice — a matematica

O metodo `slice(start, end)` do JavaScript trabalha com indices:
- `slice(0, 20)` → indices 0 a 19 (pagina 1)
- `slice(20, 40)` → indices 20 a 39 (pagina 2)

Formula: `slice((page - 1) * perPage, page * perPage)`

O instrutor explica passo a passo:
- Pagina 1: `(1-1) * 20 = 0` ate `1 * 20 = 20`
- Pagina 2: `(2-1) * 20 = 20` ate `2 * 20 = 40`

"Esta vendo por que a gente teve que reduzir 1 aqui? Porque isso aqui comeca do 0, nao comeca da segunda fatia, comeca da primeira fatia."

## Estrategia de teste TDD para paginacao

O instrutor segue uma abordagem incremental:

1. **Primeiro teste sem paginacao** — valida que a listagem funciona (cria 2 check-ins, espera length 2)
2. **Segundo teste com paginacao** — cria 22 itens (20 + 2), acessa pagina 2, espera apenas 2 itens

A escolha de 22 itens e deliberada: com 20 por pagina, a pagina 2 deve ter exatamente 2 itens. Se a paginacao estiver quebrada (retornando todos), o teste falha porque length seria 22, nao 2.

## expect.objectContaining — validacao parcial

O instrutor mostra uma tecnica do Vitest/Jest para validar objetos sem precisar conhecer todos os campos:

```typescript
expect(checkIns).toEqual([
  expect.objectContaining({ gym_id: 'gym-21' }),
  expect.objectContaining({ gym_id: 'gym-22' }),
])
```

"Nao preciso colocar o dado do objeto inteiro, eu posso esperar que tenha um objeto contendo alguma parte daquele objeto e nao objeto completo."

Isso torna os testes resilientes a mudancas no schema — se um novo campo for adicionado ao check-in, o teste nao quebra.

## Ordem de implementacao do instrutor

1. Cria o arquivo do use case (esqueleto)
2. Cria o arquivo de teste (copiando de outro teste similar para reaproveitar setup)
3. Define a interface do repositorio (novo metodo `findManyByUserId`)
4. Implementa no repositorio in-memory
5. Conecta tudo no use case
6. Roda testes, corrige erros (esqueceu de passar `page`)
7. Adiciona teste de paginacao (TDD)
8. Implementa paginacao no repositorio
9. Testes passam

Essa ordem mostra que ele comeca pelo contrato (interface), implementa o mais simples (in-memory), e usa TDD para guiar a paginacao.