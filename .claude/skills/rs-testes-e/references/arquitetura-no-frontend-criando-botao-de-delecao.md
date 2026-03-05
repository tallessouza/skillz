---
name: rs-testes-arquitetura-criando-botao-delecao
description: "Enforces TDD workflow for implementing delete confirmation dialogs in React/Next.js components. Use when user asks to 'add delete button', 'implement deletion', 'create confirmation modal', 'add AlertDialog', or 'remove item with confirmation'. Applies TDD cycle: failing test first, minimal code to pass, then refactor. Ensures destructive actions always use confirmation dialogs with loading states. Make sure to use this skill whenever implementing any destructive action UI in React. Not for API route implementation, database deletion logic, or non-UI deletion concerns."
---

# Botao de Delecao com TDD

> Toda acao destrutiva exige confirmacao via dialog, implementada seguindo o ciclo TDD: teste que falha → codigo minimo → refatoracao.

## Rules

1. **Teste primeiro, UI depois** — escreva o teste que verifica o comportamento esperado antes de criar qualquer componente, porque o teste guia a implementacao e garante cobertura desde o inicio
2. **Acoes irreversiveis exigem confirmacao** — nunca delete diretamente ao clicar; use AlertDialog ou modal de confirmacao, porque o usuario pode clicar sem querer
3. **Codigo minimo para passar o teste** — no ciclo TDD, implemente apenas o necessario para o teste ficar verde, porque isso evita over-engineering e mantem o foco
4. **Refatore somente apos verde** — melhore a implementacao (substituir `<p>` por AlertDialog real) apenas quando o teste ja esta passando, porque refatorar com teste quebrado gera confusao
5. **Botoes de acao destrutiva precisam de acessibilidade** — use `title` e `aria-label` descritivos no botao, porque screen readers e testes dependem disso
6. **Estado de loading durante delecao** — mostre icone de carregamento e desabilite o botao enquanto a acao esta em andamento, porque evita cliques duplicados

## How to write

### Teste TDD para delete dialog

```typescript
it('should open the delete confirmation dialog', async () => {
  const user = userEvent.setup()
  makeSut({ prompt })

  const deleteButton = screen.getByRole('button', { name: /remover prompt/i })
  await user.click(deleteButton)

  expect(screen.getByText(/remover prompt/i)).toBeInTheDocument()
})
```

### Botao de delete com AlertDialog

```tsx
<AlertDialog>
  <AlertDialogTrigger asChild>
    <Button variant="icon" size="icon" title="Remover prompt" aria-label="Remover prompt">
      <DeleteIcon className="w-3 h-3" />
    </Button>
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Remover prompt</AlertDialogTitle>
      <AlertDialogDescription>
        Tem certeza que deseja remover este prompt? Essa ação não pode ser desfeita.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancelar</AlertDialogCancel>
      <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
        {isDeleting && <LoadingIcon className="mr-2 h-4 w-4 animate-spin" />}
        Remover
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

## Example

**Before (sem confirmacao — perigoso):**
```tsx
<Button onClick={handleDelete}>
  <Trash className="w-3 h-3" />
</Button>
```

**After (com confirmacao e loading):**
```tsx
const [isDeleting, setIsDeleting] = useState(false)

const handleDelete = async () => {
  setIsDeleting(true)
  // logica de delecao
}

<AlertDialog>
  <AlertDialogTrigger asChild>
    <Button variant="icon" size="icon" title="Remover prompt" aria-label="Remover prompt">
      <Trash className="w-3 h-3" />
    </Button>
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Remover prompt</AlertDialogTitle>
      <AlertDialogDescription>
        Tem certeza que deseja remover este prompt? Essa ação não pode ser desfeita.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancelar</AlertDialogCancel>
      <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
        {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Remover
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Acao irreversivel (delete, reset) | Sempre usar AlertDialog com confirmacao |
| Ciclo TDD | Teste falha → codigo minimo → refatora |
| Codigo minimo pra passar teste | Pode ser um `<p>` com texto — refatore depois |
| Botao so com icone | Adicionar `title` e `aria-label` para acessibilidade e testabilidade |
| Acao assincrona no dialog | Mostrar loading icon + desabilitar botao |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `<button onClick={deleteItem}>X</button>` | AlertDialog com confirmacao antes de deletar |
| Implementar UI completa sem teste | Teste primeiro, depois codigo minimo |
| `getByRole('button')` sem name | `getByRole('button', { name: /remover prompt/i })` |
| Refatorar enquanto teste esta vermelho | Fazer teste passar primeiro, depois refatorar |
| Deletar sem feedback visual de loading | `isDeleting` state + `Loader2` animado |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/testes-e/rs-testes-e-arquitetura-no-frontend-criando-botao-de-delecao/references/deep-explanation.md)
- [Code examples](../../../data/skills/testes-e/rs-testes-e-arquitetura-no-frontend-criando-botao-de-delecao/references/code-examples.md)
