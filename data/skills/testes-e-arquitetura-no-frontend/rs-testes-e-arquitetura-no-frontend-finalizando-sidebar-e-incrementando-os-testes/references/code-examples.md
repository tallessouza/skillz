# Code Examples: Testando Sidebar com Sync de URL

## 1. useEffect para auto-submit com search params

```typescript
// sidebar-content.tsx
useEffect(() => {
  if (!restQuery) return
  formRef.current?.requestSubmit()
}, [restQuery])
```

`restQuery` vem do `useSearchParams`. Se nao houver query, o useEffect retorna imediatamente. Se houver, submete o formulario automaticamente.

## 2. Jest config — excluindo arquivos gerados

```javascript
// jest.config.js
module.exports = {
  // ...
  coveragePathIgnorePatterns: [
    '/node_modules/',
    'generated', // Exclui arquivos gerados pelo Prisma
  ],
}
```

## 3. Teste completo: re-expandir sidebar

```typescript
it('should re-expand when clicking expand button', async () => {
  makeSUT()

  const collapseButton = screen.getByRole('button', {
    name: /minimizar sidebar/i,
  })
  await userEvent.click(collapseButton)

  const expandButton = screen.getByRole('button', {
    name: /expandir sidebar/i,
  })
  await userEvent.click(expandButton)

  expect(
    screen.getByRole('button', { name: /minimizar sidebar/i })
  ).toBeVisible()

  expect(
    screen.getByRole('navigation', { name: /lista de prompts/i })
  ).toBeVisible()
})
```

## 4. Teste completo: submit ao digitar

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

## 5. Teste completo: auto-submit no mount com query

```typescript
it('should auto-submit on mount when query params exist', async () => {
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

## 6. Rodando coverage

```bash
# Coverage completo
npx jest --coverage

# Watch mode para um arquivo especifico
npx jest --watch sidebar-content
```