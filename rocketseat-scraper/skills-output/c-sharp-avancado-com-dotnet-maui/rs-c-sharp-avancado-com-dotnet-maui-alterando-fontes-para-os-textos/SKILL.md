---
name: rs-csharp-maui-fontes-textos
description: "Applies custom font configuration in .NET MAUI projects when user asks to 'add fonts', 'change typography', 'configure fonts in MAUI', 'customize text appearance', or 'use Google Fonts in dotnet'. Covers font file setup, MauiProgram registration with aliases, and FontFamily usage in XAML. Make sure to use this skill whenever working with text styling or font management in .NET MAUI apps. Not for CSS fonts, web typography, or Xamarin.Forms legacy projects."
---

# Fontes em .NET MAUI

> Registre cada fonte com alias no MauiProgram e referencie pelo alias no XAML — nunca pelo nome do arquivo.

## Conceitos essenciais

1. **Fonte = personalidade do caractere** — define desenho, espacamento, altura relativa, nao apenas a forma visual
2. **Font Family = conjunto de variacoes** — regular, italico, bold, bold-italic sao variacoes da mesma familia
3. **Peso (weight) = espessura** — quanto maior o peso, mais espesso o caractere (Thin=100, Regular=400, Bold=700, Black=900)
4. **Cada peso = um arquivo TTF** — True Type Font, um arquivo por variacao

## Rules

1. **Maximo 2 familias de fonte por app** — mais que isso gera poluicao visual, porque o usuario nao percebe diferencas sutis e o app perde coerencia
2. **Nao use todos os pesos** — selecione apenas Regular, Bold e no maximo Thin/Black, porque pesos proximos (400 vs 500) sao indistinguiveis visualmente
3. **Sempre configure via alias** — registre no `MauiProgram.cs` com alias legivel, porque referenciar arquivo TTF diretamente no XAML causa erros silenciosos
4. **Confirme build action = MauiFont** — ao adicionar TTF em `Resources/Fonts/`, verifique Properties > Build Action, porque sem isso a fonte e ignorada silenciosamente
5. **Use Google Fonts para fontes gratuitas** — fonts.google.com oferece fontes livres de direitos, porque fontes comerciais exigem licenca

## How to write

### Registrar fontes no MauiProgram.cs

```csharp
// Cada .AddFont recebe: (nomeArquivo.ttf, alias)
builder
    .UseMauiApp<App>()
    .ConfigureFonts(fonts =>
    {
        fonts.AddFont("Halloway-Black.ttf", "HallowayBlack");
        fonts.AddFont("Halloway-Regular.ttf", "HallowayRegular");
        fonts.AddFont("Halloway-Thin.ttf", "HallowayThin");
        fonts.AddFont("WorkSans-Black.ttf", "WorkSansBlack");
        fonts.AddFont("WorkSans-Regular.ttf", "WorkSansRegular");
    });
```

### Usar fonte no XAML

```xml
<!-- Referencia pelo alias, nunca pelo nome do arquivo -->
<Label
    Text="Tarefas pequenas, grandes resultados"
    FontFamily="HallowayBlack"
    FontSize="18"
    HorizontalOptions="Center" />
```

## Example

**Before (fonte default do sistema):**
```xml
<Label Text="Titulo do App" FontSize="24" />
<Label Text="Descricao aqui" FontSize="14" />
```

**After (com fontes customizadas):**
```xml
<Label Text="Titulo do App" FontFamily="HallowayBlack" FontSize="24" />
<Label Text="Descricao aqui" FontFamily="WorkSansRegular" FontSize="14" />
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Titulo principal | Use peso Black ou Bold para destaque |
| Texto corrido | Use peso Regular para leitura confortavel |
| Quer verificar se fonte aplicou | Compare caractere especifico (W, R) entre com e sem FontFamily |
| Precisa da fonte em Figma/Photoshop | Instale o TTF no SO (Windows: duplo clique > Instalar) |
| Alias digitado errado no XAML | Fonte cai silenciosamente para default — sempre copie do MauiProgram |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| Usar 4+ familias de fonte diferentes | Maximo 2 familias |
| Referenciar `"Halloway-Black.ttf"` no XAML | Usar alias `"HallowayBlack"` registrado no MauiProgram |
| Escrever alias manualmente em cada Label | Centralizar em estilos globais (proximas aulas) |
| Adicionar TTF sem conferir Build Action | Conferir Properties > Build Action = MauiFont |
| Usar todos os 9 pesos de uma fonte | Selecionar 2-3 pesos necessarios |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
