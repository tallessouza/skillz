# Code Examples: Git Stage Area

## Exemplo 1: Fluxo completo demonstrado na aula

```bash
# Estado inicial — repositorio recem-criado com git init
git status
# Output:
# On branch main
# No commits yet
# Untracked files:
#   .DS_Store
#   frases.txt

# Adicionar arquivo especifico
git add frases.txt

git status
# Output:
# On branch main
# No commits yet
# Changes to be committed:
#   new file: frases.txt
# Untracked files:
#   .DS_Store
```

## Exemplo 2: Adicionar e remover do Stage Area

```bash
# Adicionar .DS_Store
git add .DS_Store

git status
# Output:
# Changes to be committed:
#   new file: .DS_Store
#   new file: frases.txt

# Remover .DS_Store do staging (manter no disco)
git rm --cached .DS_Store

git status
# Output:
# Changes to be committed:
#   new file: frases.txt
# Untracked files:
#   .DS_Store
```

## Exemplo 3: git add . (adicionar tudo)

```bash
# Adiciona todos os arquivos da pasta atual
git add .

git status
# Todos os arquivos aparecem em "Changes to be committed"

# Se adicionou algo indesejado, remova
git rm --cached .DS_Store
```

## Exemplo 4: Modificacao apos staging (caso critico)

```bash
# Arquivo ja no stage
git add frases.txt

# Edita o arquivo (adiciona conteudo novo)
echo "nova frase" >> frases.txt

git status
# Output:
# Changes to be committed:
#   new file: frases.txt
# Changes not staged for commit:
#   modified: frases.txt

# ATENCAO: neste ponto, o commit pegaria a versao ANTERIOR a edicao

# Para incluir a modificacao:
git add frases.txt

git status
# Output:
# Changes to be committed:
#   new file: frases.txt    (agora com a modificacao incluida)
```

## Exemplo 5: Variacoes praticas adicionais

### Adicionar multiplos arquivos especificos
```bash
git add arquivo1.txt arquivo2.txt arquivo3.txt
```

### Adicionar por extensao (usando glob)
```bash
git add *.txt
```

### Verificar diferenca entre staged e working
```bash
git diff              # mostra mudancas NAO staged
git diff --cached     # mostra mudancas JA staged
```

### Remover todos os arquivos do stage (sem deletar)
```bash
git rm --cached -r .
```

## Resumo visual do fluxo

```
[Disco]          [Stage Area]        [Repositorio]
  |                   |                    |
  |-- git add ------->|                    |
  |                   |-- git commit ----->|
  |<-- git rm --cached|                    |
  |                   |                    |
  |-- edita arquivo   |                    |
  |-- git add ------->| (re-staging)       |
```