# Code Examples: Angular CLI Global vs NPX

## 1. Instalacao global do Angular CLI

### Instalar ultima versao
```bash
npm install -g @angular/cli
# Instala a ultima versao disponivel (ex: v20)
# O comando 'ng' fica disponivel globalmente
```

### Instalar versao especifica
```bash
npm install -g @angular/cli@19
# Instala exatamente a versao 19
# Todos os projetos criados com 'ng new' serao v19
```

### Desinstalar CLI global
```bash
npm uninstall -g @angular/cli
# Remove o CLI global para poder instalar outra versao
```

## 2. Criar projeto com CLI global

### Basico
```bash
ng new meu-novo-projeto
# Cria projeto na versao do CLI instalado globalmente
# Vai perguntar interativamente sobre SSR e estilo
```

### Com flags
```bash
ng new meu-novo-projeto --ssr=false --style=scss
# Cria projeto sem SSR e com SCSS
# Pula as perguntas interativas para essas opcoes
```

## 3. Criar projeto com npx

### Ultima versao
```bash
npx @angular/cli new meu-novo-projeto
# Baixa temporariamente a ultima versao do @angular/cli
# Executa 'new meu-novo-projeto'
# Remove o pacote apos execucao
```

### Versao especifica
```bash
npx @angular/cli@15 new meu-novo-projeto
# Baixa temporariamente a versao 15 do @angular/cli
# Cria projeto Angular 15
# Remove o pacote apos execucao
```

### Com flags
```bash
npx @angular/cli@20 new meu-novo-projeto --ssr=false --style=scss
# Baixa v20 temporariamente
# Cria projeto sem SSR, com SCSS
# Remove o pacote
```

## 4. Fluxo completo com npx + nvm

### Cenario: criar projeto Angular 15 tendo Node 22 instalado
```bash
# Verificar Node atual
node -v
# v22.x.x — incompativel com Angular 15!

# Trocar para Node 18 (compativel com Angular 15)
nvm use 18
# Now using node v18.x.x

# Criar projeto Angular 15
npx @angular/cli@15 new meu-projeto-legado --ssr=false --style=scss

# Voltar para Node 22 para outros projetos
nvm use 22
```

### Cenario: criar dois projetos em versoes diferentes
```bash
# Projeto 1: Angular 20 (ultima)
npx @angular/cli@20 new projeto-novo --ssr=false --style=scss

# Projeto 2: Angular 15 (legado)
nvm use 18  # Trocar Node para versao compativel
npx @angular/cli@15 new projeto-legado --ssr=false --style=scss
nvm use 22  # Voltar para Node atual
```

## 5. Verificar compatibilidade Node.js

Consultar a pagina oficial: **Angular Version Compatibility**

| Angular Version | Node.js Compativel |
|-----------------|-------------------|
| 20 | 20, 22 |
| 19 | 18, 20, 22 |
| 18 | 18, 20 |
| 17 | 18, 20 |
| 16 | 16, 18 |
| 15 | 14, 16, 18 |

*Nota: tabela ilustrativa — sempre consulte a documentacao oficial para valores atualizados.*