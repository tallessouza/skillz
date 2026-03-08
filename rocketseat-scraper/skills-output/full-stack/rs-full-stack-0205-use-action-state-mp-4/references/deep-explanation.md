# Deep Explanation: useActionState

## Por que useActionState existe

No React 18, gerenciar formulários com requisições assíncronas exigia múltiplos `useState`: um para loading, outro para erro, outro para dados. O useActionState do React 19 consolida tudo em um único hook, eliminando a necessidade de gerenciar estados manualmente.

## Como o ciclo de estado funciona

O useActionState funciona como uma máquina de estados:

1. **Estado inicial** — o segundo parâmetro do hook (pode ser `null`, string vazia, ou objeto)
2. **Trigger** — o formulário dispara o `formAction` via `<form action={formAction}>`
3. **Execução** — o formAction chama sua função passando `(prevState, formData)`
4. **Retorno** — o que sua função retorna se torna o novo `state`
5. **Re-render** — o componente re-renderiza com o novo state

```
Estado inicial → formAction dispara → fn(prevState, formData) → retorno vira state → re-render
```

## O parâmetro prevState em detalhe

O prevState é o estado **antes** da execução atual. Na primeira execução, é o valor inicial passado ao hook.

Exemplo de evolução do estado:
- Chamada 1: prevState = `null` (valor inicial) → retorna `{ email: "rodrigo@email.com" }`
- Chamada 2: prevState = `{ email: "rodrigo@email.com" }` → retorna `{ email: "joao@email.com" }`
- Chamada 3: prevState = `{ email: "joao@email.com" }` → ...

O prevState é útil para:
- Comparar valores anteriores com atuais
- Implementar lógica de retry (contar tentativas)
- Manter histórico de submissões

**Atenção:** se você exibir prevState com console.log dentro da função, verá o estado **antes** do retorno. O retorno só atualiza o state após a função completar.

## isPending vs useState para loading

Com useState manual:
```typescript
const [isLoading, setIsLoading] = useState(false)
// Precisa lembrar de setIsLoading(true) antes da requisição
// Precisa lembrar de setIsLoading(false) depois
// Se der erro e não tratar, isLoading fica true para sempre
```

Com useActionState:
```typescript
const [state, formAction, isPending] = useActionState(fn, null)
// isPending é automaticamente true enquanto a Promise não resolve
// Não precisa gerenciar manualmente
// Se der erro, isPending volta a false automaticamente
```

O isPending é gerenciado internamente pelo React — é `true` desde o momento que a ação é disparada até o momento que a Promise retornada pela função resolve (ou rejeita).

## Analogia do instrutor

O instrutor demonstra com setTimeout simulando latência de API:
- 700ms: botão bloqueia brevemente
- 1000ms: 1 segundo de loading visível
- 3000ms: 3 segundos claramente perceptíveis

Isso ilustra que em produção, a Promise será uma chamada real à API, e o isPending refletirá o tempo real de resposta do servidor.

## Quando usar state como defaultValue

O state do useActionState é perfeito para manter valores do formulário após submissão:

```tsx
<input name="email" defaultValue={state?.email ?? ""} />
```

Isso evita que o formulário limpe os campos após submissão — útil para:
- Formulários que podem falhar (manter dados para re-tentativa)
- Formulários com validação server-side (manter dados enquanto corrige erros)

## Diferença entre state inicial null vs objeto vazio

- `null`: indica ausência de estado, útil quando não quer pré-popular campos
- `{ email: "", password: "" }`: útil quando precisa de tipagem consistente e quer evitar verificações de null

## Ordem dos parâmetros da função de ação

A assinatura é `(prevState, formData)` — **não** `(formData, prevState)`. O React injeta o prevState como primeiro argumento automaticamente quando a função é usada com useActionState. Sem useActionState, uma form action recebe apenas `(formData)`.