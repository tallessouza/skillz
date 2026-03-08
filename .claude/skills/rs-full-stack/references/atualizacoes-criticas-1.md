---
name: rs-full-stack-atualizacoes-criticas-1
description: "Enforces safe dependency update practices when upgrading Node.js packages with breaking changes. Use when user asks to 'update dependencies', 'upgrade packages', 'fix breaking change', 'migrate to new version', or 'handle semver major bump'. Guides analysis of changelogs, identification of incompatibilities, and decision on whether to update. Make sure to use this skill whenever a major version upgrade is considered or npm outdated shows red entries. Not for initial project setup, adding new dependencies, or minor/patch updates."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: dependencias
  tags: [npm, breaking-changes, semver, dependency-management]
---

# Atualizações Críticas — Breaking Changes em Dependências Node.js

> Antes de atualizar uma dependência major, analise o changelog completo e identifique todos os pontos de quebra — a versão mais recente nem sempre é a melhor escolha para o projeto.

## Key concept

Breaking changes (ou "break changes") são atualizações que introduzem incompatibilidades com a versão atual usada no projeto. Seguem o semver: quando o número MAJOR muda (ex: 4.x → 5.x), a API pública mudou de forma incompatível. Essas atualizações exigem análise cuidadosa antes de aplicar.

## Decision framework

| Situação | Ação |
|----------|------|
| `npm outdated` mostra major bump (vermelho) | Ler changelog/release notes ANTES de atualizar |
| Changelog menciona "BREAKING" ou "removed" | Mapear cada ponto de quebra no seu código |
| Dependência tem muitos majors de diferença | Atualizar incrementalmente (v3→v4→v5), não pular |
| Versão nova lançada há poucos dias | Aguardar estabilização — early adopter paga o preço dos bugs |
| Projeto em produção estável | Preferir versão comprovada sobre versão mais recente |
| Erro após atualização sem solução óbvia | Consultar GitHub Issues da dependência — outros já enfrentaram o mesmo problema |

## How to think about it

### Nem sempre a versão mais recente é a melhor

Uma versão recém-lançada pode ter bugs não descobertos. Projetos em produção se beneficiam de versões com histórico de estabilidade. Avalie: o que a nova versão traz que o projeto realmente precisa?

### Análise antes da atualização

```bash
# Ver o que está desatualizado
npm outdated

# Ler changelog da dependência
# Acesse: github.com/{owner}/{repo}/releases
# Ou: github.com/{owner}/{repo}/blob/main/CHANGELOG.md

# Atualizar com cuidado — uma dependência por vez
npm install pacote@nova-versao

# Rodar testes imediatamente após
npm test
```

### Onde buscar ajuda

1. **GitHub Issues** da dependência — buscar pelo erro específico
2. **Migration guides** — muitas libs publicam guias de migração entre majors
3. **Discussions/Stack Overflow** — outros desenvolvedores com o mesmo problema

## Common misconceptions

| Pessoas pensam | Realidade |
|---------------|-----------|
| "Sempre devo usar a última versão" | A versão mais estável para o projeto é a melhor, não necessariamente a mais nova |
| "npm update resolve tudo" | `npm update` respeita o range do package.json — major bumps exigem instalação explícita |
| "Breaking change = tudo quebra" | Pode afetar apenas APIs que você não usa — leia o changelog para saber |
| "Atualizo tudo de uma vez" | Atualizar uma dependência por vez facilita identificar qual causou a quebra |

## Heuristics

| Situação | Faça |
|----------|------|
| Major bump disponível | Leia CHANGELOG e migration guide antes de qualquer ação |
| Múltiplas majors atrasadas | Atualize incrementalmente, testando a cada passo |
| Projeto novo / sem produção | Pode adotar versão mais recente com menos risco |
| Projeto em produção crítico | Aguarde a versão estabilizar (2-4 semanas após release) |
| Erro pós-atualização | Reverta (`git checkout package.json && npm install`), investigue, tente novamente |

## Anti-patterns

| Nunca faça | Faça em vez disso |
|------------|-------------------|
| `npm install pacote@latest` sem ler changelog | Consulte releases/changelog, depois instale a versão específica |
| Atualizar 10 dependências major de uma vez | Atualize uma por vez, rode testes entre cada uma |
| Ignorar warnings de deprecation | Trate deprecations como aviso prévio de breaking change futuro |
| Pular versões major (v2 → v5 direto) | Siga o caminho incremental: v2→v3→v4→v5 |
| Assumir que funcionou porque instalou sem erro | Rode a suíte de testes e teste manualmente os fluxos críticos |

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| `npm outdated` mostra pacote em vermelho | Major version disponivel com breaking changes | Leia o changelog antes de atualizar, nao use `npm update` cegamente |
| App quebra apos `npm install pacote@latest` | Breaking change na nova versao | Reverta com `git checkout package.json && npm install`, consulte migration guide |
| `npm install` falha com conflito de peer deps | Dependencia transitiva incompativel com nova versao | Use `--legacy-peer-deps` temporariamente ou atualize a dependencia conflitante |
| Erro diferente do changelog documentado | Versao muito recente com bug nao documentado | Aguarde patch fix ou use versao anterior estavel |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre breaking changes, semver e estratégias de atualização
- [code-examples.md](references/code-examples.md) — Comandos e fluxos práticos de atualização segura