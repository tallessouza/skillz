# Code Examples: Visualizando Versoes no NPM

## Instalando pacotes com diferentes versoes

### Instalar a versao latest (padrao)
```bash
# Instala a versao estavel mais recente (tag latest)
npm install express
```

### Instalar uma versao especifica
```bash
# Instala exatamente a versao 4.21.1
npm install express@4.21.1
```

### Instalar a proxima versao (next)
```bash
# Instala a versao pre-release (tag next)
npm install express@next
```

### Verificar versoes disponiveis via CLI
```bash
# Lista todas as versoes publicadas
npm view express versions

# Mostra informacoes detalhadas da versao latest
npm view express

# Mostra apenas a versao latest
npm view express version

# Mostra as dist-tags (latest, next, etc.)
npm view express dist-tags
```

## Verificando informacoes no npmjs.com

### URL padrao de um pacote
```
https://www.npmjs.com/package/express
```

### Aba de versoes
```
https://www.npmjs.com/package/express?activeTab=versions
```

### Repositorio no GitHub (exemplo Express)
```
https://github.com/expressjs/express
```

### Issues do repositorio
```
# Todas as issues abertas
https://github.com/expressjs/express/issues

# Issues fechadas
https://github.com/expressjs/express/issues?q=is%3Aissue+is%3Aclosed

# Filtrar por label
https://github.com/expressjs/express/issues?q=label%3Abug
```

## Checklist de avaliacao de pacote

```bash
# 1. Verificar versao e downloads
npm view <pacote> version
npm view <pacote> dist-tags

# 2. Verificar dependencias do pacote
npm view <pacote> dependencies

# 3. Verificar quando foi a ultima publicacao
npm view <pacote> time

# 4. Verificar licenca
npm view <pacote> license

# 5. Auditar vulnerabilidades conhecidas
npm audit
```

## Exemplo pratico: avaliando Express antes de instalar

```bash
# Passo 1: Ver dist-tags
$ npm view express dist-tags
{ latest: '4.21.1', next: '5.0.1' }

# Passo 2: Ver downloads recentes (via npmjs.com)
# Express: ~30M downloads/semana → altamente popular

# Passo 3: Ver ultima publicacao
$ npm view express time --json | tail -5
# Mostra datas das ultimas versoes publicadas

# Passo 4: Decisao
# → Projeto em producao: npm install express (pega 4.21.1)
# → Testar novidades: npm install express@next (pega 5.0.1)
```

## Comparando versoes no package.json

```json
{
  "dependencies": {
    "express": "^4.21.1"
  }
}
```

O `^` (caret) significa: aceita atualizacoes de minor e patch (4.21.x, 4.22.x) mas nao major (5.x). Isso protege contra breaking changes automaticos.

```json
{
  "dependencies": {
    "express": "~4.21.1"
  }
}
```

O `~` (tilde) e mais restritivo: aceita apenas patches (4.21.x) mas nao minor updates (4.22.x).

```json
{
  "dependencies": {
    "express": "4.21.1"
  }
}
```

Sem prefixo: versao exata, sem atualizacoes automaticas. Maximo controle, mas requer atualizacao manual.