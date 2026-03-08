# Deep Explanation: Carregando Dados da Solicitação

## Por que uma função async separada em vez de inline no useEffect?

O useEffect não aceita diretamente uma função async como callback. Se você escrever `useEffect(async () => {...})`, o React espera que o cleanup seja uma função, mas async retorna uma Promise. A solução idiomática é criar a função async fora (ou dentro do useEffect mas invocada separadamente):

```typescript
// ERRADO — useEffect não deve ser async
useEffect(async () => {
  const data = await api.get(...)
}, [])

// CORRETO — função async separada, chamada dentro do useEffect
useEffect(() => {
  if (params.id) {
    fetchRefund(params.id)
  }
}, [params.id])
```

O instrutor escolhe declarar `fetchRefund` fora do useEffect como método do componente. Isso facilita reutilização (por exemplo, um botão "recarregar" poderia chamar a mesma função).

## Guard clause no useEffect — por que verificar o ID?

Quando o componente é usado tanto para criação (sem ID) quanto para visualização (com ID), o useEffect roda em ambos os casos. Sem o guard `if (params.id)`, a requisição seria feita com `undefined`, gerando erro 404 ou comportamento inesperado:

```typescript
// Sem guard — faz requisição GET /refunds/undefined
useEffect(() => {
  fetchRefund(params.id) // params.id pode ser undefined
}, [params.id])

// Com guard — só faz requisição quando tem ID
useEffect(() => {
  if (params.id) {
    fetchRefund(params.id)
  }
}, [params.id])
```

O ID como dependência do useEffect garante que, se o ID mudar (navegação entre registros), os dados serão recarregados.

## Tratamento de erro com instanceof AxiosError

O Axios encapsula erros HTTP em uma classe `AxiosError` que contém `response.data.message` — a mensagem de erro que o backend retorna. Sem verificar a instância, você não tem acesso seguro a esses campos:

```typescript
catch (error) {
  // error pode ser qualquer coisa: AxiosError, TypeError, etc.
  if (error instanceof AxiosError) {
    // Agora TypeScript sabe que error.response existe
    return alert(error.response?.data.message)
  }
  // Fallback genérico para erros não-Axios
  alert("Não foi possível carregar")
}
```

O `return` dentro do `if` é um early return — evita que o alert genérico também execute.

## Separação de tipos: singular vs plural

O instrutor enfatiza criar tipos separados para respostas de item único vs lista:

```typescript
// Para GET /refunds (lista)
type RefundsAPIResponse = {
  refunds: Refund[]
  total: number
}

// Para GET /refunds/:id (item único)
type RefundAPIResponse = {
  id: string
  name: string
  category: string
  amount: number
  fileName: string
}
```

A justificativa: "eventualmente você vai precisar da tipagem de uma refund e não de várias". Quando os tipos são granulares, o reaproveitamento é natural — você não precisa extrair tipos de dentro de arrays ou fazer manipulações complexas.

## Desestruturação do response.data

Em vez de repetir `response.data.name`, `response.data.category`, etc., o instrutor desestrutura uma vez:

```typescript
const { data } = response
// ou direto: const { data } = await api.get<RefundAPIResponse>(...)

setName(data.name)
setCategory(data.category)
```

Isso reduz repetição e torna o código mais limpo. É um padrão idiomático do Axios onde `response.data` contém o corpo da resposta.

## Estados separados para exibição vs envio de arquivo

O componente usa dois estados distintos:
- `fileURL` (string | null) — URL do arquivo para exibição/visualização
- `file` — arquivo selecionado pelo usuário para upload

São responsabilidades diferentes. O `fileURL` vem da API (dado existente), enquanto `file` é input do usuário (dado novo). Misturar os dois em um único estado gera complexidade desnecessária.

## Modo readonly condicional

Quando `params.id` existe, o formulário está em modo visualização. O instrutor desabilita os inputs:

```tsx
<input disabled={!!params.id} />
```

Isso transforma o mesmo componente de formulário em tela de visualização sem duplicar código. O botão de comprovante também é condicionado:

```tsx
{params.id && fileURL && <button>Abrir comprovante</button>}
```

Dois guards: precisa ter ID (modo visualização) E ter arquivo associado.

## Formatação de valores monetários

O instrutor usa `formatCurrency` para converter o valor numérico da API para formato brasileiro:

```typescript
setAmount(formatCurrency(data.amount))
```

A função usa `Intl.NumberFormat` ou similar para formatar como "R$ 1.234,56". Importante: o valor é formatado NO MOMENTO de setar o estado, não no render. Isso porque o input armazena a string formatada.