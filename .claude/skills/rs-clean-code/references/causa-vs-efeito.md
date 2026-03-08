---
name: rs-clean-code-causa-vs-efeito
description: "Enforces cause-over-effect naming for boolean variables and state flags in JavaScript/TypeScript code. Use when user asks to 'create a state variable', 'add a boolean flag', 'disable a button conditionally', 'show loading state', or 'manage UI state'. Applies the Cause-Root Pattern: name booleans by WHY something happens (isFormSubmitting) not WHAT changes in the UI (isButtonDisabled), because the cause is reusable across multiple UI effects. Make sure to use this skill whenever generating boolean variables, state flags, or conditional UI logic. Not for general variable naming (use rs-clean-code-nomenclatura-de-variaveis), function naming, or non-boolean variables."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: clean-code
  module: premissas-de-escrita
  tags: [naming, booleans, state, react, clean-code, cause-effect]
---

# Causa vs Efeito

> Nomeie variaveis booleanas pela CAUSA (o que esta acontecendo no sistema) e nunca pelo EFEITO (a consequencia visual na interface).

## Rules

1. **Nomeie pela causa, nao pelo efeito** — `isFormSubmitting` nao `isButtonDisabled`, porque a causa e reutilizavel em multiplos contextos enquanto o efeito e especifico de um unico elemento UI
2. **Aplique o teste de reutilizacao** — se a variavel so faz sentido em um unico lugar da UI, provavelmente voce nomeou pelo efeito, porque o nome deveria descrever o estado do sistema
3. **Derive efeitos da causa** — crie variaveis auxiliares derivadas quando necessario (`const shouldDisableButton = isFormSubmitting`), mas a variavel-raiz sempre representa a causa, porque isso mantem uma unica fonte de verdade

## How to write

### Cause-Root Pattern

```typescript
// A variavel descreve O QUE ESTA ACONTECENDO no sistema
const isFormSubmitting = true

// Derive efeitos quando necessario
const shouldDisableButton = isFormSubmitting
const buttonLabel = isFormSubmitting ? 'Carregando...' : 'Enviar'
```

### Uso em componente React

```tsx
function Button() {
  const isFormSubmitting = useFormStatus()

  return (
    <button disabled={isFormSubmitting}>
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

## Troubleshooting

### Booleano parece correto mas acopla ao componente
**Symptom:** Variavel `isModalOpen` funciona no componente atual mas nao faz sentido em outro lugar
**Cause:** O nome descreve o efeito visual (modal aberto) em vez da razao de negocio
**Fix:** Pergunte "o que CAUSA o modal abrir?" e nomeie por isso: `hasUnsavedChanges`, `isSessionExpired`

### Multiplos efeitos do mesmo booleano com nomes inconsistentes
**Symptom:** `isButtonDisabled` controla disabled do botao E texto do botao E spinner — leitura confusa
**Cause:** O booleano foi nomeado pelo primeiro efeito percebido, nao pela causa raiz
**Fix:** Renomeie para a causa (`isFormSubmitting`) e derive efeitos explicitamente: `const shouldDisableButton = isFormSubmitting`

## Deep reference library

- [deep-explanation.md](../../../data/skills/clean-code/rs-clean-code-causa-vs-efeito/references/deep-explanation.md) — Raciocinio completo do instrutor sobre a analogia do formulario e reutilizacao
- [code-examples.md](../../../data/skills/clean-code/rs-clean-code-causa-vs-efeito/references/code-examples.md) — Exemplos expandidos: modal, input, loading state, padrao de derivacao
