# Code Examples: Cores da Barra de Navegacao no .NET MAUI Shell

## Exemplo 1: Testando cores individuais

O instrutor demonstrou primeiro com cores simples para entender as propriedades:

```xml
<!-- Testando BackgroundColor -->
<Shell
    Shell.BackgroundColor="Red">
    <!-- Barra de navegacao fica vermelha -->
```

```xml
<!-- Testando com amarelo -->
<Shell
    Shell.BackgroundColor="Yellow">
    <!-- Barra de navegacao fica amarela -->
```

```xml
<!-- Testando ForegroundColor -->
<Shell
    Shell.BackgroundColor="Black"
    Shell.ForegroundColor="Red">
    <!-- Barra preta, setinha de voltar vermelha -->
```

## Exemplo 2: Configuracao final com AppThemeBinding

```xml
<Shell
    Shell.BackgroundColor="{AppThemeBinding 
        Light={StaticResource PageBackgroundColorLight}, 
        Dark={StaticResource PageBackgroundColorDark}}"
    Shell.ForegroundColor="{AppThemeBinding 
        Light={StaticResource PrimaryColorLight}, 
        Dark={StaticResource PrimaryColorDark}}"
    Shell.NavBarHasShadow="False">
```

### O que cada binding faz:

| Propriedade | Light Mode | Dark Mode |
|-------------|------------|-----------|
| BackgroundColor | PageBackgroundColorLight (branco) | PageBackgroundColorDark (cinza escuro) |
| ForegroundColor | PrimaryColorLight (preto) | PrimaryColorDark (branco) |
| NavBarHasShadow | False (sem sombra) | False (sem sombra) |

## Exemplo 3: Ajuste de padding no ContentPage Style

Apos a nav bar ficar com mesma cor da pagina, o padding original ficou excessivo:

```xml
<!-- Antes (seguindo Figma) -->
<Style TargetType="ContentPage">
    <Setter Property="Padding" Value="40" />
</Style>

<!-- Depois (ajuste visual) -->
<Style TargetType="ContentPage">
    <Setter Property="Padding" Value="10" />
</Style>
```

**Localizacao:** `Resources/Styles/`

## Exemplo 4: Limpeza — remover Title desnecessario

O instrutor notou que havia um `Title` no Shell que nao era necessario:

```xml
<!-- Antes -->
<Shell Title="PlanShare" ...>

<!-- Depois (removido) -->
<Shell ...>
```

## Fluxo de teste completo

1. Aplicar as tres propriedades no AppShell.xaml
2. Hot reload atualiza BackgroundColor e ForegroundColor automaticamente
3. Parar e re-executar o app para NavBarHasShadow ter efeito
4. Testar navegacao (clicar em "Login com e-mail e senha") para ver a nav bar
5. Testar dark mode nas configuracoes do dispositivo
6. Re-executar o app apos trocar tema (hot reload nao atualiza nav bar no dark mode toggle)
7. Verificar em ambas plataformas (Android e iOS)