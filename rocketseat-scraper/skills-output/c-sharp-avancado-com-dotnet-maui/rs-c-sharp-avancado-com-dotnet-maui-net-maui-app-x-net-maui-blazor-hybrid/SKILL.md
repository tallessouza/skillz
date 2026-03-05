---
name: rs-csharp-maui-app-vs-blazor-hybrid
description: "Guides architectural decisions between .NET MAUI App (XAML) and .NET MAUI Blazor Hybrid (HTML/CSS) when building cross-platform mobile applications. Use when user asks to 'create a MAUI project', 'choose between XAML and Blazor', 'build a mobile app with .NET', or 'start a .NET MAUI application'. Make sure to use this skill whenever the user is deciding which .NET MAUI template to use or comparing native vs hybrid rendering approaches. Not for web-only Blazor Server/WASM apps, Xamarin.Forms migration, or general C# backend development."
---

# .NET MAUI App vs .NET MAUI Blazor Hybrid

> Escolha .NET MAUI App (XAML) para desempenho nativo e .NET MAUI Blazor Hybrid (HTML/CSS) para reaproveitar conhecimento web — a decisao impacta rendering, performance e arquitetura do projeto inteiro.

## Key concept

A Microsoft criou dois caminhos para o .NET MAUI atendendo dois perfis de desenvolvedor:

1. **Desenvolvedores com background em XML/XAML** (vindos de Android com Java/XML, WPF, Xamarin) → .NET MAUI App com XAML
2. **Desenvolvedores com background web** (HTML/CSS/JavaScript) → .NET MAUI Blazor Hybrid com componentes Blazor

XAML e uma versao melhorada do XML que permite inclusive regras de negocio dentro das tags. Blazor Hybrid renderiza dentro de uma WebView — como um navegador embutido no app.

## Decision framework

| Quando voce tem | Escolha | Porque |
|-----------------|---------|--------|
| Background em XML, WPF, Xamarin | .NET MAUI App (XAML) | Curva de aprendizado menor, evolucao natural |
| Background em HTML/CSS | .NET MAUI Blazor Hybrid | Reutiliza conhecimento web existente |
| Requisito de performance critica | .NET MAUI App (XAML) | Compila para componentes nativos |
| App que ja tem componentes Blazor web | .NET MAUI Blazor Hybrid | Reutiliza componentes existentes |
| Necessidade de UI nativa pura | .NET MAUI App (XAML) | Sem overhead de WebView |

## How to think about it

### Rendering nativo vs WebView

.NET MAUI App compila XAML para componentes nativos da plataforma — botoes, labels e inputs sao elementos nativos do Android/iOS. Blazor Hybrid renderiza HTML/CSS dentro de uma WebView, como se o app fosse um navegador exibindo sua tela. Isso gera impacto mensuravel em performance.

### XAML nao e XML puro

XAML e uma evolucao do XML. Diferente do XML basico usado no Android com Java, XAML permite data binding, triggers, conversores e ate logica condicional diretamente nas tags — tornando a camada visual mais inteligente.

### Conexao logica + visual

Em ambas abordagens, C# e a linguagem da logica. A diferenca esta na camada visual:
- MAUI App: C# (logica) + XAML (visual)
- Blazor Hybrid: C# (logica via Blazor) + HTML/CSS (visual)

## Common misconceptions

| Pensam | Realidade |
|--------|-----------|
| Blazor Hybrid e melhor porque HTML e mais popular | Performance e inferior por causa da WebView — depende do caso de uso |
| XAML e ultrapassado | XAML evoluiu significativamente, suporta regras de negocio inline e data binding avancado |
| Hibrido significa misturar XAML com HTML | Hibrido significa usar componentes Blazor (web) dentro de um app nativo |
| Preciso escolher um e nunca mudar | E possivel migrar, mas a escolha inicial impacta toda a arquitetura |

## Comparison table

| Aspecto | .NET MAUI App | .NET MAUI Blazor Hybrid |
|---------|---------------|------------------------|
| Interface grafica | XAML | HTML + CSS |
| Codigo reutilizavel | C# (logica) + XAML (visual) | Componentes Blazor + logica web |
| Desempenho | Melhor — componentes nativos | Impacto — renderiza em WebView |
| Background ideal | XML, WPF, Xamarin, Android/Java | HTML, CSS, desenvolvimento web |

## When to apply

- Inicio de projeto .NET MAUI — escolha do template
- Avaliacao de stack para app mobile cross-platform
- Decisao entre performance nativa vs produtividade web
- Planejamento de migracao de Xamarin.Forms

## Limitations

- Esta skill nao cobre implementacao de XAML ou Blazor — apenas a decisao arquitetural
- Blazor Hybrid pode evoluir e reduzir o gap de performance em versoes futuras do .NET
- Projetos muito simples podem nao sentir diferenca pratica entre as abordagens

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
