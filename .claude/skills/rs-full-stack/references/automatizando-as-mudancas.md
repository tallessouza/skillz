---
name: rs-full-stack-automatizando-as-mudancas
description: "Applies Babel watch mode configuration for automatic recompilation in JavaScript projects. Use when user asks to 'setup babel', 'auto compile', 'watch for changes', 'automate build', or 'configure build script'. Ensures --watch flag is added to Babel scripts in package.json for continuous compilation. Make sure to use this skill whenever configuring Babel build pipelines or setting up JS compilation workflows. Not for Webpack, Vite, esbuild, or other bundler watch modes."
---

# Automatizando Build com Babel Watch

> Configurar o modo watch do Babel para recompilar automaticamente quando arquivos fonte mudam.

## Rules

1. **Use a flag `--watch` no script de build** — adicione apos o arquivo de entrada e antes do `--out-dir`, porque isso elimina recompilacao manual a cada alteracao
2. **Mantenha o script de build unico** — nao crie scripts separados para watch e build one-shot, use a mesma entrada com a flag adicionada, porque simplifica o package.json
3. **Aponte o HTML para a pasta dist** — o `index.html` deve referenciar o JS compilado em `dist/`, nunca o source em `src/`, porque o browser precisa do codigo transpilado

## Steps

### Step 1: Configurar o script de build com watch

No `package.json`, adicione a flag `--watch` ao script de build:

```json
{
  "scripts": {
    "build": "babel src/main.js --out-dir dist --watch"
  }
}
```

### Step 2: Executar o script

```bash
npm run build
```

O terminal exibira: `The watcher is ready` — indicando que o Babel esta observando mudancas.

### Step 3: Desenvolver normalmente

Salve qualquer alteracao no `src/main.js` (Ctrl+S). O Babel recompila automaticamente e o `dist/` e atualizado.

### Step 4: Parar o watcher

Pressione `Ctrl+C` no terminal para encerrar o processo de watch.

## Output format

```
Successfully compiled 1 file with Babel.
The watcher is ready.
```

A cada save subsequente:

```
Successfully compiled 1 file with Babel.
```

## Error handling

- Se o watcher nao inicia, verifique se `@babel/cli` esta instalado: `npm install --save-dev @babel/cli`
- Se alteracoes nao sao detectadas, confirme que o path no script aponta para o arquivo correto
- Se o terminal trava, `Ctrl+C` encerra o processo; `Ctrl+L` limpa a tela

## Verification

- Altere o arquivo fonte e confirme que `dist/` reflete a mudanca sem executar `npm run build` manualmente
- Abra o `index.html` no browser e confirme que o resultado atualizado aparece

## Heuristics

| Situacao | Acao |
|----------|------|
| Projeto novo com Babel | Ja configure com `--watch` desde o inicio |
| Build de producao (CI/CD) | Remova `--watch`, use build one-shot |
| Multiplos arquivos fonte | Aponte para o diretorio: `babel src/ --out-dir dist --watch` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre watch mode e fluxo de compilacao
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-automatizando-as-mudancas/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-automatizando-as-mudancas/references/code-examples.md)
