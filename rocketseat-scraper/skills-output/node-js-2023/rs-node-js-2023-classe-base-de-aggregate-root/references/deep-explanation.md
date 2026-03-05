# Deep Explanation: AggregateRoot — Classe Base DDD

## O que e um Aggregate Root

O agregado em si nao necessariamente traz novas funcionalidades para dentro de uma entidade — ele **simboliza um conjunto de entidades que trabalham juntas**. A classe AggregateRoot existe para marcar qual e a entidade principal dentro desse conjunto.

O "Root" vem de "raiz". Todo agregado tem uma entidade pai, a entidade raiz. No exemplo de um pedido com varios itens, o Pedido e o root. A partir dele nascem as outras entidades. Sem o pedido, nenhum item faz sentido.

## Por que estender Entity

AggregateRoot estende Entity porque toda entidade raiz de um agregado **continua sendo uma entidade**. Ela tem id, tem props, tem toda a logica base. O AggregateRoot so adiciona a camada semantica de "esta e a entidade principal do agregado".

Como Entity recebe props genericas, AggregateRoot faz o mesmo — recebe Props e repassa para Entity.

## Classe abstrata — por que

A unica diferenca pratica de uma classe abstrata na POO e que ela **nao pode ser instanciada diretamente**. Voce so pode instanciar classes que herdam dela. Isso faz sentido porque AggregateRoot e um conceito, nao uma entidade concreta.

O instrutor menciona que Entity tambem pode (e deveria) ser abstrata pelo mesmo motivo.

## A distincao critica: Agregado vs Relacionamento

Este e o ponto mais importante da aula. O instrutor bate na tecla repetidamente:

**Agregado:** Entidades criadas e editadas AO MESMO TEMPO.
- Question + Attachments: ao criar/editar uma pergunta, voce cria/edita os anexos junto
- Question + Tags: ao criar/editar uma pergunta, voce cria/edita as tags junto

**Relacionamento simples (NAO e agregado):**
- Question + QuestionComment: primeiro voce cria a pergunta, DEPOIS (em outro momento) cria os comentarios
- Eles nao sao criados nem editados ao mesmo tempo
- O comentario pertence a uma pergunta, mas isso nao simboliza agregado

A regra e: **co-manipulacao define o agregado**, nao a existencia de foreign key.

## Classe vazia e intencional

O instrutor explica que por enquanto a classe vai estar vazia, mas mais pra frente (quando domain events forem implementados) ela tera bastante funcionalidade. Isso e normal em DDD — voce cria as abstracoes corretas antes de precisar delas, porque a separacao semantica ja tem valor.

## Impacto pratico da mudanca

Ao trocar `extends Entity` para `extends AggregateRoot` na Question:
- Nenhum teste quebra
- Tudo continua funcionando normalmente
- A mudanca e puramente semantica neste momento
- Mas prepara a entidade para gerenciar sub-entidades co-manipuladas