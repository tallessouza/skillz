# Code Examples: Instalando Node.js e Angular CLI

## Verificacao do Node.js

```bash
# Abrir terminal (Windows: Win+R → cmd)
# Verificar se Node.js esta instalado
node --version
# Output esperado: v22.14.0 (ou versao LTS atual)
```

## Instalacao do Angular CLI

```bash
# Comando copiado diretamente da documentacao oficial do Angular
# O flag -g instala globalmente (disponivel em qualquer diretorio)
npm install -g @angular/cli
```

## Verificacao do Angular CLI

```bash
# Verificar versao instalada
ng version
# Output esperado: Angular CLI: 19.2.4 (ou versao atual)

# Limpar tela do terminal (opcional)
cls  # Windows
clear  # Linux/macOS

# Ver todos os comandos disponiveis
ng help
```

## Script completo de setup (one-shot)

```bash
# Apos instalar Node.js manualmente, rodar no terminal:

# 1. Verificar Node
node --version

# 2. Instalar Angular CLI
npm install -g @angular/cli

# 3. Verificar Angular CLI
ng version
```

## Variacoes por sistema operacional

### Windows
```bash
# Abrir: Win+R → cmd (ou PowerShell)
node --version
npm install -g @angular/cli
ng version
```

### macOS / Linux
```bash
# Se houver erro de permissao:
sudo npm install -g @angular/cli

# Alternativa melhor (sem sudo): usar nvm para gerenciar Node
# curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
# nvm install --lts
# nvm use --lts
```