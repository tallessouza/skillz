---
name: rs-csharp-maui-listas-collection-view
description: "Applies .NET MAUI CollectionView patterns when displaying lists of data in XAML pages. Use when user asks to 'show a list', 'display items', 'create a collection view', 'render list data', or 'bind a list to UI' in .NET MAUI. Enforces ObservableCollection over List, proper DataTemplate with x:DataType, scroll bar configuration, and binding syntax for primitive types. Make sure to use this skill whenever generating .NET MAUI code that displays collections. Not for non-MAUI list operations, LINQ queries, or backend data processing."
---

# CollectionView no .NET MAUI

> Ao exibir listas no .NET MAUI, use CollectionView com ObservableCollection e DataTemplate tipado para garantir reatividade e renderizacao correta.

## Rules

1. **Use ObservableCollection, nunca List** — `ObservableCollection<T>` notifica a view quando itens sao adicionados/removidos via `.Add()` ou `.Remove()`, porque `List<T>` so notifica quando a propriedade inteira recebe nova instancia
2. **Defina x:DataType no DataTemplate** — tipos primitivos usam o prefixo `x:` (ex: `x:String`, `x:Int32`), porque sem isso o binding nao resolve corretamente
3. **Use Binding com ponto para tipos primitivos** — quando o item da lista e o proprio valor (string, int), use `Text="{Binding .}"`, porque nao existe propriedade interna para acessar
4. **Configure scroll bar visibility explicitamente** — use `VerticalScrollBarVisibility="Never"` quando nao quiser exibir a barra de scroll, porque o scroll continua funcionando mas sem a barra visual
5. **Espacamento entre itens via margem no template** — aplique `Margin` no layout raiz do DataTemplate para espacar itens, porque CollectionView nao tem propriedade de gap entre itens
6. **Mantenha o atributo ObservableProperty** — a propriedade ObservableCollection ainda precisa do `[ObservableProperty]` para o binding inicial funcionar

## How to write

### ViewModel com ObservableCollection

```csharp
[ObservableProperty]
ObservableCollection<string> errorsList = new([
    "E-mail is required",
    "Password must be at least 8 characters"
]);
```

### CollectionView com DataTemplate para strings

```xml
<CollectionView
    ItemsSource="{Binding ErrorsList}"
    VerticalScrollBarVisibility="Never"
    HorizontalScrollBarVisibility="Never">
    <CollectionView.ItemTemplate>
        <DataTemplate x:DataType="x:String">
            <HorizontalStackLayout Spacing="20" Margin="0,0,0,20">
                <Image Source="icon_arrow.png"
                       WidthRequest="16"
                       HeightRequest="16" />
                <Label Text="{Binding .}"
                       FontFamily="UrsansRegular"
                       FontSize="14" />
            </HorizontalStackLayout>
        </DataTemplate>
    </CollectionView.ItemTemplate>
</CollectionView>
```

## Example

**Before (erro comum — List nao notifica mudancas):**

```csharp
// ViewModel
[ObservableProperty]
List<string> errorsList = new();

// Adicionar item NAO atualiza a UI:
ErrorsList.Add("New error"); // View nao reage
```

**After (ObservableCollection notifica a view):**

```csharp
// ViewModel
[ObservableProperty]
ObservableCollection<string> errorsList = new();

// Adicionar item ATUALIZA a UI automaticamente:
ErrorsList.Add("New error"); // View reage e exibe o novo item
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Lista cujos itens mudam em runtime (add/remove) | `ObservableCollection<T>` com `[ObservableProperty]` |
| Lista estatica que nunca muda | `List<T>` e aceitavel, mas `ObservableCollection` e mais seguro |
| Itens exibidos na horizontal | Adicione `ItemsLayout="HorizontalList"` na CollectionView |
| Itens sao objetos complexos | Use `x:DataType="viewmodel:MyClass"` e `{Binding PropertyName}` |
| Itens sao tipos primitivos (string, int) | Use `x:DataType="x:String"` e `{Binding .}` |
| Precisa de espacamento entre itens | Aplique `Margin` no layout raiz do DataTemplate |

## Anti-patterns

| Nunca escreva | Escreva ao inves |
|---------------|------------------|
| `List<string> errors` para binding | `ObservableCollection<string> errors` |
| `Text="{Binding}"` sem o ponto | `Text="{Binding .}"` para tipo primitivo |
| `DataType="String"` sem prefixo | `DataType="x:String"` com prefixo x |
| `ErrorsList = new List(...)` para adicionar | `ErrorsList.Add(item)` com ObservableCollection |
| DataTemplate sem x:DataType | DataTemplate com `x:DataType` explicitamente definido |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
