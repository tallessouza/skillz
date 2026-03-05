# Deep Explanation: Inversao de Dependencias (DIP)

## Por que repositorios existem

A motivacao principal de usar o pattern Repository e ter a **possibilidade de migrar** de ferramenta, banco de dados, ou ate de estrutura de armazenamento. Hoje voce salva num banco de dados, amanha pode estar salvando numa API terceira.

Porem, sem DIP, essa migracao e ilusoria — voce teria que abrir cada use case e trocar manualmente cada referencia ao repositorio concreto.

## O problema concreto

Imagine que voce tem `PrismaUsersRepository` e cria um `InMemoryUsersRepository`. Sem inversao de dependencia:

1. Voce abre o use case
2. Troca `PrismaUsersRepository` por `InMemoryUsersRepository`
3. Repete isso em **todos** os use cases que usam aquele repositorio

O use case esta **conectado** com a ferramenta de banco de dados. O nome `PrismaUsersRepository` ja denuncia: a funcionalidade da aplicacao esta acoplada a ferramenta.

## O que e inversao de dependencia

O principio diz: **ao inves do use case instanciar as dependencias que precisa, ele recebe essas dependencias como parametro.**

A palavra "inversao" vem da mudanca de direcao:
- **Antes:** Use case → cria → Repositorio concreto
- **Depois:** Algo externo → passa → Repositorio → Use case usa

O use case deixa de ser responsavel por saber QUAL repositorio usar. Quem decide e quem chama o use case (controller, factory, etc).

## Por que classe e nao funcao

O instrutor explica que receber dependencia junto com os demais parametros de uma funcao "fica bagunçado":

```typescript
// Ruim: dependencia misturada com dados
async function register(name, email, password, usersRepository) { ... }
```

Com classe, o construtor separa **configuracao** (dependencias) de **execucao** (dados):

```typescript
// Bom: construtor configura, execute recebe dados
const useCase = new RegisterUseCase(usersRepository)
await useCase.execute({ name, email, password })
```

## Hack do TypeScript: private no construtor

Normalmente voce faria:

```typescript
class RegisterUseCase {
  private usersRepository: any

  constructor(usersRepository: any) {
    this.usersRepository = usersRepository
  }
}
```

O TypeScript permite um atalho — colocar `private` (ou `public`, `protected`) na frente do parametro do construtor transforma ele automaticamente em propriedade da classe:

```typescript
class RegisterUseCase {
  constructor(private usersRepository: any) {}
}
```

O ESLint pode reclamar de "useless constructor" porque o corpo esta vazio, mas e um falso negativo. Desabilite a regra `no-useless-constructor` nesses casos.

## Conexao com SOLID

O DIP e a letra D do SOLID (Dependency Inversion Principle). O instrutor comeca pelo D (de tras pra frente) porque ele se encaixa perfeitamente no problema pratico que estavam enfrentando com repositorios.

Os cinco principios SOLID foram criados pelo Uncle Bob (Robert C. Martin), o mesmo autor de Clean Code e Clean Architecture. Nasceram na teoria mas se traduziram cada vez mais para a pratica.

## O resultado final

Depois da refatoracao:
- O use case **nao tem nenhuma referencia ao Prisma**
- Trocar de repositorio = mudar **uma linha** no controller
- O use case se torna testavel (pode receber InMemoryRepository nos testes)
- A logica de negocio fica isolada da infraestrutura

## InMemoryRepository como exemplo

O instrutor cria um `InMemoryUsersRepository` que salva dados em um array (variavel) ao inves do banco. Isso demonstra que repositorios diferentes podem ter a mesma interface mas implementacoes completamente diferentes. Esse padrao se torna essencial para testes unitarios.