# Deep Explanation: Interface do Repositório

## Por que interfaces antes de implementacoes?

O instrutor enfatiza um ponto fundamental: **a interface e o contrato**. Ela define a comunicacao entre o use case e o repositorio. Voce sempre comeca por ela porque:

1. **Autocomplete funciona** — sem tipagem, o TypeScript nao sugere metodos. O instrutor mostra que com `any` no tipo do repositorio, CTRL+Space nao mostra nada. Com a interface, `create` e `findByEmail` aparecem automaticamente.

2. **Erros aparecem cedo** — se um repositorio concreto nao implementa um metodo do contrato, o TypeScript acusa erro imediatamente. O instrutor demonstra: sem `implements`, esquecer o `create` nao gera nenhum erro. Com `implements`, o compilador forca a implementacao.

3. **Desacoplamento real** — o use case nao tem "nenhuma mencao ao Prisma". Isso significa que trocar de ORM, de banco, ou criar versoes in-memory para teste nao exige mudar uma linha no use case.

## A analogia do contrato

O instrutor usa a palavra "contrato" repetidamente. A interface e literalmente um contrato que diz:
- "Quem quiser ser um repositorio de usuarios, PRECISA ter estes metodos"
- "Estes metodos recebem ESTES parametros"
- "Estes metodos devolvem ESTES tipos"

Qualquer classe que assine esse contrato (`implements UsersRepository`) esta obrigada a cumprir.

## Metodos especificos vs genericos

O instrutor faz uma escolha deliberada: em vez de expor `findUnique` (que e um metodo do Prisma), ele cria `findByEmail`. A razao:

- `findUnique` e generico demais — nao comunica intencao
- `findByEmail` e especifico — qualquer dev entende o que faz
- Na interface, voce define o que o dominio precisa, nao o que o banco oferece

## O fluxo de organizacao

O instrutor organiza assim:
```
repositories/
├── users-repository.ts          # Interface (contrato)
└── prisma/
    └── prisma-users-repository.ts  # Implementacao concreta
```

A interface fica na raiz de `repositories/` porque e o contrato publico. As implementacoes ficam em subpastas por provider porque sao detalhes de infraestrutura.

## Nullable returns e Promise

O instrutor mostra que `findByEmail` retorna `Promise<User | null>` porque:
- A operacao e assincrona (acessa banco) → `Promise`
- Pode nao encontrar o usuario → `| null`
- Isso forca quem consome a tratar o caso de "nao encontrado"

## Conexao com testes (preview)

O instrutor menciona que essa estrutura "vai facilitar algo que a gente vai comecar a trabalhar daqui a pouquinho: testes". A motivacao e que com a interface, voce pode criar um `InMemoryUsersRepository` que implementa o mesmo contrato mas usa um array em memoria, sem banco de dados real.

## O principio SOLID aplicado

Dependency Inversion (o D do SOLID):
- **Modulos de alto nivel** (use cases) nao dependem de **modulos de baixo nivel** (Prisma repository)
- Ambos dependem de **abstracoes** (a interface `UsersRepository`)
- A abstracao nao depende de detalhes — o detalhe (Prisma) depende da abstracao