---
name: rs-full-stack-resolvendo-conflitos-1
description: "Applies dependency conflict resolution workflow when updating Node.js packages causes typing errors, breaking changes, or incompatibilities. Use when user encounters 'overload matches', type mismatches after npm update, 'breaking change', 'dependency conflict', or asks to 'fix typing after update', 'resolve npm conflicts', 'rollback dependency version'. Make sure to use this skill whenever a library update introduces errors. Not for initial project setup, new dependency installation, or application logic bugs."
---

# Resolvendo Conflitos de Dependências

> Quando uma atualização de biblioteca introduz erros, investigue via Issues do repositório, avalie as soluções propostas, e prefira rollback a gambiarras de tipagem.

## Prerequisites

- Editor com painel de Problemas/Problems (VS Code)
- Acesso ao NPM registry e GitHub Issues
- Git inicializado no projeto

## Steps

### Step 1: Identificar os erros

Abra os arquivos afetados no editor para que os erros apareçam no painel Problems. Observe o padrão — erros de `overload matches` ou assinatura de parâmetros indicam conflito de tipagem entre versões.

```
// Painel Problems mostra erros agrupados por arquivo
// Clique em cada erro para navegar até a linha exata
```

### Step 2: Confirmar que é problema de tipagem (não de lógica)

Teste temporariamente com `any` para confirmar que o erro é de tipagem. Remova imediatamente após confirmar — `any` nunca é solução.

```typescript
// APENAS para diagnóstico — nunca commitar isso
app.use((err: any, req: any, res: any, next: any) => { ... })
// Se o erro sumiu → confirmado: é conflito de tipagem
// Reverta imediatamente
```

### Step 3: Buscar no repositório da biblioteca

1. Acesse o NPM e encontre o repositório da biblioteca
2. Vá em Issues e pesquise o texto exato do erro
3. Verifique se o problema já foi reportado e classificado como bug
4. Leia as soluções propostas pela comunidade

### Step 4: Avaliar soluções — rollback vs workaround

| Solução proposta | Avaliar |
|-----------------|---------|
| Rollback para versão anterior | Preferível — limpo, sem gambiarras |
| Adicionar `return` + `Promise<void>` | Gambiarra — evitar |
| Usar `any` nos parâmetros | Nunca — perde toda segurança de tipos |
| Aguardar patch (ex: 5.0.1) | Viável se versão atual funciona |

### Step 5: Executar o rollback da tipagem

```bash
# Encontrar a versão compatível mais recente da major anterior
# Usar o site do NPM ou npm view para listar versões

# Instalar versão específica
npm i @types/express@4.17.21

# Verificar que dependências estão consistentes
npm ls
```

### Step 6: Verificar resolução

Abra todos os arquivos que tinham erros. O painel Problems deve estar vazio. Execute `npm run build` ou `npx tsc --noEmit` para confirmar.

### Step 7: Commitar incrementalmente

```bash
git add .
git commit -m "fix: @types/express compatibility"
```

## Output format

Projeto sem erros de tipagem, com versão compatível da dependência instalada e commitada.

## Error handling

- Se o rollback não resolver: verifique se há outras dependências que também precisam de rollback (ex: `@types/node`)
- Se nenhuma versão anterior funciona: a breaking change pode ser na biblioteca principal, não apenas nos types

## Heuristics

| Situação | Ação |
|----------|------|
| Erro `overload matches` após update | Conflito de tipagem — buscar nas Issues |
| Versão mais nova tem bug reportado | Rollback para última stable da major anterior |
| Comunidade sugere workaround com `any` | Ignorar — prefira rollback limpo |
| Patch fix disponível (ex: 5.0.1) | Testar o patch antes de fazer rollback |
| Atualizando múltiplas deps | Commitar cada atualização separadamente |

## Anti-patterns

| Nunca faça | Faça instead |
|------------|-------------|
| Usar `any` para silenciar erros de tipagem | Rollback para versão compatível |
| Atualizar tudo de uma vez sem commitar | Commitar cada alteração incrementalmente |
| Assumir que a versão mais nova é a melhor | Verificar Issues e testar antes de manter |
| Ignorar erros de tipagem e continuar | Resolver antes de prosseguir |
| Aplicar workarounds de Issues sem avaliar | Avaliar se é gambiarra ou solução real |

## Verification

- Painel Problems do editor vazio
- `npx tsc --noEmit` sem erros
- `npm outdated` mostra estado esperado
- Commit registrado com a mudança

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre breaking changes, versionamento semântico e estratégia de rollback
- [code-examples.md](references/code-examples.md) — Exemplos completos do fluxo de diagnóstico e resolução