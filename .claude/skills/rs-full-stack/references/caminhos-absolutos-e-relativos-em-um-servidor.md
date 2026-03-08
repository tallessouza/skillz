---
name: rs-full-stack-caminhos-absolutos-relativos-servidor
description: "Enforces correct absolute and relative path usage when working with HTML files served via HTTP. Use when user asks to 'link pages', 'reference files in HTML', 'setup live server', 'fix broken links', or 'configure paths in a web project'. Applies rules: slash behaves differently under file:// vs http://, index.html is implicit at root, prefer relative paths. Make sure to use this skill whenever generating HTML with href/src attributes in server-hosted projects. Not for Node.js module resolution, API routing, or filesystem scripts."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: fundamentos
  tags: [html, paths, http, server, live-server, href]
---

# Caminhos Absolutos e Relativos em Servidor

> Ao referenciar arquivos em HTML servido via HTTP, o comportamento da barra `/` muda completamente em relacao ao protocolo `file://` — o root agora e o projeto, nao o disco.

## Rules

1. **Distingua o protocolo** — sob `file://` a barra `/` aponta para a raiz do disco; sob `http://` a barra `/` aponta para a raiz do projeto, porque o servidor define o escopo
2. **`/` no servidor = raiz do projeto** — `href="/second.html"` resolve para `http://localhost:5500/second.html`, nao para `C:\`, porque o servidor mapeia `/` ao diretorio do projeto
3. **`index.html` e implicito** — servidores interpretam `/` como `/index.html` automaticamente, entao `href="/"` volta para a home sem precisar nomear o arquivo
4. **Prefira caminhos relativos** — `href="second.html"` ou `href="subpasta/page.html"` funciona tanto em `file://` quanto em `http://`, porque nao depende de onde o root esta
5. **Nunca teste paths abrindo com dois cliques** — dois cliques abre com `file://`, que tem comportamento diferente de `/`; sempre use um servidor local (Live Server, http-server, etc.)

## How to write

### Links relativos (preferido)

```html
<!-- Mesmo diretorio -->
<a href="second.html">Ir para second</a>

<!-- Subpasta -->
<a href="subpasta/page.html">Ir para subpasta</a>

<!-- Voltar um nivel -->
<a href="../index.html">Voltar</a>
```

### Links absolutos no servidor

```html
<!-- Raiz do projeto (resolve para index.html) -->
<a href="/">Home</a>

<!-- Arquivo na raiz do projeto -->
<a href="/second.html">Second</a>

<!-- Arquivo em subpasta -->
<a href="/subpasta/page.html">Subpasta</a>
```

## Example

**Before (quebra ao trocar de protocolo):**

```html
<!-- Funciona em http://, quebra em file:// -->
<a href="/">Home</a>
<a href="/subpasta/page.html">Pagina</a>
```

**After (funciona em ambos os protocolos):**

```html
<!-- Relativo: funciona sempre -->
<a href="index.html">Home</a>
<a href="subpasta/page.html">Pagina</a>
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Projeto sempre servido via HTTP | `/` absoluto e seguro |
| Projeto pode ser aberto via file:// | Use apenas caminhos relativos |
| Link para a home/index | `href="/"` no servidor, `href="index.html"` para compatibilidade |
| Referenciando asset em subpasta | Caminho relativo: `img/foto.png` |
| Precisa subir um nivel | `../arquivo.html` |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Testar paths com dois cliques no arquivo | Usar Live Server ou servidor local |
| `href="C:/Users/projeto/page.html"` | `href="page.html"` (relativo) |
| Misturar absoluto com file:// | Escolher relativo para compatibilidade |
| Esquecer que `/` muda de significado por protocolo | Verificar qual protocolo esta ativo |
| `href="/index.html"` quando relativo basta | `href="index.html"` |

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| Link funciona no servidor mas quebra ao abrir com duplo clique | `/` aponta para raiz do SO em `file://` | Use caminhos relativos para compatibilidade |
| `404 Not Found` no servidor | Caminho absoluto aponta para local errado | Verifique a raiz do servidor e ajuste o path |
| `index.html` nao carrega ao acessar `/` | Servidor nao configurado para servir index implicito | Verifique configuracao do Live Server ou servidor usado |
| Recursos (CSS/JS) nao carregam | Caminho muda de comportamento entre protocolos | Prefira caminhos relativos: `style.css` em vez de `/style.css` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre protocolos, analogia da casa/porta, e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes