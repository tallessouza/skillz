# Code Examples: Levando Alterações para Produção

## Fluxo completo de deploy

### 1. Verificar estado do repositório

```bash
# Ver quais arquivos foram alterados
git status
```

Output esperado:
```
On branch main
Changes not staged for commit:
  modified:   src/components/Button.css
```

### 2. Adicionar todas as alterações

```bash
# Adicionar todos os arquivos modificados
git add .

# Ou adicionar arquivos específicos
git add src/components/Button.css
```

### 3. Fazer commit com mensagem descritiva

```bash
# Mensagem descritiva que aparecerá no dashboard da Vercel
git commit -m "change button style"
```

Variações de mensagens de commit para diferentes cenários:
```bash
# Feature nova
git commit -m "add user authentication flow"

# Bugfix
git commit -m "fix redirect after login"

# Alteração visual
git commit -m "update primary button color to purple"

# Refatoração
git commit -m "refactor header component for mobile"
```

### 4. Push para produção

```bash
# Primeiro push (configura upstream tracking)
git push -u origin main

# Todos os pushes subsequentes (Git já sabe o destino)
git push
```

### 5. Verificar no GitHub

Acessar o repositório no GitHub → clicar no histórico de commits → confirmar que o novo commit aparece.

### 6. Verificar na Vercel

No dashboard da Vercel:
- Acessar **Deployments**
- O novo deploy aparece automaticamente
- Status: Building → Ready
- Tag "Current" move para o novo deploy
- Clicar no deploy → **Build Logs** para ver detalhes da execução

### 7. Verificar em produção

```bash
# Abrir a URL de produção no navegador
# Fazer hard refresh para limpar cache:
# Windows/Linux: Ctrl+Shift+R
# Mac: Cmd+Shift+R
```

## Cenário: Build falhou

```bash
# 1. Verificar Build Logs no dashboard da Vercel
# 2. Corrigir o erro localmente
# 3. Testar localmente
npm run build  # Simula o mesmo build que a Vercel executa

# 4. Novo commit com correção
git add .
git commit -m "fix build error in Button component"
git push
```

## Cenário: Precisa reverter

```bash
# Opção 1: Git revert (cria novo commit que desfaz o anterior)
git revert HEAD
git push

# Opção 2: Rollback pelo dashboard da Vercel
# Ir em Deployments → clicar nos "..." do deploy anterior → Promote to Production
```

## Cenário: Múltiplas alterações antes do push

```bash
# Alterar vários arquivos
git add .
git commit -m "update button and header styles"
git push
# A Vercel faz um único deploy com todas as alterações
```

## Cenário: Verificar que o push com -u já foi feito

```bash
# Verificar upstream configurado
git remote -v
# Output: origin  https://github.com/user/repo.git (push)

git branch -vv
# Output: * main abc1234 [origin/main] change button style
# O [origin/main] confirma que o tracking está configurado
```