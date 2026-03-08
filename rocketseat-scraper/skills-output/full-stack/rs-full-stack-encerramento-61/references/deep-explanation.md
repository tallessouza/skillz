# Deep Explanation: Formulários em React

## Por que existem duas abordagens para inputs?

No React, o DOM é uma abstração gerenciada pelo Virtual DOM. Quando você usa um input **controlado**, o React é a "fonte de verdade" — o valor do input vive no estado do componente. Isso significa que **cada tecla digitada** causa um re-render, porque o estado muda.

Quando você usa um input **não controlado**, o DOM nativo é a fonte de verdade. O React não sabe o valor do input até você explicitamente pedir via `ref`. Isso significa **zero re-renders** durante a digitação.

### A analogia do instrutor

Pense assim: input controlado é como um professor que confere cada letra que o aluno escreve. Input não controlado é como um professor que só olha a prova quando o aluno entrega. Para uma prova de 2 questões, conferir cada letra é ok. Para uma prova de 50 questões, é inviável.

## Por que React Hook Form é padrão de mercado?

O problema real aparece em formulários com muitos campos. Se você tem 10 inputs controlados, cada digitação em qualquer campo causa re-render de **todo o formulário** (e todos os 10 inputs). React Hook Form resolve isso usando inputs não controlados internamente, mas oferecendo uma API declarativa que parece controlada.

### O que React Hook Form faz por baixo dos panos

1. Registra cada input com `register()` — internamente usa `ref`
2. Não causa re-renders durante digitação
3. Coleta todos os valores apenas no `submit`
4. Integra com bibliotecas de validação (Zod, Yup) via `resolver`

### Performance: a diferença real

| Abordagem | Re-renders por keystroke | Re-renders no submit |
|-----------|------------------------|---------------------|
| 10x `useState` | 10 (todo o form) | 1 |
| React Hook Form | 0 | 1 |

Em formulários complexos, isso é a diferença entre uma UI responsiva e uma UI travada.

## Validação: por que schema validation?

Validação manual com `if/else` tem problemas:
- Código imperativo difícil de manter
- Fácil esquecer um caso
- Mensagens de erro inconsistentes
- Impossível reutilizar regras entre forms

Schema validation (Zod/Yup) resolve tudo:
- Declarativa: descreva O QUE é válido, não COMO validar
- Composável: schemas podem ser combinados e estendidos
- Type-safe: Zod infere o tipo TypeScript automaticamente
- Reutilizável: mesmo schema no front e no back

## Quando NÃO usar React Hook Form

- Formulários com 1-2 campos onde `useState` é mais simples
- Campos que precisam reagir em tempo real (busca, autocomplete) — nesses casos, input controlado é necessário
- Protótipos rápidos onde a dependência extra não vale

## Edge cases discutidos

### Campos que precisam de ambas as abordagens

Às vezes um formulário grande usa React Hook Form para a maioria dos campos, mas um campo específico (como busca com autocomplete) precisa ser controlado. Isso é possível com `watch()` do React Hook Form, que permite observar um campo específico sem controlar todos.

### Formulários multi-step

React Hook Form suporta formulários de múltiplas etapas mantendo os dados entre steps, algo que seria muito complexo com `useState` puro (precisaria de lifting state up ou context).