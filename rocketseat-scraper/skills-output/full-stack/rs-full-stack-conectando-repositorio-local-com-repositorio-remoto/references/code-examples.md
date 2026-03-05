# Code Examples: Conectando Repositório Local com Repositório Remoto

## Cenário 1: Repositório local existente com commits (caso mais comum)

```bash
# Verificar que você tem commits locais
git log --oneline
# a1b2c3d feat: add initial phrases
# d4e5f6g initial commit

# Conectar ao remoto
git remote add origin https://github.com/usuario/meu-projeto.git

# Garantir nome da branch
git branch -M main

# Enviar para o GitHub (primeira vez, com -u para tracking)
git push -u origin main

# Verificar conexão
git remote -v
# origin  https://github.com/usuario/meu-projeto.git (fetch)
# origin  https://github.com/usuario/meu-projeto.git (push)
```

## Cenário 2: Projeto novo do zero (tudo local)

```bash
# Criar pasta e inicializar
mkdir meu-projeto && cd meu-projeto
git init

# Criar README
echo "# Meu Projeto" >> README.md
echo "Breve descrição do projeto." >> README.md

# Primeiro commit
git add README.md
git commit -m "docs: add README"

# Conectar e enviar
git remote add origin https://github.com/usuario/meu-projeto.git
git branch -M main
git push -u origin main
```

## Cenário 3: Push falhou por conflito (criou README no GitHub)

```bash
git push -u origin main
# ! [rejected]        main -> main (fetch first)

# Solução: rebase para integrar o commit remoto
git pull --rebase origin main
git push -u origin main
```

## Cenário 4: Usando SSH em vez de HTTPS

```bash
# Se configurou SSH key no GitHub
git remote add origin git@github.com:usuario/meu-projeto.git
git branch -M main
git push -u origin main
```

## Cenário 5: Alterar remote já existente

```bash
# Se errou a URL do remote
git remote set-url origin https://github.com/usuario/repositorio-correto.git

# Verificar
git remote -v
```

## Comandos úteis pós-conexão

```bash
# Pushes futuros (tracking já configurado pelo -u)
git push

# Ver branches remotas
git branch -r

# Ver status comparando com remoto
git status

# Buscar mudanças do remoto sem merge
git fetch origin
```

## Verificação completa

```bash
# Confirmar remote configurado
git remote -v

# Confirmar branch tracking
git branch -vv
# * main  a1b2c3d [origin/main] feat: add initial phrases

# Confirmar que está sincronizado
git status
# Your branch is up to date with 'origin/main'.
```