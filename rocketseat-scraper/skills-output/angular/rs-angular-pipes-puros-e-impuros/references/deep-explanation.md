# Deep Explanation: Pipes Puros e Impuros

## Por que pipes existem (alem de reuso)

O instrutor Felipe destaca dois motivos fundamentais para usar pipes ao inves de metodos:

### 1. Reuso
Se voce precisa transformar um `userStatus` (number → string) em 10 componentes, com um pipe voce escreve a logica uma vez. Com metodos, voce duplica a logica em cada componente.

### 2. Performance (o motivo mais importante)

Aqui esta a sacada principal: **pipes puros so executam quando o parametro muda**. Metodos no template executam **a cada ciclo de Change Detection**.

## Change Detection — a raiz do problema

O Angular possui um mecanismo chamado Change Detection que verifica se o template precisa ser atualizado. Ele e disparado por diversos eventos:

- Cliques do usuario
- Requisicoes HTTP completadas
- Timers (setTimeout, setInterval)
- Qualquer evento do DOM

Quando o Change Detection dispara em um componente, **tudo no template e reavaliado**. Se voce tem um metodo `{{ getUserStatus(status) }}`, ele sera chamado novamente — mesmo que `status` nao tenha mudado.

### Demonstracao do instrutor

Felipe demonstrou isso colocando `console.log` em ambos:

- **Pipe puro**: chamado **2 vezes** (uma por usuario, no render inicial)
- **Metodo no componente**: chamado **diversas vezes** no render inicial

Ao adicionar um botao com `(click)`, cada clique disparava o Change Detection:
- **Pipe puro**: **0 chamadas adicionais** (parametro nao mudou)
- **Metodo**: **4 chamadas** (2 usuarios × 2 execucoes por ciclo)

## Pipe impuro (`pure: false`)

Quando Felipe setou `pure: false` no decorator:

```typescript
@Pipe({ name: 'userStatus', pure: false })
```

O pipe passou a se comportar exatamente como um metodo — reativo a cada Change Detection. O `console.log` mostrou multiplas execucoes a cada clique.

### Quando usar pipe impuro?

Felipe e categorico: **"99% das vezes voce nao vai precisar. Eu nunca precisei."**

Casos teoricos onde faria sentido:
- Pipe que depende de estado externo que muda sem alterar o input (ex: locale, timezone dinamico)
- Pipe que transforma arrays mutaveis (o Angular nao detecta mutacao em arrays/objetos por referencia)

Mas mesmo nesses casos, geralmente ha alternativas melhores (signals, observables com async pipe).

## A regra de ouro para templates

> "Evite ao maximo chamar metodos no template. Tente quebrar a cabeca para criar uma logica que nao precise disso."

Se absolutamente necessario chamar um metodo no template:
- A logica deve ser **trivial** (sem complexidade computacional)
- **Nunca** faca chamadas HTTP
- **Nunca** execute processamentos grandes
- Considere que quanto mais componentes na aplicacao, mais Change Detections sao disparados, multiplicando o problema

## Escala do problema

O instrutor enfatiza: "quanto mais componentes, mais Change Detection sao disparados". Em uma aplicacao real com dezenas de componentes, um metodo no template pode ser executado centenas de vezes por segundo durante interacoes do usuario, transformando uma operacao "simples" em um gargalo real de performance.