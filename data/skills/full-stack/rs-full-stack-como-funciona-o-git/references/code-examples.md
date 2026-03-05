# Code Examples: Como Funciona o Git

## Fluxo basico completo (os 80%)

Esta aula e conceitual e nao mostra comandos especificos, mas o fluxo descrito pelo instrutor se traduz assim:

### Iniciar um repositorio

```bash
# Criar controle de versao no projeto
# "Agora o Git existe aqui, estou disponivel para fazer uso das coisas"
git init
```

### Verificar estado dos arquivos

```bash
# Verificar se tem arquivos para colocar no Stage Area
git status
```

### Colocar no Stage Area

```bash
# Avisar para o Git: "esse arquivo esta pronto para criar um commit"
git add arquivo.txt

# Ou todos os arquivos modificados
git add .
```

### Criar um commit (ponto na historia)

```bash
# Criar um novo ponto na historia
git commit -m "Adiciona botao verde"
```

### Enviar para repositorio remoto

```bash
# Tirar do local para o remoto
git push origin main
```

### Trazer do repositorio remoto

```bash
# Puxar do remoto para o local
git pull origin main
```

## Fluxo com branches (exemplo Instagram/Reels)

```bash
# Voce esta na main (Instagram sem Reels)
git branch
# * main

# Alguem teve a ideia do Reels — cria branch alternativa
git checkout -b feature/reels

# Desenvolve o Reels (commits na branch alternativa)
git add .
git commit -m "Implementa player de video curto"
git add .
git commit -m "Adiciona feed de Reels"
git add .
git commit -m "Implementa gravacao de Reels"

# Reels pronto e testado — volta para main e traz a feature
git checkout main
git merge feature/reels

# Agora todos veem o Reels na main
```

## Visualizacao do historico (navegando no tempo)

```bash
# Ver os pontos na historia (commits)
git log --oneline

# Exemplo de saida:
# a1b2c3d Adiciona botao azul     (versao 3)
# d4e5f6g Muda para botao verde   (versao 2)
# h7i8j9k Cria botao vermelho     (versao 1)

# "Voltar para a versao 182" — navegar no passado
git checkout h7i8j9k
```

## Diagrama ASCII do fluxo completo

```
  [Seus Arquivos]
       │
       │  git add
       ▼
  [Stage Area]     ← "Area de preparo"
       │
       │  git commit
       ▼
  [Local Repo]     ← "Repositorio na sua maquina"
       │
       │  git push
       ▼
  [Remote Repo]    ← "GitHub (nuvem)"
       │
       │  git pull
       ▼
  [Local Repo]     ← "Atualizacoes de outros devs"
```

## Diagrama ASCII de branches

```
main:     ●───●───●───●───●───●───●  (linha do tempo principal)
                   \           /
feature/reels:      ●───●───●        (linha do tempo alternativa)
                    ^           ^
                    |           |
              branch criada   merge para main
              "ideia do Reels" "Reels pronto!"
```