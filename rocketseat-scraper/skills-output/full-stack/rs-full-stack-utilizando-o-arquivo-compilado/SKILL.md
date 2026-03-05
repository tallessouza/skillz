---
name: rs-full-stack-utilizando-o-arquivo-compilado
description: "Enforces Babel compilation workflow when working with JavaScript projects that need browser compatibility. Use when user asks to 'compile JavaScript', 'build with Babel', 'generate dist folder', 'support older browsers', or 'setup JS build pipeline'. Ensures compiled output is always referenced in HTML and recompiled after changes. Make sure to use this skill whenever setting up Babel or troubleshooting stale compiled output. Not for TypeScript compilation, Webpack bundling, or framework-specific build tools like Vite or Next.js."
---

# Utilizando o Arquivo Compilado (Babel)

> Sempre aponte o HTML para o arquivo compilado em `dist/` e recompile após cada alteração no código fonte.

## Rules

1. **Aponte o HTML para `dist/main.js`, nunca para o fonte na raiz** — `<script src="./dist/main.js">` porque o arquivo compilado garante compatibilidade com navegadores antigos
2. **Recompile após cada alteração** — execute `npm run build` sempre que modificar o código fonte, porque o arquivo em `dist/` não se atualiza automaticamente
3. **Mantenha o script de build no package.json** — o script `build` deve usar Babel para compilar de `src/` (ou raiz) para `dist/`, porque centraliza o comando de compilação
4. **Nunca edite arquivos dentro de `dist/`** — são gerados automaticamente e serão sobrescritos na próxima compilação
5. **Verifique se `dist/` existe antes de servir** — se a pasta não existe, execute `npm run build` primeiro, porque o projeto não funciona sem ela

## Steps

### Step 1: Verificar script de build
```json
// package.json
{
  "scripts": {
    "build": "babel src --out-dir dist"
  }
}
```

### Step 2: Compilar o código
```bash
npm run build
```
A pasta `dist/` será criada com o código transpilado.

### Step 3: Apontar o HTML para o compilado
```html
<!-- CORRETO: aponta para dist -->
<script src="./dist/main.js"></script>

<!-- ERRADO: aponta para o fonte não compilado -->
<script src="./main.js"></script>
```

### Step 4: Após qualquer alteração no fonte
```bash
# Editou o código? Recompile:
npm run build
# Só então recarregue o navegador
```

## Example

**Problema comum: alteração não reflete no navegador**

```javascript
// Editou main.js (fonte):
sendMessage() {
  console.log("Mensagem enviada")  // mudou de "Mensagem enviada para:" para "Mensagem enviada"
}
```

Recarregou o navegador → ainda mostra "Mensagem enviada para:" com o email.

**Causa:** o HTML aponta para `dist/main.js` que ainda tem a versão anterior.

**Solução:**
```bash
npm run build   # recompila o fonte para dist/
# agora o navegador mostra "Mensagem enviada"
```

## Heuristics

| Situação | Ação |
|----------|------|
| Pasta `dist/` não existe | Execute `npm run build` antes de testar |
| Alteração no fonte não aparece no browser | Recompile com `npm run build` |
| Quer automatizar recompilação | Use `--watch` flag no Babel ou ferramentas como `nodemon` |
| Precisa servir localmente | Use Live Server apontando para o HTML que referencia `dist/` |

## Anti-patterns

| Nunca faça | Faça isto |
|------------|-----------|
| `<script src="./main.js">` (fonte direto) | `<script src="./dist/main.js">` (compilado) |
| Editar arquivos dentro de `dist/` | Editar o fonte e recompilar |
| Esquecer de recompilar após mudança | `npm run build` após cada alteração |
| Commitar `dist/` sem recompilar | Compilar antes de commitar para garantir sincronia |

## Verification

- Abra o DevTools (F12) → Console → verifique se a saída reflete as últimas alterações do fonte
- Compare o conteúdo de `dist/main.js` com o fonte para confirmar que está atualizado

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre por que compilar, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações