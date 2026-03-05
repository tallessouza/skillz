# Deep Explanation: Metodo de Insert com Query Builder

## Por que separar a conexao em um arquivo dedicado?

O instrutor cria `database/connect.ts` com um proposito claro: toda vez que qualquer parte da aplicacao precisar acessar o banco, importa essa unica instancia. Isso evita:

- Criar multiplas conexoes (cada `knex(config)` abre um pool novo)
- Duplicar configuracao em cada arquivo que precisa do banco
- Dificultar troca de banco no futuro (basta mudar um arquivo)

O instrutor renomeia o import para `knect.config` internamente para evitar conflito com o export `knex`:

```typescript
import knect from "knex"        // knect = construtor
export const knex = knect(config) // knex = instancia configurada
```

## Fluxo completo do insert

1. **Requisicao POST chega** com body JSON (`{ name: "javascript" }`)
2. **Extrair dados** do `request.body`
3. **Chamar `knex("courses").insert({ name })`** — o Query Builder:
   - Identifica a tabela `courses`
   - Gera `INSERT INTO courses (name) VALUES ('javascript')`
   - Executa contra o banco configurado
4. **Retornar 201** — sem body, porque o recurso foi criado

## Por que async/await e obrigatorio

O instrutor enfatiza: "como a gente vai trabalhar com banco de dados, entao a gente vai utilizar o await para guardar, levar a informacao para o banco de dados, salvar."

Sem `await`, o `knex().insert()` retorna uma Promise nao resolvida. A resposta 201 seria enviada antes do insert completar, podendo resultar em dados nao salvos sem erro visivel.

## Colunas auto-geradas

Na migration, `id` usa `increments()` e `created_at`/`updated_at` usam `timestamp().defaultTo(knex.fn.now())`. O instrutor mostra que ao inserir apenas `name`, o banco gera automaticamente:
- `id`: autoincremento
- `created_at`: timestamp atual
- `updated_at`: timestamp atual

Inserir essas colunas manualmente seria redundante e poderia causar conflitos.

## Query Builder vs SQL puro

O ponto central da aula: "a gente aqui nao escreveu nada de codigo SQL, a gente usou os metodos do proprio Query Builder para fazer o insert."

Vantagens do Query Builder sobre SQL puro:
- **Type-safe** — erros de coluna detectados mais cedo
- **Portavel** — mesma sintaxe funciona em SQLite, PostgreSQL, MySQL
- **Composavel** — encadear `.insert()`, `.returning()`, `.onConflict()` etc.
- **Seguro** — parametrizacao automatica previne SQL injection