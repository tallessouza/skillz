# Code Examples: Atualizações Críticas

## Verificar dependências desatualizadas

```bash
# Mostra tabela com Current, Wanted e Latest
npm outdated
```

Saída típica:
```
Package      Current  Wanted  Latest  Location
express        4.18.2  4.18.3   5.0.0  my-project
jest          28.1.3  28.1.3  29.7.0  my-project
typescript     5.2.2   5.3.3   5.3.3  my-project
```

- **Current** → versão instalada
- **Wanted** → maior versão que satisfaz o range no package.json
- **Latest** → versão mais recente publicada no registry
- Quando Current ≠ Latest com major diferente → **breaking change potencial**

## Consultar changelog no GitHub

```bash
# Acessar releases da dependência
# https://github.com/{owner}/{repo}/releases

# Ou buscar CHANGELOG no repositório
# https://github.com/{owner}/{repo}/blob/main/CHANGELOG.md

# Exemplo para Express:
# https://github.com/expressjs/express/releases
```

## Atualizar uma dependência específica

```bash
# Atualizar para versão específica (recomendado para major bumps)
npm install express@5.0.0

# NÃO faça isso para major bumps:
npm install express@latest  # perigoso — pode pegar versão instável
```

## Atualizar incrementalmente

```bash
# Exemplo: precisa ir de express@3 para express@5

# Passo 1: atualizar para v4 (ler migration guide v3→v4)
npm install express@4
npm test

# Passo 2: resolver breaking changes da v4
# ... ajustar código conforme changelog ...
npm test

# Passo 3: atualizar para v5 (ler migration guide v4→v5)
npm install express@5
npm test

# Passo 4: resolver breaking changes da v5
# ... ajustar código conforme changelog ...
npm test
```

## Reverter atualização problemática

```bash
# Se algo quebrou após atualizar
git checkout -- package.json package-lock.json
npm install

# Ou se já commitou
git revert HEAD
npm install
```

## Verificar vulnerabilidades de segurança

```bash
# Auditar dependências
npm audit

# Corrigir automaticamente (apenas minor/patch)
npm audit fix

# Para breaking changes em correções de segurança
npm audit fix --force  # CUIDADO: pode instalar majors
```

## Testar após atualização

```bash
# Fluxo completo pós-atualização
npm install pacote@nova-versao

# 1. Testes automatizados
npm test

# 2. Verificar build
npm run build

# 3. Verificar lint (pode quebrar com novas regras)
npm run lint

# 4. Testar manualmente os fluxos críticos
npm run dev
# → testar login, CRUD principal, integrações
```

## Exemplo de package.json com ranges seguros

```json
{
  "dependencies": {
    "express": "~4.18.2",
    "prisma": "^5.8.0",
    "zod": "^3.22.0"
  }
}
```

- `~4.18.2` → aceita apenas patches (4.18.x) — mais conservador
- `^5.8.0` → aceita minor e patches (5.x.x) — padrão npm
- `5.8.0` (sem prefixo) → versão exata — máximo controle

## Buscar ajuda no GitHub Issues

```bash
# Exemplo: erro após atualizar prisma para v5
# Buscar no GitHub:
# https://github.com/prisma/prisma/issues?q=is%3Aissue+migration+v5

# Ou usar GitHub CLI
gh issue list --repo prisma/prisma --search "breaking change v5"
```