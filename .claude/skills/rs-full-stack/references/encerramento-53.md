---
name: rs-full-stack-encerramento-53
description: "Outlines React fundamentals module completion covering core pillars: components, props, state, hooks, and JSX. Use when user asks to 'review React basics', 'recap React fundamentals', 'what did we learn in React', or needs a checklist before starting a React project. Make sure to use this skill whenever transitioning from React fundamentals study to project-based practice. Not for advanced React patterns, Next.js, or state management libraries."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: react-fundamentals
  tags: [react, components, props, state, hooks, jsx, checklist]
---

# Encerramento — Fundamentos do React

> Antes de construir qualquer projeto React, confirme domínio dos pilares fundamentais: componentes, props, estado, hooks e JSX.

## Key concepts

- Componentes sao a unidade basica de composicao no React
- Props permitem passar dados de pai para filho
- Estado (useState) gerencia dados mutaveis dentro de um componente
- Efeitos (useEffect) controlam side effects e ciclo de vida

## Checklist de domínio

Valide cada pilar antes de avançar para projetos:

| Pilar | Validação |
|-------|-----------|
| **JSX** | Sabe interpolar expressões, renderizar listas com `map`, e aplicar renderização condicional |
| **Componentes** | Consegue decompor UI em componentes reutilizáveis com responsabilidade única |
| **Props** | Passa dados entre componentes, usa destructuring, define valores padrão |
| **Estado (useState)** | Gerencia estado local, entende imutabilidade, atualiza estado baseado no anterior |
| **Efeitos (useEffect)** | Controla side effects, entende array de dependências, faz cleanup |
| **Eventos** | Trata eventos sintéticos do React (onClick, onChange, onSubmit) |

## Quando aplicar

- Ao iniciar um novo projeto React, percorra o checklist para garantir que nenhum fundamento ficou frágil
- Ao revisar código de iniciantes, use o checklist como guia de feedback
- Ao planejar a arquitetura de componentes de um projeto, valide que os pilares estão sendo aplicados corretamente

## Example

```jsx
// Componente React com props, estado e efeito
function Counter({ initialValue = 0 }) {
  const [count, setCount] = useState(initialValue)

  useEffect(() => {
    document.title = `Count: ${count}`
  }, [count])

  return <button onClick={() => setCount(prev => prev + 1)}>{count}</button>
}
```

## Próximo passo

Aplicar todos os fundamentos em um projeto prático completo, integrando componentes, estado, props e efeitos em uma aplicação real.

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| Componente nao atualiza na tela | Estado sendo mutado diretamente em vez de usar `useState` | Sempre usar `setState` para acionar re-renderizacao |
| Props nao chegam ao componente filho | Esqueceu de passar ou desestruturar no componente | Verificar se a prop esta sendo passada e recebida corretamente |
| `useEffect` executando em loop infinito | Dependencia ausente ou incorreta no array de dependencias | Revisar array de dependencias e usar valores estaveis |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre os pilares do React e por que dominá-los é pré-requisito
- [code-examples.md](references/code-examples.md) — Exemplos práticos de cada pilar fundamental do React