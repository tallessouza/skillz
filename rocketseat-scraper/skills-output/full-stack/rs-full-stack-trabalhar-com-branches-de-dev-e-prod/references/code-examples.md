# Code Examples: Branches de Dev e Prod com Vercel

## Fluxo completo: nova funcionalidade

### 1. Criar branch a partir de main

```bash
# Garantir que esta na main atualizada
git checkout main
git pull origin main

# Criar branch para a nova funcionalidade
git checkout -b feat/alterar-estilo-botao
```

### 2. Desenvolver e testar localmente

```bash
# Rodar o projeto localmente
npm run dev

# Testar no navegador em http://localhost:3000
# Fazer as alteracoes necessarias
```

### 3. Commit e push para branch secundaria

```bash
git add .
git commit -m "feat: altera estilo do botao principal"
git push origin feat/alterar-estilo-botao
```

Apos o push, a Vercel automaticamente:
- Detecta o novo commit na branch `feat/alterar-estilo-botao`
- Inicia uma build
- Gera uma URL de preview (ex: `projeto-feat-alterar-estilo-botao.vercel.app`)

### 4. Testar no preview

Acesse a URL de preview gerada. Verifique:
- O botao esta com o estilo correto
- Nenhum erro no console do navegador
- Funcionalidade intacta

### 5. Corrigir se encontrar problemas

```bash
# Se encontrou um problema, corrija localmente
# Exemplo: cor do botao ficou errada no hover

git add .
git commit -m "fix: corrige cor do hover no botao"
git push origin feat/alterar-estilo-botao
```

A Vercel gera novo preview automaticamente. Teste novamente.

### 6. Merge para main apos validacao

```bash
git checkout main
git merge feat/alterar-estilo-botao
git push origin main
```

A Vercel gera build de producao automaticamente.

### 7. Limpar branch (opcional)

```bash
git branch -d feat/alterar-estilo-botao
git push origin --delete feat/alterar-estilo-botao
```

## Fluxo completo: correcao de bug

```bash
# Criar branch para fix
git checkout main
git pull origin main
git checkout -b fix/corrige-link-quebrado

# Fazer a correcao
# ... editar arquivos ...

git add .
git commit -m "fix: corrige link quebrado na pagina de contato"
git push origin fix/corrige-link-quebrado

# Testar no preview gerado pela Vercel
# Validar que o link funciona corretamente

# Apos validacao, merge para main
git checkout main
git merge fix/corrige-link-quebrado
git push origin main
```

## Convencoes de nome de branch

```bash
# Features
git checkout -b feat/nome-da-feature

# Bug fixes
git checkout -b fix/descricao-do-bug

# Refatoracoes
git checkout -b refactor/o-que-esta-refatorando

# Melhorias de estilo
git checkout -b style/descricao-da-alteracao
```

## Verificacao na Vercel

Apos o merge para main, na interface da Vercel:

1. Acesse o projeto
2. Va ate a aba **Deployments**
3. O deploy mais recente tera a tag **Current**
4. Confirme que o commit message corresponde ao seu merge
5. Acesse a URL de producao para validacao final