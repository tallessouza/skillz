---
name: rs-full-stack-caminhos-absolutos-relativos
description: "Enforces correct usage of absolute and relative file paths in HTML projects. Use when user asks to 'link a file', 'add an image', 'reference a stylesheet', 'create href', 'fix broken link', or 'include a script'. Applies rules: ./ for same directory, ../ to go up levels, protocol for external URLs, never hardcode absolute local paths. Make sure to use this skill whenever generating HTML that references other files. Not for URL routing in frameworks, API endpoints, or server-side path resolution."
---

# Caminhos Absolutos e Relativos

> Ao referenciar arquivos em HTML, use caminhos relativos ao projeto — nunca caminhos absolutos locais — porque caminhos relativos funcionam em qualquer maquina.

## Rules

1. **Use caminhos relativos para arquivos do projeto** — `./style.css` ou `style.css`, nunca `/Users/fulano/Desktop/projeto/style.css`, porque caminhos absolutos locais quebram em qualquer outra maquina
2. **Use protocolo completo para recursos externos** — `https://google.com/`, nunca apenas `google.com`, porque o protocolo (`https://`) define as regras de transferencia de dados
3. **`./` referencia a pasta atual** — `./second.html` e `second.html` sao equivalentes, porque ambos buscam o arquivo na mesma pasta do arquivo atual
4. **`../` sobe um nivel de diretorio** — use `../index.html` para acessar um arquivo na pasta pai, porque cada `../` sobe exatamente um nivel na arvore de diretorios
5. **Navegue por subpastas com barra** — `subpasta/arquivo.html` entra na subpasta e encontra o arquivo, porque a barra `/` separa niveis de diretorio
6. **`/` sozinha significa a raiz** — no servidor, `/` e o root do site; no file system, `/` e o root do computador — nunca confunda os dois contextos

## How to write

### Arquivo na mesma pasta
```html
<!-- Ambos equivalentes — prefira a forma curta -->
<a href="./second.html">Link</a>
<a href="second.html">Link</a>
```

### Arquivo em subpasta
```html
<a href="subpasta/second.html">Link</a>
<link rel="stylesheet" href="css/style.css">
<script src="js/app.js"></script>
```

### Subir um nivel e acessar arquivo
```html
<!-- De subpasta/second.html para index.html na pasta pai -->
<a href="../index.html">Voltar</a>

<!-- Subir dois niveis -->
<a href="../../outro.html">Outro</a>
```

### Recurso externo (absoluto com protocolo)
```html
<a href="https://google.com/">Google</a>
<script src="https://cdn.example.com/lib.js"></script>
```

## Example

**Before (caminho absoluto local — quebra em outras maquinas):**
```html
<a href="file:///Users/mike/Desktop/projeto/subpasta/second.html">Link</a>
<link rel="stylesheet" href="/Users/mike/Desktop/projeto/style.css">
```

**After (caminho relativo — funciona em qualquer lugar):**
```html
<a href="subpasta/second.html">Link</a>
<link rel="stylesheet" href="style.css">
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Arquivo no mesmo diretorio | `arquivo.html` (omitir `./`) |
| Arquivo em subpasta | `subpasta/arquivo.html` |
| Arquivo na pasta pai | `../arquivo.html` |
| Recurso externo (CDN, site) | `https://dominio.com/recurso` |
| Protocolo file:// | Apenas para testes locais pontuais, nunca em producao |

## Anti-patterns

| Nunca escreva | Escreva |
|---------------|---------|
| `file:///Users/fulano/projeto/img.png` | `img.png` ou `./img.png` |
| `C:\Users\fulano\projeto\style.css` | `style.css` |
| `href="google.com"` | `href="https://google.com/"` |
| `../../../../../../arquivo.html` (muitos niveis) | Reorganize a estrutura do projeto |
| `/Users/mike/Desktop/projeto/page.html` | `page.html` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes