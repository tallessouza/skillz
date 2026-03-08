---
name: rs-next-js-criando-o-navigation-button
description: "Enforces component extraction patterns when creating reusable navigation buttons with tooltips in Next.js. Use when user asks to 'create a button component', 'add tooltip to button', 'extract component', 'navigation button', or 'separate component'. Applies rules: proper prop typing, TooltipProvider wrapping, asChild on triggers, variant/size styling, onClick forwarding. Make sure to use this skill whenever extracting interactive button components with tooltips in React/Next.js. Not for form buttons, submit handlers, or link navigation components."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: next-js
  module: navigation-button
  tags: [react, next-js, tooltip, shadcn-ui, component-extraction, asChild, button-component]
---

# Criando o Navigation Button

> Ao extrair um componente de botao com tooltip, defina props tipadas, envolva com TooltipProvider, e mantenha o componente colocado junto ao contexto onde sera usado.

## Rules

1. **Coloque o componente junto ao consumidor** — se o componente so sera usado dentro de um contexto especifico (ex: DatePicker), crie-o na mesma pasta, porque facilita a manutencao e deixa claro o escopo de uso
2. **Tipe as props explicitamente** — defina um type com `tooltipText: string`, `children: ReactNode`, `onClick: () => void`, porque props tipadas previnem erros e documentam a API do componente
3. **Sempre envolva com TooltipProvider** — o Tooltip do shadcn/ui exige um Provider por volta, porque sem ele o tooltip simplesmente nao funciona
4. **Use asChild no TooltipTrigger** — passe `asChild` para evitar renderizar um elemento extra no DOM, porque o Button ja e o elemento clicavel
5. **Repasse onClick para o Button interno** — o componente wrapper recebe onClick via props e repassa ao Button, porque a logica de navegacao pertence ao pai
6. **Estilize com variantes e overrides de classe** — use `variant="outline"` e `size="icon"` como base, sobrescrevendo com classes utilitarias para ajustes finos

## How to write

### Props tipadas do NavigationButton

```typescript
type NavigationButtonProps = {
  tooltipText: string
  children: React.ReactNode
  onClick: () => void
}
```

### Estrutura completa do componente

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
              focus-visible:ring-offset-0 focus-visible:ring-1 focus-visible:ring-brand
              focus-visible:border-brand"
          >
            {children}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltipText}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
```

### Uso no DatePicker

```tsx
<NavigationButton tooltipText="Dia anterior" onClick={handlePreviousDay}>
  <ChevronLeft className="h-4 w-4" />
</NavigationButton>

<NavigationButton tooltipText="Próximo dia" onClick={handleNextDay}>
  <ChevronRight className="h-4 w-4" />
</NavigationButton>
```

## Example

**Before (botao inline sem extracao):**
```tsx
// Dentro do DatePicker, repetido para cada direcao
<Button variant="outline" size="icon" onClick={handlePreviousDay}
  className="h-9 w-9 bg-transparent border-primary ...">
  <ChevronLeft />
</Button>
```

**After (componente extraido com tooltip):**
```tsx
<NavigationButton tooltipText="Dia anterior" onClick={handlePreviousDay}>
  <ChevronLeft className="h-4 w-4" />
</NavigationButton>
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Botao usado so dentro de um componente | Crie na mesma pasta do consumidor |
| Botao precisa de dica visual | Adicione Tooltip com TooltipProvider |
| Multiplos botoes com mesmo estilo | Extraia componente com children + onClick |
| Tooltip nao aparece | Verifique se TooltipProvider esta envolvendo |
| Precisa customizar o trigger | Use `asChild` no TooltipTrigger |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| Tooltip sem TooltipProvider | `<TooltipProvider><Tooltip>...</Tooltip></TooltipProvider>` |
| TooltipTrigger sem asChild wrapping Button | `<TooltipTrigger asChild><Button>...</Button></TooltipTrigger>` |
| Duplicar markup de botao em cada direcao | Extrair NavigationButton com props |
| Hardcodar texto do tooltip | Passar `tooltipText` via props |
| Logica de onClick dentro do componente wrapper | Receber onClick via props e repassar |

## Troubleshooting

### Comportamento diferente entre dev e producao
**Symptom:** Funcionalidade funciona em `npm run dev` mas nao em `npm run build && npm start`
**Cause:** Dev mode e mais permissivo — producao aplica otimizacoes, cache agressivo, e validacoes mais estritas
**Fix:** Sempre testar com `npm run build && npm start` antes de deploy. Verificar que nao ha erros no build output. Limpar .next antes de rebuildar

### Erro "Module not found" apos refatoracao
**Symptom:** Import de modulo falha apos mover arquivo
**Cause:** Path do import nao foi atualizado, ou alias de path (@/) nao esta configurado
**Fix:** Atualizar todos os imports que referenciam o arquivo movido. Verificar tsconfig.json paths para aliases

## Deep reference library

- [deep-explanation.md](../../../data/skills/next-js/rs-next-js-criando-o-navigation-button/references/deep-explanation.md) — O instrutor identifica que dentro do DatePicker existem botoes de navegacao (dia anterior/proximo di
- [code-examples.md](../../../data/skills/next-js/rs-next-js-criando-o-navigation-button/references/code-examples.md) — // navigation-button.tsx (dentro da pasta do DatePicker)
