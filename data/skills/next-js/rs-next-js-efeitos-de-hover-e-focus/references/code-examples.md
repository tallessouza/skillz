# Code Examples: Efeitos de Hover e Focus

## Exemplo 1: Componente Button completo

```typescript
// components/button.tsx
import { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

export interface ButtonProps extends ComponentProps<"button"> {}

export function Button({ className, type = "button", ...props }: ButtonProps) {
  return (
    <button
      type={type}
      className={twMerge(
        // Estilos base
        "flex items-center justify-center gap-2 rounded-lg bg-navy-600 px-5 py-3 text-sm font-semibold text-navy-100",
        // Hover
        "hover:bg-navy-500 transition-colors duration-150",
        // Focus
        "outline-none focus-visible:ring-2 focus-visible:ring-navy-400 focus-visible:ring-offset-2 focus-visible:ring-offset-navy-950",
        className,
      )}
      {...props}
    />
  );
}
```

### Uso na pagina:

```typescript
// Antes (inline)
<button
  type="button"
  className="flex items-center justify-center gap-2 rounded-lg bg-navy-600 px-5 py-3 text-sm font-semibold text-navy-100"
>
  Create board
</button>

// Depois (componente)
<Button>Create board</Button>
```

## Exemplo 2: Card com hover e focus

```typescript
// Dentro do componente de card
<a
  href={`/boards/${board.id}`}
  className={twMerge(
    // Base
    "block rounded-lg border border-navy-700 bg-navy-800 p-4",
    // Hover
    "hover:bg-navy-600/50 hover:border-navy-500 transition-colors duration-150",
    // Focus
    "outline-none focus-visible:ring-2 focus-visible:ring-navy-400 focus-visible:ring-offset-2 focus-visible:ring-offset-navy-950",
  )}
>
  <h2>{board.title}</h2>
</a>
```

## Exemplo 3: tw-merge com multiplos parametros

O tw-merge aceita N strings como argumentos separados. Cada string pode representar uma "camada" de estilos:

```typescript
// Todas estas formas sao equivalentes:

// Uma string so (dificil de ler)
twMerge("bg-navy-600 text-white hover:bg-navy-500 transition-colors duration-150 outline-none focus-visible:ring-2")

// Multiplas strings por responsabilidade (recomendado)
twMerge(
  "bg-navy-600 text-white",
  "hover:bg-navy-500 transition-colors duration-150",
  "outline-none focus-visible:ring-2 focus-visible:ring-navy-400 focus-visible:ring-offset-2 focus-visible:ring-offset-navy-950",
)
```

## Exemplo 4: Opacidade no hover

```typescript
// Hover muito forte (mesma cor do botao)
"hover:bg-navy-600"

// Com opacidade — mais sutil
"hover:bg-navy-600/60"  // 60% opacidade
"hover:bg-navy-600/50"  // 50% opacidade (preferido pelo instrutor)
```

## Exemplo 5: Focus vs Focus-Visible (demonstracao)

```typescript
// ERRADO — ao clicar no botao, o ring aparece (indesejado)
"focus:ring-2 focus:ring-navy-400"

// CORRETO — ring aparece apenas na navegacao por tab
"focus-visible:ring-2 focus-visible:ring-navy-400"
```

Teste: clique no botao (nada acontece), depois pressione Tab ate chegar nele (ring aparece).

## Exemplo 6: Pattern de ComponentProps

```typescript
import { ComponentProps } from "react";

// Extende TODAS as props nativas do elemento HTML
interface ButtonProps extends ComponentProps<"button"> {}

// Desestrutura className separadamente para merge
export function Button({ className, ...props }: ButtonProps) {
  return (
    <button
      className={twMerge("estilos-fixos", className)}
      {...props}
    />
  );
}

// Permite passar qualquer prop nativa:
<Button type="submit" disabled onClick={handleClick} className="mt-4">
  Submit
</Button>
```