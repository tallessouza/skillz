# Deep Explanation: Prisma Schema — Relacionamentos e Polimorfismo

## Contexto da aula

Esta aula faz parte de uma sequencia onde se integra a camada de dominio com persistencia e HTTP. O instrutor cria tabelas de comentarios e anexos no Prisma, demonstrando um pattern importante: como lidar quando uma entidade pertence a mais de uma outra entidade.

## Polimorfismo em banco de dados — a explicacao do instrutor

O instrutor explica polimorfismo partindo da etimologia grega: "poli" (muitos) + "morfismo" (formas). Em programacao orientada a objetos, polimorfismo e quando uma classe atende propositos diferentes. No contexto de banco de dados, e quando uma tabela armazena dados que se relacionam com tabelas diferentes.

### O problema concreto

Comentarios podem pertencer a perguntas OU respostas. Anexos tambem. Como modelar isso?

### Abordagem polimorffica (descartada)

```
parentId  → armazena o id da pergunta OU da resposta
parentType → enum (QUESTION | ANSWER) para discriminar
```

**Problemas identificados pelo instrutor:**
1. `parentId` nao pode ser foreign key — foreign keys apontam para UMA tabela especifica
2. Sem FK, perde-se integridade referencial no banco
3. O Prisma especificamente "nao lida muito bem com polimorfismo"
4. `parentId` seria no maximo um indice, sem garantia de consistencia

### Quando usar polimorfismo (segundo o instrutor)

Se tivesse ~40 tabelas que precisassem de comentarios, ai sim polimorfismo seria a melhor forma. O custo de manter 40 foreign keys opcionais seria maior que o custo de perder integridade referencial.

### Abordagem escolhida: foreign keys opcionais

Para 2 tabelas (Question e Answer), a solucao simples e ter dois campos opcionais:
- `questionId?` — preenchido quando e comentario de pergunta
- `answerId?` — preenchido quando e comentario de resposta

A presenca do valor funciona como discriminador natural — nao precisa de enum.

## Padrao de mapeamento Prisma

O instrutor segue um padrao consistente:
1. Models em PascalCase (`Comment`, `Attachment`)
2. `@@map("comments")` para nome real da tabela em snake_case plural
3. Campos de FK em camelCase (`authorId`) com `@map("author_id")` para coluna real
4. Relacionamentos inversos sempre configurados nos dois lados

## Fluxo pratico

1. Criar model com `@id @default(uuid())`
2. Adicionar campos de conteudo
3. Adicionar `createdAt`/`updatedAt` se necessario
4. Criar `@@map` para nome da tabela
5. Adicionar relacionamentos com `@relation`
6. Mapear campos FK com `@map`
7. Atualizar models referenciados com campo inverso
8. Rodar `pnpm prisma migrate dev`

## Decisao-chave: limiar para polimorfismo

Nao existe numero magico, mas o instrutor sugere implicitamente:
- **2-5 tabelas relacionadas** → foreign keys opcionais (simples, com integridade)
- **Muitas tabelas (40+)** → polimorfismo (pratico, sem integridade referencial no banco)
- **Zona cinza (5-15)** → depende do caso, mas no Prisma tende a ser melhor manter FKs opcionais pela limitacao da ferramenta