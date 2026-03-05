# Code Examples: Monitoramento de Vulnerabilidades em Dependencias

## 1. Verificacao manual com npm audit

```bash
# Verificacao basica
npm audit

# Output exemplo:
# === npm audit security report ===
# found 1 critical severity vulnerability in 347 scanned packages
#   1 vulnerability requires manual review. See the full report for details.

# Verificacao com nivel minimo de severidade
npm audit --audit-level=critical

# Output em JSON para processamento automatizado
npm audit --json

# Corrigir automaticamente quando possivel
npm audit fix

# Corrigir com breaking changes permitidas (use com cuidado)
npm audit fix --force
```

## 2. Snyk CLI completo

```bash
# Instalacao global
npm install -g snyk

# Autenticacao (abre browser)
snyk auth

# Testar projeto atual
snyk test

# Output exemplo:
# Testing /path/to/project...
# ✗ Remote Code Execution [Critical Severity]
#   in react-server-dom-webpack@18.2.0
#   introduced by react-server-dom-webpack@18.2.0
#   Fixed in: 18.3.1

# Monitorar projeto (envia para dashboard Snyk)
snyk monitor

# Testar apenas producao (ignorar devDependencies)
snyk test --production

# Ignorar uma vulnerabilidade especifica (com razao documentada)
snyk ignore --id=SNYK-JS-EXAMPLE-1234 --reason="No fix available, mitigated by WAF"
```

## 3. GitHub Actions — Pipeline automatizado

```yaml
name: Security Audit

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
  schedule:
    # Verificar diariamente as 8h UTC
    - cron: '0 8 * * *'

jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm ci

      - name: Run npm audit
        run: npm audit --audit-level=high

      - name: Run Snyk security scan
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
        with:
          args: --severity-threshold=high
```

## 4. Consultando GitHub Advisory Database via API

```bash
# Usando GitHub CLI para buscar advisories
gh api graphql -f query='
{
  securityAdvisories(first: 5, orderBy: {field: PUBLISHED_AT, direction: DESC}, ecosystem: NPM) {
    nodes {
      summary
      severity
      publishedAt
      vulnerabilities(first: 3) {
        nodes {
          package {
            name
          }
          vulnerableVersionRange
          firstPatchedVersion {
            identifier
          }
        }
      }
    }
  }
}'
```

## 5. Exemplo do caso React Server Components

```bash
# Verificar se seu projeto usa pacotes afetados
npm ls react-server-dom-webpack
npm ls react-server-dom-parcel

# Se encontrar versao vulneravel, atualizar para versao corrigida
npm install react-server-dom-webpack@latest

# Verificar se a atualizacao resolveu
npm audit
```

## 6. Pre-commit hook para auditoria

```bash
# .husky/pre-push
#!/bin/sh
npm audit --audit-level=critical
if [ $? -ne 0 ]; then
  echo "Critical vulnerabilities found. Fix before pushing."
  exit 1
fi
```