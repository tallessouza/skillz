# Code Examples: Mapeando Relacionamentos

## Exemplo completo: Question com authorId

```typescript
// domain/entities/question.ts

interface QuestionProps {
  authorId: string
  title: string
  content: string
}

export class Question {
  public id: string
  public authorId: string
  public title: string
  public content: string

  constructor(props: QuestionProps, id?: string) {
    this.authorId = props.authorId
    this.title = props.title
    this.content = props.content
    this.id = id ?? randomUUID()
  }
}
```

O `authorId` aqui referencia um `Student` — quem fez a pergunta. Note que nao ha import de `Student`, nao ha referencia direta. Apenas o ID.

## Exemplo completo: Answer com multiplos relacionamentos

```typescript
// domain/entities/answer.ts

interface AnswerProps {
  authorId: string    // Instrutor ou aluno que respondeu
  questionId: string  // Pergunta sendo respondida
  content: string
}

export class Answer {
  public id: string
  public authorId: string
  public questionId: string
  public content: string

  constructor(props: AnswerProps, id?: string) {
    this.authorId = props.authorId
    this.questionId = props.questionId
    this.content = props.content
    this.id = id ?? randomUUID()
  }
}
```

`Answer` tem dois relacionamentos por ID:
- `authorId` — quem respondeu (pode ser Instructor ou Student)
- `questionId` — qual pergunta esta sendo respondida

## Entidades separadas: Student e Instructor

```typescript
// domain/entities/student.ts
export class Student {
  public id: string
  public name: string

  constructor(name: string, id?: string) {
    this.name = name
    this.id = id ?? randomUUID()
  }
}

// domain/entities/instructor.ts
export class Instructor {
  public id: string
  public name: string

  constructor(name: string, id?: string) {
    this.name = name
    this.id = id ?? randomUUID()
  }
}
```

Campos identicos, entidades separadas. Isso e intencional.

## Caso de uso: AnswerQuestion

```typescript
// domain/use-cases/answer-question.ts

interface AnswerQuestionRequest {
  instructorId: string
  questionId: string
  content: string
}

export class AnswerQuestion {
  constructor(private answersRepository: AnswersRepository) {}

  async execute({ instructorId, questionId, content }: AnswerQuestionRequest) {
    const answer = new Answer({
      authorId: instructorId,
      questionId,
      content,
    })

    await this.answersRepository.create(answer)

    return { answer }
  }
}
```

Na criacao da `Answer`, passamos um objeto com todos os campos obrigatorios. O autocomplete guia o desenvolvedor.

## Variacao: casos de uso separados por ator

```typescript
// Instrutor: pode anexar
export class AnswerQuestionAsInstructor {
  async execute({ instructorId, questionId, content, attachments }: Request) {
    const answer = new Answer({
      authorId: instructorId,
      questionId,
      content,
      attachments, // Instrutor pode
    })
    // ...
  }
}

// Aluno: sem anexo, com limite diario
export class AnswerQuestionAsStudent {
  async execute({ studentId, questionId, content }: Request) {
    const todayAnswers = await this.repo.countByAuthorToday(studentId)
    if (todayAnswers >= 3) {
      throw new Error('Limite de 3 respostas por dia atingido')
    }

    const answer = new Answer({
      authorId: studentId,
      questionId,
      content,
      // Sem attachments
    })
    // ...
  }
}
```

Este exemplo mostra por que manter `Student` e `Instructor` separados e ter casos de uso distintos evita `if/else` dentro de um caso de uso generico.

## Anti-pattern: referencia direta ao objeto

```typescript
// ERRADO — acopla Question diretamente a Student
export class Question {
  public author: Student  // Referencia direta!
  // ...
}

// CORRETO — apenas o ID
export class Question {
  public authorId: string  // Desacoplado
  // ...
}
```

A referencia direta cria acoplamento: Question agora depende de Student. Se Student mudar, Question pode quebrar. Com apenas o ID, cada entidade evolui independentemente.