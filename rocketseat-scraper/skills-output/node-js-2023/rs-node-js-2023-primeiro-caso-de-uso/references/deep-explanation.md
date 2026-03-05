# Deep Explanation: Primeiro Caso de Uso em DDD

## Software e um organismo vivo

O instrutor enfatiza que voce nunca vai criar a primeira versao das entidades ja na versao final. Voce cria com o conhecimento que tem naquele momento. Isso e fundamental — nao tente prever todos os campos, todos os relacionamentos. Comece simples, evolua.

## Entidades NAO sao tabelas

Este e o exercicio mental mais importante da aula. O instrutor pede explicitamente: "desconecte totalmente esse pensamento". Exemplos:

- Varias entidades podem se traduzir em uma unica tabela
- Uma entidade pode nem virar tabela (serve apenas para organizar o codigo)
- `Question` e `Answer` sao semelhantes, poderiam estar na mesma tabela — mas no dominio sao entidades separadas
- A decisao de como salvar no banco nao pertence a camada de dominio

## O padrao do ID opcional

O constructor da entidade serve para dois propositos:
1. **Criar uma entidade nova** — nao passa ID, gera `randomUUID()`
2. **Criar referencia para entidade existente** — passa o ID existente

```typescript
// Criando instrutor novo
const newInstructor = new Instructor('João')  // id gerado automaticamente

// Referenciando instrutor existente
const existingInstructor = new Instructor('João', 'uuid-existente')
```

Isso e elegante porque a mesma classe serve para ambos os cenarios sem precisar de factory methods separados.

## Por que parametros nomeados

O instrutor mostra o problema:
```typescript
answerQuestion.execute('1', '2')
// Na execucao, nao sei o que '1' e '2' significam
// Qual e o instructorId? Qual e o questionId?
```

Solucao: interface com desestruturacao:
```typescript
answerQuestion.execute({ questionId: '1', instructorId: '2' })
// Agora e obvio o que cada valor significa
```

## Identificadores nao precisam ser UUID

O instrutor menciona que estamos acostumados com UUID/chave primaria, mas existem alternativas:
- Email unico
- Snowflake ID
- SEO ID
- Qualquer valor unico no contexto

A escolha do tipo de identificador depende do dominio.

## Testes guiam o desenvolvimento

O instrutor instala Vitest e escreve o primeiro teste junto com a implementacao. A funcionalidade ainda esta "crua", mas o teste ja valida o comportamento basico. A premissa e: testes desde o comeco guiam o desenvolvimento — voce ve o codigo funcionando incrementalmente.

## A resposta como entidade separada

Mesmo que `Answer` e `Question` sejam muito parecidas (ambas tem conteudo), elas sao entidades separadas no dominio. A decisao de unifica-las em uma tabela e da camada de infraestrutura, nao do dominio. Enquanto desenvolve na camada de dominio, pense em como as coisas se relacionam, nao em como serao armazenadas.