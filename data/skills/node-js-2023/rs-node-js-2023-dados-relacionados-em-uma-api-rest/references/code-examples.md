# Code Examples: Dados Relacionados em uma API REST

## Exemplo 1: Listagem com autor inline

O padrao principal discutido na aula. Em vez de retornar apenas IDs de relacionamento, a listagem ja inclui os dados necessarios.

### Endpoint de listagem de perguntas

```typescript
// Controller - GET /questions
@Get()
async fetchRecentQuestions(@Query('page') page: number) {
  const { questions } = await this.fetchRecentQuestions.execute({
    page: page ?? 1,
  })

  // Presenter transforma para incluir author inline
  return {
    questions: questions.map(QuestionWithAuthorPresenter.toHTTP),
  }
}
```

### Resposta esperada

```json
{
  "questions": [
    {
      "id": "question-1",
      "title": "Como configurar NestJS?",
      "slug": "como-configurar-nestjs",
      "createdAt": "2024-01-01T00:00:00Z",
      "author": {
        "id": "author-1",
        "name": "João Silva",
        "avatarUrl": "https://..."
      }
    }
  ]
}
```

## Exemplo 2: Detalhe com multiplos relacionamentos

A rota `getQuestionBySlug` retorna a pergunta com autor E anexos — dois relacionamentos na mesma requisicao.

```typescript
// Controller - GET /questions/:slug
@Get(':slug')
async getQuestionBySlug(@Param('slug') slug: string) {
  const { question } = await this.getQuestionBySlug.execute({ slug })

  return {
    question: QuestionDetailsPresenter.toHTTP(question),
  }
}
```

### Resposta esperada

```json
{
  "question": {
    "id": "question-1",
    "title": "Como configurar NestJS?",
    "slug": "como-configurar-nestjs",
    "content": "Estou tentando configurar...",
    "createdAt": "2024-01-01T00:00:00Z",
    "author": {
      "id": "author-1",
      "name": "João Silva"
    },
    "attachments": [
      {
        "id": "attachment-1",
        "title": "screenshot.png",
        "url": "https://..."
      }
    ]
  }
}
```

## Exemplo 3: Respostas como rota separada

Respostas NAO vem embutidas na rota de detalhe da pergunta — sao uma rota separada com paginacao.

```typescript
// GET /questions/:questionId/answers?page=1
@Get(':questionId/answers')
async fetchQuestionAnswers(
  @Param('questionId') questionId: string,
  @Query('page') page: number,
) {
  const { answers } = await this.fetchQuestionAnswers.execute({
    questionId,
    page: page ?? 1,
  })

  return {
    answers: answers.map(AnswerWithAuthorPresenter.toHTTP),
  }
}
```

### Resposta esperada

```json
{
  "answers": [
    {
      "id": "answer-1",
      "content": "Voce precisa primeiro instalar...",
      "createdAt": "2024-01-02T00:00:00Z",
      "author": {
        "id": "author-2",
        "name": "Maria Santos"
      }
    }
  ]
}
```

## Exemplo 4: Comentarios com limite e "carregar mais"

O instrutor sugere trazer apenas os primeiros comentarios (ex: 3) e oferecer botao para carregar mais.

```typescript
// Dentro da resposta de answers, trazer recentComments limitado
{
  "answers": [
    {
      "id": "answer-1",
      "content": "...",
      "author": { "id": "author-2", "name": "Maria Santos" },
      "recentComments": [
        { "id": "comment-1", "content": "Concordo!", "author": { "id": "author-3", "name": "Pedro" } },
        { "id": "comment-2", "content": "Muito bom", "author": { "id": "author-4", "name": "Ana" } }
      ],
      "totalComments": 15
    }
  ]
}

// Rota separada para carregar mais comentarios
// GET /answers/:answerId/comments?page=2
```

## Exemplo 5: Anti-pattern — N+1 requisicoes no frontend

O que acontece quando o backend NAO inclui relacionamentos inline:

```typescript
// Backend retorna apenas IDs
// GET /questions -> [{ id, title, authorId }]

// Frontend precisa fazer:
const questions = await fetch('/questions').then(r => r.json())

// N+1 problem!
const questionsWithAuthors = await Promise.all(
  questions.map(async (q) => {
    const author = await fetch(`/authors/${q.authorId}`).then(r => r.json())
    return { ...q, author }
  })
)
// Se tem 20 perguntas = 1 + 20 = 21 requisicoes!
```

## Resumo da arquitetura de rotas do curso

```
GET /questions                    → listagem + author inline
GET /questions/:slug              → detalhe + author + attachments inline
GET /questions/:id/answers        → listagem + author inline (rota separada)
GET /answers/:id/comments         → listagem + author inline (rota separada, paginada)
```