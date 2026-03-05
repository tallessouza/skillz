# Code Examples: Listando Registros com Prisma

## Exemplo base da aula

```typescript
// questionsController — action index
async index() {
  const questions = await prisma.questions.findMany()

  return questions
}
```

Resultado ao chamar GET `http://localhost:3333/questions`:
```json
[
  {
    "id": 1,
    "title": "Primeira pergunta",
    "content": "Conteudo da primeira pergunta"
  },
  {
    "id": 2,
    "title": "Segunda pergunta",
    "content": "Conteudo da segunda pergunta"
  }
]
```

## Variacoes do findMany

### Com ordenacao
```typescript
async index() {
  const questions = await prisma.questions.findMany({
    orderBy: { createdAt: 'desc' }
  })

  return questions
}
```

### Com selecao de campos
```typescript
async index() {
  const questions = await prisma.questions.findMany({
    select: {
      id: true,
      title: true,
    }
  })

  return questions
}
```

### Com relacoes incluidas
```typescript
async index() {
  const questions = await prisma.questions.findMany({
    include: {
      author: true
    }
  })

  return questions
}
```

## Rota correspondente

```typescript
// routes.ts
router.get('/questions', questionsController.index)
```

## Teste no Insomnia

- Metodo: GET
- URL: `http://localhost:3333/questions`
- Body: nenhum (GET nao envia body)
- Response esperado: array JSON com todos os registros