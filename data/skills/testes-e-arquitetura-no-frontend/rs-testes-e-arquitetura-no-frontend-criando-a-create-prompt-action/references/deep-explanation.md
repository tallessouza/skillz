# Deep Explanation: Server Action com Validacao, Use Case e TDD

## Por que safeParse e nao parse?

O instrutor escolhe `safeParse` deliberadamente porque ele retorna um objeto tipado com `success: boolean` em vez de lancar excecao. Isso permite um fluxo de controle limpo: `if (!validated.success)` retorna o erro de validacao diretamente, sem try/catch para erros de input. O try/catch fica reservado para erros de negocio e infraestrutura.

## A depreciacao do flatten()

O instrutor mostra na aula que `validated.error.flatten()` esta marcado como depreciado no momento da gravacao. A alternativa e usar o Zod error diretamente ou `fromZodError()`. Isso e um exemplo pratico de por que nao devemos confiar em APIs depreciadas — elas podem sumir em versoes futuras.

Ao inspecionar o `fieldErrors` com `console.log`, o instrutor mostra que vem um objeto como:
```json
{ "title": ["String must contain at least 1 character(s)"] }
```

## Desacoplamento: o insight principal

O ponto mais importante da aula e quando o instrutor mostra que os testes passam MESMO SEM o repository estar completamente implementado. O `PrismaPromptRepository` estava dando erro de tipagem porque faltavam os metodos `findByTitle` e `create`, mas os testes da action funcionam perfeitamente porque mockam o use case.

Isso demonstra o poder do desacoplamento:
- A action depende do use case (mockado no teste)
- O use case depende do repository (interface, nao implementacao)
- O teste da action nao precisa de banco, nem de repository real

## Categorizacao de erros em 3 niveis

O instrutor estrutura o error handling em camadas distintas:

1. **Validacao** — antes do try, retorna `errors` com detalhes dos campos
2. **Negocio** — dentro do catch, verifica `error.message` especifica ("Prompt already exists")
3. **Generico** — else do catch, mensagem amigavel sem expor detalhes internos

Cada nivel tem informacao diferente para o frontend. Validacao tem field errors para mostrar inline. Negocio tem mensagem especifica. Generico tem mensagem segura.

## Por que testar o falso positivo?

O instrutor insiste em inverter os valores esperados para confirmar que o teste nao e um falso positivo. Muda `false` para `true`, muda a mensagem — e ve que quebra. So entao confia no teste. Isso e uma pratica essencial de TDD que muitos pulam.

## Use Case como barreira de regras

O `CreatePromptUseCase` encapsula UMA regra: nao permitir prompts com titulo duplicado. Ele:
1. Busca por titulo (`findByTitle`)
2. Se existe, lanca erro
3. Se nao existe, cria

Essa separacao permite que a regra seja testada isoladamente do HTTP, do Zod, e do framework.

## Interface do Repository crescendo incrementalmente

A aula mostra o padrao de adicionar metodos a interface `PromptRepository` conforme a necessidade:
- `findByTitle(title: string): Promise<Prompt | null>`
- `create(data: CreatePromptDTO): Promise<void>`

A implementacao concreta (Prisma) pode ficar incompleta temporariamente — os testes nao quebram porque usam mocks.