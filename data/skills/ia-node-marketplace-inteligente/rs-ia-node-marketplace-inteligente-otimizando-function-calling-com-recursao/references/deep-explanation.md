# Deep Explanation: Otimizando Function Calling com Recursão

## O problema que motivou a recursão

Quando você faz uma completion com tools habilitadas, a API pode retornar `tool_calls` pedindo que você execute funções. O resultado dessas funções vai de volta como mensagem, e uma nova completion é feita. Mas essa segunda completion **também pode retornar tool_calls**. E a terceira também. E assim infinitamente.

O instrutor começou com código serial — `completion1`, depois processa tool_calls, depois `completion2`, processa de novo, `completion3`... Isso funciona para casos conhecidos, mas não escala. Se o modelo decide que precisa de 5 chamadas encadeadas, seu código serial não cobre.

## Por que o instrutor ensinou serial primeiro

> "Deixei fora primeiro porque recursão é difícil de entender no começo. Então aqui ficaria mais fácil da gente ver acontecendo em série pra depois a gente poder aplicar a recursão."

Essa é uma estratégia pedagógica importante: entender o fluxo linear antes de abstrair em recursão. Na prática, a versão serial ajuda a visualizar:
1. Faz completion → recebe tool_calls
2. Executa as funções → coloca resultados nas messages
3. Faz outra completion → verifica de novo

Quando você entende esse ciclo, a recursão é natural: é o mesmo ciclo, mas a função chama a si mesma em vez de você copiar/colar código.

## O bug clássico: retornar parsed dentro da recursão

O instrutor encontrou um erro ao vivo: `Properties of undefined, linha 105`. O problema era que dentro do loop recursivo, ele estava retornando `completion.choices[0].message.parsed` (o conteúdo parseado) em vez da completion inteira.

Por que isso quebra? Porque quando a função recursiva chama `return completionWithToolResults(messages)`, ela espera receber uma completion completa de volta. Se uma das chamadas internas retorna apenas o parsed (que pode ser `undefined` em chamadas intermediárias), toda a cadeia quebra.

**Regra derivada:** Dentro da recursão, sempre retorne o objeto completo. Extraia o que precisa apenas no ponto final de consumo, fora da função recursiva.

## O fluxo recursivo explicado

```
completionWithToolResults(messages)
  → completion tem tool_calls? SIM
    → executa funções, adiciona resultados às messages
    → return completionWithToolResults(messages)  // RECURSÃO
      → completion tem tool_calls? SIM
        → executa funções, adiciona resultados
        → return completionWithToolResults(messages)
          → completion tem tool_calls? NÃO
          → return completion  // CASO BASE
        ← recebe completion, retorna
      ← recebe completion, retorna
    ← recebe completion final
  → extrai parsed do resultado
```

## Sobre o mapa de funções

O instrutor mencionou que as funções disponíveis poderiam ser recebidas por parâmetro para ficar "mais personalizável, mais customizável", mas optou por deixar fixo por enquanto. Na prática, passar o mapa como parâmetro é uma boa evolução:

```typescript
async function completionWithToolResults(
  messages: Message[],
  functionMap: Record<string, Function>  // parametrizado
)
```

Isso permite reutilizar a mesma função recursiva em diferentes contextos com diferentes conjuntos de tools.

## Nota sobre o prompt e resultados

O instrutor observou que o modelo retornou resultados estranhos para "almoço saudável" — listando macarrão, sal, leite e iogurte grego. Ele reforçou no prompt "liste no máximo 3 produtos que atendem à necessidade" e o resultado melhorou. O ponto dele: isso é questão de prompt engineering, não do mecanismo de function calling. A recursão funcionou corretamente — o problema era o prompt.