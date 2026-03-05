# Deep Explanation: Criando Páginas .NET MAUI com ViewModel

## Por que 3 passos obrigatórios?

O instrutor enfatiza que existem **exatamente 3 passos** que nunca podem ser pulados ao criar uma nova página:

1. **CodeBehind bind** — O construtor da página recebe a ViewModel via injeção de dependência e faz `BindingContext = viewModel`. Sem isso, nenhum binding no XAML funciona.

2. **XAML namespace reference** — O `xmlns:viewmodel` no XAML não é apenas decoração. Ele permite que o Visual Studio faça autocomplete de propriedades e comandos da ViewModel. Sem isso, você perde toda a ajuda do IDE e pode ter erros silenciosos de binding.

3. **MauiProgram registration** — Tanto a ViewModel quanto a Page precisam ser registradas no container de DI. A rota também precisa ser registrada. Se qualquer um faltar, a navegação falha silenciosamente ou lança exceção em runtime.

## `sealed` vs `partial` — a explicação do instrutor

O instrutor demonstrou o modificador `sealed` na ViewModel para fins didáticos:

- `sealed` **bloqueia herança** — nenhuma outra classe pode herdar da classe selada
- Se colocar `sealed` no `ViewModelBase`, o compilador acusaria erro porque `ChangeUserPasswordViewModel` herda dele
- O correto para ViewModels que usam CommunityToolkit é `partial`, porque o source generator precisa criar uma classe parcial complementar com o código gerado

O instrutor colocou `sealed` propositalmente errado para explicar o conceito e depois corrigiu para `partial`.

## Estratégia de reutilização de UI

O instrutor demonstra uma abordagem pragmática: ao criar a página de alterar senha, ele **copiou o VerticalStackLayout inteiro da página de registro** e foi removendo o que não precisava:

- Manteve: animação de loading, componente de senha, título
- Removeu: campos de email, nome, subtítulo
- Adaptou: textos, bindings, margens

Essa estratégia garante consistência visual e economiza tempo. O instrutor calcula margens somando: se o `Spacing` do StackLayout é 30 e precisa de 70 de margem total, coloca `Margin` de 40 (40 + 30 = 70).

## Teste incremental

O instrutor faz questão de testar em **dois momentos**:

1. **Após configurar navegação** (antes de criar componentes) — testa só com o label "Welcome to .NET MAUI" padrão para garantir que os 3 passos foram feitos corretamente
2. **Após criar os componentes** — testa a aparência visual completa

Essa abordagem evita debugging complexo: se a navegação falha, você sabe que é problema de configuração, não de UI.

## Estrutura de pastas

O instrutor segue uma convenção rigorosa de pastas espelhadas:

```
ViewModels/Pages/User/ChangePassword/ChangeUserPasswordViewModel.cs
Views/Pages/User/ChangePassword/ChangeUserPasswordPage.xaml
```

A pasta `ChangePassword` agrupa ViewModel e Page do mesmo feature. O sufixo `ViewModel` e `Page` diferencia os arquivos.

## Model separado para formulários

Para formulários com múltiplos campos, o instrutor cria uma classe Model:

```csharp
public class ChangePassword
{
    public string CurrentPassword { get; set; }
    public string NewPassword { get; set; }
}
```

Essa classe é usada como `[ObservableProperty]` na ViewModel, permitindo binding direto no XAML via `Model.CurrentPassword` e `Model.NewPassword`.

## Resource files para textos

Todos os textos da UI (títulos, labels, placeholders) são armazenados em resource files, não hardcoded no XAML. O instrutor já tinha preparado as chaves como `ChangePassword`, `CurrentPassword`, `NewPassword` antes de começar a implementação.