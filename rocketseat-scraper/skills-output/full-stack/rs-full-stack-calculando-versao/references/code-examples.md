# Code Examples: Calculando Versão com Semver

## Ranges no package.json

### Versão exata (sem flexibilidade)

```json
{
  "dependencies": {
    "express": "3.19.0"
  }
}
```

Instala **apenas** a 3.19.0. Sem atualizações automáticas.

### Range com til (~) — apenas patches

```json
{
  "dependencies": {
    "express": "~3.19.0"
  }
}
```

Equivale a `3.19.x` no calculator. Aceita: 3.19.0, 3.19.1, 3.19.2.
Não aceita: 3.20.0 (é minor, não patch).

### Range com caret (^) — minor + patches

```json
{
  "dependencies": {
    "express": "^3.19.0"
  }
}
```

Equivale a `3.x` no calculator. Aceita qualquer versão `>=3.19.0` e `<4.0.0`.
Inclui novas funcionalidades e correções.

### Range com X notation

```json
{
  "dependencies": {
    "express": "3.x"
  }
}
```

Mesmo efeito do caret para major 3. Todas as versões 3.*.* são aceitas.

```json
{
  "dependencies": {
    "express": "3.19.x"
  }
}
```

Mesmo efeito do til. Apenas patches da 3.19.

## Usando o semver calculator — passo a passo

### Cenário 1: Encontrar patches seguros

```
Site: semver.npmjs.com
Pacote: express
Range: 3.19.x
Resultado: 3 versões (3.19.0, 3.19.1, 3.19.2)
Ação: atualizar para 3.19.2 (último patch)
```

### Cenário 2: Encontrar todas as versões compatíveis

```
Site: semver.npmjs.com
Pacote: express
Range: 3.x
Resultado: dezenas de versões
Ação: avaliar changelog das versões mais recentes, escolher a melhor
```

### Cenário 3: Verificar se versão específica está no range

```
Site: semver.npmjs.com
Pacote: express
Range: ^3.19.0
Verificar: 3.21.0 aparece na lista? Sim → compatível
Verificar: 4.0.0 aparece na lista? Não → breaking change
```

## Comandos npm relacionados

### Ver versão instalada

```bash
npm list express
```

### Ver todas as versões disponíveis no registry

```bash
npm view express versions
```

### Ver apenas versões dentro de um range

```bash
npm view express versions --json | node -e "
  const semver = require('semver');
  const versions = JSON.parse(require('fs').readFileSync('/dev/stdin','utf8'));
  console.log(versions.filter(v => semver.satisfies(v, '3.x')));
"
```

### Atualizar respeitando o range do package.json

```bash
npm update express
```

### Instalar versão específica após consultar o calculator

```bash
npm install express@3.19.2
```

## Fluxo recomendado de atualização

```bash
# 1. Verificar versão atual
npm list express
# express@3.19.0

# 2. Consultar semver.npmjs.com com range 3.19.x
# Resultado: 3.19.0, 3.19.1, 3.19.2

# 3. Atualizar para último patch
npm install express@3.19.2

# 4. Rodar testes
npm test

# 5. Se tudo passar, considerar range mais amplo (3.x)
# Consultar calculator novamente, escolher versão mais recente

# 6. Atualizar
npm install express@3.21.0

# 7. Rodar testes novamente
npm test
```