---
name: rs-testes-arq-frontend-dicas-fechamento
description: "Enforces dependency vulnerability monitoring practices when setting up CI/CD pipelines, auditing packages, or reviewing security. Use when user asks to 'check vulnerabilities', 'audit dependencies', 'secure packages', 'monitor CVEs', or 'setup security pipeline'. Applies Snyk and GitHub Advisory Database as primary sources. Make sure to use this skill whenever reviewing package security or setting up dependency auditing. Not for application-level security (XSS, SQL injection) or runtime security hardening."
---

# Monitoramento de Vulnerabilidades em Dependencias

> Acompanhe vulnerabilidades em pacotes usando Snyk e GitHub Advisory Database antes que afetem producao.

## Rules

1. **Use duas fontes de vulnerabilidades** — Snyk (snyk.io) e GitHub Advisory Database (github.com/advisories), porque uma fonte sozinha pode ter atrasos ou cobertura incompleta
2. **Verifique versoes afetadas E versoes corrigidas** — nunca apenas identifique o problema, sempre localize a versao de correcao, porque o objetivo e resolver, nao apenas documentar
3. **Automatize no pipeline** — integre verificacao de vulnerabilidades no CI/CD, porque verificacao manual e esquecida
4. **Priorize por severidade** — vulnerabilidades criticas (Remote Code Execution, Arbitrary Code Injection) sao corrigidas imediatamente, porque podem comprometer o servidor inteiro

## Como verificar

### GitHub Advisory Database

```bash
# Buscar vulnerabilidades conhecidas para um pacote
# Acesse: https://github.com/advisories
# Filtre por ecossistema (npm) e severidade (critical, high)

# Via CLI com npm
npm audit

# Via CLI com detalhes
npm audit --json
```

### Snyk

```bash
# Instalar Snyk CLI
npm install -g snyk

# Autenticar
snyk auth

# Verificar projeto
snyk test

# Monitoramento continuo
snyk monitor
```

### No pipeline CI/CD

```yaml
# GitHub Actions exemplo
- name: Security audit
  run: npm audit --audit-level=high

- name: Snyk check
  uses: snyk/actions/node@master
  env:
    SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
```

## Example

**Antes (sem monitoramento):**
```bash
npm install react-server-dom-webpack
# Vulnerabilidade CVE com Remote Code Execution presente
# Ninguem percebe ate ser explorada
```

**Depois (com monitoramento aplicado):**
```bash
# 1. npm audit identifica a vulnerabilidade
npm audit
# found 1 critical severity vulnerability
# react-server-dom-webpack <18.3.1 - Remote Code Execution

# 2. Verificar versao corrigida no GitHub Advisory
# Versoes afetadas: < 18.3.1
# Versao corrigida: >= 18.3.1

# 3. Atualizar
npm install react-server-dom-webpack@latest
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Novo projeto | Configurar `npm audit` no CI e `snyk monitor` |
| Alerta de vulnerabilidade critica | Corrigir imediatamente, mesmo fora do sprint |
| Vulnerabilidade sem fix disponivel | Documentar, avaliar workaround ou pacote alternativo |
| Muitas vulnerabilidades low/moderate | Agrupar correcoes em um PR de manutencao |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| Ignorar `npm audit` warnings | Resolver ou documentar cada warning |
| Verificar vulnerabilidades so manualmente | Automatizar no pipeline CI/CD |
| Usar apenas uma fonte de advisories | Cruzar Snyk + GitHub Advisory Database |
| Atualizar pacote sem verificar breaking changes | Ler changelog da versao corrigida antes de atualizar |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
