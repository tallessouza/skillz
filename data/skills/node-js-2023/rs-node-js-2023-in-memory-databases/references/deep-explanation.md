# Deep Explanation: In-Memory Test Database Pattern

## Origem e Referencia

O pattern vem de um artigo do Martin Fowler de 2005 chamado "InMemoryTestDatabase". A ideia central e ter uma representacao do banco de dados em memoria — dados salvos em variaveis JavaScript puras — para que testes unitarios sejam rapidos e focados na logica de negocio.

## Por que nao testar com banco real em testes unitarios?

O instrutor enfatiza uma separacao clara de responsabilidades:
- **Teste unitario** → testa a logica do use case (regras de negocio)
- **Teste de integracao/e2e** → testa se o banco de dados funciona, se a aplicacao funciona no mundo real

Testes unitarios com banco real sao lentos e frageis. O In-Memory repository elimina essa dependencia, tornando os testes rapidos e deterministicos.

## A analogia com o Prisma Repository

O instrutor faz questao de mostrar que o In-Memory Repository e "quase uma representacao genuina do banco de dados". A diferenca e que:
- `PrismaUsersRepository` → bate no banco real via Prisma client
- `InMemoryUsersRepository` → usa array JavaScript e metodos como `find()`, `push()`

Ambos implementam a mesma interface `UsersRepository`. O use case nao sabe (e nao precisa saber) qual esta usando. Isso e o poder da inversao de dependencias (Dependency Inversion Principle do SOLID).

## Por que `items` e publico?

O array `items` e declarado como `public` propositalmente. Nos testes, voce pode inspecionar diretamente o estado do "banco":
```typescript
expect(usersRepository.items).toHaveLength(1)
```

Isso nao seria possivel com um banco real, mas em testes unitarios e uma ferramenta poderosa para verificar side effects.

## O tratamento de undefined vs null

O metodo `Array.find()` do JavaScript retorna `undefined` quando nao encontra. Porem, a interface do repositorio espera `null`. O instrutor destaca essa "inconsistencia" e mostra que o In-Memory precisa tratar isso:

```typescript
const user = this.items.find(item => item.email === email)
if (!user) return null
return user
```

## Testando rejeicao de Promises

Um insight importante da aula: quando um use case e async (retorna Promise), o teste pode verificar se a Promise rejeitou ou resolveu:

```typescript
await expect(() => sut.execute(data)).rejects.toBeInstanceOf(SomeError)
```

O instrutor explica que uma Promise so tem duas alternativas: **resolver** (sucesso) ou **rejeitar** (erro). O Vitest/Jest permite testar ambos os cenarios com `.resolves` e `.rejects`.

## Organizacao de arquivos

A pasta recomendada e `repositories/in-memory/`, separada dos repositorios reais. Cada entidade tem seu proprio In-Memory repository:
- `in-memory-users-repository.ts`
- `in-memory-gyms-repository.ts`
- etc.

## Tipos de teste mencionados

O instrutor diferencia claramente:
- **Testes unitarios** → usam In-Memory, rapidos, testam logica isolada
- **Testes e2e / integracao** → batem no banco real, mais lentos, garantem funcionamento no mundo real

Ambos sao necessarios, mas In-Memory e a base para testes unitarios eficientes.