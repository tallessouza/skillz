# Code Examples: Mocks para Funções que Devolvem Valores

## Interface sendo mockada

```csharp
public interface IUserReadOnlyRepository
{
    Task<bool> ExistActiveUserWithEmail(string email);
}
```

## Onde o mock e usado — Use Case

```csharp
public class RegisterUserUseCase
{
    private readonly IUserReadOnlyRepository _userReadOnlyRepository;
    // ... other dependencies

    private async Task Validate(RequestRegisterUserJson request)
    {
        // Chama o repositorio para verificar email duplicado
        var emailAlreadyExists = await _userReadOnlyRepository
            .ExistActiveUserWithEmail(request.Email);

        if (emailAlreadyExists)
        {
            // Adiciona falha na validacao — lanca exceção
        }
    }
}
```

## Builder completo — UserReadOnlyRepositoryBuilder

```csharp
public class UserReadOnlyRepositoryBuilder
{
    private readonly Mock<IUserReadOnlyRepository> _mockRepository;

    public UserReadOnlyRepositoryBuilder()
    {
        _mockRepository = new Mock<IUserReadOnlyRepository>();
    }

    public void ExistActiveUserWithEmail(string email)
    {
        _mockRepository.Setup(repository =>
            repository.ExistActiveUserWithEmail(email))
            .ReturnsAsync(true);
    }

    public IUserReadOnlyRepository Build() => _mockRepository.Object;
}
```

## Comparacao: Builder estatico vs com instancia

### Builder estatico (funcoes void — aula anterior)

```csharp
public class UserWriteOnlyRepositoryBuilder
{
    public static IUserWriteOnlyRepository Build()
    {
        var mock = new Mock<IUserWriteOnlyRepository>();
        return mock.Object;
    }
}

// Uso: sem instanciar
var repo = UserWriteOnlyRepositoryBuilder.Build();
```

### Builder com instancia (funcoes com retorno — esta aula)

```csharp
public class UserReadOnlyRepositoryBuilder
{
    private readonly Mock<IUserReadOnlyRepository> _mockRepository;

    public UserReadOnlyRepositoryBuilder()
    {
        _mockRepository = new Mock<IUserReadOnlyRepository>();
    }

    public void ExistActiveUserWithEmail(string email)
    {
        _mockRepository.Setup(r => r.ExistActiveUserWithEmail(email))
            .ReturnsAsync(true);
    }

    public IUserReadOnlyRepository Build() => _mockRepository.Object;
}

// Uso: precisa instanciar
var builder = new UserReadOnlyRepositoryBuilder();
builder.ExistActiveUserWithEmail("test@email.com"); // opcional
var repo = builder.Build();
```

## Classe de teste completa

```csharp
public class RegisterUserUseCaseTest
{
    private RegisterUserUseCase CreateUseCase(string? emailAlreadyExists = null)
    {
        var userReadOnlyRepository = new UserReadOnlyRepositoryBuilder();

        if (!string.IsNullOrEmpty(emailAlreadyExists))
        {
            userReadOnlyRepository.ExistActiveUserWithEmail(emailAlreadyExists);
        }

        return new RegisterUserUseCase(
            null, // unitOfWork
            null, // writeOnlyRepository
            userReadOnlyRepository.Build(),
            null, // dependency 4
            null  // dependency 5
        );
    }

    [Fact]
    public async Task Success()
    {
        // Arrange — nao configura mock, default bool = false
        // Simula: nenhum usuario com esse email existe
        var useCase = CreateUseCase();

        // Act & Assert...
    }

    [Fact]
    public async Task Error_Email_Already_Exists()
    {
        // Arrange — configura mock para retornar true para este email
        var useCase = CreateUseCase(emailAlreadyExists: "existing@email.com");

        // Act & Assert — espera exceção de email duplicado
    }
}
```

## Valores default por tipo (referencia rapida)

```csharp
// O mock retorna estes valores quando NAO configurado:
bool   → false
int    → 0
long   → 0L
double → 0.0
string → null  // (referencia)
object → null  // (qualquer tipo referencia)
List<T> → null // (cuidado: nao e lista vazia!)
Task<bool> → Task.FromResult(false)
Task<User> → Task.FromResult<User>(null)
```