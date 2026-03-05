# Deep Explanation: Configurando ESLint com Drizzle Plugin

## Por que o TypeScript como peerDependency quebra o ESLint

O Bun, ao inicializar o projeto, pode colocar o TypeScript como `peerDependency` no `package.json`. Isso causa um erro no ESLint:

```
Failed to load plugin TypeScript as declared — cannot find module TypeScript
```

A solucao e remover o TypeScript de `peerDependencies` e instalar como `devDependency`:

```bash
bun add -d typescript
```

O instrutor descobriu isso durante a aula — e um gotcha especifico do Bun que nao acontece com npm/yarn.

## Por que o eslint-plugin-drizzle e essencial

O instrutor destaca com humor: "Gracas a Deus que isso aqui existisse na minha epoca de junior." A ideia e que um dos erros mais perigosos em ORMs e fazer:

```typescript
await db.delete(users)  // Apaga TODA a tabela
await db.update(users).set({ active: false })  // Atualiza TODOS os registros
```

Sem a clausula `where`, essas operacoes afetam a tabela inteira. O plugin do Drizzle para o ESLint detecta isso em tempo de desenvolvimento e marca como erro.

### Regras disponiveis (no momento da aula)

1. **`drizzle/enforce-delete-with-where`** — Bloqueia `delete` sem `where`
2. **`drizzle/enforce-update-with-where`** — Bloqueia `update` sem `where`

O instrutor menciona que "mais pra frente pode ser que ele tenha outras coisas", indicando que o plugin esta em desenvolvimento ativo.

## Desabilitando regras de forma cirurgica

O instrutor mostra a tecnica correta para desabilitar regras:

1. **Errado:** `// eslint-disable` — desabilita TODAS as regras do ESLint na proxima linha
2. **Correto:** `// eslint-disable drizzle/enforce-delete-with-where` — desabilita apenas a regra especifica

Para descobrir o nome da regra, basta passar o mouse sobre o erro no editor — ele mostra o identificador completo (ex: `drizzle/enforce-delete-with-where`).

O unico caso de uso legitimo para desabilitar essa regra e em **seed files**, onde voce realmente quer deletar todos os registros antes de re-popular a tabela.

## Configuracao do ESLint com extends e plugins

A estrutura do `.eslintrc.json` usa dois mecanismos:

- **`extends`**: Herda configuracoes completas (regras + plugins + settings). O `@skillz/eslint-config/node` ja vem com regras de TypeScript, import order, etc. O `plugin:drizzle/all` ativa todas as regras do plugin Drizzle.
- **`plugins`**: Registra o plugin para que o ESLint reconheca as regras. Necessario declarar `"drizzle"` aqui mesmo que ja esteja no extends.

## O comando de lint

```bash
eslint --fix src --ext ts
```

- `--fix`: Corrige automaticamente o que for possivel (formatacao, imports, etc.)
- `src`: Diretorio alvo
- `--ext ts`: Apenas arquivos TypeScript

O instrutor demonstra que ao rodar, o ESLint corrige automaticamente coisas como ponto-e-virgula e imports nao utilizados.