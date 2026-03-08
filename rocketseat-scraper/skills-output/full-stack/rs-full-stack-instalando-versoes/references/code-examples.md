# Code Examples: Instalando Versões com NPM

## Exemplo 1: Instalação sem versão (latest estável)

```bash
# Forma completa
npm install express

# Forma abreviada (preferida)
npm i express
```

**Resultado no package.json:**
```json
{
  "dependencies": {
    "express": "^4.21.1"
  }
}
```

Note o `^` (caret): permite atualizações automáticas dentro da mesma major version (4.x.x).

## Exemplo 2: Instalação de versão específica mais recente

```bash
npm i express@5.0.1
```

**Resultado no package.json:**
```json
{
  "dependencies": {
    "express": "^5.0.1"
  }
}
```

## Exemplo 3: Instalação de versão antiga

```bash
npm i express@3.19.0
```

**Resultado no package.json:**
```json
{
  "dependencies": {
    "express": "^3.19.0"
  }
}
```

## Exemplo 4: Sincronizar lock file após mudança manual

```bash
# Após editar manualmente o package.json
npm i
```

Sem argumentos — apenas sincroniza.

## Variações úteis (extensão dos conceitos da aula)

### Verificar versões disponíveis

```bash
# Todas as versões publicadas
npm view express versions

# Apenas as tags (latest, next, etc.)
npm view express dist-tags
```

### Instalar versão exata (sem caret)

```bash
# Com --save-exact ou -E, grava sem o ^
npm i express@4.21.1 --save-exact
```

**Resultado no package.json:**
```json
{
  "dependencies": {
    "express": "4.21.1"
  }
}
```

Sem `^` — a versão fica travada exatamente nesse número.

### Instalar como dependência de desenvolvimento

```bash
npm i jest --save-dev
# ou abreviado
npm i jest -D
```

**Resultado no package.json:**
```json
{
  "devDependencies": {
    "jest": "^29.7.0"
  }
}
```

### Verificar versão instalada

```bash
# Versão de um pacote específico
npm list express

# Todas as dependências de primeiro nível
npm list --depth=0
```

### Fluxo completo demonstrado na aula

```bash
# 1. Instalar latest (estável)
npm i express
# → package.json: "express": "^4.21.1"

# 2. Trocar para versão next
npm i express@5.0.1
# → package.json: "express": "^5.0.1"

# 3. Voltar para versão antiga
npm i express@3.19.0
# → package.json: "express": "^3.19.0"

# 4. Sincronizar lock file
npm i
# → package-lock.json atualizado
```