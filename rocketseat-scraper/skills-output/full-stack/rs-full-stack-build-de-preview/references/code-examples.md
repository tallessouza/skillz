# Code Examples: Build de Preview

## Fluxo completo — Feature branch para preview build

### 1. Criar a feature branch (se ainda não existe)

```bash
# Partir sempre da main atualizada
git checkout main
git pull origin main

# Criar e mudar para a feature branch
git checkout -b feature/shake_feedback
```

### 2. Desenvolver a funcionalidade

Faça as alterações necessárias no código. Neste caso, implementar o feedback visual de shake quando o usuário erra.

### 3. Verificar status e commitar

```bash
# Ver o que mudou
git status

# Adicionar todas as alterações
git add .

# Commit com conventional commit
git commit -m "feat: shake feedback when user makes a wrong guess"
```

### 4. Push para o remote (feature branch)

```bash
# Push para a feature branch — NÃO para main
git push origin feature/shake_feedback
```

### 5. Verificação no GitHub

```
GitHub → Repositório → Branch selector
  ├── main (sem o commit novo)
  └── feature/shake_feedback (com o commit novo)
```

### 6. Verificação na Vercel

```
Vercel → Projeto → Deployments
  ├── Build anterior (main) → Tag: Current → Production
  └── Nova build (feature/shake_feedback) → Tag: Preview
```

## Variações comuns

### Múltiplas features em paralelo

```bash
# Feature 1
git checkout -b feature/shake_feedback
# ... desenvolver, commitar, push
git push origin feature/shake_feedback

# Feature 2 (a partir da main)
git checkout main
git checkout -b feature/sound_effects
# ... desenvolver, commitar, push
git push origin feature/sound_effects
```

Cada feature branch gera sua própria preview build na Vercel.

### Atualizar preview com novos commits

```bash
# Já está na feature branch
git add .
git commit -m "fix: adjust shake animation duration"
git push origin feature/shake_feedback
```

A Vercel gera uma nova preview build automaticamente, substituindo a anterior da mesma branch.

### Promover preview para produção (merge)

```bash
# Após validar o preview
git checkout main
git merge feature/shake_feedback
git push origin main

# Limpar a feature branch
git branch -d feature/shake_feedback
git push origin --delete feature/shake_feedback
```

A Vercel detecta o push na main e gera uma nova build de **produção**.

### Rollback se o merge deu errado

```bash
# Reverter o merge na main
git revert HEAD
git push origin main
```

A Vercel gera nova build de produção com o revert.

## Padrões de mensagem de commit

```bash
# Nova funcionalidade
git commit -m "feat: shake feedback when user makes a wrong guess"

# Correção de bug
git commit -m "fix: shake animation not triggering on mobile"

# Estilo/visual
git commit -m "style: adjust shake intensity and duration"

# Refatoração sem mudança de comportamento
git commit -m "refactor: extract shake animation to custom hook"
```

## Comandos de verificação úteis

```bash
# Em qual branch estou?
git branch

# Quais branches existem no remote?
git branch -r

# Qual o último commit nesta branch?
git log --oneline -1

# Diferença entre minha branch e a main
git log main..HEAD --oneline
```