# Deep Explanation: Testes de Unidade para UseCase Update User Profile

## Por que GetById no repositorio mesmo ja tendo o LoggedUser?

O instrutor destaca um ponto arquitetural importante. O `LoggedUser` usa `AsNoTracking()` no Entity Framework por questoes de performance — essa entidade e consultada em muitos use cases apenas para identificar quem esta logado, entao nao precisa ser rastreada.

Ja o `GetById` do `UpdateOnlyRepository` **nao usa** `AsNoTracking()`, porque o UseCase vai alterar propriedades da entidade. O Entity Framework precisa rastrear essas mudancas para persistir no banco.

Resumo:
- `LoggedUser.Get()` → `AsNoTracking()` → somente leitura, performance
- `UpdateOnlyRepository.GetById()` → sem `AsNoTracking()` → rastreamento ativo, permite update

Isso explica por que o UseCase faz duas queries aparentemente redundantes — uma para identificar, outra para modificar.

## Como decidir o tipo de builder (estatico vs instancia)

A decisao depende das funcoes da interface:

1. **Todas void** → Builder estatico simples com `Build()`. Nada para configurar.
2. **Tem retorno mas sempre o mesmo valor** → Builder estatico que recebe o valor no `Build(entity)`.
3. **Tem retorno condicional** → Builder com instancia, metodos de configuracao, e `Build()` no final.

Exemplo do `UserReadOnlyRepositoryBuilder`: ele usa instancia porque o metodo `ExistActiveUserWithEmail` so deve retornar `true` em cenarios especificos. Entao voce configura o builder condicionalmente antes de chamar `.Build()`.

Exemplo do `UserUpdateOnlyRepositoryBuilder`: usa estatico porque o `GetById` sempre retorna a mesma entidade — se o UseCase chegou ate ali, a entidade existe.

## Objetos como referencia em C# e assertions

Em C#, objetos sao passados por referencia. Quando voce cria um `User` no teste e passa como parametro para o builder, o mock devolve exatamente aquele objeto. Quando o UseCase faz `user.Name = request.Name`, essa alteracao reflete no objeto original do teste.

Isso permite um pattern poderoso: apos executar o UseCase void, voce pode verificar se as propriedades do objeto foram alteradas corretamente, sem precisar de retorno.

## Tres cenarios de teste e como identifica-los

O instrutor analisa a funcao `Execute` linha a linha para derivar os cenarios:

1. **Sucesso** — dados validos, e-mail nao duplicado → nao lanca excecao, propriedades alteradas
2. **Erro de validacao** — nome vazio → `OnValidationException` com mensagem especifica
3. **E-mail duplicado** — e-mail ja existe no banco → `OnValidationException` com mensagem de e-mail

A tecnica: leia cada `if` e cada chamada de validacao no UseCase, e cada branch que lanca excecao e um cenario de teste.

## ShouldNotThrowAsync vs ShouldThrowAsync

Para UseCases que retornam `Task` (void):
- **Cenario de sucesso**: `act.Should().NotThrowAsync()` — valida que nenhuma excecao foi lancada
- **Cenario de erro**: `act.Should().ThrowAsync<SpecificException>()` — valida tipo e conteudo da excecao

O padrao de guardar a execucao em `Func<Task> act` e reutilizado em ambos os casos — o que muda e o assert.