# Code Examples: AvatarView com Skeleton Loading

## 1. Enum StatusPage completo

```csharp
public enum StatusPage
{
    Default = 0,
    Sending = 1,
    Loading = 2
}
```

O valor `Loading` foi adicionado nesta aula. `Sending` ja existia para animacoes de envio (ex: aviãozinho na tela de login).

## 2. ViewModelBase com StatusPage observavel

```csharp
public partial class ViewModelBase : ObservableObject
{
    [ObservableProperty]
    private StatusPage statusPage;
}
```

## 3. UserProfileViewModel — Initialize com controle de status

```csharp
public async Task Initialize()
{
    StatusPage = Models.StatusPage.Loading;

    // ... chamadas a API para carregar dados do perfil ...

    StatusPage = Models.StatusPage.Default;
}
```

## 4. XAML — Declaracao do namespace skeleton

```xml
<ContentPage xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
             xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
             xmlns:models="clr-namespace:PlanShare.App.Models"
             xmlns:skeleton="clr-namespace:PlanShare.App.Views.Components.Skeletons"
             x:Class="PlanShare.App.Views.UserProfilePage">
```

## 5. XAML — Estrutura completa do avatar com skeleton

```xml
<ContentPage>
    <VerticalStackLayout>

        <!-- Conteudo real — visivel quando StatusPage == Default -->
        <VerticalStackLayout IsVisible="False">
            <VerticalStackLayout.Triggers>
                <DataTrigger TargetType="VerticalStackLayout"
                             Binding="{Binding StatusPage}"
                             Value="{x:Static models:StatusPage.Default}">
                    <Setter Property="IsVisible" Value="True"/>
                </DataTrigger>
            </VerticalStackLayout.Triggers>

            <!-- Avatar real -->
            <Grid>
                <controls:AvatarView HeightRequest="100"
                                     WidthRequest="100"
                                     CornerRadius="50"/>
                <!-- Icone de edicao (lapis) -->
                <Border HeightRequest="30"
                        WidthRequest="30"
                        StrokeShape="RoundRectangle 15"
                        VerticalOptions="End"
                        HorizontalOptions="End">
                    <Image Source="pencil_icon.png"
                           HeightRequest="16"
                           WidthRequest="16"/>
                </Border>
            </Grid>
        </VerticalStackLayout>

        <!-- Skeleton — visivel quando StatusPage == Loading -->
        <VerticalStackLayout IsVisible="False">
            <VerticalStackLayout.Triggers>
                <DataTrigger TargetType="VerticalStackLayout"
                             Binding="{Binding StatusPage}"
                             Value="{x:Static models:StatusPage.Loading}">
                    <Setter Property="IsVisible" Value="True"/>
                </DataTrigger>
            </VerticalStackLayout.Triggers>

            <!-- Skeleton no lugar do avatar -->
            <Grid>
                <skeleton:SkeletonView HeightRequest="100"
                                       WidthRequest="100"
                                       CornerRadius="50"/>
                <!-- Mesmo icone de edicao mantido -->
                <Border HeightRequest="30"
                        WidthRequest="30"
                        StrokeShape="RoundRectangle 15"
                        VerticalOptions="End"
                        HorizontalOptions="End">
                    <Image Source="pencil_icon.png"
                           HeightRequest="16"
                           WidthRequest="16"/>
                </Border>
            </Grid>
        </VerticalStackLayout>

    </VerticalStackLayout>
</ContentPage>
```

## 6. Referencia — DataTrigger na pagina de registro (padrao existente)

```xml
<!-- Padrao ja usado em RegisterUserAccountPage -->
<VerticalStackLayout IsVisible="False">
    <VerticalStackLayout.Triggers>
        <DataTrigger TargetType="VerticalStackLayout"
                     Binding="{Binding StatusPage}"
                     Value="{x:Static models:StatusPage.Default}">
            <Setter Property="IsVisible" Value="True"/>
        </DataTrigger>
    </VerticalStackLayout.Triggers>
    <!-- Formulario aqui -->
</VerticalStackLayout>

<!-- Animacao de envio -->
<animations:SendingAnimation IsVisible="False">
    <animations:SendingAnimation.Triggers>
        <DataTrigger TargetType="animations:SendingAnimation"
                     Binding="{Binding StatusPage}"
                     Value="{x:Static models:StatusPage.Sending}">
            <Setter Property="IsVisible" Value="True"/>
        </DataTrigger>
    </animations:SendingAnimation.Triggers>
</animations:SendingAnimation>
```

## 7. Propriedades do SkeletonView para formato circular

```xml
<!-- Para reproduzir um circulo de 100x100: -->
<skeleton:SkeletonView HeightRequest="100"
                       WidthRequest="100"
                       CornerRadius="50"/>
<!-- CornerRadius = metade da dimensao para circulo perfeito -->
```

## 8. Teste com breakpoint

Para validar visualmente o skeleton loading quando a API e rapida demais:

```csharp
// No controller da API, adicione um breakpoint na linha do return
[HttpGet("users/{id}")]
public async Task<IActionResult> GetUser(string id)
{
    var user = await _repository.GetById(id);
    return Ok(user); // <-- breakpoint aqui para simular delay
}
```

Sem o breakpoint, a resposta e tao rapida que "nao da nem um segundo" — o skeleton aparece e some instantaneamente.