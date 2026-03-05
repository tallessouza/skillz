# Deep Explanation: Persistencia de Agregados com Colecoes Filhas

## O que e um agregado e por que importa na persistencia

O instrutor reforça que a Question é um **aggregate root** no DDD. Um agregado é um conjunto de entidades que caminham juntas. A Question tem varios QuestionAttachments. Quando voce salva o agregado, todas as entidades dentro dele devem ser salvas automaticamente — o consumidor do repositorio nao deveria precisar se preocupar com isso.

## Dominio vs Persistencia: nao e mapeamento 1:1

Insight crucial do instrutor: **criar uma entidade na camada de dominio nao significa necessariamente criar uma nova linha no banco de dados.**

No caso dos attachments:
- Quando o usuario faz upload, ja cria um registro na tabela `attachment` (sem `questionId`, sem `answerId`)
- Quando o usuario cria uma pergunta com anexos, o "criar QuestionAttachment" na camada de dominio na verdade significa **atualizar** o registro existente no banco para setar o `questionId`

O instrutor enfatiza: "Voce tem que sempre pensar que nao necessariamente as acoes fazem um mapeamento de um para um entre camada de dominio e camada de persistencia. Pode ser que voce esta criando uma informacao na camada de dominio e esta criando quatro registros em tabelas diferentes no banco de dados."

## Por que WatchedList na edicao

Na edicao, o usuario pode:
- Manter anexos existentes
- Adicionar novos anexos
- Remover anexos antigos

A WatchedList monitora essas mudancas automaticamente:
- `getNewItems()` — itens que foram adicionados
- `getRemovedItems()` — itens que foram removidos
- `getCurrentItems()` — estado atual

Isso evita a abordagem ingenua de "deletar tudo e recriar", que seria ineficiente e potencialmente perigosa.

## Repositorio chamando repositorio

O instrutor destaca que **um repositorio chamar outro repositorio e totalmente normal**. O QuestionsRepository chama o QuestionAttachmentsRepository dentro dos metodos `create` e `save`. Isso garante que a persistencia do agregado seja atomica do ponto de vista do caso de uso.

## Logica do deleteMany no repositorio em memoria

O filtro funciona assim:
```typescript
this.items = this.items.filter((item) => {
  return !attachments.some((attachment) => attachment.equals(item))
})
```

- Para cada item existente, verifica se ele esta na lista de "para deletar"
- Se estiver (some retorna true), a negacao (!) faz o filter remover
- O metodo `equals` compara pelo ID da entidade

## Ordem de implementacao

O instrutor sempre comeca pela camada de dominio:
1. Adicionar metodos abstratos no repositorio
2. Implementar no repositorio em memoria
3. Escrever testes unitarios
4. So depois implementar na camada de infra (Prisma, etc.)

Isso valida a logica de negocio antes de mexer em banco de dados.