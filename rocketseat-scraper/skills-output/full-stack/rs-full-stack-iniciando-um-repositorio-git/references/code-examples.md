# Code Examples: Iniciando Um Repositório Git

## Exemplo completo: Mac/Linux

```bash
# Abrir terminal

# Navegar ate a pasta
cd /Users/seuusuario/Desktop/git-aula

# Confirmar localizacao
pwd
# Output: /Users/seuusuario/Desktop/git-aula

# Iniciar repositorio
git init
# Output: Initialized empty Git repository in /Users/seuusuario/Desktop/git-aula/.git/
```

## Exemplo completo: Windows (Git Bash)

```bash
# Abrir Git Bash

# Navegar ate a pasta
cd /c/git-aula

# Confirmar localizacao
pwd
# Output: /c/git-aula

# Iniciar repositorio
git init
# Output: Initialized empty Git repository in C:/git-aula/.git/
```

## Exemplo completo: Windows (CMD/PowerShell)

```cmd
# Navegar ate a pasta
cd c:\git-aula

# Iniciar repositorio
git init
```

## Criar pasta e iniciar de uma vez

```bash
mkdir meu-novo-projeto
cd meu-novo-projeto
git init
```

## Verificar que o repositorio foi criado

```bash
# Listar todos os arquivos incluindo ocultos
ls -la

# Output esperado:
# drwxr-xr-x  3 user group  96 Jan  1 10:00 .
# drwxr-xr-x  5 user group 160 Jan  1 10:00 ..
# drwxr-xr-x  9 user group 288 Jan  1 10:00 .git    <-- repositorio criado
# -rw-r--r--  1 user group  45 Jan  1 10:00 frases.txt
```

## Cenario do instrutor

O instrutor usou uma pasta `git-aula` com um unico arquivo `frases.txt` contendo algumas frases. O conteudo do arquivo nao importa — o objetivo e apenas demonstrar que qualquer pasta com qualquer conteudo pode se tornar um repositorio Git.

```bash
cd /Users/MikeBritto/Desktop/git-aula
pwd
# /Users/MikeBritto/Desktop/git-aula
git init
# Initialized empty Git repository in /Users/MikeBritto/Desktop/git-aula/.git/
```

## Desfazer um `git init` acidental

```bash
# Se iniciou na pasta errada, basta remover a pasta .git
rm -rf .git
```

Isso remove completamente o repositorio Git sem afetar os arquivos do projeto.