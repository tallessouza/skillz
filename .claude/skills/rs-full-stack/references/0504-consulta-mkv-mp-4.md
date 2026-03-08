---
name: rs-full-stack-0504-consulta-mkv-mp-4
description: "Enforces proper React form submission handling with preventDefault to avoid page refresh on search. Use when user asks to 'handle form submit', 'prevent page reload on enter', 'search without refresh', 'onSubmit in React', or 'form event handling'. Applies pattern: separate onSubmit handler with preventDefault from useEffect data fetching. Make sure to use this skill whenever building search forms or handling Enter key submission in React. Not for server-side form processing, file uploads, or non-React form handling."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: fundamentos
  tags: [react, forms, preventDefault, onSubmit, useEffect]
---

# Consulta — Form Submit sem Refresh

> Separe a logica de submissao do formulario (onSubmit + preventDefault) da logica de busca de dados (useEffect), para que pesquisa funcione tanto com Enter quanto com clique no botao sem recarregar a pagina.

## Rules

1. **Sempre use preventDefault em formularios React** — `e.preventDefault()` no handler de onSubmit, porque sem isso o navegador faz refresh da pagina ao pressionar Enter
2. **Separe onSubmit do useEffect** — o onSubmit cuida do evento do formulario, o useEffect cuida da busca de dados, porque misturar os dois impede acesso ao `React.FormEvent`
3. **Type o evento como React.FormEvent** — `e: React.FormEvent` no handler, porque o useEffect nao recebe FormEvent e o onSubmit sim

## How to write

### Handler de submissao separado

```typescript
function onSubmit(e: React.FormEvent) {
  e.preventDefault()
  fetchData()
}
```

### Formulario com onSubmit

```tsx
<form onSubmit={onSubmit}>
  <input type="text" value={search} onChange={e => setSearch(e.target.value)} />
  <button type="submit">Pesquisar</button>
</form>
```

### useEffect para busca inicial

```typescript
useEffect(() => {
  fetchData()
}, [])
```

## Example

**Before (pagina recarrega ao dar Enter):**
```tsx
// onSubmit chamando fetchRefunds diretamente — sem preventDefault
<form onSubmit={fetchRefunds}>
  <input value={search} onChange={e => setSearch(e.target.value)} />
  <button type="submit">Pesquisar</button>
</form>

useEffect(() => {
  fetchRefunds()
}, [])
```

**After (pesquisa funciona sem refresh):**
```tsx
function onSubmit(e: React.FormEvent) {
  e.preventDefault()
  fetchRefunds()
}

<form onSubmit={onSubmit}>
  <input value={search} onChange={e => setSearch(e.target.value)} />
  <button type="submit">Pesquisar</button>
</form>

useEffect(() => {
  fetchRefunds()
}, [])
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Formulario com Enter + botao | Crie handler onSubmit separado com preventDefault |
| Busca inicial ao montar componente | Use useEffect chamando a funcao de fetch |
| Precisa de React.FormEvent | Coloque no onSubmit, nunca no useEffect |
| Botao de pesquisa fora de form | Considere envolver em `<form>` para ganhar Enter de graca |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| `<form onSubmit={fetchData}>` sem preventDefault | `<form onSubmit={onSubmit}>` com preventDefault no handler |
| preventDefault dentro do useEffect | preventDefault apenas no handler de onSubmit |
| Duplicar logica de fetch no onSubmit e useEffect | Extrair funcao de fetch e chamar nos dois lugares |
| Usar `onClick` no botao dentro de form para pesquisar | Usar `type="submit"` e tratar no onSubmit do form |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre separacao de responsabilidades entre onSubmit e useEffect
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| Pagina recarrega ao pressionar Enter | `preventDefault` nao chamado no onSubmit | Adicione `e.preventDefault()` no inicio do handler |
| Erro de tipo no parametro do evento | Tipo incorreto do evento | Use `e: React.FormEvent` no handler de onSubmit |
| Busca nao dispara ao montar componente | `useEffect` nao configurado | Adicione `useEffect(() => { fetchData() }, [])` |
| Logica de fetch duplicada | Fetch inline no onSubmit e no useEffect | Extraia para funcao nomeada e chame nos dois lugares |