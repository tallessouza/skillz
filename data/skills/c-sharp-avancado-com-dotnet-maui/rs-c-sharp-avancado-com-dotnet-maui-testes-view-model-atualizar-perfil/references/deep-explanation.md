# Deep Explanation: Testes de ViewModel de Perfil

## Por que dividir testes por comando

A ViewModel `UserProfileViewModel` tem 4 comandos: Initialize, UpdateProfile, ChangePassword e ChangeProfilePhoto. Cada comando tem cenarios independentes. Testar todos juntos cria testes frageis que quebram por razoes nao relacionadas.

## Heranca de Result — o insight chave

O instrutor destaca um ponto sutil de C#: `Result<User>` herda de `Result`. Isso significa:

- Voce PODE passar `Result<User>` onde `Result` e esperado (filho → mae)
- Voce NAO PODE passar `Result` onde `Result<User>` e esperado (mae → filho)

Isso permite criar um unico `Result<User>` e reutiliza-lo em builders que esperam tanto `Result<User>` (GetUserProfileUseCase) quanto `Result` (UpdateUserUseCase). Economia de codigo sem perda de corretude.

## Estrategia de null para dependencias

Ao testar ChangePassword, os parametros `ChangeUserPhotoUseCase` e `MediaPicker` sao passados como `null`. Isso e intencional:

1. Documenta que o teste nao depende desses servicos
2. Se o comando acidentalmente usar uma dependencia errada, o teste falha com NullReferenceException — o que e bom, revela acoplamento indesejado
3. Mantem o setup minimo e legivel

## Quando armazenar vs inline

O instrutor mostra dois padroes:

**Inline** (quando nao precisa comparar):
```csharp
CreateViewModel(Result<User>.Success(UserBuilder.Build()));
```

**Variavel** (quando precisa comparar propriedades):
```csharp
var user = UserBuilder.Build();
CreateViewModel(Result<User>.Success(user));
// ... depois ...
viewModel.Model.Name.Should().Be(user.Name);
```

A regra: se o dado gerado aparece em algum assert, armazene em variavel.

## Organizacao fisica dos builders

O instrutor organiza builders espelhando a estrutura do app:

```
CommonTestUtilities/
├── Models/
│   └── UserBuilder.cs
├── UseCases/
│   ├── Profile/
│   │   └── GetUserProfileUseCaseBuilder.cs
│   └── Update/
│       └── UpdateUserUseCaseBuilder.cs
```

Isso facilita encontrar o builder correspondente a cada classe de producao.

## Bogus para dados de teste

A biblioteca Bogus gera dados realistas e randomicos. Vantagens sobre dados fixos:

- Revela bugs que dependem de formato especifico (ex: nome com acento)
- Cada execucao testa com dados diferentes
- Nao cria falsa seguranca de "funciona com John Doe"

Instalacao: `NuGet\Install-Package Bogus -Version 35.6.4`

## Padrao dos 3 asserts

Todo teste de comando na ViewModel segue:
1. `act.Should().NotThrowAsync()` — o comando nao explode
2. `viewModel.StatusPage.Should().Be(...)` — estado correto apos execucao
3. Verificacao de efeito (navegacao, feedback, ou propriedade preenchida)

Isso garante cobertura completa do comportamento do comando.