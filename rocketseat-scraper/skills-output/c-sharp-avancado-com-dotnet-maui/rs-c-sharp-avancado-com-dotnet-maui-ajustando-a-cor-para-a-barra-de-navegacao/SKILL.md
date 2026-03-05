---
name: rs-csharp-maui-nav-bar-colors
description: "Applies correct navigation bar styling in .NET MAUI Shell apps when user asks to 'style navigation bar', 'fix nav bar colors', 'customize shell bar', 'remove navigation shadow', or 'set bar colors for dark mode'. Configures Shell.BackgroundColor, Shell.ForegroundColor, and Shell.NavBarHasShadow with AppThemeBinding for light/dark themes. Make sure to use this skill whenever styling Shell navigation in MAUI. Not for tab bars, status bars, or non-Shell navigation patterns."
---

# Cores da Barra de Navegacao no .NET MAUI Shell

> Configure as cores da barra de navegacao no Shell usando AppThemeBinding para light e dark mode com tres propriedades: BackgroundColor, ForegroundColor e NavBarHasShadow.

## Rules

1. **Use Shell.BackgroundColor para cor de fundo da nav bar** — define a cor da barra inteira, porque e ela que controla o background da navigation bar no Shell
2. **Use Shell.ForegroundColor para cor dos icones** — controla a setinha de voltar e outros icones da nav bar, porque sem isso o iOS mostra azul padrao
3. **Sempre use AppThemeBinding** — `{AppThemeBinding Light=X, Dark=Y}` para ambas propriedades, porque o app precisa respeitar light e dark mode
4. **Use NavBarHasShadow=False para remover sombra** — remove a elevacao/relevo da barra, porque o hot reload nao funciona nessa propriedade (requer restart do app)
5. **Aplique no AppShell.xaml** — as propriedades vao no elemento Shell raiz, porque o Shell e o responsavel pela navegacao

## How to write

### AppShell.xaml — Configuracao completa

```xml
<Shell
    Shell.BackgroundColor="{AppThemeBinding Light={StaticResource PageBackgroundColorLight}, Dark={StaticResource PageBackgroundColorDark}}"
    Shell.ForegroundColor="{AppThemeBinding Light={StaticResource PrimaryColorLight}, Dark={StaticResource PrimaryColorDark}}"
    Shell.NavBarHasShadow="False">
```

## Example

**Before (nav bar com cores erradas):**
```xml
<Shell
    x:Class="PlanShare.AppShell"
    xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
    xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml">
    <!-- Nav bar com cor padrao azul/cinza, sombra visivel, setinha branca ou azul -->
```

**After (nav bar correta):**
```xml
<Shell
    x:Class="PlanShare.AppShell"
    xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
    xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
    Shell.BackgroundColor="{AppThemeBinding Light={StaticResource PageBackgroundColorLight}, Dark={StaticResource PageBackgroundColorDark}}"
    Shell.ForegroundColor="{AppThemeBinding Light={StaticResource PrimaryColorLight}, Dark={StaticResource PrimaryColorDark}}"
    Shell.NavBarHasShadow="False">
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Nav bar precisa mesma cor da pagina | Use o mesmo resource de PageBackgroundColor |
| Setinha de voltar com cor errada | Configure ForegroundColor com PrimaryColor |
| Sombra/elevacao na nav bar | `NavBarHasShadow="False"` e reinicie o app |
| Mudanca no NavBarHasShadow nao aparece | Hot reload nao suporta — pare e execute novamente |
| iOS mostra setinha azul | ForegroundColor resolve — codigo unico para ambas plataformas |
| iOS mostra linha separadora na nav bar | Remover exige sobrescrever Shell navigation handler — efeitos colaterais possiveis, avaliar se vale |

## Anti-patterns

| Nunca faca | Faca isso |
|------------|-----------|
| Cor fixa sem AppThemeBinding | `{AppThemeBinding Light=X, Dark=Y}` |
| Codigo separado por plataforma para nav bar | Propriedades do Shell funcionam cross-platform |
| Confiar no hot reload para NavBarHasShadow | Reinicie o app apos alterar essa propriedade |
| Deixar Title no Shell sem necessidade | Remova se nao precisa de titulo na nav bar |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
