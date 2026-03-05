# Deep Explanation: Factory Pattern para Use Cases

## Por que usar Factory Pattern aqui?

O instrutor introduz o Factory Pattern de forma preventiva — antes de ter muitos use cases — para evitar refatoracao futura. A motivacao principal:

Numa aplicacao real, existem **varias portas de entrada** para a mesma funcionalidade: rotas HTTP, integracoes com outros sistemas, workers, etc. Cada porta de entrada que precisa de um use case tambem precisa instanciar todas as dependencias daquele use case.

O problema escala: hoje o `RegisterUseCase` recebe 1 repositorio. Mais pra frente, use cases vao receber 2, 3, 4, 5 dependencias. Sem factory, cada controller que usa o use case precisa conhecer e instanciar todas essas dependencias. Quando uma dependencia muda, voce precisa ir em **cada arquivo** que instancia aquele use case.

## A analogia da "fabrica"

O instrutor usa a metafora literal: e uma **fabrica de criacao de coisas comuns que tem muitas dependencias**. A factory nao decide nada, nao calcula nada — ela so monta a peca final (o use case) com todas as partes necessarias (repositorios, services, etc).

## Factory vs outros patterns

O instrutor menciona que existem outros patterns para resolver o mesmo problema, como o **Facade**. Mas escolhe Factory por simplicidade — e literalmente uma funcao que retorna o use case instanciado.

## Relacao com SOLID

O Factory Pattern complementa o Dependency Inversion Principle (DIP) aplicado nos use cases. Os use cases recebem interfaces (abstracoes) no construtor. A factory e o lugar onde voce decide **qual implementacao concreta** passar. Isso significa que:

- No ambiente de producao, a factory passa `PrismaUsersRepository`
- Em testes, voce instancia o use case diretamente com `InMemoryUsersRepository`
- A factory nao e usada em testes — ela e especifica para o ambiente de producao

## Quando a factory realmente brilha

O beneficio real aparece quando:
1. Um use case ganha uma nova dependencia (ex: um email service)
2. Voce muda a implementacao de um repositorio (ex: de Prisma para TypeORM)
3. Voce precisa adicionar caching ou logging como decorator

Em todos esses casos, a mudanca acontece em **um unico arquivo** (a factory), nao em dezenas de controllers.

## Convencao de nomenclatura

O instrutor tem preferencia forte por `make` como prefixo: `makeRegisterUseCase`, `makeAuthenticateUseCase`. Isso diferencia factories de outros tipos de funcoes e cria um padrao reconhecivel no codebase.