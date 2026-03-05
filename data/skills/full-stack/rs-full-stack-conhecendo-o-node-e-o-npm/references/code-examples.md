# Code Examples: Conhecendo o Node e o NPM

## Verificacao basica de instalacao

```bash
# Verificar versao do npm
npm --version
# Saida esperada: algo como 10.2.0

# Verificar versao do Node
node --version
# Saida esperada: algo como v20.11.0
```

## Instalacao via site oficial

1. Acesse `https://nodejs.org`
2. Clique no botao LTS
3. Execute o instalador:
   - **Windows:** arquivo `.msi` — next, next, finish
   - **Mac:** arquivo `.pkg` — next, next, finish
   - **Linux:** use o gerenciador de pacotes da distro ou nvm

## Instalacao via nvm (recomendado para desenvolvedores)

```bash
# Instalar nvm (Linux/Mac)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# Reiniciar o terminal, depois:
nvm install --lts
nvm use --lts

# Verificar
node --version
npm --version
```

## Instalacao via nvm-windows

```powershell
# Baixe o instalador de: https://github.com/coreybutler/nvm-windows/releases
# Apos instalar:
nvm install lts
nvm use lts

# Verificar
node --version
npm --version
```

## Troubleshooting comum

```bash
# Se 'node' nao e reconhecido apos instalar:
# 1. Feche e reabra o terminal
# 2. Verifique se o Node esta no PATH:
echo $PATH | tr ':' '\n' | grep node

# No Windows (PowerShell):
$env:PATH -split ';' | Select-String node

# Se npm da erro de permissao no Linux/Mac:
# NAO use sudo npm install -g
# Use nvm em vez disso (evita problemas de permissao)
```

## Verificacao completa do ambiente

```bash
# Script rapido para verificar tudo
echo "Node: $(node --version 2>/dev/null || echo 'NAO INSTALADO')"
echo "NPM: $(npm --version 2>/dev/null || echo 'NAO INSTALADO')"
echo "NPX: $(npx --version 2>/dev/null || echo 'NAO INSTALADO')"
```