# Code Examples: Testes de Unidade para Use Cases com Mocks

## Estrutura do Use Case sendo testado

```csharp
// O use case que sera testado
public class RegisterUserUseCase
{
    private readonly IUserWriteOnlyRepository _writeOnlyRepository;
    private readonly IUserReadOnlyRepository _readOnlyRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IPasswordEncrypter _passwordEncrypter;
    private readonly IAccessTokenGenerator _accessTokenGenerator;

    public RegisterUserUseCase(
        IUserWriteOnlyRepository writeOnlyRepository,
        IUserReadOnlyRepository readOnlyRepository,
        IUnitOfWork unitOfWork,
        IPasswordEncrypter passwordEncrypter,
        IAccessTokenGenerator accessTokenGenerator)
    {
        _writeOnlyRepository = writeOnlyRepository;
        _readOnlyRepository = readOnlyRepository;
        _unitOfWork = unitOfWork;
        _passwordEncrypter = passwordEncrypter;
        _accessTokenGenerator = accessTokenGenerator;
    }

    public async Task<ResponseRegisteredUserJson> Execute(RequestRegisterUserJson request)
    {
        Validate(request);

        // Verifica email duplicado
        var existingUser = await _readOnlyRepository.GetByEmail(request.Email);
        if (existingUser is not null)
            throw new BusinessException("Email ja esta registrado");

        // Mapeia request -> entidade
        var user = new User { /* mapping */ };

        // Criptografa senha
        user.Password = _passwordEncrypter.Encrypt(request.Password);

        // Persiste
        await _writeOnlyRepository.Add(user);
        await _unitOfWork.Commit();

        // Gera tokens e resposta
        var token = _accessTokenGenerator.Generate(user);
        return new ResponseRegisteredUserJson { /* response */ };
    }
}
```

## Interfaces envolvidas

```csharp
// NAO retorna valor — mock simples
public interface IUserWriteOnlyRepository
{
    Task Add(User user);
}

// NAO retorna valor — mock simples
public interface IUnitOfWork
{
    Task Commit();
}

// RETORNA valores — mock com Setup (proxima aula)
public interface IUserReadOnlyRepository
{
    Task<User?> GetByEmail(string email);
    Task<User?> GetById(long id);
    Task<bool> ExistsByEmail(string email);
}

// RETORNA valores — mock com Setup (proxima aula)
public interface IPasswordEncrypter
{
    string Encrypt(string password);
    bool IsValid(string password, string hash);
}
```

## Builder para mock simples (sem retorno)

```csharp
// CommonTestUtilities/Repositories/UserWriteOnlyRepositoryBuilder.cs
using Moq;
using Domain.Repositories;

public class UserWriteOnlyRepositoryBuilder
{
    public static IUserWriteOnlyRepository Build()
        => new Mock<IUserWriteOnlyRepository>().Object;
}
```

```csharp
// CommonTestUtilities/Repositories/UnitOfWorkBuilder.cs
using Moq;
using Domain.Repositories;

public class UnitOfWorkBuilder
{
    public static IUnitOfWork Build()
        => new Mock<IUnitOfWork>().Object;
}
```

## Passo a passo: criando o mock

```csharp
// Passo 1: Criar instancia do Mock<T>
var mock = new Mock<IUserWriteOnlyRepository>();

// Passo 2: Retornar .Object (a implementacao fake da interface)
return mock.Object;

// Versao compacta (uma linha):
return new Mock<IUserWriteOnlyRepository>().Object;
```

## Adicionando referencia ao projeto

O projeto CommonTestUtilities precisa referenciar Domain para conhecer as interfaces:

```
CommonTestUtilities → Add Project Reference → Domain
```

Isso permite usar as interfaces (`IUserWriteOnlyRepository`, `IUnitOfWork`, etc.) nos builders de mock.

## Cenarios de teste a implementar

```csharp
// Teste 1: Sucesso — dados validos, sem excecao
[Fact]
public async Task Success()
{
    var useCase = CreateUseCase();
    var request = RegisterUserRequestBuilder.Build();

    var act = async () => await useCase.Execute(request);

    await act.Should().NotThrowAsync();
}

// Teste 2: Email duplicado — espera excecao
[Fact]
public async Task Error_Email_Already_Registered()
{
    // Mock do ReadOnlyRepository configurado para retornar um user existente
    var act = async () => await useCase.Execute(request);

    await act.Should().ThrowAsync<BusinessException>()
        .WithMessage("Email ja esta registrado");
}

// Teste 3: Validacao falha — propriedade invalida
[Fact]
public async Task Error_Invalid_Request()
{
    var request = RegisterUserRequestBuilder.Build();
    request.Email = ""; // invalido

    var act = async () => await useCase.Execute(request);

    await act.Should().ThrowAsync<ValidationException>();
}
```

## Por que BcryptNet nao pode ser instanciado diretamente

```csharp
// Infrastructure/Security/BcryptNet.cs
internal class BcryptNet : IPasswordEncrypter  // internal!
{
    public string Encrypt(string password) => BCrypt.Net.BCrypt.HashPassword(password);
    public bool IsValid(string password, string hash) => BCrypt.Net.BCrypt.Verify(password, hash);
}

// No teste (CommonTestUtilities), isso NAO compila:
// var encrypter = new BcryptNet(); // ERRO: BcryptNet e internal

// Solucao: mock da interface publica
public class PasswordEncrypterBuilder
{
    public static IPasswordEncrypter Build()
    {
        // Mock com Setup sera mostrado na proxima aula
        // porque Encrypt() retorna string
        var mock = new Mock<IPasswordEncrypter>();
        mock.Setup(x => x.Encrypt(It.IsAny<string>())).Returns("hashed");
        return mock.Object;
    }
}
```