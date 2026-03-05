# Code Examples: Alterando e Commitando

## Exemplo 1: Fluxo completo da aula

Exatamente como o instrutor demonstrou:

```bash
# Editou phrases.txt adicionando textos
# Verifica o status
git status
# Saida: modified: phrases.txt (em vermelho — nao esta no staged)
# Saida: untracked: .DS_Store

# Adiciona APENAS o arquivo desejado
git add phrases.txt

# Verifica novamente
git status
# Saida: modified: phrases.txt (em verde — no staged, pronto para commit)

# Cria o commit
git commit -m "Adicionei novas linhas"
# Saida: 1 file changed, 4 insertions(+), 1 deletion(-)
```

## Exemplo 2: Tentando commit sem staged

```bash
# Modificou o arquivo mas esqueceu do git add
vim phrases.txt

git commit -m "Minhas mudancas"
# Saida: nothing to commit, working tree clean
# (ou: Changes not staged for commit)

# Solucao: adicionar ao staged primeiro
git add phrases.txt
git commit -m "Minhas mudancas"
```

## Exemplo 3: Descartando mudancas

```bash
# Modificou o arquivo mas nao gostou
vim phrases.txt

git status
# Saida: modified: phrases.txt

# Restaura ao estado do ultimo commit
git restore phrases.txt

git status
# Saida: nothing to commit, working tree clean
```

## Exemplo 4: Arquivo ja rastreado detecta mudancas automaticamente

```bash
# Primeira vez: precisa adicionar explicitamente
git add phrases.txt
git commit -m "Adicionei phrases.txt"

# A partir de agora, qualquer mudanca e detectada:
echo "mais uma frase" >> phrases.txt
git status
# O Git ja sabe que phrases.txt mudou — sem precisar re-registrar
```

## Exemplo 5: Selecionando arquivos especificos para staged

```bash
git status
# modified: phrases.txt
# modified: config.txt
# untracked: .DS_Store

# Adicionar apenas o que faz sentido para este commit
git add phrases.txt
git commit -m "Atualizei frases"

# Depois, em outro commit
git add config.txt
git commit -m "Atualizei configuracoes"

# .DS_Store nunca e adicionado
```

## Exemplo 6: Lendo a saida do commit

```bash
git commit -m "Adicionei novas linhas"
# [main abc1234] Adicionei novas linhas
#  1 file changed, 4 insertions(+), 1 deletion(-)
#
# Significado:
# - abc1234: ID unico deste commit (hash)
# - 1 file changed: um arquivo foi modificado
# - 4 insertions(+): 4 linhas novas adicionadas
# - 1 deletion(-): 1 linha removida
```

## Variacoes de mensagens de commit descritivas

```bash
# Boas mensagens (descrevem O QUE foi feito):
git commit -m "Adicionei novas frases ao arquivo phrases.txt"
git commit -m "Corrigi erro de digitacao na terceira linha"
git commit -m "Removi linhas duplicadas do phrases.txt"

# Mensagens ruins (nao descrevem nada):
git commit -m "update"
git commit -m "mudancas"
git commit -m "fix"
git commit -m "wip"
```