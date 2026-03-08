# Code Examples: Subindo a Versão

## Exemplo 1: Instalando Express em versão específica

### Consultando versões disponíveis

```bash
# Ver todas as versões do Express
npm view express versions --json

# Saída (parcial):
# [
#   "0.14.0",
#   ...
#   "4.19.0",
#   "4.19.1",
#   "4.19.2",
#   "4.21.0",
#   "4.21.1",
#   ...
# ]
```

### Instalando a versão escolhida

```bash
# Instalar Express 4.19.0 especificamente
npm i express@4.19.0

# Saída esperada:
# added 64 packages in 2s
# (ou "changed 1 package" se já tinha Express instalado)
```

### Resultado no package.json

```json
{
  "dependencies": {
    "express": "^4.19.0"
  }
}
```

## Exemplo 2: Instalando jsonwebtoken em versão específica

```bash
# Consultar versões
npm view jsonwebtoken versions --json

# Instalar versão 9.0.0
npm i jsonwebtoken@9.0.0
```

### Resultado no package.json

```json
{
  "dependencies": {
    "express": "^4.19.0",
    "jsonwebtoken": "^9.0.0"
  }
}
```

## Exemplo 3: Double check final

```bash
# Após todas as instalações forçadas, sincronizar dependências
npm i

# Isso garante que package-lock.json está consistente
```

## Variações úteis

### Instalar versão exata sem prefixo caret (^)

```bash
# Com --save-exact, grava "4.19.0" em vez de "^4.19.0"
npm i express@4.19.0 --save-exact
```

### Ver qual versão está instalada atualmente

```bash
# Ver versão instalada de um pacote específico
npm ls express

# Saída:
# projeto@1.0.0
# └── express@4.19.0
```

### Ver informações da versão latest

```bash
# Ver apenas a versão latest
npm view express version
# 4.21.1

# Ver todas as dist-tags (latest, next, etc.)
npm view express dist-tags
# { latest: '4.21.1', next: '5.0.0-beta.3' }
```

### Instalar múltiplos pacotes com versões específicas

```bash
# Pode instalar vários de uma vez
npm i express@4.19.0 jsonwebtoken@9.0.0

# Mas o instrutor instala um por vez para verificar cada instalação
```

### Verificar se há atualizações disponíveis

```bash
# Após instalar versões específicas, verificar o que pode ser atualizado
npm outdated

# Saída:
# Package        Current  Wanted  Latest
# express        4.19.0   4.19.2  4.21.1
# jsonwebtoken   9.0.0    9.0.2   9.0.2
```