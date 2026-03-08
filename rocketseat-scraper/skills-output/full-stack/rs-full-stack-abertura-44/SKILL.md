---
name: rs-full-stack-abertura-44
description: "Guides React form architecture decisions when choosing between controlled inputs, uncontrolled inputs, and stateless form management. Use when user asks to 'create a form', 'handle form submit', 'validate form fields', 'capture form data', or 'manage inputs in React'. Provides decision framework for input strategy and validation approach. Make sure to use this skill whenever building React forms or choosing between controlled vs uncontrolled inputs. Not for backend form processing, database operations, or non-React form libraries."
---

# Formulários em React — Visão Geral e Decisão de Estratégia

> Escolha a estratégia de formulário (controlado, não controlado, ou sem estado) com base na complexidade do caso de uso, e implemente validação para todos os campos obrigatórios.

## Key concept

Formulários em React possuem três estratégias fundamentais, cada uma com trade-offs distintos. A escolha correta depende de quanto controle sobre os dados em tempo real é necessário versus a simplicidade desejada.

## Decision framework

| Quando você encontrar | Aplique |
|----------------------|---------|
| Precisa reagir a cada keystroke (mask, preview, enable/disable) | Input controlado com `useState` |
| Precisa apenas dos dados no momento do submit | Input não controlado com `ref` ou `FormData` |
| Formulário simples sem lógica intermediária | Captura via `FormData` no `onSubmit` — sem estado |
| Campos obrigatórios com regras específicas por tipo | Validação explícita antes de processar o submit |
| Formulário complexo com muitos campos | Considere `FormData` para evitar múltiplos `useState` |

## Três estratégias

### 1. Input controlado (com estado)
O React controla o valor do input via `useState`. Cada digitação atualiza o estado.

```tsx
const [name, setName] = useState('')
<input value={name} onChange={e => setName(e.target.value)} />
```

**Quando usar:** feedback em tempo real, máscaras, validação instantânea.

### 2. Input não controlado (sem estado)
O DOM mantém o valor. Acesso via `useRef` quando necessário.

```tsx
const nameRef = useRef<HTMLInputElement>(null)
<input ref={nameRef} />
// No submit: nameRef.current?.value
```

**Quando usar:** formulários simples, sem necessidade de reatividade.

### 3. Captura no submit (FormData, sem estado)
Captura todos os campos de uma vez no evento de submit, sem nenhum `useState`.

```tsx
function handleSubmit(event: FormEvent<HTMLFormElement>) {
  event.preventDefault()
  const formData = new FormData(event.currentTarget)
  const name = formData.get('name')
}
```

**Quando usar:** múltiplos campos, dados necessários apenas no submit.

## Validação

Independente da estratégia, valide campos obrigatórios antes de processar:
- Verifique se campos required foram preenchidos
- Valide o tipo de dado esperado (email, número, data)
- Forneça feedback visual ao usuário sobre erros

## Heuristics

| Situação | Faça |
|----------|------|
| 1-2 campos com feedback visual | Controlado com `useState` |
| 3+ campos, dados só no submit | `FormData` sem estado |
| Campo com máscara (CPF, telefone) | Controlado — precisa interceptar cada keystroke |
| Formulário de busca com debounce | Controlado com `useState` + `useEffect` |
| Upload de arquivo | Não controlado com `ref` |

## Anti-patterns

| Nunca faça | Faça ao invés |
|------------|---------------|
| Um `useState` para cada campo em formulário grande | `FormData` no submit para capturar tudo de uma vez |
| Validar apenas no backend | Validar no frontend E no backend |
| Ignorar campos obrigatórios | Validar presença e tipo antes de submeter |
| Misturar controlado e não controlado no mesmo input | Escolha uma estratégia por input e mantenha |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre trade-offs entre estratégias de formulário
- [code-examples.md](references/code-examples.md) — Exemplos completos de cada estratégia com validação