# Deep Explanation: Testes de Unidade para Validators

## Por que um teste por regra?

O instrutor enfatiza que cada `RuleFor` no FluentValidation precisa de um teste dedicado que envia propositalmente dados invalidos para aquela regra especifica. O objetivo e garantir que o validator "esta fazendo o trabalho dele reclamando quando tem uma propriedade invalida".

A estrategia e: para cada regra, force exatamente aquela propriedade a ser invalida enquanto todas as outras estao corretas. Isso isola a regra sendo testada.

## O padrao AAA na pratica

- **Arrange**: Instancie o validator e crie uma request valida via Builder, depois force a propriedade que voce quer testar a ser invalida
- **Act**: Chame `validator.Validate(request)` — sempre a mesma linha
- **Assert**: Verifique `IsValid == false`, que a lista de erros contem exatamente um erro, e que a mensagem e a esperada

O instrutor removeu os comentarios `// Arrange`, `// Act`, `// Assert` do codigo porque considera que com bons nomes de variaveis e FluentAssertions, o codigo se auto-documenta.

## Theory vs Fact — quando usar cada um

O problema concreto: testar que senhas com menos de 6 caracteres sao rejeitadas. Opcoes:

1. **5 metodos `[Fact]` separados** — funciona mas duplica codigo
2. **Um `[Fact]` com `for` loop** — proibido em testes de unidade
3. **Um `[Theory]` com `[InlineData(1)]` ate `[InlineData(5)]`** — solucao correta

O `[Theory]` transforma a funcao em um template que o xUnit executa uma vez para cada `[InlineData]`. Cada execucao e tratada como um teste independente no Test Explorer.

### Ordem de execucao e aleatoria

O instrutor demonstrou que o xUnit nao garante ordem: com `[InlineData(1), (2), (3), (4), (5)]`, a execucao pode ser 3, 2, 4, 5, 1. Isso vale tanto para InlineData quanto para a ordem entre metodos de teste. Por isso testes devem ser completamente independentes.

## Por que instanciar o validator em cada teste?

O instrutor antecipou a duvida: "nao seria melhor colocar uma variavel da classe e instanciar uma vez so?" A resposta e nao, porque:

- Testes executam em ordem aleatoria
- Um teste poderia contaminar o estado do validator para outro
- Independencia total e a unica forma de garantir resultados confiaveis

## Validators compartilhados (SetValidator)

O `PasswordValidator` foi extraido para uma classe separada em `SharedValidators` porque a mesma regra de senha se aplica em `RegisterUserValidator` e `ChangePasswordValidator`. O `RegisterUserValidator` usa `.SetValidator(new PasswordValidator())` no `RuleFor` da senha.

Isso significa que ao testar o `RegisterUserValidator`, voce esta indiretamente testando o `PasswordValidator`. Nao e necessario testar o `PasswordValidator` isoladamente se ele ja esta coberto pelos testes dos validators que o consomem.

## Builder pattern para requests de teste

O `RequestRegisterUserBuilder.Build()` retorna uma request com todos os campos validos. Parametros opcionais (como `passwordLength`) permitem variar apenas o que o teste precisa, mantendo o default seguro (10 caracteres).

A melhoria de nomenclatura do parametro (`length` → `passwordLength`) foi destacada: dentro do builder voce sabe que e o tamanho da senha, mas quem chama `Build(passwordLength: 3)` precisa de clareza.

## Referencia da Microsoft

O instrutor mencionou a documentacao oficial da Microsoft sobre boas praticas de testes de unidade, que proibe: reaproveitar instancias entre testes, usar `if`/`for`/`switch` em testes, e depender de ordem de execucao.