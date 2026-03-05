# Deep Explanation: Interpolacao Angular

## O que e interpolacao

Interpolacao e o mecanismo do Angular para exibir valores do componente no template usando `{{ }}`. Tudo dentro das chaves duplas e avaliado como uma expressao TypeScript e o resultado e **convertido em string** antes de ser renderizado no DOM.

## Change Detection — a "magica" do Angular

O Angular possui um sistema chamado **Change Detection** que monitora as propriedades usadas no template. Quando o valor de uma propriedade muda na classe do componente, o Angular detecta essa mudanca e **atualiza automaticamente** o template nos locais necessarios.

Isso e poderoso, mas tem uma consequencia critica: **o Change Detection roda multiplas vezes**. Nao e executado apenas uma vez — ele e disparado por diversos eventos (clicks, HTTP responses, timers, etc.). Cada vez que roda, todas as expressoes de interpolacao sao re-avaliadas.

### Por que metodos com side effects sao perigosos

O instrutor demonstrou ao vivo o problema. Criou um metodo `meuCounter()` que incrementa `this.counter` e retorna o valor. Ao usar `{{ meuCounter() }}` no template:

- O valor mostrado ja comecava em 2 ou 3 (nao 1), porque o Change Detection ja tinha rodado varias vezes antes do primeiro render
- Cada interacao (como clicar em um botao) fazia o counter pular de 5 para 6, de 8 para 9, de forma imprevisivel
- O Angular ate exibiu um erro no console, que e um erro comum quando propriedades mudam durante o ciclo de deteccao

**Analogia:** e como se voce pedisse para alguem "me diz que horas sao" mas cada vez que a pessoa olha o relogio, ela adianta 1 minuto. Voce nunca vai ter a hora certa.

## Pipes — transformacao pura

Pipes sao a forma correta de transformar valores no template porque sao **funcoes puras** — dado o mesmo input, retornam sempre o mesmo output, sem efeitos colaterais. O Angular otimiza pipes puros para nao re-executar quando o input nao mudou.

### Pipes nativos importantes
- `uppercase` / `lowercase` — transformacao de texto
- `date` — formatacao de datas (aceita parametros como `'shortDate'`)
- `currency` — formatacao monetaria (aceita locale, simbolo, digitos)
- `async` — se inscreve em Observables e resolve Promises automaticamente, e se desinscreve quando o componente e destruido

Todos vem de `@angular/common` e precisam ser importados no array `imports` do componente.

## Getters (propriedades computadas)

Quando voce precisa de um valor derivado de outras propriedades mas nao quer criar um pipe, use um **getter**:

```typescript
get nomeCompleto(): string {
  return `${this.nome} ${this.sobrenome}`;
}
```

No template, acesse como propriedade (sem parenteses): `{{ nomeCompleto }}`.

Dentro da propria classe, acesse com `this.nomeCompleto`.

**Cuidado:** getters tambem sao re-executados pelo Change Detection. Mantenha-os simples — sem chamadas HTTP, sem manipulacao de listas grandes, sem logica de negocio complexa.

## Conversao para string

Tudo dentro de `{{ }}` e convertido para string. Isso significa:
- Numeros: funcionam normalmente (`25` → `"25"`)
- Booleanos: funcionam (`true` → `"true"`)
- Strings: direto
- Objetos: mostram `[object Object]` — ilegivel
- Arrays: mostram os itens separados por virgula, mas de forma nao controlada

Por isso, sempre acesse propriedades especificas de objetos e itens especificos de arrays.

## As 3 coisas que interpolacao NAO deve fazer

1. **Chamar metodos com efeitos colaterais** — Change Detection re-executa multiplas vezes
2. **Logica de negocio complexa** — chamadas HTTP, manipulacao de listas, calculos pesados
3. **Atribuicao de valores** — `{{ counter = 2 }}` nao funciona, interpolacao e somente leitura