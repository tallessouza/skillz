# Deep Explanation: Knex Update com Query Builder

## Por que separar ID dos dados

O instrutor enfatiza a separacao clara entre **identificacao** (qual registro) e **payload** (o que mudar):

- O **ID** vem da URL como route parameter (`:id`) — identifica O QUE atualizar
- Os **dados** vem do body da requisicao — definem PARA O QUE atualizar

Isso segue o padrao REST onde a URL identifica o recurso e o body carrega a representacao.

## A cadeia do Knex: table → update → where

O Knex usa um pattern de method chaining:

```
knex('tabela')     → seleciona a tabela
  .update({...})   → define os campos a atualizar
  .where({...})    → filtra quais registros
```

O instrutor mostra que sem o `.where()`, o update afetaria TODAS as linhas da tabela — um erro critico em producao.

## Desestruturacao dos params

O instrutor mostra duas formas de extrair o ID:

```typescript
// Forma 1: inline
.where({ id: request.params.id })

// Forma 2: desestruturado (preferida)
const { id } = request.params
.where({ id })
```

A forma desestruturada e preferida porque:
- Codigo mais limpo
- Reutilizavel se precisar do ID em outro lugar
- Shorthand property (`{ id }` em vez de `{ id: id }`)

## Padronizacao do return

O instrutor menciona que padronizou TODOS os responses com `return`:

```typescript
return response.json()
```

Isso garante que a funcao encerra apos enviar a resposta, evitando execucao de codigo apos o response.

## Testando com Insomnia

O fluxo de teste demonstrado:
1. Criar nova HTTP request
2. Mudar metodo para PUT
3. URL: `http://localhost:3333/courses/2` (com ID na URL)
4. Body: JSON com `{ "name": "CSS" }`
5. Send → verificar status 200
6. Confirmar no GET que os dados mudaram
7. Confirmar direto no banco de dados

## PUT vs PATCH

Embora o instrutor use PUT, vale notar:
- **PUT** — substituicao completa do recurso (envia todos os campos)
- **PATCH** — atualizacao parcial (envia apenas campos que mudaram)

Na pratica do curso, o comportamento e de PATCH (atualiza so o `name`), mas a convencao usada e PUT.