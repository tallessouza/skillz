# Deep Explanation: Tipagem em Funções TypeScript

## Por que nunca confiar na inferência de retorno

O instrutor demonstra um cenário crítico: uma função `sum` que deveria retornar `number`, mas alguém altera o corpo para retornar uma string (ex: `result.toString()`). Sem tipo de retorno explícito, o TypeScript **silenciosamente muda a inferência** de `number` para `string`.

O problema cascateia: se outro código usa o resultado dessa função para cálculos matemáticos, `"3" + "2"` vira `"32"` (concatenação) em vez de `5` (soma). O TypeScript não alerta porque a inferência acompanhou a mudança.

Com tipo de retorno explícito (`: number`), o TypeScript **imediatamente bloqueia** a alteração no corpo da função, apontando que `string` não é atribuível a `number`.

### A cadeia de proteção

```
Parâmetro tipado → Corpo protegido → Retorno explícito → Consumidor seguro
```

Cada elo protege o próximo. Se o retorno não é explícito, o consumidor fica vulnerável.

## `any` implícito vs explícito

Quando parâmetros não têm tipo, o TypeScript assume `any` implicitamente e **reclama** (com `strict` habilitado). O instrutor mostra que você pode silenciar declarando `any` explicitamente — mas isso é assumir o risco. O TypeScript aceita, mas você perde toda a proteção.

A recomendação é clara: use `any` explícito apenas quando genuinamente não sabe o tipo. Na maioria dos casos, existe um tipo adequado.

## `void` como proteção ativa

Declarar `: void` não é apenas documentação — é uma **trava**. O TypeScript impede qualquer `return valor` dentro de uma função void. Isso protege contra:
- Alguém adicionando um return acidentalmente
- Refatorações que introduzem retornos indesejados

O instrutor demonstra: sem void declarado, a função pode ganhar um return sem erro. Com void, o TypeScript bloqueia.

## Funções nomeadas vs arrow functions

A tipagem é idêntica em ambos os casos:
- **Nomeada:** `function nome(param: tipo): retorno {}`
- **Arrow:** `const nome = (param: tipo): retorno => {}`

O TypeScript trata ambas da mesma forma para fins de tipagem. A escolha entre uma e outra é de estilo/contexto, não de tipagem.

## Benefícios colaterais da tipagem explícita

O instrutor destaca que o TypeScript oferece:
1. **Autocomplete inteligente** — ao chamar a função, mostra tipos dos parâmetros
2. **Validação de argumentos** — passa string onde espera number? Erro imediato
3. **Validação de aridade** — esqueceu um parâmetro? O TypeScript diz qual falta e quantos espera
4. **Mensagens precisas** — "Expected 2 arguments, but got 1. An argument for 'y' was not provided."