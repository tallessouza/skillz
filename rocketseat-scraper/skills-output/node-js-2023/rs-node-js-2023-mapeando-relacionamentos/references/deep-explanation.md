# Deep Explanation: Mapeando Relacionamentos entre Entidades

## Por que relacionar apenas por ID?

O instrutor Diego enfatiza que o relacionamento por ID dentro de uma entidade NAO implica a estrutura do banco de dados. Duas entidades com `authorId` podem:
- Virar duas tabelas com foreign key (relacional)
- Ser salvas na mesma tabela (desnormalizacao)
- Ser documentos separados (NoSQL)
- Ser nos em um grafo (banco de grafos)

A camada de dominio e agnositca a persistencia. O ID e a unica ponte necessaria entre entidades no dominio.

## O problema do DRY prematuro

Diego usa o exemplo concreto de `Student` e `Instructor`. Ambos tem exatamente os mesmos campos (`id`, `name`). A tentacao natural do programador e:

> "Sao iguais, vou criar uma classe User e pronto."

Mas isso viola a linguagem ubiqua. O expert de dominio (um instrutor da Rocketseat respondendo forum) nunca diz "este usuario respondeu este usuario". Ele diz "este **instrutor** respondeu este **aluno**" ou "este **aluno** respondeu este **aluno**".

### Regras de negocio divergentes por ator

Diego da exemplos concretos de como as regras divergem:
- **Instrutor respondendo**: pode colocar anexos na resposta
- **Aluno respondendo outro aluno**: NAO pode colocar anexos
- **Aluno respondendo**: pode ter limite de 3 respostas por dia

Se voce unificou em `User`, agora precisa de `if/else` ou flags para distinguir comportamento. Se manteve separado, cada caso de uso ja encapsula suas regras naturalmente.

## A analogia com o mundo real

> "Design Software tem que traduzir a linguagem ubiqua, tem que traduzir a linguagem do mundo real em codigo."

Isso e um dos pilares do DDD (Domain-Driven Design): o codigo deve ser um espelho da conversa entre desenvolvedores e experts de dominio. Se no vocabulario do negocio existem "aluno" e "instrutor", no codigo devem existir `Student` e `Instructor`.

## Props pattern para construtores

Em vez de passar cada campo como parametro separado no construtor, Diego introduz o pattern de criar uma interface `{Entity}Props`:

```typescript
interface QuestionProps {
  authorId: string
  title: string
  content: string
}
```

Beneficios:
- Autocomplete mostra exatamente quais campos preencher
- Adicionar um campo novo nao quebra chamadas existentes (se opcional)
- Leitura mais clara na criacao: `new Question({ authorId, title, content })`

## Quando dois codigos parecidos NAO sao duplicacao

O DRY (Don't Repeat Yourself) e frequentemente mal interpretado. Dois trechos de codigo identicos so sao duplicacao real quando:
1. Mudam pelas **mesmas razoes**
2. Representam o **mesmo conceito** no dominio

Se `Student` e `Instructor` mudam por razoes diferentes (regras de negocio distintas), eles NAO sao duplicacao — sao **coincidencia estrutural temporaria**.