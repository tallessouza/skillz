# Code Examples: Ambiente de Desenvolvimento Node.js

## Instalacao por sistema operacional

### Windows

**Opcao 1: Instalador oficial**
1. Acessar https://nodejs.org
2. Baixar versao LTS
3. Executar instalador (.msi)
4. Seguir wizard (manter opcoes padrao)
5. Reiniciar terminal

**Opcao 2: nvm-windows (recomendado)**
```powershell
# Baixar nvm-windows de https://github.com/coreybutler/nvm-windows/releases
# Instalar o setup

# Depois de instalado:
nvm install lts
nvm use lts
node --version
npm --version
```

### macOS

```bash
# Opcao 1: nvm (recomendado)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.zshrc  # ou ~/.bashrc
nvm install --lts
nvm use --lts

# Opcao 2: Homebrew
brew install node@20
```

### Linux (Ubuntu/Debian)

```bash
# Opcao 1: nvm (recomendado)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc
nvm install --lts
nvm use --lts

# Opcao 2: apt (versao pode estar desatualizada)
sudo apt update
sudo apt install nodejs npm
```

## Verificacao completa do ambiente

```bash
# Verificar Node
node --version
# Esperado: v20.x.x ou v22.x.x (LTS)

# Verificar npm
npm --version
# Esperado: 10.x.x

# Verificar VS Code
code --version

# Teste funcional
node -e "console.log('Hello from Node', process.version)"

# Verificar onde o Node esta instalado
which node    # Linux/macOS
where node    # Windows
```

## Problemas comuns e solucoes

### "node: command not found"
```bash
# Provavelmente PATH nao foi atualizado
# Fechar e reabrir o terminal

# Se usando nvm, garantir que foi carregado:
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
```

### Versao errada do Node
```bash
# Listar versoes instaladas
nvm ls

# Instalar e usar LTS
nvm install --lts
nvm alias default lts/*
```

### Erro de permissao no npm global (Linux/macOS)
```bash
# NUNCA usar sudo com npm
# Solucao: configurar diretorio global do npm
mkdir -p ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
```