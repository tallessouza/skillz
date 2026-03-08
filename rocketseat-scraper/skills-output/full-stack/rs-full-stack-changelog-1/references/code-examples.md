# Code Examples: Changelog

## Como verificar a versão atual de uma dependência

```bash
# Ver versão instalada de um pacote específico
npm list express

# Ver todas as dependências e suas versões
npm list --depth=0

# Ver se existem atualizações disponíveis
npm outdated
```

Saída típica do `npm outdated`:
```
Package  Current  Wanted  Latest  Location
express  4.18.2   4.19.2  5.0.1   node_modules/express
```

- **Current**: versão instalada no projeto
- **Wanted**: maior versão compatível com o range do package.json
- **Latest**: última versão publicada no npm

## Consultando changelog antes de atualizar

### Via NPM — encontrar o repositório

```bash
# Abrir a página do pacote no npm
npm docs express

# Ver informações do pacote (inclui link do repositório)
npm info express

# Ir direto para o repositório
npm repo express
```

### Via GitHub — acessar releases

Após abrir o repositório, navegar para:
- **Releases** — versões publicadas com notas
- **CHANGELOG.md** — arquivo de changelog (se existir na raiz)
- **Blog** — algumas bibliotecas documentam em formato de blog

## Fluxo de atualização segura

### Passo 1: Verificar o que vai mudar

```bash
# Ver versão atual
npm list express
# express@4.18.2

# Ver última versão disponível
npm view express version
# 5.0.1
```

### Passo 2: Consultar changelog

Acessar o changelog entre a versão 4.18.2 e 5.0.1. Como é mudança de major (4 → 5), esperar breaking changes.

### Passo 3: Atualizar com controle

```bash
# Atualizar dentro do range do package.json (seguro)
npm update express

# Atualizar para a última versão (pode ter breaking changes)
npm install express@latest

# Atualizar para versão específica
npm install express@5.0.1
```

### Passo 4: Testar

```bash
# Rodar testes automatizados
npm test

# Iniciar aplicação e verificar manualmente
npm start
```

## Exemplo de leitura de changelog

### Formato de tópicos (Express)

```markdown
# 4.19.2 - 2024-03-25

## Fixed
- Fix redirect handling for encoded URLs
- Fix cookie parsing edge case

# 4.19.1 - 2024-03-24

## Fixed
- Fix path traversal vulnerability (CVE-2024-XXXX)
```

**Como interpretar:**
- Versão 4.19.1: correção de segurança — atualização urgente
- Versão 4.19.2: correção de bugs — atualização recomendada
- Ambas são patches (4.19.x) — sem breaking changes esperadas

### Formato de blog/artigo (React Native)

```markdown
# React Native 0.76

## Highlights
- New Architecture is now default
- React 18.3 support

## Breaking Changes
- Removed deprecated `ViewPropTypes`
- Changed default Metro bundler config

## How to Upgrade
1. Update package.json
2. Run `npx react-native upgrade`
3. Follow migration steps for removed APIs
```

**Como interpretar:**
- "New Architecture is now default" — mudança significativa, testar extensivamente
- "Removed deprecated ViewPropTypes" — se seu código usa, vai quebrar
- "How to Upgrade" — seguir esse guia passo a passo

## Abrindo uma issue no GitHub

### Bug report — estrutura recomendada

```markdown
## Bug Report

### Description
Brief description of the bug

### Steps to Reproduce
1. Install express@5.0.1
2. Create route with middleware X
3. Send POST request with body Y
4. Observe error Z

### Expected Behavior
The route should process the request and return 200

### Actual Behavior
Server crashes with TypeError: Cannot read property 'body' of undefined

### Environment
- Node.js: 20.11.0
- Express: 5.0.1
- OS: Ubuntu 22.04
```

### Dica do instrutor
Quanto mais detalhado o report, mais rápido a comunidade consegue ajudar. Inclua sempre: versão, sistema operacional, passos para reproduzir e o erro exato.

## Verificando se uma versão tem vulnerabilidades conhecidas

```bash
# Auditar dependências do projeto
npm audit

# Ver detalhes de vulnerabilidades
npm audit --json

# Tentar corrigir automaticamente
npm audit fix
```

Saída típica:
```
found 2 vulnerabilities (1 moderate, 1 high)
  run `npm audit fix` to fix them
```

Isso complementa o changelog — mesmo que o changelog não mencione vulnerabilidades explicitamente, o `npm audit` identifica CVEs conhecidos.