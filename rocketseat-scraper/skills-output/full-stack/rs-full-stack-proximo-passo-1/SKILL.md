---
name: rs-full-stack-proximo-passo-1
description: "Enforces a gradual dependency update strategy in Node.js projects, updating patch fixes first, then minor features, then major breaking changes. Use when user asks to 'update dependencies', 'upgrade packages', 'check outdated', 'manage npm dependencies', or 'update node modules'. Make sure to use this skill whenever performing dependency updates in any Node.js project. Not for installing new packages, removing dependencies, or non-Node.js package managers."
---

# Atualização Gradual de Dependências Node.js

> Atualize dependências de forma gradual: primeiro patches (bug fixes), depois minor (funcionalidades), por último major (breaking changes).

## Rules

1. **Identifique antes de atualizar** — execute `npm outdated` ou ferramenta equivalente para listar todas as dependências desatualizadas, porque atualizar às cegas causa quebras silenciosas
2. **Compare versão recomendada vs última disponível** — a versão "wanted" respeita o range do package.json, a "latest" é a mais recente publicada, porque cada uma tem nível de risco diferente
3. **Atualize em 3 fases ordenadas por risco** — patch → minor → major, porque correções de bugs são seguras, funcionalidades novas são moderadas, e breaking changes exigem atenção máxima
4. **Teste após cada fase** — rode testes e verifique o build entre cada fase de atualização, porque problemas isolados por fase são mais fáceis de diagnosticar
5. **Nunca misture atualizações de risco diferente no mesmo commit** — separe patches, minors e majors em commits distintos, porque facilita rollback cirúrgico

## Steps

### Step 1: Identificar dependências desatualizadas
```bash
npm outdated
```
Analise a tabela: Current (instalada), Wanted (recomendada pelo range), Latest (última publicada).

### Step 2: Fase 1 — Patches (correções de bugs)
```bash
# Atualize apenas patches (x.y.Z)
npm update
```
Rode testes. Commit: `chore: update patch dependencies`

### Step 3: Fase 2 — Minor (novas funcionalidades)
```bash
# Atualize minor versions individualmente
npm install package@^x.NEW_MINOR
```
Rode testes. Commit: `chore: update minor dependencies`

### Step 4: Fase 3 — Major (breaking changes)
```bash
# Atualize major versions uma por uma
npm install package@latest
```
Leia o changelog/migration guide. Rode testes. Corrija breaking changes. Commit: `chore: update package to vX (major)`

## Heuristics

| Situação | Ação |
|----------|------|
| `npm outdated` mostra apenas patches | Atualize tudo de uma vez com `npm update` |
| Major version com migration guide longo | Atualize isoladamente, em branch separada |
| Dependência sem testes cobrindo seu uso | Teste manualmente antes de avançar |
| Muitas majors pendentes | Priorize por criticidade (segurança primeiro) |

## Anti-patterns

| Nunca faça | Faça ao invés |
|------------|---------------|
| `npm update && git commit` (tudo junto) | Separe por fase: patch → minor → major |
| Atualizar major sem ler changelog | Leia changelog e migration guide antes |
| Ignorar dependências desatualizadas por meses | Revise mensalmente com `npm outdated` |
| Atualizar todas as majors de uma vez | Atualize uma major por vez, testando entre cada |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre a estratégia gradual e análise de risco por tipo de versão
- [code-examples.md](references/code-examples.md) — Exemplos práticos de fluxo de atualização com npm outdated e npm update