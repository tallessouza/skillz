# Deep Explanation: Evitando Chamadas Duplicadas com Signals

## Por que Signals nao disparam com valores iguais

O Angular Signals tem um mecanismo de performance nativo: quando voce faz `signal.set(valor)`, ele compara o valor novo com o atual. Se forem iguais, **nao propaga atualizacao nenhuma**.

Para valores primitivos (number, string, boolean), a comparacao e por valor:
- `signal` vale `1`, voce faz `set(1)` → nao dispara
- `signal` vale `"abc"`, voce faz `set("abc")` → nao dispara

Para objetos e arrays, a comparacao e por **referencia de memoria**:
- `signal` vale `{a: 1}`, voce faz `set({a: 1})` → **DISPARA** (novo objeto, nova referencia)
- `signal` vale `ref`, voce faz `set(ref)` → **nao dispara** (mesma referencia)

## A cadeia de dependencias

O instrutor explica que o problema nao e apenas o Signal em si, mas toda a cadeia:

```
loginParams (Signal)
    ↓ muda?
loginResource (RxResource)
    ↓ sim
HTTP POST /login
    ↓
Response
```

Se `loginParams` nao dispara atualizacao, o `RxResource` nao executa, e a requisicao HTTP nao acontece. E uma otimizacao em cascata.

## Por que o formulario cria novas referencias

Quando voce acessa `this.loginForm.value`, o Angular retorna **o mesmo objeto** enquanto os valores nao mudam. Porem, se voce desestrutura manualmente (`{ email: form.email, password: form.password }`), cria um **novo objeto** a cada chamada — mesmo que os valores internos sejam identicos.

A solucao do instrutor: armazenar `this.loginForm.value` numa constante e passar essa constante ao `set()`. Como o Angular reutiliza a mesma referencia quando os valores nao mudam, o Signal detecta igualdade e nao propaga.

## Impacto pratico

O instrutor demonstra no Network tab do browser:
- **Antes:** cada clique em "Entrar" dispara uma requisicao HTTP, mesmo com dados identicos
- **Depois:** primeiro clique dispara, cliques subsequentes com mesmos dados nao disparam nada
- **Ao mudar um campo:** dispara novamente (comportamento correto)

Isso e especialmente relevante para:
- Formularios de login (usuario clica multiplas vezes por impaciencia)
- Formularios de busca/filtro (mesmos criterios resubmetidos)
- Qualquer interacao que alimenta um RxResource via Signal

## Analogia com memoizacao

O comportamento e similar a memoizacao em programacao funcional: se a entrada nao mudou, reutilize o resultado anterior. Signals fazem isso nativamente para a **propagacao de mudancas**, economizando:
- Re-renders no template
- Recalculos de computed signals
- Requisicoes HTTP via RxResource