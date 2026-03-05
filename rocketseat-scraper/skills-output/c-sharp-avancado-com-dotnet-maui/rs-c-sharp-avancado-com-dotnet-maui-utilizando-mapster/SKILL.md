---
name: rs-csharp-dotnet-maui-utilizando-mapster
description: "Applies Mapster object mapping patterns when writing C# .NET code. Use when user asks to 'map objects', 'convert entities', 'replace AutoMapper', 'use Mapster', or 'transform DTOs'. Covers Adapt syntax, existing instance mapping, IMapper DI registration, and list mapping. Make sure to use this skill whenever generating C# mapping code or migrating from AutoMapper. Not for EF Core queries, serialization, or manual property assignment."
---

# Mapeamento de Objetos com Mapster

> Use Mapster como biblioteca de mapeamento em projetos C#/.NET — mais performatica, mais simples, sem configuracao obrigatoria.

## Rules

1. **Use `Adapt<T>()` para criar nova instancia** — `source.Adapt<DestType>()` substitui `mapper.Map<DestType>(source)`, porque nao precisa de injecao de dependencia nem configuracao previa
2. **Use `Adapt(destino)` para mapear em instancia existente** — `source.Adapt(existingObj)` preenche propriedades sem criar novo objeto, porque cenarios de update precisam preservar a instancia original
3. **Mapster funciona com listas automaticamente** — `listSource.Adapt<List<DestType>>()` converte colecoes inteiras, porque o Mapster resolve generics e colecoes sem configuracao extra
4. **Registre `services.AddMapster()` apenas se precisar de IMapper via DI** — instale `Mapster.DependencyInjection` separadamente, porque o pacote base `Mapster` nao inclui integracao com DI
5. **Remova AutoMapper completamente ao migrar** — o Mapster oferece `IMapper` com mesma interface, porque a equipe do Mapster manteve nomes compativeis para facilitar migracao
6. **Prefira `Adapt<T>()` direto sobre IMapper** — reduz codigo eliminando construtor, campo privado e DI, porque a extension method e suficiente na maioria dos casos

## How to write

### Mapeamento simples (nova instancia)

```csharp
using Mapster;

// Converte entidade para response DTO
var userProfile = user.Adapt<ResponseUserProfileJson>();
return userProfile;
```

### Mapeamento para instancia existente (update)

```csharp
using Mapster;

// Preenche entidade existente com dados da request
request.Adapt(workItem);
// workItem agora tem os valores da request
await repository.Update(workItem);
```

### Mapeamento de listas

```csharp
using Mapster;

var workItemsResponse = workItems.Adapt<List<ResponseShortWorkItemJson>>();
var associationsResponse = associations.Adapt<List<ResponseAssignJson>>();
```

### Registro no DI (apenas se usar IMapper)

```csharp
// Requer pacote: Mapster.DependencyInjection
using Mapster;

services.AddMapster();
```

## Example

**Before (AutoMapper):**
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

**After (Mapster):**
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

## Heuristics

| Situation | Do |
|-----------|-----|
| Criar novo objeto a partir de outro | `source.Adapt<Dest>()` |
| Atualizar objeto existente com dados de outro | `source.Adapt(existingDest)` |
| Converter lista inteira | `list.Adapt<List<DestType>>()` |
| Projeto grande migrando de AutoMapper | Trocar `using AutoMapper` por `using Mapster` — IMapper e compativel |
| Nao precisa de IMapper via DI | Use `Adapt<T>()` direto, sem registrar no DI |
| Precisa de IMapper via DI | Instale `Mapster.DependencyInjection` e chame `services.AddMapster()` |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `_mapper.Map<Dest>(source)` com AutoMapper | `source.Adapt<Dest>()` com Mapster |
| Construtor recebendo IMapper quando nao precisa | Chamar `.Adapt<T>()` direto na entidade |
| Criar Profile/MappingConfiguration para mapeamentos simples | Mapster mapeia automaticamente por convencao de nomes |
| `new Dest { Prop1 = source.Prop1, Prop2 = source.Prop2 }` manual | `source.Adapt<Dest>()` quando propriedades tem mesmo nome |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
