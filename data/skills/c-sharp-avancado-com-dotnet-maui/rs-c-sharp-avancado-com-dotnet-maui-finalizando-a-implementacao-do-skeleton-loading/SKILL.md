---
name: rs-csharp-dotnet-maui-skeleton-loading
description: "Applies skeleton loading implementation patterns in .NET MAUI XAML apps. Use when user asks to 'add skeleton loading', 'implement loading placeholder', 'create shimmer effect', 'loading state UI', or 'skeleton screen' in XAML/.NET MAUI projects. Covers XAML file copying pitfalls, namespace syncing, component reuse for loading states, and button disabling during load. Make sure to use this skill whenever building loading feedback in .NET MAUI. Not for web skeleton loading, React/CSS shimmer, or non-XAML frameworks."
---

# Skeleton Loading em .NET MAUI

> Crie componentes de skeleton loading que replicam a forma exata dos elementos reais, reutilizando componentes existentes com SkeletonView no lugar dos inputs.

## Rules

1. **Skeleton deve ter o mesmo shape do elemento real** — mesma largura, altura similar e posicao, porque o usuario nao deve perceber mudanca drastica quando os dados carregam
2. **Reutilize componentes existentes trocando o input pelo SkeletonView** — copie o componente (ex: EntryLabelComponent), remova propriedades desnecessarias (placeholder, keyboard, text value), mantenha apenas o titulo, porque isso garante consistencia visual
3. **BoxView sem largura explicita ocupa todo o espaco disponivel** — nao precisa definir WidthRequest quando o skeleton deve ocupar a largura total, porque BoxView herda o comportamento de fill
4. **Ajuste altura com testes visuais, nao apenas pelo Figma** — use o valor do design como ponto de partida e refine executando o app, porque valores no Figma nem sempre correspondem ao render real
5. **Botoes na tela de loading devem estar desabilitados** — use `IsEnabled="False"` em todos os botoes exibidos durante o skeleton load, porque evita acoes indesejadas como navegacao durante carregamento
6. **Ao copiar arquivos XAML, atualize 4 lugares** — nome do arquivo XAML, nome do arquivo CodeBehind, nome da classe no CodeBehind, e o atributo `x:Class` no XAML, porque inconsistencia causa erros de compilacao

## How to write

### Componente Skeleton reutilizavel (a partir de componente existente)

```xml
<!-- EntryLabelComponent em Views/Components/Skeletons/ -->
<ContentView xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
             xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
             xmlns:skeleton="clr-namespace:PlanShare.App.Views.Components.Skeletons"
             x:Class="PlanShare.App.Views.Components.Skeletons.EntryLabelComponent">
    <VerticalStackLayout>
        <Label Text="{Binding Title, Source={x:Reference this}}" />
        <skeleton:SkeletonView HeightRequest="38" CornerRadius="3" />
    </VerticalStackLayout>
</ContentView>
```

### Usando skeleton components na pagina

```xml
<!-- UserProfilePage.xaml - dentro do VerticalStackLayout de loading -->
<skeleton:SkeletonView ... /> <!-- Avatar -->
<Border>...</Border>

<!-- Apos o border do avatar -->
<skeleton:EntryLabelComponent Title="Nome" Margin="0,5,0,0" />
<skeleton:EntryLabelComponent Title="E-mail" />

<!-- Botoes desabilitados durante loading -->
<Button Text="Alterar Senha" IsEnabled="False" />
<Button Text="Atualizar Perfil" IsEnabled="False" />
<Button Text="Deletar Conta" IsEnabled="False" />
```

## Example

**Before (sem skeleton, ou skeleton inconsistente):**
```xml
<!-- Tela de loading vazia ou com ActivityIndicator generico -->
<ActivityIndicator IsRunning="True" />
```

**After (skeleton loading fiel ao layout real):**
```xml
<VerticalStackLayout IsVisible="{Binding IsLoading}">
    <skeleton:SkeletonView WidthRequest="120" HeightRequest="120"
                           CornerRadius="60" />
    <skeleton:EntryLabelComponent Title="Nome" Margin="0,5,0,0" />
    <skeleton:EntryLabelComponent Title="E-mail" />
    <Button Text="Atualizar Perfil" IsEnabled="False" />
</VerticalStackLayout>
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Elemento ocupa largura total | Nao defina WidthRequest no SkeletonView |
| Skeleton parece "quadrado" demais | Adicione CornerRadius pequeno (3-5) |
| Posicao muda quando dados carregam | Ajuste Margin no skeleton para alinhar com elemento real |
| Pagina tem botoes de acao | Inclua os botoes com `IsEnabled="False"` |
| Copiou arquivo XAML para outra pasta | Atualize namespace no CodeBehind E `x:Class` no XAML |
| Sync Namespaces nao funciona | Em projetos .NET MAUI, altere manualmente (funciona em outros tipos de projeto) |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| Deixar botoes habilitados no skeleton load | `IsEnabled="False"` em todos os botoes |
| Copiar XAML sem atualizar namespace e x:Class | Atualize os 4 lugares: arquivo XAML, arquivo CodeBehind, nome da classe, x:Class |
| Usar ActivityIndicator generico para paginas com layout definido | Crie skeleton que replica o shape dos elementos reais |
| Confiar 100% nos valores do Figma para altura | Use como ponto de partida e ajuste testando no dispositivo |
| Esquecer margem entre skeleton e elemento real | Teste a transicao skeleton → dados e ajuste Margin |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
