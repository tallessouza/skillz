# Code Examples: Preparação de Projeto para Deploy

## Método 1: Download ZIP (demonstrado na aula)

```bash
# 1. Acesse o repositório no navegador
# https://github.com/rocketseat-education/fullstack-deploy-template

# 2. Code → Download ZIP

# 3. Extrair
cd ~/Downloads
unzip fullstack-deploy-template-main.zip

# 4. Renomear
mv fullstack-deploy-template-main rocket-log

# 5. Organizar em pasta dedicada
mkdir -p ~/projetos/deploy
mv rocket-log ~/projetos/deploy/

# 6. Abrir no VSCode
cd ~/projetos/deploy/rocket-log
code .

# 7. Instalar dependências
npm i
```

## Método 2: Git Clone (alternativa profissional)

```bash
# Clone direto com nome customizado
git clone https://github.com/rocketseat-education/fullstack-deploy-template.git rocket-log

# Organizar
mkdir -p ~/projetos/deploy
mv rocket-log ~/projetos/deploy/

# Instalar
cd ~/projetos/deploy/rocket-log
npm install
```

## Método 3: GitHub CLI

```bash
# Usando gh cli
gh repo clone rocketseat-education/fullstack-deploy-template rocket-log

cd rocket-log
npm i
```

## Verificações pós-setup

```bash
# Verificar estrutura do projeto
ls -la
# Deve mostrar: package.json, src/, node_modules/, etc.

# Verificar dependências instaladas
npm ls --depth=0

# Verificar scripts disponíveis
cat package.json | grep -A 10 '"scripts"'

# Teste rápido de execução
npm run dev
# ou
npm start
```

## Troubleshooting comum

```bash
# Erro de versão do Node
node -v
# Se incompatível, usar nvm:
nvm install 18
nvm use 18
npm i

# Erro de permissão no npm
# Nunca use sudo com npm install
# Configure o diretório global do npm:
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'

# Limpar cache se instalação falhar
npm cache clean --force
rm -rf node_modules package-lock.json
npm i
```