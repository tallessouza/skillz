# Deep Explanation: Caso de Uso — Comentar na Pergunta

## Por que o nome do caso de uso importa

O instrutor enfatiza que o nome `CommentOnQuestion` e "bem especifico da acao que esta sendo feita". Em DDD, cada caso de uso representa uma intencao do usuario no dominio. Nomes genericos como `CreateComment` nao capturam o contexto — comentar em uma pergunta e diferente de comentar em uma resposta, mesmo que a mecanica seja parecida.

Essa especificidade permite que, no futuro, regras de negocio diferentes possam ser aplicadas a cada caso de uso sem quebrar o outro.

## O padrao de validacao da entidade pai

Antes de criar qualquer entidade filha (comment), o caso de uso busca a entidade pai (question) pelo ID. Se nao encontrar, lanca erro. Isso e uma guarda de dominio — impede que comentarios orfaos existam no sistema.

```
1. Recebe questionId
2. Busca question no repositorio
3. Se nao existe → erro
4. Se existe → cria o comment
```

## Por que um repositorio separado por entidade

O instrutor nota que "eu ainda nao tenho um repositorio para parte de comentarios". Em Clean Architecture, cada agregado ou entidade com ciclo de vida proprio merece seu repositorio. Comentarios de perguntas e comentarios de respostas sao entidades diferentes, entao:

- `QuestionCommentsRepository` — para comentarios em perguntas
- `AnswerCommentsRepository` — para comentarios em respostas (aula seguinte)

Isso respeita o Single Responsibility Principle e facilita testes isolados.

## Inversao de dependencia na pratica

O caso de uso recebe os repositorios pelo construtor. No teste, passamos implementacoes in-memory. Em producao, passamos implementacoes reais (Prisma, TypeORM, etc). O caso de uso nunca sabe qual implementacao esta usando.

## O padrao de reuso entre casos de uso similares

O instrutor explicitamente copia o `CreateQuestion` como base para o `CommentOnQuestion`, fazendo find-and-replace. Depois, faz o mesmo para `CommentOnAnswer`. Esse e um padrao pratico — casos de uso em DDD frequentemente seguem a mesma estrutura, e copiar-adaptar e mais seguro que abstrair prematuramente.

## Estrategia de teste

O teste segue um padrao simples:
1. Cria a entidade pai (question) e salva no repositorio in-memory
2. Executa o caso de uso com os dados necessarios
3. Verifica que o item foi salvo no repositorio in-memory de comments

A verificacao `items[0].content` e direta e suficiente — nao precisa de assertions complexas para um caso de uso simples.