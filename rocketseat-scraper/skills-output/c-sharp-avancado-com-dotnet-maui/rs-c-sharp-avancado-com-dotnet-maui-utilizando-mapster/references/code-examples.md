# Code Examples: Mapeamento de Objetos com Mapster

## Instalacao

```bash
# Pacote principal
NuGet\Install-Package Mapster -Version 7.4.0

# Pacote para DI (opcional, apenas se usar IMapper)
NuGet\Install-Package Mapster.DependencyInjection -Version 1.0.1
```

## Exemplo 1: GetUserProfileUseCase (mapeamento simples)

**Antes (AutoMapper):**
```csharp
using AutoMapper;

public class GetUserProfileUseCase
{
    private readonly IMapper _mapper;

    public GetUserProfileUseCase(IMapper mapper)
    {
        _mapper = mapper;
    }

    public ResponseUserProfileJson Execute(User user)
    {
        return _mapper.Map<ResponseUserProfileJson>(user);
    }
}
```

**Depois (Mapster):**
```csharp
using Mapster;

public class GetUserProfileUseCase
{
    public ResponseUserProfileJson Execute(User user)
    {
        return user.Adapt<ResponseUserProfileJson>();
    }
}
```

Nota: construtor eliminado, campo `_mapper` eliminado, DI nao necessaria.

## Exemplo 2: GetDashboardUseCase (mapeamento de listas)

```csharp
using Mapster;

public class GetDashboardUseCase
{
    public Dashboard Execute(User user, List<WorkItem> workItems, List<Association> associations)
    {
        var workItemsResponse = workItems.Adapt<List<ResponseShortWorkItemJson>>();
        var associationsResponse = associations.Adapt<List<ResponseAssignJson>>();

        return new Dashboard
        {
            WorkItems = workItemsResponse,
            Associations = associationsResponse
        };
    }
}
```

## Exemplo 3: RegisterWorkItemUseCase (request para entidade)

```csharp
using Mapster;

public class RegisterWorkItemUseCase
{
    public void Execute(RequestWorkItemJson request)
    {
        var workItem = request.Adapt<WorkItem>();
        // workItem agora tem todas as propriedades mapeadas da request
        repository.Create(workItem);
    }
}
```

## Exemplo 4: UpdateWorkItemUseCase (mapear para instancia existente)

```csharp
using Mapster;

public class UpdateWorkItemUseCase
{
    public void Execute(RequestWorkItemJson request, WorkItem workItem)
    {
        // NAO cria nova instancia — preenche o workItem existente
        request.Adapt(workItem);
        repository.Update(workItem);
    }
}
```

Diferenca critica:
- `source.Adapt<T>()` → cria nova instancia de T
- `source.Adapt(existing)` → preenche instancia existente

## Exemplo 5: GetByIdUseCase

```csharp
using Mapster;

public class GetByIdUseCase
{
    public ResponseWorkItemJson Execute(WorkItem workItem)
    {
        return workItem.Adapt<ResponseWorkItemJson>();
    }
}
```

## Exemplo 6: Migracao via IMapper (projetos grandes)

```csharp
// DependencyInjectionExtension.cs
using Mapster;

public static class DependencyInjectionExtension
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        // Substitui services.AddAutoMapper(...) por:
        services.AddMapster();
        return services;
    }
}
```

```csharp
// UseCase que usa IMapper (compativel com sintaxe AutoMapper)
using Mapster; // era: using AutoMapper;

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
        // Atencao: Password sera mapeada tambem!
        // Customizacao para ignorar sera vista na proxima aula
    }
}
```

## Resumo das sintaxes

| Operacao | Sintaxe |
|----------|---------|
| Nova instancia | `source.Adapt<Dest>()` |
| Instancia existente | `source.Adapt(existingDest)` |
| Via IMapper (DI) | `_mapper.Map<Dest>(source)` |
| Registrar DI | `services.AddMapster()` |