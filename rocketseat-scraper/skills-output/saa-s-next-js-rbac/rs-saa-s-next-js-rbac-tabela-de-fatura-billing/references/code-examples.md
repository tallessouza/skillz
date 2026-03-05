# Code Examples: Tabela de Fatura (Billing)

## 1. HTTP function para billing

```typescript
// src/http/get-billing.ts
import { api } from './api-client'

interface GetBillingResponse {
  billing: {
    seats: {
      amount: number
      unit: number
      price: number
    }
    projects: {
      amount: number
      unit: number
      price: number
    }
    total: number
  }
}

export async function getBilling(org: string) {
  const result = await api
    .get(`organizations/${org}/billing`)
    .json<GetBillingResponse>()

  return result
}
```

## 2. Componente billing completo

```tsx
// src/app/(app)/org/[slug]/settings/billing.tsx
import { getCurrentOrg } from '@/auth/auth'
import { getBilling } from '@/http/get-billing'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import {
  Table, TableBody, TableCell, TableFooter,
  TableHead, TableHeader, TableRow,
} from '@/components/ui/table'

export default async function Billing() {
  const currentOrg = getCurrentOrg()
  const { billing } = await getBilling(currentOrg!)

  return (
    <>
      <Separator />
      <Card>
        <CardHeader>
          <CardTitle>Billing</CardTitle>
          <CardDescription>
            Information about your organization costs.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cost type</TableHead>
                <TableHead className="text-right" style={{ width: 160 }}>
                  Quantity
                </TableHead>
                <TableHead className="text-right" style={{ width: 200 }}>
                  Subtotal
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Amount of projects</TableCell>
                <TableCell className="text-right">
                  {billing.projects.amount}
                </TableCell>
                <TableCell className="text-right">
                  {billing.projects.price.toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD',
                  })}{' '}
                  ({billing.projects.unit.toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD',
                  })} each)
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Amount of seats</TableCell>
                <TableCell className="text-right">
                  {billing.seats.amount}
                </TableCell>
                <TableCell className="text-right">
                  {billing.seats.price.toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD',
                  })}{' '}
                  ({billing.seats.unit.toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD',
                  })} each)
                </TableCell>
              </TableRow>
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell />
                <TableCell className="text-right">Total</TableCell>
                <TableCell className="text-right">
                  {billing.total.toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD',
                  })}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </CardContent>
      </Card>
    </>
  )
}
```

## 3. Instalacao do componente table do shadcn/ui

```bash
npx shadcn-ui@latest add table
```

## 4. Uso na page de settings

```tsx
// src/app/(app)/org/[slug]/settings/page.tsx
import Billing from './billing'

export default async function Settings() {
  return (
    <div>
      {/* ... other settings content ... */}
      <Billing />
    </div>
  )
}
```