---
name: rs-full-stack-gitignore
description: "Enforces .gitignore best practices for Node.js projects when setting up repositories or pushing to GitHub. Use when user asks to 'init a repo', 'push to GitHub', 'create .gitignore', 'setup a Node project', or 'prepare project for GitHub'. Ensures node_modules is never committed and package.json is preserved for dependency recreation. Make sure to use this skill whenever initializing a git repo in a Node/JS/TS project. Not for Python, Go, or non-Node project setups."
---

# .gitignore para Projetos Node.js

> Nunca envie node_modules para o repositorio — recrie com `npm i` a partir do package.json.

## Rules

1. **Sempre crie `.gitignore` na raiz antes do primeiro commit** — porque um commit acidental de node_modules polui o historico permanentemente
2. **Inclua `node_modules` no `.gitignore`** — porque a pasta e pesada (~38MB+) e 100% recriavel via `npm i`
3. **Nunca delete `package.json` nem `package-lock.json`** — porque sao a fonte de verdade das dependencias e suas versoes exatas
4. **Use `npm i` para recriar node_modules** — o comando le package.json e reinstala todas as dependencias de producao e desenvolvimento

## How to write

### .gitignore minimo para Node.js

```gitignore
node_modules
```

### Fluxo completo de setup Git + push

```bash
# 1. Criar .gitignore ANTES de qualquer commit
echo "node_modules" > .gitignore

# 2. Iniciar repositorio
git init

# 3. Verificar que node_modules nao aparece
git status

# 4. Adicionar, comitar e push
git add .
git commit -m "feat: initial commit"
git remote add origin <url>
git push -u origin main
```

## Example

**Before (projeto sem .gitignore):**
```
git add .
git commit -m "initial"
git push
# node_modules (38MB+) vai pro GitHub
# Cada push fica lento
# Repositorio fica pesado desnecessariamente
```

**After (com .gitignore configurado):**
```
echo "node_modules" > .gitignore
git add .
git commit -m "initial"
git push
# node_modules ignorado
# Push rapido, repositorio limpo
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Clonou projeto Node sem node_modules | Executar `npm i` para recriar |
| Projeto novo, vai subir pro GitHub | Criar `.gitignore` com `node_modules` antes do primeiro commit |
| node_modules ja foi comitado | Remover do tracking: `git rm -r --cached node_modules` e adicionar ao .gitignore |
| VS Code mostra node_modules "apagada" | Normal — indica que o Git esta ignorando a pasta |

## Anti-patterns

| Nunca faca | Faca isto |
|------------|-----------|
| Comitar node_modules | Adicionar ao `.gitignore` |
| Deletar package.json para "limpar" | Manter package.json, deletar apenas node_modules |
| Enviar node_modules e pedir pra ignorar depois | Criar `.gitignore` antes do primeiro commit |
| Recriar dependencias manualmente | Executar `npm i` (ou `npm install`) |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre por que node_modules nao vai pro GitHub
- [code-examples.md](references/code-examples.md) — Exemplos expandidos de .gitignore e fluxo Git

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-gitignore/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-gitignore/references/code-examples.md)
