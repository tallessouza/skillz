# Code Examples: Navegando Pelos Commits

## Exemplo 1: Fluxo basico da aula

```bash
# Situacao: arquivo modificado, quero ver versao anterior

# 1. Ver status atual
git status
# modified: phrases.txt

# 2. Ver historico de commits
git log
# commit f8a3b2c (HEAD -> main) segundo commit
# commit abc1234 primeiro commit

# 3. Sair do git log
# Pressione :q

# 4. Navegar para o primeiro commit (copie parte do SHA)
git checkout abc1234

# Mensagem: You are in 'detached HEAD' state.
# Voce pode olhar, experimentar, mas para salvar mudancas
# precisa criar uma branch.

# 5. Ver o arquivo como estava
cat phrases.txt
# (conteudo original)

# 6. Ver git log neste ponto — so mostra ate aqui
git log
# commit abc1234 primeiro commit
# (nao mostra o segundo commit — "nao ve o futuro")

# 7. Voltar para o presente
git checkout main
# Switched to branch 'main'

# 8. Confirmar que tudo voltou ao normal
git log
# commit f8a3b2c (HEAD -> main) segundo commit
# commit abc1234 primeiro commit

cat phrases.txt
# (conteudo modificado — versao atual)
```

## Exemplo 2: Navegar com git log formatado

```bash
# Ver historico compacto (facilita copiar SHA)
git log --oneline
# f8a3b2c (HEAD -> main) segundo commit
# abc1234 primeiro commit

# Navegar para commit especifico
git checkout abc1234

# Voltar
git checkout main
```

## Exemplo 3: Inspecionar arquivo especifico sem checkout

```bash
# Alternativa: ver arquivo de commit antigo sem sair da branch
git show abc1234:phrases.txt

# Isso mostra o conteudo do arquivo naquele commit
# SEM entrar em detached HEAD
```

## Exemplo 4: Criar branch a partir do passado (mencionado pelo instrutor)

```bash
# Se voce quer MODIFICAR algo do passado
git checkout abc1234
# Detached HEAD

# Crie uma branch para nao perder mudancas
git checkout -b recuperar-versao-antiga

# Faca mudancas e commit normalmente
echo "mudanca" >> phrases.txt
git add phrases.txt
git commit -m "recuperar conteudo antigo"

# Volte para main e traga as mudancas
git checkout main
git merge recuperar-versao-antiga
```

## Exemplo 5: SHA parcial — quanto e suficiente

```bash
# SHA completo (40 chars) — funciona mas desnecessario
git checkout f8a3b2c1d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9

# Primeiros 7 chars — normalmente suficiente
git checkout f8a3b2c

# Primeiros 4 chars — pode funcionar em repos pequenos
git checkout f8a3

# Se for ambiguo, Git avisa:
# error: short SHA1 f8a3 is ambiguous
```

## Exemplo 6: Erros comuns

```bash
# SHA errado — Git nao encontra
git checkout zzz1234
# error: pathspec 'zzz1234' did not match any file(s) known to git

# Esqueceu de voltar para main — ainda em detached HEAD
git status
# HEAD detached at abc1234
# (lembre de fazer git checkout main)
```