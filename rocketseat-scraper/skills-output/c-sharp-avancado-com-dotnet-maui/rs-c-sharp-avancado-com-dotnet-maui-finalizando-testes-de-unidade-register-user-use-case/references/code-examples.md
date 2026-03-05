# Code Examples: Testes de Unidade para Cenarios de Erro

## Exemplo 1: Teste de sucesso complementado

```csharp
[Fact]
public async Task Success()
{
    var request = RequestRegisterUserJsonBuilder.Build();
    var useCase = CreateUseCase();

    var result = await useCase.Execute(request);

    result.Should().NotBeNull();
    result.Name.Should().Be(request.Name);
    result.Id.Should().NotBe(Guid.Empty);
    result.Tokens.Should().NotBeNull();
    result.Tokens.AccessToken.Should().NotBeNullOrEmpty();
    result.Tokens.RefreshToken.Should().NotBeNullOrEmpty();
}
```

## Exemplo 2: Teste de erro — email ja registrado

```csharp
[Fact]
public async Task Error_Email_Ja_Registrado()
{
    var request = RequestRegisterUserJsonBuilder.Build();

    // Passa o email para o builder configurar o mock
    var useCase = CreateUseCase(email: request.Email);

    // Armazena a funcao (NAO executa ainda)
    var act = async () => await useCase.Execute(request);

    // Framework executa e captura a excecao
    var exception = await act.Should().ThrowAsync<ErrorOnValidationException>();

    // Valida conteudo da excecao
    exception.And.Should().SatisfyAllConditions(
        ex => ex.GetStatusCode().Should().Be(HttpStatusCode.BadRequest),
        ex => ex.GetErrorMessages().Should().SatisfyAllConditions(
            errors => errors.Count.Should().Be(1),
            errors => errors.Should().Contain("E-mail ja registrado")
        )
    );
}
```

## Exemplo 3: Teste de erro — nome vazio

```csharp
[Fact]
public async Task Error_Nome_Vazio()
{
    var request = RequestRegisterUserJsonBuilder.Build();
    request.Name = string.Empty; // Forca nome vazio

    // Sem parametro de email — nao testa duplicidade
    var useCase = CreateUseCase();

    var act = async () => await useCase.Execute(request);

    var exception = await act.Should().ThrowAsync<ErrorOnValidationException>();

    exception.And.Should().SatisfyAllConditions(
        ex => ex.GetStatusCode().Should().Be(HttpStatusCode.BadRequest),
        ex => ex.GetErrorMessages().Should().SatisfyAllConditions(
            errors => errors.Count.Should().Be(1),
            errors => errors.Should().Contain("Nome nao pode ser vazio")
        )
    );
}
```

## Exemplo 4: Builder do repositorio com parametro opcional

```csharp
public class ReadOnlyRepositoryBuilder
{
    private readonly Mock<IReadOnlyRepository> _mock;

    public ReadOnlyRepositoryBuilder(string email = "")
    {
        _mock = new Mock<IReadOnlyRepository>();

        if (!string.IsNullOrEmpty(email))
        {
            _mock.Setup(r => r.ExistsActiveUserWithEmail(email))
                 .ReturnsAsync(true);
        }
    }

    public IReadOnlyRepository Build() => _mock.Object;
}
```

## Exemplo 5: Metodo CreateUseCase com parametro opcional

```csharp
private RegisterUserUseCase CreateUseCase(string email = "")
{
    var readOnlyRepo = new ReadOnlyRepositoryBuilder(email).Build();
    var writeRepo = new WriteRepositoryBuilder().Build();
    var mapper = new AutoMapperBuilder().Build();
    var passwordEncrypter = new PasswordEncrypterBuilder().Build();
    var tokenGenerator = new TokenGeneratorBuilder().Build();

    return new RegisterUserUseCase(
        readOnlyRepo, writeRepo, mapper, passwordEncrypter, tokenGenerator
    );
}
```

## Exemplo 6: Codigo do Use Case sendo testado (referencia)

```csharp
public async Task<ResponseRegisterUserJson> Execute(RequestRegisterUserJson request)
{
    Validate(request);

    var entity = _mapper.Map<User>(request);
    entity.Password = _passwordEncrypter.Encrypt(request.Password);

    await _writeRepository.Add(entity);

    var tokens = _tokenGenerator.Generate(entity);

    return new ResponseRegisterUserJson
    {
        Id = entity.Id,
        Name = entity.Name,
        Tokens = tokens
    };
}

private void Validate(RequestRegisterUserJson request)
{
    var result = new RegisterUserValidator().Validate(request);

    var emailExists = _readOnlyRepository
        .ExistsActiveUserWithEmail(request.Email).Result;

    if (emailExists)
        result.Errors.Add(new ValidationFailure("Email", "E-mail ja registrado"));

    if (!result.IsValid)
        throw new ErrorOnValidationException(result.Errors);
}
```

## Sintaxe alternativa: funcao armazenada em variavel

```csharp
// Opcao 1: lambda async
var act = async () => await useCase.Execute(request);

// Opcao 2: referencia de metodo (se assinatura compativel)
var act = createUseCase;

// Para executar manualmente (NAO faca isso em testes de excecao):
act(); // executa a funcao

// Deixe o FluentAssertions executar:
await act.Should().ThrowAsync<ErrorOnValidationException>();
```