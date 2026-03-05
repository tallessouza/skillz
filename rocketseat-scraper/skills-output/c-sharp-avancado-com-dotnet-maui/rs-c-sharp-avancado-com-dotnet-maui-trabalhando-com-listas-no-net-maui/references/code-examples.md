# Code Examples: CollectionView no .NET MAUI

## Exemplo completo do ViewModel

```csharp
public partial class ErrorViewModel : ObservableObject
{
    [ObservableProperty]
    ObservableCollection<string> errorsList = new([
        "Error 1",
        "Invalid input",
        "Network find not found"
    ]);
}
```

**Nota:** No curso, os valores sao fixos temporariamente para teste. Na aula seguinte, a lista e populada dinamicamente via parametros de navegacao.

## Exemplo completo do XAML (pagina de erros)

```xml
<?xml version="1.0" encoding="utf-8" ?>
<ContentPage xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
             xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
             xmlns:viewmodel="clr-namespace:MyApp.ViewModels"
             x:DataType="viewmodel:ErrorViewModel">

    <VerticalStackLayout Padding="40">

        <!-- Imagem de erro -->
        <Image Source="error_image.png"
               WidthRequest="120"
               HeightRequest="120" />

        <!-- Mensagens de texto -->
        <Label Text="Ops! Algo deu errado"
               FontSize="20"
               FontFamily="UrsansBold" />

        <Label Text="Os seguintes erros foram encontrados:"
               FontSize="14"
               FontFamily="UrsansRegular" />

        <!-- CollectionView com lista de erros -->
        <CollectionView
            ItemsSource="{Binding ErrorsList}"
            VerticalScrollBarVisibility="Never"
            HorizontalScrollBarVisibility="Never"
            Margin="0,20,0,0">
            <CollectionView.ItemTemplate>
                <DataTemplate x:DataType="x:String">
                    <HorizontalStackLayout
                        Spacing="20"
                        Margin="0,0,0,20">
                        <Image Source="icon_arrow.png"
                               WidthRequest="16"
                               HeightRequest="16">
                            <Image.Behaviors>
                                <!-- AppThemeBinding para cor do icone -->
                            </Image.Behaviors>
                        </Image>
                        <Label Text="{Binding .}"
                               FontFamily="UrsansRegular"
                               FontSize="14" />
                    </HorizontalStackLayout>
                </DataTemplate>
            </CollectionView.ItemTemplate>
        </CollectionView>

        <!-- Botao tentar novamente -->
        <Button Text="Tentar novamente"
                Command="{Binding TryAgainCommand}"
                Margin="0,70,0,0" />

    </VerticalStackLayout>
</ContentPage>
```

## Variacao: CollectionView com objetos complexos

Se ao inves de strings voce tiver uma classe:

```csharp
public class ValidationError
{
    public string Message { get; set; }
    public string Code { get; set; }
}
```

O ViewModel muda para:

```csharp
[ObservableProperty]
ObservableCollection<ValidationError> errorsList = new();
```

E o DataTemplate muda para:

```xml
<DataTemplate x:DataType="models:ValidationError">
    <HorizontalStackLayout Spacing="20" Margin="0,0,0,20">
        <Image Source="icon_arrow.png" />
        <Label Text="{Binding Message}" />
        <Label Text="{Binding Code}" TextColor="Gray" FontSize="12" />
    </HorizontalStackLayout>
</DataTemplate>
```

**Diferenca chave:** com objetos, use `{Binding PropertyName}` ao inves de `{Binding .}`.

## Variacao: CollectionView horizontal

Mencionado pelo instrutor como conteudo futuro:

```xml
<CollectionView
    ItemsSource="{Binding Items}"
    ItemsLayout="HorizontalList">
    <!-- DataTemplate aqui -->
</CollectionView>
```

## Adicionando/removendo itens reativamente

```csharp
// Todos esses chamados atualizam a UI automaticamente com ObservableCollection:
ErrorsList.Add("New error message");
ErrorsList.Remove("Old error message");
ErrorsList.RemoveAt(0);
ErrorsList.Clear();
ErrorsList.Insert(0, "First error");
```