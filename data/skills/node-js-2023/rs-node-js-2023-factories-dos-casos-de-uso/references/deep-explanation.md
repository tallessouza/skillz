# Deep Explanation: Factories dos Casos de Uso

## Por que factories existem

O conceito de Factory neste contexto resolve um problema pratico do SOLID: quando um caso de uso depende de repositorios concretos (como `PrismaUsersRepository`), alguem precisa instanciar essas dependencias. Se o controller faz isso, ele fica acoplado a implementacao concreta do repositorio, violando o principio de inversao de dependencia.

A factory e o **unico ponto do sistema que conhece as implementacoes concretas**. O use case depende de interfaces (abstratas), o controller chama a factory, e a factory conecta os dois mundos.

## O padrao completo da arquitetura

A estrutura segue esta hierarquia:

```
use-cases/
├── check-in-use-case.ts              # Use case (depende de interfaces)
├── get-user-profile-use-case.ts
├── factories/
│   ├── make-check-in-use-case.ts     # Factory (instancia concretos)
│   ├── make-get-user-profile-use-case.ts
│   └── ...
```

O instrutor destaca que **todos os use cases precisam de factories**, mesmo os simples com uma unica dependencia. A consistencia do padrao e mais importante que a economia de linhas.

## Relacao com testes

O instrutor faz uma distincao importante:
- **Testes unitarios**: injetam repositorios in-memory diretamente no use case, **sem usar factories**
- **Testes E2E**: usam os controllers que por sua vez usam as factories reais com Prisma

Isso significa que factories sao exclusivamente para o ambiente de producao/E2E. Nos testes unitarios, a injecao manual de dependencias e o caminho correto, porque voce quer controlar o comportamento do repositorio.

## Por que factory sem parametros

A factory nao recebe argumentos porque ela representa a **configuracao de producao**. Se voce precisa de flexibilidade (trocar repositorios), isso acontece:
1. Mudando o codigo da factory (troca de infra)
2. Nos testes, sem usar factory (injecao direta)

Nunca passando parametros para a factory — isso reintroduziria o acoplamento que ela existe para eliminar.

## Multiplas dependencias

O caso do `CheckInUseCase` e ilustrativo: ele precisa tanto do `CheckInsRepository` quanto do `GymsRepository`. A factory centraliza essa montagem:

```typescript
export function makeCheckInUseCase() {
  const checkInsRepository = new PrismaCheckInsRepository()
  const gymsRepository = new PrismaGymsRepository()
  const useCase = new CheckInUseCase(checkInsRepository, gymsRepository)
  return useCase
}
```

Se amanha o `CheckInUseCase` precisar de um terceiro repositorio, so a factory muda. Nenhum controller e afetado.

## Nomenclatura

O padrao de nomenclatura e estrito:
- **Funcao**: `make` + nome do use case em PascalCase → `makeCheckInUseCase`
- **Arquivo**: kebab-case com prefixo make → `make-check-in-use-case.ts`
- **Variavel interna**: `useCase` (generica, porque a factory so retorna uma coisa)
- **Repositorios internos**: nomeados pelo dominio → `checkInsRepository`, `gymsRepository`