# Deep Explanation: Entidades de Comentarios em DDD

## O insight central do instrutor

A separacao entre entidades de dominio e entidades de persistencia e um dos conceitos mais confusos para desenvolvedores que vem de abordagens database-first. O instrutor enfatiza repetidamente: **"nao necessariamente as minhas entidades vao fazer um relacionamento de 1 para 1 em tabelas do banco de dados"**.

Isso significa que a decisao de ter uma ou duas tabelas de comentarios no banco e uma decisao de **infraestrutura**, nao de **dominio**. No dominio, se voce consegue identificar dois conceitos distintos (comentario de pergunta e comentario de resposta), eles merecem entidades separadas.

## Por que separar mesmo com campos identicos?

O instrutor usa o exemplo do Stack Overflow: tanto perguntas quanto respostas podem ter comentarios. A tentacao natural e criar uma unica entidade `Comment` com um campo `type` ou `parentType`. Mas isso viola o principio de que o dominio modela o negocio, nao a persistencia.

Razoes concretas para separar:
1. **Evolucao independente** — no futuro, comentarios de perguntas podem ganhar campos que comentarios de respostas nao tem
2. **Regras de negocio distintas** — talvez so o autor da pergunta possa marcar um comentario como "util"
3. **Relacionamentos tipados** — `answerId` e `questionId` sao semanticamente diferentes, mesmo sendo ambos IDs
4. **Clareza no codigo** — ao ler `AnswerComment`, voce sabe exatamente o contexto sem precisar verificar um campo `type`

## A analogia 50 entidades / 20 tabelas

O instrutor menciona explicitamente: "Eu posso ter 50 entidades aqui dentro e ter 20 tabelas no banco de dados." Isso e o cerne do DDD — o dominio e mais rico e expressivo que a persistencia. A persistencia otimiza para armazenamento e queries. O dominio otimiza para expressividade e regras de negocio.

## Polimorfismo: onde resolver?

O instrutor sugere que polimorfismo (uma tabela servindo multiplas entidades) e uma decisao de persistencia. No banco, voce pode ter:

```sql
CREATE TABLE comments (
  id UUID PRIMARY KEY,
  commentable_id UUID NOT NULL,
  commentable_type VARCHAR(20) NOT NULL, -- 'question' ou 'answer'
  author_id UUID NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

Mas no dominio, isso se traduz em duas entidades separadas com mapeamento feito pela camada de infraestrutura (repository/mapper).

## O padrao de construcao da entidade

O instrutor segue um padrao consistente:
1. Define `Props` interface com todos os campos
2. Cria a classe estendendo `Entity<Props>`
3. Getters para todos os campos
4. Setters apenas para campos editaveis (nesse caso, `content`)
5. Metodo `touch()` privado para atualizar `updatedAt`
6. Factory method `create()` com defaults para campos automaticos (`createdAt`)

## A tecnica de duplicacao com replace

O instrutor demonstra uma tecnica pratica: copiar a entidade `AnswerComment`, usar find-and-replace com "preserve case" para trocar `answer` por `question`, e ajustar. Isso e pragmatismo — quando duas entidades tem estrutura identica, duplicar e renomear e mais rapido que abstrair prematuramente.