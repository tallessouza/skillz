---
name: rs-full-stack-criando-arquivo-de-scripts
description: "Applies correct script tag placement and connection when linking JavaScript files to HTML. Use when user asks to 'connect JS to HTML', 'add script tag', 'link JavaScript file', 'create script file', or 'setup HTML with JS'. Ensures script tag is placed before closing body tag with src attribute. Make sure to use this skill whenever setting up a new HTML+JS project structure. Not for module bundlers, build tools, or framework-specific script loading like Next.js or Vite."
---

# Conectando JavaScript ao HTML

> Posicione a tag script antes do fechamento do body, referenciando o arquivo via src.

## Rules

1. **Coloque o script antes do `</body>`** — nunca no `<head>`, porque o DOM precisa estar carregado antes do script executar
2. **Use o atributo `src`** — separe JS do HTML em arquivos `.js` dedicados, porque inline scripts dificultam cache e manutenção
3. **Valide a conexão com `console.log`** — após conectar, teste no console do navegador e remova o log antes de seguir, porque garante que o caminho está correto sem poluir o código final

## Steps

### Step 1: Criar o arquivo JavaScript

Crie `script.js` na raiz do projeto (ou no diretório adequado).

### Step 2: Conectar ao HTML

Adicione a tag `<script>` antes do `</body>`:

```html
<body>
  <!-- conteúdo da página -->

  <script src="./script.js"></script>
</body>
```

### Step 3: Verificar a conexão

```javascript
// script.js — teste temporário
console.log("javascript connected")
```

Abra o navegador → Inspecionar → Console → confirme a mensagem.

### Step 4: Remover o teste

Apague o `console.log` de teste após confirmar a conexão.

## Output format

```
projeto/
├── index.html    ← com <script src="./script.js"></script> antes de </body>
└── script.js     ← arquivo JS limpo, sem console.log de teste
```

## Error handling

- Se o console não exibir a mensagem: verifique o caminho no `src` — use caminho relativo correto
- Se o script executar antes do DOM: confirme que a tag está antes do `</body>`, não no `<head>`

## Anti-patterns

| Nunca faça | Faça assim |
|------------|------------|
| `<script>` no `<head>` sem defer/async | `<script src="..."></script>` antes de `</body>` |
| JavaScript inline no HTML | Arquivo `.js` separado com `src` |
| Deixar `console.log` de teste no código | Remover após validar conexão |
| `<script src="script.js">código aqui</script>` | Usar `src` OU conteúdo inline, nunca ambos |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre posicionamento de scripts e carregamento do DOM
- [code-examples.md](references/code-examples.md) — Exemplos expandidos com variações de caminhos e estruturas

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-criando-o-arquivo-de-scripts/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-criando-o-arquivo-de-scripts/references/code-examples.md)
