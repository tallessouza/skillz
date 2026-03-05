# Code Examples: Recuperando Arquivos Deletados com Git

## Exemplo 1: Fluxo completo de delecao e recuperacao (da aula)

```bash
# Estado inicial: phrases.txt existe e esta comitado

# 1. Deletar o arquivo (pelo editor, explorador, ou rm)
rm phrases.txt

# 2. Registrar a delecao no Git
git add phrases.txt
git commit -m "deletado phrases.txt"

# 3. Verificar o log para encontrar o commit com o arquivo
git log --oneline
# Saida exemplo:
# f7a3b2c deletado phrases.txt
# a1b2c3d novas frases adicionadas
# 9e8d7c6 commit inicial

# 4. Recuperar o arquivo do commit desejado
git checkout a1b2c3d -- phrases.txt

# 5. Verificar que o arquivo voltou
git status
# Saida: new file: phrases.txt (no stage area)

# 6. Comitar a recuperacao
git commit -m "resgatando phrases.txt"
```

## Exemplo 2: Remover do stage area apos recuperacao

```bash
# Apos git checkout <hash> -- phrases.txt
# O arquivo esta no stage area

# Se nao quiser comitar ainda:
git restore --staged phrases.txt

# Agora o arquivo esta no working directory mas fora do stage
git status
# Saida: untracked files: phrases.txt
```

## Exemplo 3: Recuperar delecao nao comitada

```bash
# Deletou o arquivo sem querer
rm phrases.txt

# Ainda nao fez git add nem commit
# Simplesmente restaure:
git restore phrases.txt

# Arquivo de volta instantaneamente
ls phrases.txt
# phrases.txt
```

## Exemplo 4: Encontrar historico de um arquivo especifico

```bash
# Ver todos os commits que mexeram no arquivo
git log --oneline -- phrases.txt
# a1b2c3d novas frases adicionadas
# 9e8d7c6 commit inicial

# Ver o conteudo do arquivo em um commit especifico (sem restaurar)
git show a1b2c3d:phrases.txt
```

## Exemplo 5: Recuperar arquivo deletado varios commits atras

```bash
# Cenario: voce fez 20 commits desde a delecao

# Encontrar o ultimo commit que tinha o arquivo
git log --oneline --diff-filter=D -- config.yaml
# b4c5d6e removido config desnecessario

# O commit ANTERIOR a esse e o ultimo que tinha o arquivo
# Use ~1 para referenciar o commit pai
git checkout b4c5d6e~1 -- config.yaml

git commit -m "resgatando config.yaml"
```

## Variacao: Recuperar multiplos arquivos de uma vez

```bash
# Recuperar todos os arquivos de um commit especifico
git checkout a1b2c3d -- phrases.txt config.yaml README.md

# Ou recuperar um diretorio inteiro
git checkout a1b2c3d -- src/
```