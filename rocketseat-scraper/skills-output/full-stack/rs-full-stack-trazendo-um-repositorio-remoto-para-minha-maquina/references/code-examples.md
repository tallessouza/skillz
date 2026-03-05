# Code Examples: Git Clone

## Exemplo básico da aula

```bash
# Navegar até o desktop
cd ~/Desktop

# Clonar o repositório
git clone https://github.com/usuario/nome-do-repositorio.git

# Repositório clonado com o nome "nome-do-repositorio"
# Renomear a pasta (opcional)
mv nome-do-repositorio git-aula

# Entrar na pasta
cd git-aula

# Verificar status — tudo funciona normalmente
git status
# On branch main
# nothing to commit, working tree clean
```

## Clonar com nome customizado diretamente

```bash
# Em vez de clonar e renomear, você pode passar o nome desejado como segundo argumento
git clone https://github.com/usuario/repo.git meu-nome-local

# Isso cria a pasta "meu-nome-local" em vez de "repo"
cd meu-nome-local
git status
```

## Clonar em diretório específico

```bash
# Clonar dentro de uma pasta de projetos
cd ~/projetos
git clone https://github.com/usuario/repo.git

# Clonar direto para pasta atual (se estiver vazia)
mkdir meu-projeto && cd meu-projeto
git clone https://github.com/usuario/repo.git .
```

## Verificar o remote após clone

```bash
cd meu-projeto
git remote -v
# origin  https://github.com/usuario/repo.git (fetch)
# origin  https://github.com/usuario/repo.git (push)
```

## Ver branches disponíveis após clone

```bash
# Branches locais
git branch
# * main

# Branches remotas
git branch -r
# origin/main
# origin/feature-x
# origin/develop

# Trocar para branch remota
git checkout feature-x
# Branch 'feature-x' set up to track remote branch 'feature-x' from 'origin'.
```

## Cenários comuns pós-clone

```bash
# Verificar último commit
git log --oneline -5

# Começar a trabalhar — criar branch
git checkout -b minha-feature

# Fazer alterações, commitar e enviar
git add .
git commit -m "feat: minha alteração"
git push origin minha-feature
```