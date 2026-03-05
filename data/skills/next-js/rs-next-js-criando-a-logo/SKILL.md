---
name: rs-next-js-criando-a-logo
description: "Enforces reusable component extraction patterns in React/Next.js when code duplication is detected. Use when user asks to 'create a component', 'refactor duplicated code', 'extract a shared component', or 'organize header and footer'. Applies DRY principle by extracting shared UI into dedicated components with props for variations. Make sure to use this skill whenever duplicated JSX appears across multiple locations. Not for state management, API routes, or styling-only changes."
---

# Componente Reutilizavel — Extracao de Duplicacao

> Quando o mesmo JSX aparece em dois ou mais locais, extraia imediatamente para um componente dedicado com props para variacoes.

## Rules

1. **Extraia ao duplicar** — se voce copiou e colou JSX, crie um componente, porque qualquer alteracao futura precisaria ser feita em N lugares
2. **Um unico elemento raiz** — React exige retorno de um unico elemento; use fragment `<>...</>` apenas quando necessario, porque o JSX e uma funcao que retorna um elemento
3. **Barrel export com index** — crie `index.ts` exportando o componente, porque simplifica imports no restante da aplicacao
4. **Props para variacoes visuais** — receba `className` ou props especificas para variantes (cor clara/escura), porque o mesmo componente pode precisar de estilos diferentes em header vs footer
5. **Altere em um lugar, reflita em todos** — o componente extraido e a unica fonte de verdade, porque mudancas na logo/marca propagam automaticamente

## How to write

### Estrutura de pasta do componente

```
components/
  Logo/
    logo.tsx
    index.ts
```

### Componente com props de variacao

```tsx
import Link from "next/link";
import Image from "next/image";

interface LogoProps {
  className?: string;
  variant?: "light" | "dark";
}

export function Logo({ className, variant = "dark" }: LogoProps) {
  return (
    <Link href="/" title="Pagina inicial">
      <Image
        src={variant === "light" ? logoLight : logoDark}
        alt="Logo"
        className={className}
      />
    </Link>
  );
}
```

### Barrel export

```ts
// components/Logo/index.ts
export { Logo } from "./logo";
```

### Uso no Header e Footer

```tsx
import { Logo } from "@/components/Logo";

// Header — variante escura
<Logo variant="dark" />

// Footer — variante clara
<Logo variant="light" className="opacity-80" />
```

## Example

**Before (duplicacao no header e footer):**

```tsx
// header.tsx
<Link href="/">
  <Image src={logo} alt="Logo" />
</Link>

// footer.tsx
<Link href="/">
  <Image src={logo} alt="Logo" />
</Link>
```

**After (componente extraido):**

```tsx
// header.tsx
<Logo />

// footer.tsx
<Logo variant="light" />
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Mesmo JSX em 2+ arquivos | Extrair componente imediatamente |
| Logo com cores diferentes por contexto | Usar prop `variant` |
| Precisa de estilos customizados por local | Aceitar `className` via props |
| Componente so tem imagem sem link | Ainda assim extrair — link pode ser adicionado depois |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| Copiar JSX de logo em cada pagina | `<Logo />` componente compartilhado |
| Retornar dois elementos raiz sem fragment | Envolver em `<>...</>` ou elemento semantico |
| Hardcodar variante dentro do componente | Receber via props com default sensato |
| Exportar direto sem barrel file | Criar `index.ts` com re-export |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
