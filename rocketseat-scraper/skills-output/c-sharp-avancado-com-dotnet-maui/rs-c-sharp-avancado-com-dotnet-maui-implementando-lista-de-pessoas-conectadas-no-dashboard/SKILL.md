---
name: rs-csharp-maui-lista-conectados-dashboard
description: "Applies .NET MAUI CollectionView patterns for displaying horizontal user lists with avatars, headers, and gesture recognizers. Use when user asks to 'create a user list', 'show connected users', 'horizontal CollectionView', 'avatar list in MAUI', or 'add header to CollectionView'. Enforces DataTemplate typing, ItemsLayout configuration, scroll bar control, and binding context for commands inside templates. Make sure to use this skill whenever building list-based UI in .NET MAUI with custom templates. Not for backend API integration, SignalR connections, or non-MAUI list implementations."
---

# Lista de Usuarios Conectados no Dashboard (.NET MAUI)

> Ao construir listas de usuarios em .NET MAUI, use CollectionView com DataTemplate tipado, layout horizontal via LinearItemsLayout, e header template para acoes adicionais.

## Rules

1. **Separe models por responsabilidade** — crie classes distintas mesmo que compartilhem propriedades, porque cada contexto (ex: usuario pendente vs conectado) tem ciclo de vida diferente
2. **Tipo o DataTemplate com x:DataType** — permite IntelliSense e binding seguro dentro do template, porque sem tipagem o binding falha silenciosamente
3. **Use LinearItemsLayout para listas horizontais** — nao tente manipular o StackLayout pai, porque CollectionView controla o layout dos itens via ItemsLayout
4. **Esconda scrollbar quando desnecessario** — `HorizontalScrollBarVisibility="Never"` mantem a UI limpa, porque a barra visual pode poluir listas curtas
5. **Use HeaderTemplate para acoes contextuais** — botao de adicionar como header da lista, porque fica posicionado naturalmente antes dos itens
6. **Corrija binding de commands dentro de templates** — use `Path=BindingContext.CommandName` com `Source={x:Reference PageName}`, porque o contexto dentro do DataTemplate e o item, nao a ViewModel

## How to write

### Model separado por responsabilidade

```csharp
// Model para usuario ja conectado (tem ID)
public class ConnectedUser
{
    public string Id { get; set; }
    public string Name { get; set; }
    public string PhotoUrl { get; set; }
}

// Model do dashboard com lista observavel
public class Dashboard
{
    public string Username { get; set; }
    public ObservableCollection<ConnectedUser> ConnectedUsers { get; set; }
}
```

### CollectionView horizontal com DataTemplate tipado

```xml
<!-- Declarar namespace dos models no ContentPage -->
<ContentPage xmlns:models="clr-namespace:PlanShare.Models"
             x:Name="PageDashboard">

<CollectionView ItemsSource="{Binding Dashboard.ConnectedUsers}"
                HorizontalScrollBarVisibility="Never">

    <!-- Layout horizontal com espacamento -->
    <CollectionView.ItemsLayout>
        <LinearItemsLayout Orientation="Horizontal" ItemSpacing="15"/>
    </CollectionView.ItemsLayout>

    <!-- Header com botao de adicionar -->
    <CollectionView.HeaderTemplate>
        <DataTemplate>
            <VerticalStackLayout Spacing="5">
                <Image Source="add_circle" HeightRequest="50" WidthRequest="50"/>
                <Label Text="Add" FontSize="12" HorizontalOptions="Center"/>
                <VerticalStackLayout.GestureRecognizers>
                    <TapGestureRecognizer
                        Command="{Binding Path=BindingContext.ConnectionByCodeCommand,
                                  Source={x:Reference PageDashboard}}"/>
                </VerticalStackLayout.GestureRecognizers>
            </VerticalStackLayout>
        </DataTemplate>
    </CollectionView.HeaderTemplate>

    <!-- Template de cada item -->
    <CollectionView.ItemTemplate>
        <DataTemplate x:DataType="models:ConnectedUser">
            <VerticalStackLayout Spacing="5">
                <views:AvatarView CornerRadius="25"
                                  HeightRequest="50" WidthRequest="50"
                                  Text="{Binding Name}" FontSize="14"/>
                <Label Text="{Binding Name}" FontSize="12"
                       HorizontalOptions="Center"/>
            </VerticalStackLayout>
        </DataTemplate>
    </CollectionView.ItemTemplate>
</CollectionView>
```

## Example

**Before (botao temporario sem lista):**
```xml
<Button Text="Adicionar" Command="{Binding ConnectionByCodeCommand}"/>
```

**After (lista horizontal com header e template tipado):**
```xml
<Label Text="{StaticResource TasksSharedWith}" Margin="0,40,0,20"/>
<CollectionView ItemsSource="{Binding Dashboard.ConnectedUsers}"
                HorizontalScrollBarVisibility="Never">
    <CollectionView.ItemsLayout>
        <LinearItemsLayout Orientation="Horizontal" ItemSpacing="15"/>
    </CollectionView.ItemsLayout>
    <CollectionView.HeaderTemplate>
        <DataTemplate>
            <VerticalStackLayout Spacing="5">
                <Image Source="add_circle" HeightRequest="50" WidthRequest="50">
                    <Image.Behaviors>
                        <toolkit:IconTintColorBehavior TintColor="{...}"/>
                    </Image.Behaviors>
                </Image>
                <Label Text="Add" FontSize="12" HorizontalOptions="Center"/>
                <VerticalStackLayout.GestureRecognizers>
                    <TapGestureRecognizer
                        Command="{Binding Path=BindingContext.ConnectionByCodeCommand,
                                  Source={x:Reference PageDashboard}}"/>
                </VerticalStackLayout.GestureRecognizers>
            </VerticalStackLayout>
        </DataTemplate>
    </CollectionView.HeaderTemplate>
    <CollectionView.ItemTemplate>
        <DataTemplate x:DataType="models:ConnectedUser">
            <VerticalStackLayout Spacing="5">
                <views:AvatarView CornerRadius="25" HeightRequest="50"
                                  WidthRequest="50" Text="{Binding Name}" FontSize="14"/>
                <Label Text="{Binding Name}" FontSize="12" HorizontalOptions="Center"/>
            </VerticalStackLayout>
        </DataTemplate>
    </CollectionView.ItemTemplate>
</CollectionView>
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Avatar circular | CornerRadius = metade de HeightRequest/WidthRequest |
| Command dentro de DataTemplate | Use `Path=BindingContext.Command, Source={x:Reference PageName}` |
| Lista horizontal sem barra | `HorizontalScrollBarVisibility="Never"` |
| Acao antes dos itens da lista | Use `CollectionView.HeaderTemplate` |
| Models com propriedades similares mas contextos diferentes | Crie classes separadas |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `Command="{Binding MyCommand}"` dentro de DataTemplate | `Command="{Binding Path=BindingContext.MyCommand, Source={x:Reference PageName}}"` |
| StackLayout manual para lista horizontal | `CollectionView` com `LinearItemsLayout Orientation="Horizontal"` |
| Reutilizar model de contexto diferente por ter props iguais | Criar model separado por responsabilidade |
| CornerRadius arbitrario para circulo | CornerRadius = Width/2 = Height/2 |
| Botao fixo fora da lista para adicionar item | HeaderTemplate dentro da CollectionView |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
