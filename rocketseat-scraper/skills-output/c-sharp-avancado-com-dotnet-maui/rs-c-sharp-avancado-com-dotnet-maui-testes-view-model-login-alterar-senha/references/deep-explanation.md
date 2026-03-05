# Deep Explanation: Testes de Unidade para ViewModels de Login e Alterar Senha

## Filosofia do instrutor

O instrutor enfatiza fortemente que o aluno deve **tentar implementar sozinho antes de ver a solução**. A razão: nessas duas ViewModels não há nenhuma novidade técnica — tudo já foi ensinado em aulas anteriores. O valor está na **fixação por repetição**, não em aprender algo novo.

Isso revela um princípio pedagógico importante: **testes de unidade são sobre padrões repetitivos aplicados consistentemente**, não sobre criatividade.

## Raciocínio para identificar cenários

O instrutor usa uma heurística simples e poderosa:

1. Olhe para os **commands** da ViewModel
2. Para cada command, conte os **branches** (if/else, switch cases)
3. Cada branch = 1 cenário de teste

Para `DoLoginViewModel`: 1 command, 2 branches (sucesso → dashboard, erro → error page) = 2 testes.
Para `ChangeUserPasswordViewModel`: 1 command, 2 branches (sucesso → close + feedback, erro → error page) = 2 testes.

## Por que StatusPage sempre volta ao default

O command handler segue o padrão:
```
StatusPage = Loading → Execute UseCase → Handle Result → StatusPage = Default
```

Independente de sucesso ou erro, o StatusPage **deve** resetar. Isso garante que a UI não fica travada em estado de loading se algo falhar.

## Diferença entre verificação de string e coleção

O instrutor destaca um ponto sutil do Moq:

- **String**: comparação por **valor** automaticamente. `Verify(f => f.Show("texto"))` funciona direto.
- **Dictionary/List**: comparação por **referência**. Precisa de `It.Is<T>(x => ...)` com lambda para comparar conteúdo.

Essa é a razão do "It.Is maluco" que ele menciona — não é complexidade desnecessária, é necessidade do framework de mocking.

## Padrão Builder para UseCases

Cada UseCase testável ganha um Builder estático que:
1. Cria o `Mock<IUseCase>`
2. Configura o `Setup` para retornar o `Result` passado como parâmetro
3. Retorna `mock.Object`

Isso isola a configuração do mock e torna os testes declarativos: "crie uma ViewModel onde o use case retorna sucesso/falha".

## Função Verify reutilizável

Na aula anterior, o instrutor refatorou a verificação de navegação para página de erro numa função utilitária (`Verify.NavigatedToErrorPage`). Isso encapsula:
- Verificar que a rota é `ErrorPage`
- Verificar que o dicionário contém a lista de erros esperada
- Verificar que foi chamado `Times.Once`

Essa refatoração é reaproveitada aqui sem modificação — validando o princípio de que bons utilitários de teste pagam dividendos rapidamente.

## Total de testes no projeto

Ao final, o projeto tem **64 testes de unidade** cobrindo: use cases, view models, validators e web API. Todos passando (verdinhos).