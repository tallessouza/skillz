# Code Examples: Sincronização entre Repositório Local e Remoto

## Cenário completo da aula

### 1. Alguém fez uma mudança no remoto (via GitHub)

Criação de um arquivo README.md diretamente pela interface do GitHub com commit automático.

### 2. Trazendo mudanças para a máquina local

```bash
# Verificar estado atual — README.md não aparece
git status

# Trazer as mudanças do remoto
git pull

# Agora o README.md existe localmente
ls
# README.md aparece na listagem
```

### 3. Criando um arquivo local e enviando

```bash
# Criar novo arquivo
echo "alô" > alo.txt

# Verificar estado — arquivo aparece como untracked
git status
# Untracked files:
#   alo.txt

# Adicionar ao stage
git add alo.txt

# Commitar
git commit -m "add alo.txt"

# Pull antes de push (mesmo tendo feito pull recentemente)
git pull

# Verificar se não houve erros, então push
git push
```

### 4. Erro comum: push sem commit

```bash
# Arquivo novo criado mas não commitado
echo "teste" > teste.txt

# Tentativa de push
git push
# Everything up to date   ← Nada foi enviado!

# Diagnóstico
git status
# Untracked files:
#   teste.txt              ← Arquivo não foi adicionado/commitado

# Correção
git add teste.txt
git commit -m "add teste.txt"
git pull
git push
# Agora sim, enviado com sucesso
```

## Fluxo completo de colaboração (expandido)

```bash
# Início do dia de trabalho — sempre começar sincronizando
git pull

# Trabalhar nos arquivos...
# (editar, criar, modificar)

# Verificar o que mudou
git status

# Adicionar arquivos específicos
git add arquivo1.txt arquivo2.txt

# Commitar com mensagem descritiva
git commit -m "feat: adiciona arquivos do módulo X"

# Pull antes de push — SEMPRE
git pull

# Se pull trouxe mudanças, verificar se não quebrou nada
# Se tudo ok, push
git push
```

## Variação: múltiplos arquivos

```bash
# Vários arquivos modificados
git status
# modified:   index.html
# modified:   style.css
# new file:   script.js

# Adicionar todos de uma vez
git add index.html style.css script.js

# Ou adicionar todos os rastreados modificados
git add .

# Commit
git commit -m "feat: implementa página inicial"

# Ciclo de segurança
git pull
# Verificar se não houve conflito
git push
```