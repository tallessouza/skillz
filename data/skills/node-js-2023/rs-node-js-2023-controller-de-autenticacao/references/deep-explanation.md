# Deep Explanation: Controller de Autenticação NestJS

## Por que o mesmo erro para email e senha?

O instrutor enfatiza: "A gente não retorna erros diferentes, até para o usuário no front-end não saber se deu erro na senha ou no e-mail, a gente retorna a mesma mensagem." Isso é uma prática de segurança fundamental — se o sistema retorna "usuário não encontrado" vs "senha incorreta", um atacante pode enumerar emails válidos no sistema antes de tentar brute force.

A mensagem escolhida é `"User credentials do not match"` — genérica o suficiente para não revelar nada, específica o suficiente para o front-end saber que é erro de credenciais (401).

## O padrão `sub` no JWT

O instrutor explica a escolha de `sub` ao invés de `userId`: "Eu geralmente gosto de chamar de sub, até porque é um padrão do JWT." O claim `sub` (subject) é definido na RFC 7519 como o identificador do principal que é o assunto do token.

Benefício prático demonstrado: no jwt.io, ao passar o mouse sobre `sub`, a ferramenta já mostra automaticamente "subject whom the token refers to" — ferramentas do ecossistema reconhecem esse padrão.

## snake_case na resposta HTTP

O instrutor tem uma preferência clara: "Eu gosto de retornar as coisas para o front-end geralmente com underscore, mesmo que a minha variável aqui dentro siga padrão camelCase, porque no front-end depois fica mais legalzinho nesse formato." Isso segue a convenção de APIs REST onde o JSON de resposta usa snake_case, enquanto o código interno do servidor usa camelCase do TypeScript.

## Inversão de dependência no NestJS

O instrutor mostra como injetar o PrismaService: "Como a gente está usando inversão de dependência, bem facinho, só vem aqui e joga ele em qualquer ordem." O NestJS resolve as dependências automaticamente pelo tipo no constructor — a ordem dos parâmetros não importa.

## Estrutura do controller

O controller segue o mesmo padrão do controller de criação de conta:
1. Schema Zod para validação do body
2. `@UsePipes(new ZodValidationPipe(schema))` para validação automática
3. `@HttpCode(201)` para definir o status code
4. Tipagem do body com o tipo inferido do Zod

## Testando com dados existentes

O instrutor demonstra um ponto prático importante: ao testar, lembrar que usuários criados antes da implementação do hash de senha não terão senhas com hash no banco. Apenas usuários criados após a implementação do bcrypt no controller de criação terão senhas comparáveis. Isso é relevante em ambientes de desenvolvimento e migrações.

## UnauthorizedException do NestJS

O NestJS fornece exceções HTTP built-in como `UnauthorizedException`, que automaticamente retorna status 401 com o formato padrão de erro:

```json
{
  "statusCode": 401,
  "message": "User credentials do not match.",
  "error": "Unauthorized"
}
```

Isso garante consistência nas respostas de erro sem precisar formatar manualmente.