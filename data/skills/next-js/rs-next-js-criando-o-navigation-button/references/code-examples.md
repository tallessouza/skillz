# Code Examples: Criando o Navigation Button

## Exemplo 1: Definicao de tipos das props

```typescript
// navigation-button.tsx (dentro da pasta do DatePicker)
type NavigationButtonProps = {
  tooltipText: string        // Texto exibido no tooltip ao hover
  children: React.ReactNode  // Icone ou conteudo do botao
  onClick: () => void        // Callback de navegacao (dia anterior/proximo)
}
```

## Exemplo 2: Componente completo

```tsx
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

export const NavigationButton = ({
  tooltipText,
  children,
  onClick,
}: NavigationButtonProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            onClick={onClick}
            className="h-9 w-9 bg-transparent border-primary text-primary
              hover:bg-background/80 hover:border-secondary hover:text-primary
              focus-visible:ring-offset-0 focus-visible:ring-1
              focus-visible:ring-brand focus-visible:border-brand"
          >
            {children}
          </Button>
        </TooltipTrigger>
        <TooltipContent className="bg-primary">
          <p>{tooltipText}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
```

## Exemplo 3: Integracao no DatePicker

```tsx
// date-picker.tsx
import { NavigationButton } from './navigation-button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

// Dentro do JSX do DatePicker:
<div className="flex items-center gap-2">
  <NavigationButton
    tooltipText="Dia anterior"
    onClick={() => handleNavigate(-1)}
  >
    <ChevronLeft className="h-4 w-4" />
  </NavigationButton>

  {/* Trigger do Popover com calendario */}

  <NavigationButton
    tooltipText="Próximo dia"
    onClick={() => handleNavigate(1)}
  >
    <ChevronRight className="h-4 w-4" />
  </NavigationButton>
</div>
```

## Exemplo 4: Instalacao do Tooltip via shadcn CLI

```bash
# Instalar o componente tooltip do shadcn/ui
npx shadcn-ui@latest add tooltip
```

Isso gera `components/ui/tooltip.tsx` com os exports:
- `TooltipProvider`
- `Tooltip`
- `TooltipTrigger`
- `TooltipContent`

## Exemplo 5: Variacao — TooltipContent sem arrow

```tsx
// O instrutor menciona que prefere sem a setinha (arrow)
<TooltipContent className="bg-primary" sideOffset={5}>
  <p>{tooltipText}</p>
</TooltipContent>

// vs com arrow (padrao do Radix)
// A setinha aparece automaticamente — para remover,
// nao inclua o componente Arrow ou estilize com CSS
```

## Exemplo 6: Antes da extracao (codigo duplicado)

```tsx
// ANTES: Markup repetido no DatePicker
<Button
  variant="outline"
  size="icon"
  onClick={() => handleNavigate(-1)}
  className="h-9 w-9 bg-transparent border-primary text-primary ..."
>
  <ChevronLeft className="h-4 w-4" />
</Button>

{/* ... popover do calendario ... */}

<Button
  variant="outline"
  size="icon"
  onClick={() => handleNavigate(1)}
  className="h-9 w-9 bg-transparent border-primary text-primary ..."
>
  <ChevronRight className="h-4 w-4" />
</Button>
```

## Exemplo 7: Estrutura de pastas

```
components/
  date-picker/
    date-picker.tsx          # Componente principal
    navigation-button.tsx    # Componente extraido (uso local)
  ui/
    button.tsx               # shadcn Button
    tooltip.tsx              # shadcn Tooltip (instalado nesta aula)
```