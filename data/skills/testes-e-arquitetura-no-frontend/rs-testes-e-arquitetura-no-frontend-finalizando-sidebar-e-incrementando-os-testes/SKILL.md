---
name: rs-testes-arquitetura-frontend-sidebar-testes
description: "Enforces testing patterns for Next.js sidebar components with URL state sync. Use when user asks to 'test a sidebar', 'test form submission', 'spy on submit', 'test URL params on mount', 'increase test coverage', or 'test component with search params'. Applies patterns: requestSubmit spy via HTMLFormElement.prototype, auto-submit on mount with useEffect, URL search params mocking, coverage exclusion of generated files. Make sure to use this skill whenever testing components that sync state with URL parameters. Not for API route testing, E2E tests, or backend unit tests."
---

# Testando Sidebar com Sync de URL e Cobertura

> Ao testar componentes que sincronizam estado com URL, espione o submit do formulario via prototype e mocke os search params para validar comportamento automatico no mount.

## Rules

1. **Espione requestSubmit via prototype** — `jest.spyOn(HTMLFormElement.prototype, 'requestSubmit')` porque o submit e controlado via ref, nao via evento direto do usuario
2. **Mocke search params antes do render** — configure `mockSearchParams` antes de chamar `makeSUT()`, porque o useEffect roda no mount
3. **Restaure spies apos cada teste** — `submitSpy.mockRestore()` no final, porque spies no prototype vazam entre testes
4. **Exclua arquivos gerados do coverage** — adicione patterns como `generated` no `coveragePathIgnorePatterns` do Jest config, porque testar codigo gerado (Prisma) nao faz sentido
5. **100% coverage e melhor que 78%, mas nao garante zero bugs** — busque cobertura maxima como indicador, nao como garantia

## How to write

### Spy no requestSubmit do formulario

```typescript
const submitSpy = jest.spyOn(
  HTMLFormElement.prototype,
  'requestSubmit'
).mockImplementation(() => undefined)

// ... renderiza e interage ...

expect(submitSpy).toHaveBeenCalled()
submitSpy.mockRestore()
```

### Teste de submit ao digitar no campo de busca

```typescript
it('should submit form when typing in search field', async () => {
  const submitSpy = jest.spyOn(
    HTMLFormElement.prototype,
    'requestSubmit'
  ).mockImplementation(() => undefined)

  makeSUT()

  const searchInput = screen.getByPlaceholderText('Buscar prompts')
  await userEvent.type(searchInput, 'AI')

  expect(submitSpy).toHaveBeenCalled()
  submitSpy.mockRestore()
})
```

### Teste de auto-submit ao montar com query na URL

```typescript
it('should auto-submit on mount when query exists', async () => {
  const submitSpy = jest.spyOn(
    HTMLFormElement.prototype,
    'requestSubmit'
  ).mockImplementation(() => undefined)

  const text = 'protocol'
  const searchParams = new URLSearchParams({ q: text })
  mockSearchParams.mockReturnValue(searchParams)

  makeSUT()

  expect(submitSpy).toHaveBeenCalled()
  submitSpy.mockRestore()
})
```

### useEffect para sync de URL no mount

```typescript
useEffect(() => {
  if (!restQuery) return
  formRef.current?.requestSubmit()
}, [restQuery])
```

## Example

**Before (sem sync de URL no mount):**
```typescript
// Pagina recarrega com ?q=protocol na URL
// Input mostra "protocol", URL tem o param
// Mas a lista nao filtra — mostra todos os items
```

**After (com useEffect + requestSubmit):**
```typescript
// useEffect detecta restQuery no mount
// Chama requestSubmit() automaticamente
// Lista ja vem filtrada ao recarregar a pagina
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Componente usa ref para submit | Spy em `HTMLFormElement.prototype.requestSubmit` |
| Teste depende de search params | Mock `useSearchParams` antes do render |
| Coverage inclui arquivos gerados | Adicione ao `coveragePathIgnorePatterns` |
| Teste de collapse/expand | Use `getByRole('button', { name })` + `toBeVisible()` |
| Spy no prototype | Sempre `mockRestore()` no final do teste |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `fireEvent.submit(form)` quando usa ref | `jest.spyOn(HTMLFormElement.prototype, 'requestSubmit')` |
| Render antes de configurar mocks | Configurar mocks, depois `makeSUT()` |
| Esquecer `mockRestore()` em spy de prototype | Sempre restaurar no final do teste |
| Testar arquivos gerados pelo Prisma | Excluir via `coveragePathIgnorePatterns` |
| Assumir que 100% coverage = zero bugs | Tratar coverage como indicador, nao garantia |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
