# Code Examples: Entidades e Casos de Uso

## Setup inicial do projeto

```bash
npm init -y
npm install typescript @types/node -D
npx tsc --init
```

### tsconfig.json ajustes
```json
{
  "compilerOptions": {
    "target": "es2020",
    "strict": true
  }
}
```

Nota: o instrutor intencionalmente nao instala nenhum framework. O objetivo e mostrar que o dominio vive sem dependencias externas.

## Estrutura de pastas criada

```
src/
  domain/
    entities/
      instructor.ts
      student.ts
      question.ts
    use-cases/
      answer-question.ts
```

O instrutor menciona que essa estrutura de pastas vai mudar mais pra frente no curso — por enquanto serve para organizar os primeiros conceitos.

## Entidades identificadas pela conversa

Da frase "Eu tenho que responder os alunos e me perco em quais duvidas foram respondidas":

| Termo na conversa | Entidade | Arquivo |
|-------------------|----------|---------|
| "Eu" (instrutor) | Instructor | `instructor.ts` |
| "alunos" | Student | `student.ts` |
| "duvidas" | Question | `question.ts` |

## Caso de uso identificado

| Verbo na conversa | Caso de uso | Arquivo |
|-------------------|-------------|---------|
| "responder" | Answer Question | `answer-question.ts` |

## Exemplo expandido: como as entidades podem ser escritas

```typescript
// src/domain/entities/instructor.ts
export class Instructor {
  constructor(
    public name: string,
    public email: string,
  ) {}
}

// src/domain/entities/student.ts
export class Student {
  constructor(
    public name: string,
    public email: string,
  ) {}
}

// src/domain/entities/question.ts
export class Question {
  constructor(
    public title: string,
    public content: string,
    public authorId: string,
  ) {}
}
```

## Exemplo expandido: caso de uso

```typescript
// src/domain/use-cases/answer-question.ts
export class AnswerQuestionUseCase {
  execute(instructorId: string, questionId: string, content: string) {
    // Aqui entra a logica de dominio
    // Nao acessa banco, nao acessa HTTP
    // Recebe dados puros, processa, retorna dados puros
  }
}
```

## Variacao: implementacao funcional (alternativa mencionada pelo instrutor)

O instrutor diz que DDD nao exige OOP. Uma alternativa funcional:

```typescript
// Entidade como tipo
interface Question {
  title: string
  content: string
  authorId: string
}

// Caso de uso como funcao pura
function answerQuestion(
  instructorId: string,
  questionId: string,
  content: string,
) {
  // Logica de dominio pura
}
```

## Teste de portabilidade

O instrutor destaca que o codigo do dominio deve passar no "teste de portabilidade":

```
1. Copie a pasta domain/ inteira
2. Cole em outro projeto TypeScript
3. Rode os testes
4. Tudo deve funcionar sem instalar nada extra
```

Se precisou instalar um ORM ou framework para os testes passarem, o dominio esta acoplado.