# Deep Explanation: Implementando Repositorios do Prisma

## Por que separar em DatabaseModule?

O instrutor explica que ate entao o `PrismaService` estava declarado diretamente no `HttpModule`. Ao criar um `DatabaseModule` dedicado, ganha-se:

1. **Centralizacao** — toda configuracao de banco fica em um lugar
2. **Substituibilidade** — se no futuro trocar Prisma por outro ORM, so muda o `DatabaseModule`
3. **Reutilizacao** — qualquer modulo que precise de banco apenas importa `DatabaseModule`

## A armadilha do providers vs exports

Ponto crucial da aula: quando voce declara algo em `providers`, ele fica disponivel **apenas dentro daquele modulo**. Para que outros modulos que importam o `DatabaseModule` tambem tenham acesso, e necessario declarar em `exports` tambem.

O instrutor demonstra isso ao vivo: importou `DatabaseModule` no `HttpModule`, mas sem `exports` no `DatabaseModule`, a aplicacao quebrou. So funcionou apos adicionar `exports: [PrismaService]`.

## Direcao de dependencia (Clean Architecture)

O instrutor mostra o diagrama de camadas e enfatiza:

- **Camadas externas podem importar de camadas internas** — o repositorio Prisma (infra) importa o contrato (dominio)
- **Camadas internas NUNCA importam de externas** — um use case nunca deve importar do Prisma
- As flechas sempre apontam para dentro

Isso e o que permite ter implementacoes in-memory para testes e implementacoes Prisma para producao, ambas cumprindo o mesmo contrato.

## Injectable e inversao de dependencia no NestJS

O decorator `@Injectable()` e obrigatorio em toda classe que sera injetada via construtor. Os use cases dependem dos repositorios (recebem no construtor), entao os repositorios Prisma precisam do `@Injectable()`.

Sem ele, o NestJS nao consegue resolver a dependencia e lanca erro em runtime.

## Implementacao incremental com throw

O instrutor usa `throw new Error('Method not implemented.')` como placeholder. Isso permite:
- Ter a estrutura completa antes de implementar cada metodo
- A aplicacao compilar sem erros de tipo
- Identificar rapidamente quais metodos ainda precisam ser implementados (erro em runtime)

## Contratos como interfaces

Os repositorios no dominio sao "contratos" — interfaces TypeScript que definem exatamente quais metodos existem, seus parametros e retornos. A unica implementacao que existia ate entao era a in-memory (para testes unitarios). Agora com Prisma, temos a implementacao real.