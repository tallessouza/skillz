---
name: rs-saas-nextjs-rbac-tabela-fatura-billing
description: "Enforces patterns for building billing/pricing tables with shadcn/ui in Next.js when user asks to 'create a billing page', 'build a pricing table', 'show costs in a table', 'format currency', or 'display subscription billing'. Applies rules: server component for data fetching, shadcn/ui Table with proper thead>tr>th structure, fixed-width columns via inline style not CSS, currency formatting with toLocaleString. Make sure to use this skill whenever building financial or billing UI in Next.js with shadcn/ui. Not for generic data tables without currency, or backend billing logic."
---

# Tabela de Fatura (Billing)

> Tabelas de billing usam server components para fetch, shadcn/ui Table para estrutura, e toLocaleString para formatacao monetaria.

## Rules

1. **Billing como server component async** — `export default async function Billing()` porque o fetch de dados acontece no servidor, sem necessidade de client-side state
2. **thead precisa de tr por volta dos th** — `<TableHeader><TableRow><TableHead>...</TableHead></TableRow></TableHeader>` porque sem o TableRow dentro do TableHeader, o browser gera erro de HTML invalido no console
3. **Largura fixa de coluna via style inline** — `style={{ width: 200 }}` no TableHead, porque width via className/CSS nao funciona em colunas de tabela
4. **Deixe pelo menos uma coluna sem width** — a coluna flexivel preenche o espaco restante, enquanto as demais tem largura fixa
5. **Formate precos com toLocaleString** — `value.toLocaleString('en-US', { style: 'currency', currency: 'USD' })` porque garante formatacao monetaria consistente
6. **Alinhe valores numericos a direita** — `className="text-right"` nas colunas de quantidade e subtotal, porque segue convencao de tabelas financeiras

## How to write

### Estrutura da tabela de billing

```tsx
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from './ui/table'

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Cost type</TableHead>
      <TableHead className="text-right" style={{ width: 160 }}>Quantity</TableHead>
      <TableHead className="text-right" style={{ width: 200 }}>Subtotal</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>Amount of projects</TableCell>
      <TableCell className="text-right">{billing.projects.amount}</TableCell>
      <TableCell className="text-right">
        {billing.projects.price.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
        {' '}({billing.projects.unit.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} each)
      </TableCell>
    </TableRow>
  </TableBody>
  <TableFooter>
    <TableRow>
      <TableCell />
      <TableCell className="text-right">Total</TableCell>
      <TableCell className="text-right">
        {billing.total.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
      </TableCell>
    </TableRow>
  </TableFooter>
</Table>
```

### Fetch de billing como server component

```tsx
import { getCurrentOrg } from '../utils/get-current-org'
import { getBilling } from '@/http/get-billing'

export default async function Billing() {
  const currentOrg = getCurrentOrg()
  const { billing } = await getBilling(currentOrg!)

  return (
    <>
      <Separator />
      <Card>
        <CardHeader>
          <CardTitle>Billing</CardTitle>
          <CardDescription>Information about your organization costs.</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Table here */}
        </CardContent>
      </Card>
    </>
  )
}
```

## Example

**Before (erro comum — TableHead sem TableRow):**
```tsx
<TableHeader>
  <TableHead>Type</TableHead>
  <TableHead>Qty</TableHead>
</TableHeader>
```

**After (com TableRow obrigatorio):**
```tsx
<TableHeader>
  <TableRow>
    <TableHead>Type</TableHead>
    <TableHead>Qty</TableHead>
  </TableRow>
</TableHeader>
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Coluna com valores monetarios | `toLocaleString` com style currency |
| Coluna numerica (qty, price) | `className="text-right"` |
| Largura fixa em coluna | `style={{ width: N }}` no TableHead |
| Linha de total | Use TableFooter com TableRow |
| Billing depende de org | Server component async + getCurrentOrg |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `<TableHeader><TableHead>` sem TableRow | `<TableHeader><TableRow><TableHead>` |
| `className="w-[200px]"` em TableHead | `style={{ width: 200 }}` |
| `${price} USD` (string manual) | `price.toLocaleString('en-US', { style: 'currency', currency: 'USD' })` |
| Client component com useEffect para billing | Server component async com fetch direto |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/saa-s/rs-saa-s-next-js-rbac-tabela-de-fatura-billing/references/deep-explanation.md)
- [Code examples](../../../data/skills/saa-s/rs-saa-s-next-js-rbac-tabela-de-fatura-billing/references/code-examples.md)
