# Deep Explanation: Removendo Comentarios e Organizacao de Componentes Angular

## Por que filter e nao splice?

O instrutor usa `this._task.comments = this._task.comments.filter(...)` em vez de `splice`. Isso e intencional no Angular porque:

1. **Change detection**: O Angular (especialmente com OnPush) detecta mudancas por referencia. `filter` cria um novo array, trigando o change detection. `splice` modifica in-place e pode nao ser detectado.
2. **Imutabilidade**: O padrao funcional de criar novos arrays em vez de mutar os existentes e mais previsivel e menos propenso a bugs.
3. **Simplicidade**: Uma unica linha substitui o find-index + splice.

## Padrao de sinalizacao pai-filho (flag pattern)

O instrutor usa `taskCommentsChanged = true` como mecanismo de comunicacao:

- O modal (filho) modifica os comentarios localmente
- Ao fechar o modal, o componente pai verifica essa flag
- Se `true`, o pai chama o metodo da "fonte de verdade" para sincronizar

Esse padrao evita chamadas excessivas ao servico/store a cada mudanca individual. As mudancas sao "batched" — acumuladas localmente e sincronizadas de uma vez ao fechar.

## Organizacao de classe — o padrao do instrutor

O instrutor enfatiza que a ordem dos membros da classe importa para legibilidade:

```
1. Propriedades simples (flags, variaveis locais)
2. Decorators (@Input, @ViewChild, @Output)
3. Injecoes de dependencia (inject() ou constructor)
4. Metodos publicos (onAddComment, onRemoveComment)
5. Metodos privados (helpers internos)
```

Ele destaca: "nao adianta voce colocar um metodo aqui em cima, outro la embaixo, outro no meio das propriedades, vai ficar uma baguna."

## Interpolacao vs texto hardcoded

O instrutor chama texto fixo no template de "achumbado" (hardcoded). A correcao e simples — substituir por interpolacao `{{ }}` — mas o ponto importante e: **componentes de modal devem sempre receber dados via @Input e exibi-los dinamicamente**, nunca ter texto fixo que so funciona para um caso.

## Fonte de verdade

O instrutor menciona repetidamente o conceito de "fonte de verdade". No contexto do GoTask:

- A fonte de verdade e o servico/store que mantem o estado global das tarefas
- O modal trabalha com uma copia local dos dados
- Ao fechar, sincroniza com a fonte de verdade
- Isso evita inconsistencias entre o que o modal mostra e o que o app inteiro ve