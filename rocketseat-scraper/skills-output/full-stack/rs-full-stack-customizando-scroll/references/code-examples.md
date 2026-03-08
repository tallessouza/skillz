# Code Examples: Customizando Scroll

## Exemplo 1 — Container de cards no dashboard (da aula)

### Layout do container
```tsx
// Dashboard com lista de refunds scrollável
<div className="mt-6 flex flex-col gap-4 max-h-[420px] overflow-y-auto">
  {refunds.map(refund => (
    <RefundItem key={refund.id} data={refund} />
  ))}
</div>
```

### Customização CSS global (index.css)
```css
/* Scrollbar — largura slim */
::-webkit-scrollbar {
  width: 0.4rem;
}

/* Thumb — cor sutil */
::-webkit-scrollbar-thumb {
  background: #e4e9;
}

/* Track — transparente para visual limpo */
::-webkit-scrollbar-track {
  background-color: transparent;
}
```

## Exemplo 2 — Scrollbar com border-radius na thumb

```css
::-webkit-scrollbar {
  width: 0.4rem;
}

::-webkit-scrollbar-thumb {
  background: #e4e9;
  border-radius: 9999px; /* thumb arredondada */
}

::-webkit-scrollbar-thumb:hover {
  background: #c4c9d4; /* feedback visual no hover */
}

::-webkit-scrollbar-track {
  background-color: transparent;
}
```

## Exemplo 3 — Scrollbar para dark mode

```css
/* Light mode */
::-webkit-scrollbar-thumb {
  background: #d1d5db;
}

/* Dark mode — usando classe .dark no html */
.dark ::-webkit-scrollbar-thumb {
  background: #4b5563;
}

.dark ::-webkit-scrollbar-track {
  background-color: transparent;
}
```

## Exemplo 4 — Scrollbar horizontal (tabela wide)

```tsx
<div className="max-w-full overflow-x-auto">
  <table className="min-w-[800px]">
    {/* conteúdo da tabela */}
  </table>
</div>
```

```css
/* Scrollbar horizontal */
::-webkit-scrollbar {
  width: 0.4rem;  /* vertical */
  height: 0.4rem; /* horizontal */
}
```

## Exemplo 5 — Fallback Firefox

```css
/* WebKit (Chrome, Safari, Edge) */
::-webkit-scrollbar {
  width: 0.4rem;
}

::-webkit-scrollbar-thumb {
  background: #e4e9;
  border-radius: 9999px;
}

::-webkit-scrollbar-track {
  background-color: transparent;
}

/* Firefox fallback */
* {
  scrollbar-width: thin;
  scrollbar-color: #e4e9 transparent;
}
```

## Exemplo 6 — Scrollbar scoped para um componente específico

Se precisar de scrollbar diferente em um componente:

```css
/* Sidebar com scrollbar mais larga */
.sidebar-scroll::-webkit-scrollbar {
  width: 0.6rem;
}

.sidebar-scroll::-webkit-scrollbar-thumb {
  background: #6366f1;
  border-radius: 9999px;
}

.sidebar-scroll::-webkit-scrollbar-track {
  background-color: #1e1b4b;
}
```

```tsx
<aside className="sidebar-scroll max-h-screen overflow-y-auto">
  <nav>{/* menu items */}</nav>
</aside>
```

## Exemplo 7 — Esconder scrollbar mas manter funcionalidade

```css
.no-scrollbar::-webkit-scrollbar {
  display: none;
}

.no-scrollbar {
  -ms-overflow-style: none;  /* IE/Edge */
  scrollbar-width: none;      /* Firefox */
}
```

```tsx
<div className="no-scrollbar max-h-[420px] overflow-y-auto">
  {/* conteúdo scrollável sem barra visível */}
</div>
```

## Exemplo 8 — Combinação completa: container + scrollbar + Tailwind

```tsx
// Componente completo de lista scrollável
function RefundList({ refunds }: { refunds: Refund[] }) {
  return (
    <section className="mt-6 flex flex-col gap-4 max-h-[420px] overflow-y-auto">
      {refunds.length === 0 ? (
        <p className="text-gray-500 text-center py-8">
          Nenhuma solicitação encontrada.
        </p>
      ) : (
        refunds.map(refund => (
          <RefundItem key={refund.id} data={refund} />
        ))
      )}
    </section>
  )
}
```