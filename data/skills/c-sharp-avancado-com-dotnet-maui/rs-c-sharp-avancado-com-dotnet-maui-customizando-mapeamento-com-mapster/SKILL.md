---
name: rs-csharp-mapster-custom-mapping
description: "Applies Mapster custom mapping patterns when writing C# .NET mapping configurations. Use when user asks to 'configure Mapster', 'ignore property in mapping', 'custom mapping', 'map properties differently', 'replace AutoMapper with Mapster', or 'TypeAdapterConfig'. Covers Ignore, Map with transformation, and GUID-to-entity conversion. Make sure to use this skill whenever generating Mapster configuration code or migrating from AutoMapper. Not for AutoMapper code, EF Core mappings, or manual object mapping."
---

# Customizando Mapeamento com Mapster

> Configure mapeamentos customizados no Mapster usando TypeAdapterConfig com sintaxe direta para ignorar propriedades, transformar valores e converter tipos.

## Rules

1. **Use classe estatica para configuracoes** — `public static class MapConfigurations` com metodo `public static void Configure()`, porque Mapster nao precisa de heranca como AutoMapper's Profile
2. **Use TypeAdapterConfig para customizacoes** — `TypeAdapterConfig<Source, Destination>.NewConfig()` inicia uma configuracao, porque mapeamentos simples (sem customizacao) nao precisam de configuracao alguma
3. **Ignore propriedades sensiveis explicitamente** — `.Ignore(dest => dest.Password)` para campos como senha, porque Mapster mapeia tudo por padrao
4. **Transforme valores no Map** — `.Map(dest => dest.DueDate, src => src.DueDate.Date)` para normalizar dados, porque evita logica de transformacao espalhada pelo codigo
5. **Prefira metodo de extensao .Adapt()** — use `request.Adapt<Entity>()` ao inves de injetar IMapper, porque economiza uma dependencia e simplifica o construtor
6. **Remova Mapster.DependencyInjection se usar .Adapt()** — o pacote de DI so e necessario se injetar IMapper, porque .Adapt() funciona sem registro no container

## How to write

### Configuracao estatica

```csharp
public static class MapConfigurations
{
    public static void Configure()
    {
        // Configuracoes customizadas aqui
    }
}
```

### Ignorar propriedade

```csharp
TypeAdapterConfig<RequestRegisterUserJson, User>
    .NewConfig()
    .Ignore(dest => dest.Password);
```

### Mapear com transformacao

```csharp
TypeAdapterConfig<RequestWorkItemJson, WorkItem>
    .NewConfig()
    .Map(dest => dest.DueDate, src => src.DueDate.Date);
```

### Converter GUID para entidade

```csharp
TypeAdapterConfig<Guid, Assignee>
    .NewConfig()
    .Map(dest => dest.UserId, src => src);
```

### Encadear Map e Ignore

```csharp
TypeAdapterConfig<RequestWorkItemJson, WorkItem>
    .NewConfig()
    .Map(dest => dest.DueDate, src => src.DueDate.Date)
    .Map(dest => dest.Assignees, src => src.Assignees.Distinct());
```

### Registrar no DI

```csharp
public static void AddMapperConfigurations(this IServiceCollection services)
{
    MapConfigurations.Configure();
}
```

## Example

**Before (AutoMapper syntax):**
```csharp
public class AutoMapping : Profile
{
    public AutoMapping()
    {
        CreateMap<RequestRegisterUserJson, User>()
            .ForMember(dest => dest.Password, opt => opt.Ignore());

        CreateMap<RequestWorkItemJson, WorkItem>()
            .ForMember(dest => dest.DueDate, opt => opt.MapFrom(src => src.DueDate.Date));
    }
}
```

**After (Mapster syntax):**
```csharp
public static class MapConfigurations
{
    public static void Configure()
    {
        TypeAdapterConfig<RequestRegisterUserJson, User>
            .NewConfig()
            .Ignore(dest => dest.Password);

        TypeAdapterConfig<RequestWorkItemJson, WorkItem>
            .NewConfig()
            .Map(dest => dest.DueDate, src => src.DueDate.Date)
            .Map(dest => dest.Assignees, src => src.Assignees.Distinct());

        TypeAdapterConfig<Guid, Assignee>
            .NewConfig()
            .Map(dest => dest.UserId, src => src);
    }
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Propriedade com mesmo nome e tipo nos dois lados | Nenhuma configuracao necessaria — Mapster mapeia automaticamente |
| Propriedade sensivel (senha, token) | `.Ignore()` explicitamente |
| DateTime que precisa ignorar horario | `.Map(dest => dest.X, src => src.X.Date)` |
| Lista de IDs que vira lista de entidades | Crie TypeAdapterConfig de GUID para a entidade |
| Lista pode ter duplicatas | Use `.Distinct()` no source do Map |
| Classe de config ficando grande | Separe em metodos: `ConfigureRequestToDomain()`, `ConfigureDomainToResponse()` |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| Herdar de Profile (AutoMapper) | Classe estatica com metodo Configure |
| `CreateMap<A, B>()` sem customizacao | Nada — Mapster nao precisa |
| Injetar IMapper quando so usa Adapt | `request.Adapt<Entity>()` direto |
| Instalar Mapster.DependencyInjection sem usar IMapper | Desinstalar, usar so Mapster |
| `.NewConfig()` como metodo separado: `var config = ...; config.NewConfig()` | `TypeAdapterConfig<A, B>.NewConfig()` direto apos os generics |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
