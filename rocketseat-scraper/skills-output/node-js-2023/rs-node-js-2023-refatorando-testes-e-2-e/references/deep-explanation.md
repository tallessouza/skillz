# Deep Explanation: Refatorando Testes E2E com Factories

## Por que refatorar para Factories?

O instrutor explica que o objetivo principal é **deixar a estrutura pronta para criar todos os demais controllers**. Quando os testes usam PrismaService diretamente, cada teste repete a lógica de criação de entidades — com todos os campos obrigatórios, mapeamentos, e relacionamentos. As Factories encapsulam isso.

## O padrão Factory no contexto NestJS

Cada Factory é um `@Injectable()` que recebe o `PrismaService` por injeção de dependência. O método principal é `makePrismaEntity()`, que:

1. Usa uma função `make` do domínio para criar a entidade com valores padrão (via faker)
2. Aceita overrides opcionais para customizar campos específicos
3. Usa um Mapper (`PrismaEntityMapper.toPrisma()`) para converter do domínio para o formato do Prisma
4. Persiste no banco via `prisma.entity.create()`
5. Retorna a entidade de domínio (não o registro Prisma)

## O insight sobre PrismaService nos testes

O instrutor destaca um momento interessante: "Olha que interessante. Tiro toda a referência do PrismaService, porque agora a gente tá usando direto as nossas Factories." A percepção é que quando o teste só precisa de dados no banco para setup, a Factory é suficiente. O PrismaService só é necessário quando o teste precisa **consultar** o banco para validar um resultado.

Exemplo concreto:
- `FetchRecentQuestionsController` — só cria dados → remove PrismaService
- `CreateQuestionController` — cria user (Factory) mas valida que a question foi salva → mantém PrismaService para o `findFirst`

## Criando novas Factories rapidamente

O instrutor demonstra o padrão de copiar uma Factory existente e adaptar:
1. Copie o arquivo da Factory mais parecida
2. Substitua o nome da entidade em todos os lugares
3. Ajuste os imports (Mapper, entidade de domínio)
4. O método `make` já existe no domínio (usado em testes unitários)

Ele faz isso ao vivo para Answer, QuestionComment e AnswerComment, mostrando que o processo é mecânico e rápido quando o padrão está estabelecido.

## DatabaseModule como chave

Um erro que o instrutor comete ao vivo e corrige: esquecer de importar o `DatabaseModule` no módulo de teste. Sem ele, as Factories não conseguem resolver o `PrismaService` por DI e o teste falha. Este é o import correto:

```typescript
import { DatabaseModule } from '@/infra/database/database.module'
```

## Override de atributos em Factories

No teste de autenticação, o instrutor mostra que é possível passar overrides para a Factory:

```typescript
await studentFactory.makePrismaStudent({
  email: 'johndoe@example.com',
  password: await hash('123456', 8),
})
```

Isso é necessário porque o teste de autenticação precisa saber exatamente qual email e senha usar para fazer login. O password precisa estar hasheado porque é assim que seria salvo em produção.