# Code Examples: Customizando Mapeamento com Mapster

## Exemplo completo: MapConfigurations

```csharp
// Mappings/MapConfigurations.cs
using Mapster;

namespace Application.Mappings;

public static class MapConfigurations
{
    public static void Configure()
    {
        // Request -> User: ignorar password (sera criptografado pelo use case)
        TypeAdapterConfig<RequestRegisterUserJson, User>
            .NewConfig()
            .Ignore(dest => dest.Password);

        // Request -> WorkItem: normalizar data + remover duplicatas de assignees
        TypeAdapterConfig<RequestWorkItemJson, WorkItem>
            .NewConfig()
            .Map(dest => dest.DueDate, src => src.DueDate.Date)
            .Map(dest => dest.Assignees, src => src.Assignees.Distinct());

        // GUID -> Assignee: converter ID em entidade
        TypeAdapterConfig<Guid, Assignee>
            .NewConfig()
            .Map(dest => dest.UserId, src => src);

        // Request Update -> WorkItem: mesma normalizacao de data
        TypeAdapterConfig<RequestUpdateWorkItemJson, WorkItem>
            .NewConfig()
            .Map(dest => dest.DueDate, src => src.DueDate.Date);
    }
}
```

## Registro no Dependency Injection

```csharp
// DependencyInjectionExtension.cs
public static class DependencyInjectionExtension
{
    public static void AddMapperConfigurations(this IServiceCollection services)
    {
        MapConfigurations.Configure();
    }
}
```

## Uso no Use Case com .Adapt()

```csharp
// Antes (com IMapper injetado)
public class RegisterUserUseCase
{
    private readonly IMapper _mapper;

    public RegisterUserUseCase(IMapper mapper)
    {
        _mapper = mapper;
    }

    public void Execute(RequestRegisterUserJson request)
    {
        var user = _mapper.Map<User>(request);
        // user.Password esta vazio (ignorado pelo mapeamento)
        user.Password = _encryptor.Encrypt(request.Password);
    }
}

// Depois (com .Adapt() - preferido pelo instrutor)
public class RegisterUserUseCase
{
    public void Execute(RequestRegisterUserJson request)
    {
        var user = request.Adapt<User>();
        // user.Password esta vazio (ignorado pelo mapeamento)
        user.Password = _encryptor.Encrypt(request.Password);
    }
}
```

## Comparacao: AutoMapper vs Mapster lado a lado

### Ignore

```csharp
// AutoMapper
CreateMap<RequestRegisterUserJson, User>()
    .ForMember(dest => dest.Password, opt => opt.Ignore());

// Mapster
TypeAdapterConfig<RequestRegisterUserJson, User>
    .NewConfig()
    .Ignore(dest => dest.Password);
```

### Map com transformacao

```csharp
// AutoMapper
CreateMap<RequestWorkItemJson, WorkItem>()
    .ForMember(dest => dest.DueDate, opt => opt.MapFrom(src => src.DueDate.Date));

// Mapster
TypeAdapterConfig<RequestWorkItemJson, WorkItem>
    .NewConfig()
    .Map(dest => dest.DueDate, src => src.DueDate.Date);
```

### DateTime.Date — o que faz

```csharp
var original = new DateTime(2026, 3, 15, 14, 30, 0);
// original = 2026-03-15 14:30:00

var dateOnly = original.Date;
// dateOnly = 2026-03-15 00:00:00 (meia-noite)
```

## Verificacao: testando que Password foi ignorado

O instrutor demonstra com breakpoint:
1. Envia request com senha "123456789"
2. Apos `request.Adapt<User>()`, inspeciona o objeto `user`
3. `user.Password` esta vazio (string vazia) — confirmando que o Ignore funcionou
4. O use case entao preenche `user.Password` com a versao criptografada