# Deep Explanation: Aggregates & Watched Lists

## O que e um Agregado

O agregado e um conceito central do DDD (Domain-Driven Design). Nao e exatamente um design pattern — e mais um conceito arquitetural. O agregado e um conjunto de entidades que sao **manipuladas ao mesmo tempo** e que juntas compoem algo maior.

### Criterio de identificacao

A pergunta-chave e: **essas entidades sao persistidas no banco de dados ao mesmo tempo?**

- **Order + OrderItems**: quando o cliente fecha o pedido, o pedido e seus itens sao salvos juntos. Os itens nao fazem sentido sem o pedido. Isso e um agregado.
- **Answer + AnswerComments**: a resposta e criada primeiro. Os comentarios sao criados depois, no futuro. Isso NAO e um agregado — sao entidades com ciclos de vida independentes.

### O que muda no codigo

O agregado em si nao exige uma implementacao radicalmente diferente. Porem, no DDD estrito, agregados ganham privilegios que entidades simples nao tem:
- Podem disparar domain events
- Servem como raiz de consistencia (aggregate root)
- Sao a unidade de transacao — tudo dentro do agregado e salvo ou falha junto

A classe `AggregateRoot` estende `Entity` e adiciona essas capacidades.

## O que e uma Watched List

A Watched List e uma lista observada — um array que, alem dos dados de cada item, rastreia o **estado** de cada item: se e novo, se foi removido, ou se foi editado.

### Por que existe

Na **criacao**, trabalhar com listas e trivial: voce so precisa criar registros no banco. Nao ha complexidade.

Na **edicao**, a complexidade explode. Ao editar uma pergunta com anexos:
- Voce pode **adicionar** um novo anexo
- Voce pode **remover** um anexo existente
- Voce pode **editar** um anexo existente (ex: renomear)

Sem a Watched List, a abordagem mais "facil" seria apagar todos os anexos e recriar do zero. Isso e:
- Ruim para performance (operacoes desnecessarias)
- Custoso para o banco de dados
- Gera novos IDs sem necessidade
- Pode quebrar referencias externas

### Como funciona

A Watched List carrega a lista original (do banco) e, conforme o usuario faz alteracoes, rastreia:
- `getNewItems()`: itens que nao existiam na lista original
- `getRemovedItems()`: itens que existiam mas foram removidos
- Itens que permanecem inalterados: nenhuma operacao necessaria

Na hora de persistir, o repository consulta esses metodos e executa apenas as operacoes necessarias:
- `CREATE` para novos
- `DELETE` para removidos
- `UPDATE` para editados

### Analogia do instrutor

Pense na Watched List como um "array turbinado". E um array como qualquer outro, porem cada item carrega metadata sobre seu estado. Nao e apenas `[item1, item2, item3]` — e `[{item1, status: existing}, {item2, status: new}, {item3, status: removed}]`.

## Quando usar cada conceito

- **Agregados**: sempre que identificar entidades que sao criadas/editadas/removidas juntas
- **Watched Lists**: sempre que um agregado contiver uma **lista** de sub-entidades que pode ser editada

Esses conceitos se tornam essenciais quando a aplicacao comeca a trabalhar com **relacionamentos** — e ai que surgem os desafios que aggregates e watched lists resolvem.

## Contexto da aplicacao (Forum)

No exemplo do curso, os agregados identificados sao:
- **Question + QuestionAttachments**: anexos sao criados junto com a pergunta
- **Question + Tags**: tags sao atribuidas junto com a pergunta
- **Answer + AnswerAttachments**: anexos sao criados junto com a resposta

Em todos esses casos, a lista de filhas (attachments, tags) usa Watched List para rastrear mudancas na edicao.