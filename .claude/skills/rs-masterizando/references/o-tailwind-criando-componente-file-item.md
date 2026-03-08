---
name: rs-tailwind-file-item-states
description: "Enforces multi-state component patterns with Tailwind CSS when building upload components or any UI element with progress, complete, and error states. Use when user asks to 'create a file upload component', 'add error state to component', 'style upload progress', 'create multi-state UI', or 'add visual feedback states'. Applies conditional styling, custom color palettes, and icon swapping based on component state. Make sure to use this skill whenever building components that need progress/success/error visual variations. Not for form validation logic, file upload API integration, or server-side error handling."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: masterizando-o-tailwind
  module: componentes
  tags: [tailwind, react, flexbox]
---

# Componente Multi-Estado com Tailwind CSS

> Componentes com multiplos estados visuais (progress, complete, error) devem ter estilizacao condicional clara, paletas de cores customizadas e troca de icones por estado.

## Rules

1. **Extraia componentes com estado proprio** — separe o FileItem do FileList, porque cada item tem estado independente (progress, complete, error) e misturar estados no pai gera complexidade desnecessaria
2. **Defina estados como union type** — `state: 'progress' | 'complete' | 'error'`, porque permite TypeScript validar todas as variações e evita strings magicas
3. **Crie paletas de cores customizadas no tailwind.config** — use nomes semanticos como `error` ao inves de `red`, porque `error-700` comunica intencao melhor que `red-700`
4. **Troque icones por estado, nao esconda com CSS** — renderize condicionalmente o icone correto (Trash para progress, CheckCircle2 para complete, botao Try Again para error), porque display:none ainda carrega o elemento no DOM
5. **Ajuste progresso ao estado** — complete = 100%, progress = valor real, error = esconda a barra, porque mostrar 80% num upload completo confunde o usuario
6. **Use tonalidades medias para texto de erro (600-700)** — evite 500 que e muito claro para leitura, porque acessibilidade exige contraste suficiente

## How to write

### Componente FileItem com estados

```tsx
type FileItemState = 'progress' | 'complete' | 'error'

interface FileItemProps {
  name: string
  size: number
  state?: FileItemState
}

export function FileItem({ name, size, state = 'progress' }: FileItemProps) {
  return (
    <div className="border rounded-lg p-4">
      {/* Conteudo muda por estado */}
      {state === 'error' ? (
        <div className="flex flex-col">
          <span className="text-error-700">Upload failed. Please try again.</span>
          <span className="text-error-600">{name}</span>
          <button className="text-sm font-semibold text-error-700 hover:text-error-900">
            Try again
          </button>
        </div>
      ) : (
        <div className="flex flex-col">
          <span>{name}</span>
          <span>{formatBytes(size)}</span>
          {/* Barra de progresso */}
          <div
            className="h-2 rounded-full bg-violet-600"
            style={{ width: state === 'complete' ? '100%' : '80%' }}
          />
        </div>
      )}

      {/* Icone/acao muda por estado */}
      {state === 'complete' ? (
        <CheckCircle2 className="h-5 w-5 fill-violet-600 text-white" />
      ) : state !== 'error' ? (
        <button><Trash2 className="h-5 w-5" /></button>
      ) : null}
    </div>
  )
}
```

### Paleta customizada no tailwind.config

```ts
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        error: {
          25: '#FFFBFA',
          50: '#FEF3F2',
          100: '#FEE4E2',
          200: '#FECDCA',
          300: '#FDA29B',
          400: '#F97066',
          500: '#F04438',
          600: '#D92D20',
          700: '#B42318',
          800: '#912018',
          900: '#7A271A',
        },
      },
    },
  },
}
```

## Example

**Before (tudo inline, sem estados):**
```tsx
<div className="border p-4">
  <span>{file.name}</span>
  <div className="h-2 bg-red-500" style={{ width: '80%' }} />
  <button><Trash2 /></button>
</div>
```

**After (componente com estados e paleta semantica):**
```tsx
<FileItem name={file.name} size={file.size} state="error" />
// Renderiza: mensagem de erro com text-error-700, botao "Try again", sem barra de progresso
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Upload em andamento | `state="progress"`, mostra barra + icone Trash |
| Upload concluido | `state="complete"`, barra 100% + CheckCircle2 preenchido |
| Upload falhou | `state="error"`, mensagem erro + botao Try Again |
| Cor de erro no projeto | Crie paleta `error` no tailwind.config, nao use `red` direto |
| Icone de sucesso precisa destaque | Use `fill-violet-600 text-white` para preencher o icone |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `className={hasError ? 'text-red-500' : ''}` | `className="text-error-700"` com paleta customizada |
| `{!error && <Trash2 />}` misturado no JSX | Bloco condicional explicito por estado |
| `style={{ width: '80%' }}` fixo | `style={{ width: state === 'complete' ? '100%' : '80%' }}` |
| `color: 'red'` inline para erros | Classes Tailwind com paleta semantica `error-700` |
| Um componente gigante com tudo | FileItem extraido com props tipadas |
## Troubleshooting

### Props nao chegam ao elemento HTML
**Symptom:** className, onClick ou outras props passadas ao componente nao funcionam.
**Cause:** O componente nao usa spread props (`{...props}`) no elemento raiz.
**Fix:** Adicione `{...props}` no elemento HTML raiz do componente para repassar todas as props.

### Estilos do consumidor sobrescritos pelo componente
**Symptom:** className passada pelo pai nao tem efeito.
**Cause:** O spread `{...props}` esta antes das classes base, sobrescrevendo o className do pai.
**Fix:** Coloque classes base antes do spread: `className="base-classes" {...props}` ou use `twMerge`.

## Deep reference library

- [deep-explanation.md](../../../data/skills/masterizando-o-tailwind/rs-masterizando-o-tailwind-criando-componente-file-item/references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](../../../data/skills/masterizando-o-tailwind/rs-masterizando-o-tailwind-criando-componente-file-item/references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
