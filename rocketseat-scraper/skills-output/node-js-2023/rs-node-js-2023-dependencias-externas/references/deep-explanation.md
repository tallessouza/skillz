# Deep Explanation: Dependencias Externas no DDD

## Por que interfaces antes de implementacoes?

O instrutor enfatiza um ponto crucial: **conforme voce cria use cases, voce vai naturalmente identificando pontos de conexao externa**. A camada de dominio precisa se conectar com camadas externas (persistencia, APIs, etc), mas essa conexao deve ser feita atraves de contratos, nao implementacoes.

A ideia central e: "eu nao sei o que e, por enquanto" — nas palavras do instrutor ao se referir ao repositorio. O use case sabe que precisa salvar uma answer, mas nao sabe (e nao deve saber) se isso vai para PostgreSQL, MongoDB, um arquivo, ou uma API.

## Repository Pattern vs. Mapping Direto

O instrutor faz questao de desmistificar: **repositorio nao e necessariamente um mapping direto de uma tabela no banco**. Ele menciona "repository pattern, data mapper pattern, sei la, voce pode chamar do que for" — o nome importa menos que o conceito.

O conceito e: uma interface que define como o dominio persiste e recupera dados, sem se importar com o mecanismo subjacente.

## Abordagem emergente vs. planejamento antecipado

Uma perspectiva importante do instrutor: "nem DDD, nem Clean Architecture, dificilmente vao te dizer exatamente como voce tem que implementar". Isso libera o desenvolvedor para descobrir as dependencias conforme desenvolve, em vez de tentar mapear tudo antecipadamente.

O fluxo natural e:
1. Cria o use case
2. Percebe que precisa salvar dados
3. Cria a interface do repositorio
4. No teste, cria um fake
5. Depois (muito depois), implementa o repositorio real

## Fake repositories nos testes

O instrutor mostra a forma mais simples possivel de fake: um objeto literal que implementa a interface com metodos que nao fazem nada. Isso e suficiente para o teste inicial porque o objetivo e testar a logica do use case, nao a persistencia.

```typescript
const fakeAnswersRepository: AnswersRepository = {
  create: async () => {},
}
```

Ele tipa o objeto com `AnswersRepository` "para ser mais facil" — o TypeScript garante que o fake respeita o contrato.

## Configuracao de testes com Vitest

O instrutor tambem configura scripts uteis:
- `test`: `vitest run` — executa uma vez
- `test:watch`: `vitest` — modo watch, re-executa ao salvar

Tecla `A` no modo watch executa todos os testes.