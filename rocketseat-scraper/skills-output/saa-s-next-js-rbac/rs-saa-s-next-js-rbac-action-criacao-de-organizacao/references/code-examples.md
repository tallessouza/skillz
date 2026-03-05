# Code Examples: Server Actions com Zod — Criacao de Organizacao

## 1. Schema completo com todas as validacoes

```typescript
import { z } from 'zod'

export const organizationSchema = z
  .object({
    name: z.string().min(4, {
      message: 'Please include at least 4 characters.',
    }),
    domain: z
      .string()
      .nullable()
      .refine(
        (value) => {
          if (value) {
            const domainRegex =
              /^[a-zA-Z0-9]+([.-][a-zA-Z0-9]+)*\.[a-zA-Z]{2,}$/
            return domainRegex.test(value)
          }
          return true
        },
        { message: 'Please enter a valid domain.' },
      ),
    shouldAttachUsersByDomain: z
      .union([z.literal('on'), z.literal('off'), z.boolean()])
      .transform((value) => value === true || value === 'on')
      .default(false),
  })
  .refine(
    (data) => {
      if (data.shouldAttachUsersByDomain && !data.domain) {
        return false
      }
      return true
    },
    {
      message: 'Domain is required when auto-join is enabled.',
      path: ['domain'],
    },
  )
```

## 2. Server Action completa

```typescript
'use server'

import { HTTPError } from 'ky'
import { z } from 'zod'
import { createOrganization } from '@/http/create-organization'

const organizationSchema = z
  .object({
    name: z.string().min(4, {
      message: 'Please include at least 4 characters.',
    }),
    domain: z.string().nullable().refine(
      (value) => {
        if (value) {
          const domainRegex = /^[a-zA-Z0-9]+([.-][a-zA-Z0-9]+)*\.[a-zA-Z]{2,}$/
          return domainRegex.test(value)
        }
        return true
      },
      { message: 'Please enter a valid domain.' },
    ),
    shouldAttachUsersByDomain: z
      .union([z.literal('on'), z.literal('off'), z.boolean()])
      .transform((value) => value === true || value === 'on')
      .default(false),
  })
  .refine(
    (data) => !(data.shouldAttachUsersByDomain && !data.domain),
    {
      message: 'Domain is required when auto-join is enabled.',
      path: ['domain'],
    },
  )

export async function createOrganizationAction(data: FormData) {
  const result = organizationSchema.safeParse(Object.fromEntries(data))

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors
    return { success: false, message: null, errors }
  }

  const { name, domain, shouldAttachUsersByDomain } = result.data

  try {
    await createOrganization({
      name,
      domain,
      shouldAttachUsersByDomain,
    })
  } catch (err) {
    if (err instanceof HTTPError) {
      const { message } = await err.response.json()
      return { success: false, message, errors: null }
    }
    console.error(err)
    return {
      success: false,
      message: 'Unexpected error, try again in a few minutes.',
      errors: null,
    }
  }

  return {
    success: true,
    message: 'Successfully saved the organization.',
    errors: null,
  }
}
```

## 3. HTTP client function

```typescript
// http/create-organization.ts
import { api } from './api-client'

interface CreateOrganizationRequest {
  name: string
  domain: string | null
  shouldAttachUsersByDomain: boolean
}

export async function createOrganization({
  name,
  domain,
  shouldAttachUsersByDomain,
}: CreateOrganizationRequest) {
  await api.post('organizations', {
    json: {
      name,
      domain,
      shouldAttachUsersByDomain,
    },
  })
}
```

## 4. Client Component com formulario completo

```typescript
'use client'

import { AlertTriangle, CheckCircle, Loader2 } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useFormState } from '@/hooks/use-form-state'
import { createOrganizationAction } from './actions'

export function OrganizationForm() {
  const [{ success, message, errors }, handleSubmit, isPending] =
    useFormState(createOrganizationAction)

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {success === false && message && (
        <Alert variant="destructive">
          <AlertTriangle className="size-4" />
          <AlertTitle>Save organization failed!</AlertTitle>
          <AlertDescription>
            <p>{message}</p>
          </AlertDescription>
        </Alert>
      )}

      {success === true && message && (
        <Alert variant="success">
          <CheckCircle className="size-4" />
          <AlertTitle>Success!</AlertTitle>
          <AlertDescription>
            <p>{message}</p>
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-1">
        <Label htmlFor="name">Organization name</Label>
        <Input name="name" id="name" />
        {errors?.name && (
          <p className="text-xs font-medium text-red-500 dark:text-red-400">
            {errors.name[0]}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <Label htmlFor="domain">E-mail domain</Label>
        <Input
          name="domain"
          type="text"
          id="domain"
          inputMode="url"
          placeholder="example.com"
        />
        {errors?.domain && (
          <p className="text-xs font-medium text-red-500 dark:text-red-400">
            {errors.domain[0]}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <div className="flex items-baseline space-x-2">
          <Checkbox
            name="shouldAttachUsersByDomain"
            id="shouldAttachUsersByDomain"
          />
          <label htmlFor="shouldAttachUsersByDomain" className="space-y-1">
            <span className="text-sm font-medium leading-none">
              Auto-join new members
            </span>
            <p className="text-sm text-muted-foreground">
              This will automatically invite all members with same e-mail
              domain to this organization.
            </p>
          </label>
        </div>
        {errors?.shouldAttachUsersByDomain && (
          <p className="text-xs font-medium text-red-500 dark:text-red-400">
            {errors.shouldAttachUsersByDomain[0]}
          </p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          'Save organization'
        )}
      </Button>
    </form>
  )
}
```

## 5. Variacoes do padrao refine para campos nullable

```typescript
// Padrao: campo opcional com formato especifico
const phoneSchema = z.string().nullable().refine(
  (value) => {
    if (value) {
      return /^\+?[1-9]\d{1,14}$/.test(value)
    }
    return true
  },
  { message: 'Please enter a valid phone number.' },
)

// Padrao: campo opcional com tamanho minimo
const bioSchema = z.string().nullable().refine(
  (value) => {
    if (value) {
      return value.length >= 10
    }
    return true
  },
  { message: 'Bio must be at least 10 characters.' },
)
```

## 6. Variacoes do padrao cross-field validation

```typescript
// Padrao: campo obrigatorio quando outro e ativado
const schema = z.object({
  enableNotifications: z.boolean(),
  notificationEmail: z.string().nullable(),
}).refine(
  (data) => !(data.enableNotifications && !data.notificationEmail),
  {
    message: 'Email is required when notifications are enabled.',
    path: ['notificationEmail'],
  },
)

// Padrao: confirmacao de senha
const schema = z.object({
  password: z.string().min(8),
  confirmPassword: z.string(),
}).refine(
  (data) => data.password === data.confirmPassword,
  {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  },
)
```