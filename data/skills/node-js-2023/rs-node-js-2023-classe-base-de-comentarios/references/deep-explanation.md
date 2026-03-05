# Deep Explanation: Classe Base de Comentarios

## Por que entidades nao sao tabelas

O instrutor enfatiza que existe um "relacionamento vicioso" na cabeca dos desenvolvedores: pensar que cada entidade no dominio deve corresponder a uma tabela no banco. Isso e um anti-pattern em DDD. A classe `Comment` abstrata, por exemplo, provavelmente nunca tera uma tabela propria — ela existe apenas como abstracao no dominio para compartilhar comportamento.

## Polimorfismo: a escolha pragmatica do instrutor

O instrutor apresenta duas formas de polimorfismo:

### Forma "nativa" (rejeitada)
Uma unica classe `Comment` com um campo `type` que determina se e comentario de pergunta ou resposta. O instrutor rejeita explicitamente: "eu particularmente nao gosto de polimorfismo da maneira mais nativa... acaba trazendo complexidade demais para um ganho muito pequeno de otimizacao na quantidade de codigo."

### Forma preferida (adotada)
Classe base abstrata + subclasses concretas. Nao e polimorfismo "puro", mas usa heranca para compartilhar campos e comportamentos comuns. Cada subclasse mantem sua identidade e pode ter propriedades especificas.

### Raciocinio
- Polimorfismo com type field forca checagens condicionais em todo o codigo
- Subclasses sao mais explicitas — `AnswerComment` vs `QuestionComment` em vez de `Comment where type = 'answer'`
- Extensibilidade: adicionar `ArticleComment` no futuro e criar nova subclasse, nao mais um valor no enum

## O truque do Generic Props

A parte mais tecnica da aula e o uso de generics para permitir extensao das props:

```typescript
abstract class Comment<Props extends CommentProps = CommentProps> extends Entity<Props>
```

Isso resolve o problema: `AnswerComment` precisa de `answerId` alem dos campos comuns. Sem generic, o TypeScript nao saberia que `this.props.answerId` existe na subclasse. Com `Props extends CommentProps`, a subclasse pode enviar um tipo mais especifico que inclui campos adicionais.

## Processo de refatoracao do instrutor

1. Copiou `AnswerComment` como base
2. Removeu tudo especifico (`answerId`, `create()`)
3. Renomeou para `Comment`
4. Adicionou `abstract`
5. Adicionou generic `<Props extends CommentProps>`
6. Voltou no `AnswerComment`, trocou `extends Entity` por `extends Comment`
7. Removeu getters duplicados
8. Manteve apenas `answerId` getter e `create()`
9. Replicou para `QuestionComment`

## Quando NAO usar essa tecnica

O instrutor reconhece: "a gente poderia manter as classes com todos os campos como estava antes." Heranca adiciona uma camada de abstracao. Se so existem 2 entidades com 2 campos em comum, o custo pode nao valer. A regra pratica e: 3+ campos compartilhados entre 2+ entidades justifica a extracao.