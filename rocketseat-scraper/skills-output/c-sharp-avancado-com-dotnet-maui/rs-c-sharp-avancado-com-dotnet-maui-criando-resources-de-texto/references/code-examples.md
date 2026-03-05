# Code Examples: Resources de Texto no .NET MAUI

## Estrutura de arquivos

```
PlanShare.App/
├── Resources/
│   ├── ResourceTexts.resx           # Idioma neutro (ingles)
│   └── ResourceTexts.pt-BR.resx     # Portugues Brasil
```

## Arquivo .resx neutro completo (ingles)

```xml
<?xml version="1.0" encoding="utf-8"?>
<root>
  <data name="login_with_email_password" xml:space="preserve">
    <value>Login with e-mail and password</value>
  </data>
  <data name="subtitle_register_account" xml:space="preserve">
    <value>Control your routine with ease because you deserve more time for what you love</value>
  </data>
</root>
```

## Arquivo .resx localizado (pt-BR)

```xml
<?xml version="1.0" encoding="utf-8"?>
<root>
  <data name="login_with_email_password" xml:space="preserve">
    <value>Login com e-mail e senha</value>
  </data>
  <data name="subtitle_register_account" xml:space="preserve">
    <value>Comande sua rotina aqui com facilidade porque você merece mais tempo para o que você ama</value>
  </data>
</root>
```

## XAML completo com binding de resources

```xml
<?xml version="1.0" encoding="utf-8" ?>
<ContentPage xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
             xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
             xmlns:resourcefile="clr-namespace:PlanShare.App.Resources"
             x:Class="PlanShare.App.Views.Pages.OnBoarding.OnBoardingPage">

    <VerticalStackLayout>
        <!-- Botao usando resource -->
        <Button Text="{x:Static resourcefile:ResourceTexts.login_with_email_password}" />

        <!-- Label usando resource -->
        <Label Text="{x:Static resourcefile:ResourceTexts.subtitle_register_account}" />
    </VerticalStackLayout>
</ContentPage>
```

## Configuracao do .csproj para Public access

```xml
<Project Sdk="Microsoft.NET.Sdk">
  <!-- ... outras configuracoes ... -->

  <ItemGroup>
    <EmbeddedResource Update="Resources\ResourceTexts.resx">
      <Generator>PublicResXFileCodeGenerator</Generator>
      <LastGenOutput>ResourceTexts.Designer.cs</LastGenOutput>
    </EmbeddedResource>
  </ItemGroup>
</Project>
```

## Convencao de nomes de arquivo para outros idiomas

```
ResourceTexts.resx          # Neutro (fallback)
ResourceTexts.pt-BR.resx    # Portugues Brasil
ResourceTexts.pt-PT.resx    # Portugues Portugal
ResourceTexts.fr-FR.resx    # Frances Franca
ResourceTexts.fr-CA.resx    # Frances Canada
ResourceTexts.fr-BE.resx    # Frances Belgica
ResourceTexts.es-ES.resx    # Espanhol Espanha
ResourceTexts.fr.resx       # Frances generico (qualquer regiao)
```

## Padrao para reutilizacao de namespace entre telas

```xml
<!-- OnBoardingPage.xaml -->
<ContentPage xmlns:resourcefile="clr-namespace:PlanShare.App.Resources">
    <Button Text="{x:Static resourcefile:ResourceTexts.login_with_email_password}" />
</ContentPage>

<!-- RegisterPage.xaml -->
<ContentPage xmlns:resourcefile="clr-namespace:PlanShare.App.Resources">
    <Label Text="{x:Static resourcefile:ResourceTexts.subtitle_register_account}" />
</ContentPage>
```

A mesma declaracao `xmlns:resourcefile` e usada em todas as paginas. O nome `resourcefile` e arbitrario — voce pode chamar de `res`, `strings`, ou qualquer nome. O importante e que o namespace aponte para o namespace correto da classe gerada pelo .resx.

## Comparacao com exception resources

O instrutor ja tinha criado anteriormente um resource para excecoes (`ResourceMessageException.resx`). A diferenca e apenas semantica:

| Arquivo | Proposito |
|---------|-----------|
| `ResourceMessageException.resx` | Mensagens de erro/excecao (backend) |
| `ResourceTexts.resx` | Textos de UI exibidos ao usuario (frontend) |

Ambos seguem exatamente o mesmo mecanismo de chave-valor e localizacao.