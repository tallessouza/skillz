# Code Examples: Estilos de Botões .NET MAUI

## Exemplo 1: ResourceDictionary corrigido (ButtonStyles.xaml)

```xml
<?xml version="1.0" encoding="utf-8" ?>
<ResourceDictionary xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
                    xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml">

    <!-- Estilo IMPLÍCITO: padrão para todos os botões -->
    <Style TargetType="Button">
        <Setter Property="FontFamily" Value="MainFontBlack"/>
        <Setter Property="BackgroundColor" Value="Black"/>
        <Setter Property="TextColor" Value="White"/>
        <Setter Property="FontSize" Value="18"/>
        <Setter Property="HeightRequest" Value="50"/>
        <Setter Property="CornerRadius" Value="15"/>
    </Style>

    <!-- Estilo EXPLÍCITO removido — era usado apenas uma vez -->
    <!-- Se necessário em múltiplas páginas, recriar com x:Key -->

</ResourceDictionary>
```

## Exemplo 2: Página de Login com botão padrão

```xml
<!-- LoginPage.xaml (trecho relevante) -->

<!-- ... campos de email e senha ... -->

<!-- Vertical stack para "Esqueceu sua senha?" -->
<VerticalStackLayout>
    <Label Text="Esqueceu sua senha?" />
</VerticalStackLayout>

<!-- Botão de login: usa estilo implícito (sem configuração extra) -->
<Button Text="Login"/>
```

## Exemplo 3: Página de Registro com botão de exceção

```xml
<!-- RegisterPage.xaml (trecho relevante) -->

<!-- Botão ANTES do texto (ordem visual do Figma) -->
<Button Text="Criar minha conta"
        HeightRequest="60"
        CornerRadius="20"
        BackgroundColor="#1E90FF"
        TextColor="Black"/>

<!-- Texto "Já possui uma conta?" DEPOIS do botão -->
<VerticalStackLayout>
    <Label Text="Já possui uma conta? Faça login" />
</VerticalStackLayout>
```

## Exemplo 3: Onboarding com overrides inline

```xml
<!-- LoginOnBoard.xaml (trecho relevante) -->

<!-- Botão "Continuar com Google" — exceção com valores inline -->
<Button Text="Continuar com Google"
        HeightRequest="60"
        CornerRadius="20"
        BackgroundColor="White"
        TextColor="Black"/>

<!-- Botão "Login com e-mail e senha" — exceção com valores inline -->
<Button Text="Login com e-mail e senha"
        HeightRequest="60"
        CornerRadius="20"/>
```

## Processo de decisão aplicado

```
Design completo analisado:
├── Botões altura 50, borda 15: ~10 ocorrências (maioria)
│   ├── Salvar tarefa
│   ├── Editar tarefa
│   ├── Confirmar
│   └── ... outros
└── Botões altura 60, borda 20: 3 ocorrências (exceção)
    ├── Criar minha conta (RegisterPage)
    ├── Continuar com Google (OnBoard)
    └── Login com e-mail e senha (OnBoard)

Decisão: altura 50 + borda 15 → estilo implícito
         altura 60 + borda 20 → inline nos 3 componentes
```