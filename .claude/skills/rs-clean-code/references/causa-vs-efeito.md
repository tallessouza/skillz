---
name: rs-clean-code-causa-vs-efeito
description: "Enforces cause-over-effect naming for boolean variables in any codebase. Use when user asks to 'create a state variable', 'add a boolean flag', 'disable a button', 'show loading state', or any UI state management. Applies rule: name booleans by WHY something happens (isFormSubmitting) not WHAT happens in the UI (isButtonDisabled). Make sure to use this skill whenever generating boolean variables or state flags, even if the user doesn't mention naming. Not for general variable naming, function naming, or non-boolean variables."
---

# Causa vs Efeito

> Nomeie variaveis booleanas pela CAUSA (o que esta acontecendo) e nunca pelo EFEITO (a consequencia na interface).

## Rules

1. **Nomeie pela causa, nao pelo efeito** — `isFormSubmitting` nao `isButtonDisabled`, porque a causa e reutilizavel em multiplos contextos, o efeito e especifico de um unico elemento
2. **Teste de reutilizacao** — se a variavel so faz sentido em um unico lugar da UI, provavelmente voce nomeou pelo efeito
3. **Derive efeitos da causa** — crie variaveis auxiliares derivadas se necessario, mas a variavel-raiz sempre representa a causa

## How to write

### Booleano pela causa

```typescript
// A variavel descreve O QUE ESTA ACONTECENDO no sistema
const isFormSubmitting = true

// Derive efeitos quando necessario
const shouldDisableButton = isFormSubmitting
const buttonLabel = isFormSubmitting ? 'Carregando...' : 'Enviar'
```

### Uso em componente

```tsx
function Button() {
  const isFormSubmitting = useFormStatus()

  return (
    <button disabled={isFormSubmitting}>
      <span>icon</span>
      {isFormSubmitting ? 'Carregando...' : 'Enviar'}
    </button>
  )
}
```

## Example

**Before (nomeado pelo efeito):**
```typescript
const isButtonDisabled = true

<button disabled={isButtonDisabled}>
  {isButtonDisabled ? 'Carregando...' : 'Enviar'}
</button>
// Problema: "se o botao esta desabilitado, mostro carregando" — nao faz sentido logico
```

**After (nomeado pela causa):**
```typescript
const isFormSubmitting = true

<button disabled={isFormSubmitting}>
  {isFormSubmitting ? 'Carregando...' : 'Enviar'}
</button>
// Claro: "se o formulario esta enviando, desabilito o botao E mostro carregando"
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Estado controla um unico elemento UI | Ainda nomeie pela causa — derive o efeito se quiser |
| Estado controla multiplos elementos UI | Causa obrigatoria — e o unico nome que faz sentido em todos os contextos |
| Nome do booleano menciona elemento UI (button, modal, input) | Provavelmente e efeito — repense |
| Nome do booleano descreve acao do sistema (submitting, loading, fetching) | Correto — e a causa |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `isButtonDisabled` | `isFormSubmitting` |
| `isModalVisible` | `hasUnsavedChanges` |
| `isInputReadOnly` | `isProcessingPayment` |
| `isSpinnerShowing` | `isDataLoading` |
| `isOverlayActive` | `isFileUploading` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/clean-code/rs-clean-code-causa-vs-efeito/references/deep-explanation.md)
- [Code examples](../../../data/skills/clean-code/rs-clean-code-causa-vs-efeito/references/code-examples.md)
