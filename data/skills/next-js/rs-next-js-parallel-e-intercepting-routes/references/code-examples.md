# Code Examples: Parallel e Intercepting Routes

## Exemplo 1: Parallel Route basico (da aula)

O instrutor criou uma pasta `@banana` para demonstrar o conceito:

```
app/
├── layout.tsx
├── @banana/
│   ├── default.tsx
│   └── issues/
│       └── [id]/
│           └── page.tsx
```

### default.tsx (fallback do slot)

```typescript
// app/@banana/default.tsx
export default function Default() {
  return <h1>Hello World</h1>
}
```

Depois mudou para retornar `null` quando nao queria exibir nada:

```typescript
export default function Default() {
  return null
}
```

### Layout recebendo o slot

```typescript
// app/layout.tsx
export default function Layout({
  children,
  banana,
}: {
  children: React.ReactNode
  banana: React.ReactNode
}) {
  return (
    <html>
      <body>
        {banana}
        {children}
      </body>
    </html>
  )
}
```

O instrutor mostrou que colocar `{banana}` acima de `{children}` faz o conteudo do slot aparecer no topo da pagina.

### Pagina especifica dentro do slot

```typescript
// app/@banana/issues/[id]/page.tsx
export default function IssueBanana() {
  return <p>Issue Banana</p>
}
```

Quando o usuario acessa `/issues/123`, o slot mostra "Issue Banana" ao inves do default "Hello World".

## Exemplo 2: Intercepting Route (da aula)

Para transformar em interceptacao, o instrutor adicionou `(.)` antes do segmento:

```
app/
├── @banana/
│   ├── default.tsx
│   └── (.)issues/          # <-- (.) adicionado aqui
│       └── [id]/
│           └── page.tsx
```

Com essa mudanca:
- **Navegacao via Link**: mostra "Issue Banana" no slot, mantendo a pagina do board visivel
- **F5 na URL**: vai para a pagina real `app/issues/[id]/page.tsx`

## Exemplo 3: Pattern completo para modal (aplicacao pratica)

Baseado no que o instrutor esta construindo:

```
app/
├── layout.tsx
├── board/
│   └── page.tsx                    # Lista de issues
├── issues/
│   └── [id]/
│       └── page.tsx                # Pagina completa da issue (F5)
└── @modal/
    ├── default.tsx                 # return null
    └── (.)issues/
        └── [id]/
            └── page.tsx            # Modal/sheet da issue (click)
```

### Layout

```typescript
// app/layout.tsx
export default function RootLayout({
  children,
  modal,
}: {
  children: React.ReactNode
  modal: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body>
        {children}
        {modal}
      </body>
    </html>
  )
}
```

### Default do modal

```typescript
// app/@modal/default.tsx
export default function ModalDefault() {
  return null
}
```

### Pagina interceptada (modal)

```typescript
// app/@modal/(.)issues/[id]/page.tsx
export default async function IssueSheet({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return (
    <div className="fixed inset-0 z-50 bg-black/50">
      <div className="fixed right-0 top-0 h-full w-96 bg-white p-6 shadow-xl">
        <h2>Issue #{id}</h2>
        {/* Conteudo da issue */}
      </div>
    </div>
  )
}
```

### Pagina real (acesso direto/F5)

```typescript
// app/issues/[id]/page.tsx
export default async function IssuePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return (
    <main className="p-8">
      <h1>Issue #{id}</h1>
      {/* Pagina completa da issue */}
    </main>
  )
}
```

## Convencoes de interceptacao

| Sintaxe | Significado | Exemplo |
|---------|-------------|---------|
| `(.)` | Mesmo nivel | `@modal/(.)issues/[id]` intercepta `issues/[id]` |
| `(..)` | Um nivel acima | `@modal/(..)settings` intercepta `../settings` |
| `(..)(..)` | Dois niveis acima | Raro, mas disponivel |
| `(...)` | Raiz do app | `@modal/(...)login` intercepta `/login` de qualquer lugar |