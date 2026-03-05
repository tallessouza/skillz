---
name: rs-csharp-maui-resource-text
description: "Applies .NET MAUI text resource file patterns for centralization and localization when writing XAML or C# code. Use when user asks to 'add translations', 'localize app', 'centralize strings', 'create resource files', 'support multiple languages in MAUI', or 'organize text strings'. Enforces resx file naming conventions, public access modifiers, and x:Static binding syntax. Make sure to use this skill whenever creating or modifying text displayed to users in .NET MAUI apps. Not for exception messages, logging, or non-UI string constants."
---

# Resources de Texto no .NET MAUI

> Centralize todos os textos exibidos ao usuario em arquivos .resx, nunca hardcode strings em XAML.

## Rules

1. **Crie arquivos .resx na pasta Resources** — nomeie como `ResourceTexts.resx` para o idioma neutro, porque centraliza todos os textos de UI em um unico local
2. **Use chave-valor sem espacos na chave** — `login_with_email_password` nao `login with email`, porque chaves sao identificadores de codigo
3. **Defina um idioma neutro como fallback** — o arquivo sem sufixo de idioma (ex: `ResourceTexts.resx`) sera usado quando o dispositivo estiver em um idioma sem suporte
4. **Nomeie arquivos traduzidos com a tag correta** — `ResourceTexts.pt-BR.resx` para portugues Brasil, seguindo a tabela de Language Tags da Microsoft (MS-LCID)
5. **Configure o access modifier como Public** — sem isso, o XAML nao consegue acessar as chaves via `x:Static`, porque o arquivo gera uma classe interna por padrao
6. **Prefira localizacao especifica a generalizada** — crie `pt-BR` em vez de apenas `pt`, porque conjugacoes e palavras variam entre paises lusofonos

## How to write

### Arquivo .resx neutro (ingles como fallback)

```xml
<!-- ResourceTexts.resx -->
<data name="login_with_email_password" xml:space="preserve">
  <value>Login with e-mail and password</value>
</data>
<data name="subtitle_register_account" xml:space="preserve">
  <value>Control your routine with ease</value>
</data>
```

### Arquivo .resx localizado

```xml
<!-- ResourceTexts.pt-BR.resx -->
<data name="login_with_email_password" xml:space="preserve">
  <value>Login com e-mail e senha</value>
</data>
<data name="subtitle_register_account" xml:space="preserve">
  <value>Comande sua rotina aqui com facilidade</value>
</data>
```

### Declarar namespace no XAML

```xml
<ContentPage
    xmlns:resourcefile="clr-namespace:PlanShare.App.Resources">
```

### Usar texto via x:Static

```xml
<Button Text="{x:Static resourcefile:ResourceTexts.login_with_email_password}" />
<Label Text="{x:Static resourcefile:ResourceTexts.subtitle_register_account}" />
```

### Forcar Public no .csproj (se IDE nao oferecer opcao)

```xml
<ItemGroup>
  <EmbeddedResource Update="Resources\ResourceTexts.resx">
    <Generator>PublicResXFileCodeGenerator</Generator>
  </EmbeddedResource>
</ItemGroup>
```

## Example

**Before (strings hardcoded no XAML):**
```xml
<Button Text="Login com e-mail e senha" />
<Label Text="Comande sua rotina aqui com facilidade" />
```

**After (com resource files):**
```xml
<ContentPage xmlns:resourcefile="clr-namespace:PlanShare.App.Resources">
    <Button Text="{x:Static resourcefile:ResourceTexts.login_with_email_password}" />
    <Label Text="{x:Static resourcefile:ResourceTexts.subtitle_register_account}" />
</ContentPage>
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Texto visivel ao usuario em XAML | Mover para .resx e usar `x:Static` |
| App precisa suportar novo idioma | Criar novo .resx com tag de idioma correta (consultar MS-LCID) |
| Texto compartilhado entre telas | Uma unica chave no .resx, reutilizar via `x:Static` |
| Idioma do dispositivo sem suporte | O arquivo neutro (sem sufixo) sera usado automaticamente |
| App em background ao trocar idioma | Usuario precisa fechar e reabrir o app para ver a traducao |

## Anti-patterns

| Nunca faca | Faca assim |
|------------|------------|
| `Text="Login com e-mail"` hardcoded | `Text="{x:Static resourcefile:ResourceTexts.login_key}"` |
| Chave com espacos: `login email` | Chave com underscore: `login_with_email_password` |
| Access modifier Internal no .resx | Alterar para Public (ou usar `PublicResXFileCodeGenerator`) |
| Arquivo generico `ResourceTexts.pt.resx` | Arquivo especifico `ResourceTexts.pt-BR.resx` |
| Duplicar strings iguais em multiplos XAMLs | Uma chave no .resx, reutilizar em todas as telas |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
