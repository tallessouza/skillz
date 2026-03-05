# Code Examples: Git Pull e Push

## Exemplo 1: Fluxo básico de sincronização

```bash
# Cenário: você vai começar a trabalhar no projeto
# Primeiro, traz as atualizações do time
git pull origin main

# Faz suas alterações...
# ... edita arquivos ...

# Commita localmente
git add .
git commit -m "feat: implementa nova funcionalidade"

# Envia para o remoto
git push origin main
```

## Exemplo 2: Push rejeitado (cenário mais comum em equipe)

```bash
# Você commitou localmente e tenta enviar
git push origin main

# Output:
# ! [rejected]        main -> main (fetch first)
# error: failed to push some refs to 'origin'
# hint: Updates were rejected because the remote contains work that you do not have locally.

# Solução: puxar primeiro
git pull origin main

# Se não houver conflito, merge automático acontece
# Agora sim:
git push origin main
```

## Exemplo 3: Conflito durante pull

```bash
git pull origin main

# Output:
# Auto-merging arquivo.js
# CONFLICT (content): Merge conflict in arquivo.js

# O arquivo terá marcadores:
# <<<<<<< HEAD
# seu código local
# =======
# código do remoto
# >>>>>>> origin/main

# Resolva editando o arquivo, removendo os marcadores
# Mantenha o código correto

git add arquivo.js
git commit -m "fix: resolve conflito em arquivo.js"
git push origin main
```

## Exemplo 4: Usando pull com rebase (alternativa mais limpa)

```bash
# Em vez de merge, rebase reaplica seus commits sobre o remoto
git pull --rebase origin main

# Vantagem: histórico linear, sem commits de merge extras
# Se houver conflito durante rebase:
git add arquivo-resolvido.js
git rebase --continue

git push origin main
```

## Exemplo 5: Fluxo completo de trabalho em equipe

```bash
# Início do dia — sincroniza
git pull origin main

# Cria branch para sua feature
git checkout -b feat/minha-feature

# Trabalha, commita...
git add .
git commit -m "feat: adiciona componente X"

# Antes de enviar, atualiza main e rebasa
git checkout main
git pull origin main
git checkout feat/minha-feature
git rebase main

# Envia a branch
git push origin feat/minha-feature

# Abre PR no GitHub
```