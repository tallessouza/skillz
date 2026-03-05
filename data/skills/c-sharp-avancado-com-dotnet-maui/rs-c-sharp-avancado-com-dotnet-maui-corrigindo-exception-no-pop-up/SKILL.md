---
name: rs-csharp-maui-popup-dismiss-exception
description: "Guards against null return exceptions in .NET MAUI popups by enforcing CanBeDismissedByTappingOutsideOfPopup configuration. Use when user asks to 'create a popup', 'show popup', 'implement popup', 'fix popup crash', or 'handle popup result' in .NET MAUI or C# mobile apps. Ensures popups that require a typed result cannot be dismissed without a valid selection. Make sure to use this skill whenever implementing popups with return values in MAUI. Not for alerts, toast notifications, or popups without return values."
---

# Corrigindo Exception no PopUp (.NET MAUI)

> Quando um popup exige um resultado tipado, bloqueie o fechamento por toque externo e force o usuario a escolher uma opcao valida.

## Rules

1. **Popup com resultado tipado nunca permite dismiss por toque externo** — configure `CanBeDismissedByTappingOutsideOfPopup = false`, porque o toque externo retorna `null` e `null` nao converte para enum, causando crash
2. **Sempre inclua opcao "Cancelar" (None)** — quando bloquear dismiss externo, o usuario precisa de uma saida explicita que retorne um valor valido do enum
3. **Enum de opcoes deve ter valor None/Cancel** — porque o cenario "nao quero fazer nada" precisa de representacao tipada, nunca null
4. **Popups sem resultado tipado podem manter dismiss padrao** — nem todo popup precisa de resultado; so bloqueie quando ha return tipado esperado

## How to write

### Popup com resultado obrigatorio

```csharp
// No servico de navegacao/popup
var popup = new MyPopup();

// BLOQUEAR dismiss externo quando resultado e obrigatorio
var result = await Shell.Current.ShowPopupAsync<ChooseFileOption>(
    popup,
    canBeDismissedByTappingOutsideOfPopup: false
);

// result nunca sera null — sempre tera um valor valido do enum
return result;
```

### Enum com opcao None

```csharp
public enum ChooseFileOption
{
    None,           // Cancelar / nao fazer nada
    TakePicture,
    UploadFromGallery,
    DeletePhoto
}
```

## Example

**Before (crash ao tocar fora do popup):**
```csharp
// CanBeDismissedByTappingOutsideOfPopup = true (default)
var result = await Shell.Current.ShowPopupAsync<ChooseFileOption>(popup);
// Se usuario toca fora → result = null → exception ao converter para enum
```

**After (sem crash):**
```csharp
var result = await Shell.Current.ShowPopupAsync<ChooseFileOption>(
    popup,
    canBeDismissedByTappingOutsideOfPopup: false
);
// Usuario obrigado a escolher uma opcao → resultado sempre valido
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Popup retorna enum/tipo especifico | Bloquear dismiss externo, incluir opcao Cancel/None |
| Popup so exibe informacao (sem retorno) | Manter dismiss externo habilitado (default) |
| Popup com multiplas opcoes obrigatorias | Sempre ter botao "Cancelar" como saida segura |
| App crashando ao fechar popup | Verificar se resultado null esta sendo convertido para tipo nao-nullable |

## Anti-patterns

| Nunca faca | Faca isso |
|------------|-----------|
| Deixar dismiss externo ativo em popup com resultado tipado | `canBeDismissedByTappingOutsideOfPopup: false` |
| Tentar tratar null com try-catch no caller | Impedir que null seja retornado na origem |
| Criar popup com retorno tipado sem opcao "Cancelar" | Incluir `None` no enum para saida segura |
| Ignorar o cenario de toque fora do popup durante testes | Testar explicitamente o dismiss externo |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
