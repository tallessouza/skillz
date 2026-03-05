# Code Examples: Instalando Git no Mac

## Instalacao completa via Homebrew

```bash
# 1. Instalar Homebrew
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# 2. Instalar Git
brew install git

# 3. Verificar versao
git version
# Exemplo de saida: git version 2.42.0
```

## Configuracao de identidade

```bash
# Configurar nome
git config --global user.name "Mayk Brito"

# Configurar email (DEVE ser o mesmo do GitHub)
git config --global user.email "mayk@rocketseat.com.br"
```

## Verificacao pos-instalacao

```bash
# Checar tudo de uma vez
git version && git config --global user.name && git config --global user.email
```

## Alternativa: Xcode

```bash
# Digitar git no terminal — se nao instalado, macOS sugere Xcode
git

# Ou instalar Command Line Tools diretamente (mais leve que Xcode completo)
xcode-select --install
```

## Alternativa: Download direto

Acessar https://git-scm.com/download/mac e seguir o instalador grafico.

## Corrigir email depois

```bash
# Se configurou email errado
git config --global user.email "email-correto@exemplo.com"

# Verificar
git config --global user.email
```

## Listar todas as configs globais

```bash
git config --global --list
```