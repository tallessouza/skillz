# Code Examples: Lista de Pessoas Conectadas no Dashboard

## Model: ConnectedUser

```csharp
namespace PlanShare.Models;

public class ConnectedUser
{
    public string Id { get; set; }
    public string Name { get; set; }
    public string PhotoUrl { get; set; }
}
```

## Model: Dashboard

```csharp
using System.Collections.ObjectModel;

namespace PlanShare.Models;

public class Dashboard
{
    public string Username { get; set; }
    public ObservableCollection<ConnectedUser> ConnectedUsers { get; set; }
}
```

## ViewModel: Inicializacao com dados de teste

```csharp
// Antes (propriedade simples)
[ObservableProperty]
private string username;

public DashboardViewModel(IUserStorage userStorage)
{
    username = userStorage.GetUsername();
}

// Depois (model Dashboard completo)
[ObservableProperty]
private Models.Dashboard dashboard;

public DashboardViewModel()
{
    dashboard = new Models.Dashboard
    {
        Username = "Ellison Marley",
        ConnectedUsers = new ObservableCollection<ConnectedUser>
        {
            new ConnectedUser { Name = "Alice" },
            new ConnectedUser { Name = "Bob" },
            new ConnectedUser { Name = "Charlie" }
        }
    };
}
```

## XAML: Declaracao de namespace no ContentPage

```xml
<ContentPage xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
             xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
             xmlns:models="clr-namespace:PlanShare.Models"
             xmlns:views="clr-namespace:PlanShare.Views"
             x:Name="PageDashboard"
             x:Class="PlanShare.Pages.DashboardPage">
```

## XAML: Label de titulo

```xml
<Label Text="{StaticResource TasksSharedWith}"
       Margin="0,40,0,20"
       FontFamily="MainFontBlack"/>
```

## XAML: Atualizacao dos bindings do header (avatar e username)

```xml
<!-- Avatar no header agora usa Dashboard.Username -->
<views:AvatarView Text="{Binding Dashboard.Username}" />

<!-- Label do nome tambem -->
<Label Text="{Binding Dashboard.Username}" />
```

## XAML: CollectionView completa

```xml
<CollectionView ItemsSource="{Binding Dashboard.ConnectedUsers}"
                HorizontalScrollBarVisibility="Never">

    <!-- Layout horizontal -->
    <CollectionView.ItemsLayout>
        <LinearItemsLayout Orientation="Horizontal" ItemSpacing="15"/>
    </CollectionView.ItemsLayout>

    <!-- Header: botao de adicionar -->
    <CollectionView.HeaderTemplate>
        <DataTemplate>
            <VerticalStackLayout Spacing="5">
                <Image Source="add_circle"
                       HeightRequest="50"
                       WidthRequest="50">
                    <Image.Behaviors>
                        <toolkit:IconTintColorBehavior
                            TintColor="{AppThemeBinding Light={StaticResource Gray600},
                                                       Dark={StaticResource White}}"/>
                    </Image.Behaviors>
                </Image>
                <Label Text="Add"
                       FontSize="12"
                       FontFamily="{StaticResource MainFontBlack}"
                       HorizontalOptions="Center"/>
                <VerticalStackLayout.GestureRecognizers>
                    <TapGestureRecognizer
                        Command="{Binding Path=BindingContext.ConnectionByCodeCommand,
                                  Source={x:Reference PageDashboard}}"/>
                </VerticalStackLayout.GestureRecognizers>
            </VerticalStackLayout>
        </DataTemplate>
    </CollectionView.HeaderTemplate>

    <!-- Item template tipado -->
    <CollectionView.ItemTemplate>
        <DataTemplate x:DataType="models:ConnectedUser">
            <VerticalStackLayout Spacing="5">
                <views:AvatarView BackgroundColor="{StaticResource PrimaryColor}"
                                  CornerRadius="25"
                                  HeightRequest="50"
                                  WidthRequest="50"
                                  Text="{Binding Name}"
                                  FontFamily="MainFontBlack"
                                  FontSize="14"
                                  TextColor="White"/>
                <Label Text="{Binding Name}"
                       FontSize="12"
                       HorizontalOptions="Center"/>
            </VerticalStackLayout>
        </DataTemplate>
    </CollectionView.ItemTemplate>
</CollectionView>
```

## Variacao: Lista vertical (padrao)

```xml
<!-- Sem ItemsLayout, CollectionView usa vertical por padrao -->
<CollectionView ItemsSource="{Binding Items}">
    <CollectionView.ItemTemplate>
        <DataTemplate x:DataType="models:MyItem">
            <HorizontalStackLayout Spacing="10" Padding="10">
                <Image Source="{Binding Icon}" HeightRequest="40" WidthRequest="40"/>
                <Label Text="{Binding Title}" VerticalOptions="Center"/>
            </HorizontalStackLayout>
        </DataTemplate>
    </CollectionView.ItemTemplate>
</CollectionView>
```

## Variacao: FooterTemplate (em vez de Header)

```xml
<!-- Botao de acao no final da lista -->
<CollectionView.FooterTemplate>
    <DataTemplate>
        <Button Text="Load More"
                Command="{Binding Path=BindingContext.LoadMoreCommand,
                          Source={x:Reference PageName}}"/>
    </DataTemplate>
</CollectionView.FooterTemplate>
```

## Variacao: Controle de scroll bar vertical

```xml
<CollectionView VerticalScrollBarVisibility="Never"
                ItemsSource="{Binding LongList}">
    <!-- ... -->
</CollectionView>
```