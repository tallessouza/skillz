# Code Examples: Promovendo Build de Preview para Produção

## Fluxo completo via Git CLI

### Cenário: Feature branch `feat/shake_feedback` pronta para produção

```bash
# 1. Trocar para a branch principal
git checkout main

# 2. Atualizar a main com o remoto (prevenir conflitos)
git pull origin main

# 3. Fazer merge da feature branch
git merge feat/shake_feedback

# 4. Verificar o histórico
git log --oneline
# Saída esperada:
# a1b2c3d Merge branch 'feat/shake_feedback'
# d4e5f6g feat: add shake feedback animation
# g7h8i9j style: change button styling
# j0k1l2m feat: initial v1

# 5. Sair do log
# Pressionar :q

# 6. Enviar para produção
git push origin main
```

## Variações do fluxo

### Com conflitos no pull

```bash
git checkout main
git pull origin main
# CONFLICT: se houver conflitos
# Resolver manualmente nos arquivos indicados
git add .
git commit -m "fix: resolve merge conflicts from main"
git merge feat/shake_feedback
git push origin main
```

### Com conflitos no merge da feature

```bash
git checkout main
git pull origin main
git merge feat/shake_feedback
# CONFLICT: arquivos conflitantes listados
# Editar os arquivos, resolver os marcadores <<<<< ===== >>>>>
git add .
git commit -m "merge: integrate shake_feedback resolving conflicts"
git push origin main
```

### Push simplificado (quando tracking está configurado)

```bash
git checkout main
git pull
git merge feat/shake_feedback
git push
# Funciona quando o upstream tracking já está configurado
```

### Verificar status antes do push

```bash
git checkout main
git pull origin main
git merge feat/shake_feedback

# Verificar o que será enviado
git status
git diff origin/main --stat

# Confirmar e enviar
git push origin main
```

## Fluxo via GitHub Pull Request

```bash
# 1. Garantir que a feature branch está no remoto
git push origin feat/shake_feedback

# 2. No GitHub:
#    - Acessar o repositório
#    - Clicar no banner "Compare & pull request"
#    - Preencher título e descrição
#    - Clicar "Create pull request"
#    - Revisar as mudanças
#    - Clicar "Merge pull request"
#    - Clicar "Confirm merge"

# 3. Atualizar local após merge pelo GitHub
git checkout main
git pull origin main
```

## Fluxo via Painel da Vercel

```
1. Acessar o dashboard da Vercel
2. Ir em "Deployments"
3. Localizar o preview deployment desejado
4. Clicar nos três pontinhos (...)
5. Selecionar "Promote to Production"
6. Confirmar a promoção

# Nota: este método NÃO faz merge no Git
# A main continua sem a feature — apenas o deploy muda
# Use apenas para promoções emergenciais
```

## Comandos úteis para verificação

```bash
# Ver todas as branches (local e remoto)
git branch -a

# Ver último commit em cada branch
git branch -v

# Ver diferenças entre branches antes do merge
git diff main..feat/shake_feedback --stat

# Ver log gráfico com branches
git log --oneline --graph --all

# Deletar feature branch após merge (limpeza)
git branch -d feat/shake_feedback
git push origin --delete feat/shake_feedback
```