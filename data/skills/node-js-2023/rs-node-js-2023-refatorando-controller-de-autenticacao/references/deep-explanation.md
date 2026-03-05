# Deep Explanation: Refatorando Controller de Autenticacao

## Por que refatorar controllers para use cases?

O controller e a camada de apresentacao HTTP. Ele recebe requests, valida input basico e delega para a logica de negocio. Quando o controller acessa Prisma diretamente, ele mistura responsabilidades — qualquer mudanca no banco exige mudanca no controller.

Com use cases, o controller fica fino: recebe dados, chama `execute()`, trata o resultado. Toda logica de autenticacao (buscar usuario, comparar senha, gerar token) fica encapsulada no use case.

## O grafo de dependencias do NestJS

O erro mais comum nesse processo e o NestJS nao conseguir resolver dependencias. Isso acontece porque:

1. **Use cases precisam de repositories** — o `AuthenticateStudentUseCase` depende de `StudentsRepository`
2. **Repositories vivem no DatabaseModule** — entao o `HttpModule` precisa importar `DatabaseModule`
3. **Use cases podem depender de servicos de infra** — `HashGenerator` vive no `CryptographicModule`
4. **O NestJS so injeta o que esta visivel** — se o module nao importa, nao injeta

A mensagem de erro do NestJS e bastante util: "Please make sure that the argument HashGenerator at index 1 is available in the HTTP module context". Ela diz exatamente qual dependencia falta e em qual posicao do construtor.

## Nomes diferentes entre dominio e persistencia

O instrutor destaca que isso e "muito comum acontecer" — uma entidade `Student` no dominio pode ser `User` no banco de dados. Isso e perfeitamente aceitavel porque:

- O banco de dados reflete a estrutura de persistencia
- O dominio reflete o modelo de negocio
- Nao necessariamente toda tabela mapeia 1:1 para uma entidade
- O mapper e a ponte entre essas duas representacoes

## Processo de criacao do repository Prisma

O instrutor usa uma tecnica pratica: copiar um repository existente (Questions) e fazer find-and-replace para a nova entidade (Students). Isso garante consistencia de padrao entre repositories. Passo a passo:

1. Copiar `PrismaQuestionsRepository`
2. Replace `Question` → `Student` (com match case)
3. Ajustar queries especificas (`findByEmail` ao inves de `findBySlug`)
4. Criar mapper correspondente (`PrismaStudentMapper`)
5. Registrar no `DatabaseModule` com `provide/useClass`

## Tratativa de erros adiada

O instrutor deliberadamente usa `throw new Error()` temporario, dizendo "logo a gente vai fazer a tratativa de erros". Isso mostra uma abordagem pragmatica: primeiro faz funcionar com a arquitetura correta, depois refina o error handling. O padrao `result.isLeft()` ja esta preparado para o Either pattern.

## O padrao provide/useClass

```typescript
{ provide: StudentsRepository, useClass: PrismaStudentsRepository }
```

Isso diz ao NestJS: "quando alguem pedir `StudentsRepository`, entregue uma instancia de `PrismaStudentsRepository`". E o mecanismo que permite inversao de dependencia — o dominio depende da abstracao, nao da implementacao.