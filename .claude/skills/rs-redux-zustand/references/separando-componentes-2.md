---
name: rs-redux-zustand-separando-componentes
description: "Enforces React component decomposition patterns when splitting monolithic pages into smaller components. Use when user asks to 'separate components', 'break down a page', 'extract component', 'split UI into components', or 'organize React components'. Applies rules: one responsibility per component, props for dynamic data, meaningful component names, index adjustments for display. Make sure to use this skill whenever refactoring large JSX into smaller pieces. Not for state management, API integration, or styling decisions."
---

# Separando Componentes React

> Decomponha paginas monoliticas em componentes pequenos, cada um com uma unica responsabilidade, recebendo dados via props.

## Rules

1. **Um componente = uma responsabilidade visual** — `Header` exibe titulo, `Video` encapsula o player, `Module` lista aulas, porque componentes focados sao reutilizaveis e testaveis
2. **Extraia de baixo pra cima** — comece pelos componentes folha (Lesson), depois os intermediarios (Module), depois os containers (Player), porque dependencias ficam claras
3. **Nomeie pelo dominio, nao pela estrutura** — `Video` nao `PlayerWrapper`, `Lesson` nao `ListItem`, porque o nome deve comunicar O QUE e, nao COMO e implementado
4. **Props tipadas com apenas o necessario** — passe `title` e `duration`, nao o objeto inteiro, porque reduz acoplamento e facilita reutilizacao
5. **Ajuste indices para exibicao** — use `moduleIndex + 1` ao exibir para o usuario, porque arrays comecam em zero mas humanos contam a partir de um
6. **Cuidado com colisao de nomes** — se um icone e um componente tem o mesmo nome (ex: `Video`), renomeie ou importe de forma explicita, porque colisoes causam bugs silenciosos

## How to write

### Componente folha (Lesson)

```tsx
interface LessonProps {
  title: string
  duration: string
}

export function Lesson({ title, duration }: LessonProps) {
  return (
    <button>
      <Video className="w-4 h-4" />
      <span>{title}</span>
      <span>{duration}</span>
    </button>
  )
}
```

### Componente intermediario (Module)

```tsx
interface ModuleProps {
  title: string
  amountOfLessons: number
  moduleIndex: number
}

export function Module({ title, amountOfLessons, moduleIndex }: ModuleProps) {
  return (
    <div>
      <span>Módulo {moduleIndex + 1}</span>
      <h3>{title}</h3>
      <span>{amountOfLessons} aulas</span>
      <Lesson title="Fundamentos do Redux" duration="09:13" />
    </div>
  )
}
```

## Example

**Before (tudo numa pagina so):**

```tsx
export function Player() {
  return (
    <div>
      <header>
        <span>Módulo: Desvendando o Redux</span>
        <h1>Fundamentos do Redux</h1>
      </header>
      <div>
        <ReactPlayer />
      </div>
      <aside>
        <div>
          <span>Módulo 1</span>
          <button><Video /> Fundamentos <span>09:13</span></button>
          <button><Video /> Usando Redux <span>11:45</span></button>
        </div>
      </aside>
    </div>
  )
}
```

**After (componentes separados):**

```tsx
export function Player() {
  return (
    <div>
      <Header />
      <Video />
      <aside>
        <Module title="Desvendando o Redux" amountOfLessons={3} moduleIndex={0} />
        <Module title="Estrutura Redux" amountOfLessons={2} moduleIndex={1} />
      </aside>
    </div>
  )
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Bloco JSX se repete 2+ vezes | Extrair como componente com props |
| Secao da pagina tem responsabilidade clara | Extrair mesmo sem repeticao |
| Componente precisa de dados dinamicos | Definir interface de props tipada |
| Indice de array exibido ao usuario | Somar 1 antes de renderizar |
| Nome do componente colide com import | Renomear o import do icone ou usar alias |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| Pagina com 200+ linhas de JSX | Componentes de 20-50 linhas cada |
| `<div>{/* modulo 1 */}...{/* modulo 2 */}...` | `<Module />` com props |
| Props com objeto inteiro `lesson={lessonObj}` | Props primitivas `title={lesson.title}` |
| `Módulo {index}` (exibe zero) | `Módulo {index + 1}` |
| Componente chamado `Section1`, `Part2` | Componente chamado `Header`, `Module`, `Lesson` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/redux-zustand/rs-redux-zustand-separando-componentes-2/references/deep-explanation.md)
- [Code examples](../../../data/skills/redux-zustand/rs-redux-zustand-separando-componentes-2/references/code-examples.md)
