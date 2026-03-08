# Code Examples: Variantes de Componentes com Tailwind CSS

## 1. Instalação das dependências

```bash
npm i clsx tailwind-merge
```

## 2. Utilitário classMerge completo

```typescript
// src/utils/classmerge.ts
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function classMerge(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

## 3. Componente Button com variantes (versão completa da aula)

```tsx
// src/components/button.tsx
import { classMerge } from "@/utils/classmerge"

const variants = {
  button: {
    basic: "h-12",
    icon: "h-12 w-12",
    iconSmall: "h-10 w-10",
  },
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean
  variant?: "basic" | "icon" | "iconSmall"
}

export function Button({
  isLoading,
  variant = "basic",
  className,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={classMerge([
        "flex items-center justify-center gap-2 rounded-xl bg-green-600 text-sm font-semibold text-gray-100",
        variants.button[variant],
        className,
      ])}
      disabled={isLoading}
      {...rest}
    />
  )
}
```

## 4. Uso do botão com ícone (pesquisa)

```tsx
// No componente de pesquisa
import searchSvg from "../assets/search.svg"
import { Button } from "./button"

export function SearchForm() {
  return (
    <form>
      <input type="text" placeholder="Pesquisar..." />
      <Button variant="icon" type="submit">
        <img src={searchSvg} alt="Ícone de pesquisar" className="w-5" />
      </Button>
    </form>
  )
}
```

## 5. Uso do botão básico (padrão)

```tsx
// Sem especificar variant, usa "basic"
<Button type="submit">Cadastrar</Button>
<Button type="submit">Entrar</Button>
<Button type="submit">Enviar solicitação</Button>
```

## 6. Override pontual com className

```tsx
// Muda a cor do botão só nesse uso específico
<Button className="bg-red-800">Excluir</Button>

// Muda o arredondamento
<Button className="rounded-full">Circular</Button>

// Sem className, mantém os estilos padrão
<Button>Normal</Button>
```

## 7. Adicionando nova variante (processo)

```typescript
// 1. Adicione a classe no objeto de variantes
const variants = {
  button: {
    basic: "h-12",
    icon: "h-12 w-12",
    iconSmall: "h-10 w-10",
    outline: "h-12 border-2 border-green-600 bg-transparent", // nova
  },
}

// 2. Adicione na tipagem
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "basic" | "icon" | "iconSmall" | "outline"
}

// 3. Use
<Button variant="outline">Cancelar</Button>
```

## 8. Variante com múltiplos elementos (padrão expandido)

```typescript
// Se o botão tiver label + ícone como sub-elementos
const variants = {
  wrapper: {
    basic: "h-12 px-6",
    icon: "h-12 w-12",
    compact: "h-8 px-3 text-xs",
  },
  label: {
    basic: "block",
    icon: "sr-only",    // esconde texto, mantém acessibilidade
    compact: "block",
  },
}
```