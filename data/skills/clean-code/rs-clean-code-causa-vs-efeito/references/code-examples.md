# Code Examples: Causa vs Efeito

## Exemplo original da aula (React)

### Versao com efeito (problema)

```tsx
function Button() {
  const isButtonDisabled = true

  return (
    <button disabled={isButtonDisabled}>
      <span>icon</span>
      {isButtonDisabled ? 'Carregando...' : 'Enviar'}
    </button>
  )
}
```

Problema: a linha `isButtonDisabled ? 'Carregando...'` nao faz sentido semantico. Por que um botao desabilitado implica em "carregando"?

### Versao com causa (correta)

```tsx
function Button() {
  const isFormSubmitting = true

  return (
    <button disabled={isFormSubmitting}>
      <span>icon</span>
      {isFormSubmitting ? 'Carregando...' : 'Enviar'}
    </button>
  )
}
```

Agora ambos os usos fazem sentido: "quando o formulario esta enviando, desabilita o botao" e "quando o formulario esta enviando, mostra 'Carregando'".

## Variacoes em outros contextos

### Modal de confirmacao

```typescript
// EFEITO (errado)
const isModalVisible = true
const isOverlayShowing = true

// CAUSA (correto)
const hasUnsavedChanges = true
// Derive: mostrar modal, mostrar overlay, bloquear navegacao
```

### Campo de input

```typescript
// EFEITO (errado)
const isInputReadOnly = true

// CAUSA (correto)
const isProcessingPayment = true
// Derive: input readonly, botao desabilitado, spinner visivel
```

### Loading state

```typescript
// EFEITO (errado)
const isSpinnerShowing = true

// CAUSA (correto)
const isDataLoading = true
// Derive: mostrar spinner, esconder conteudo, desabilitar filtros
```

## Padrao de derivacao

Quando voce precisa de nomes especificos para efeitos, derive da causa:

```typescript
// Causa raiz
const isFormSubmitting = true

// Efeitos derivados (opcionais, para clareza)
const shouldDisableSubmitButton = isFormSubmitting
const shouldShowLoadingSpinner = isFormSubmitting
const submitButtonLabel = isFormSubmitting ? 'Enviando...' : 'Enviar'
```

Isso mantem a causa como fonte de verdade e torna explicito que os efeitos sao consequencias.