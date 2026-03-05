# Code Examples: Criando o Primeiro Commit

## Exemplo 1: Fluxo basico da aula

```bash
# Verificar estado do projeto
git status
# Saida: new file: frases.txt (no stage, mas com modificacoes)

# Restaurar arquivo ao estado do stage (desfazer modificacoes)
git restore frases.txt
# Nenhuma saida visivel, mas o arquivo volta ao estado anterior

# Verificar novamente — mensagem diferente agora
git status
# Saida: new file: frases.txt (sem modificacoes pendentes)

# Criar o primeiro commit
git commit -m "initial commit"
# Saida:
# [main abc1234] initial commit
#  1 file changed, 5 insertions(+)
#  create mode 100644 frases.txt

# Verificar estado pos-commit
git status
# Saida: On branch main, nothing to commit
```

## Exemplo 2: Modificar e re-adicionar (fluxo normal)

```bash
# Arquivo ja esta no stage
git status
# new file: frases.txt

# Voce edita o arquivo, adicionando novas linhas...

# Verifica — agora mostra modificacoes alem do stage
git status
# Changes to be committed: new file: frases.txt
# Changes not staged: modified: frases.txt

# Atualiza o stage com a versao mais recente
git add frases.txt

# Agora sim, commita com tudo atualizado
git commit -m "initial commit"
```

## Exemplo 3: Tentando commitar com stage vazio

```bash
# Apos um commit, sem novas modificacoes
git status
# On branch main, nothing to commit, working tree clean

git commit -m "tentativa vazia"
# nothing to commit, working tree clean
# (nenhum commit e criado)
```

## Exemplo 4: Multiplos arquivos no primeiro commit

```bash
# Projeto com varios arquivos
git status
# Untracked files:
#   index.html
#   style.css
#   app.js

# Adicionar todos
git add index.html style.css app.js

# Commitar
git commit -m "initial commit"
# [main abc1234] initial commit
#  3 files changed, 45 insertions(+)
#  create mode 100644 index.html
#  create mode 100644 style.css
#  create mode 100644 app.js
```

## Exemplo 5: git restore em diferentes cenarios

```bash
# Cenario: voce adicionou linhas erradas ao arquivo no stage
git restore frases.txt
# Arquivo volta ao estado que estava quando voce fez git add

# Cenario: voce quer descartar TODAS as modificacoes nao-staged
git restore .
# Todos os arquivos voltam ao estado do stage
```