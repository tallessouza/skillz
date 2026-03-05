---
name: rs-full-stack-caminhos-relativos-pastas
description: "Enforces correct relative path usage when referencing files across different folders in HTML projects. Use when user asks to 'link to a file', 'add an image', 'reference a stylesheet', 'navigate between pages', or 'fix broken path'. Applies rules: ./ or direct name for subfolders, ../ to go up levels, works for all asset types (HTML, CSS, JS, images). Make sure to use this skill whenever generating href, src, or any file path in HTML projects. Not for absolute URLs, CDN links, or server-side routing."
---

# Caminhos Relativos em Pastas Diferentes

> Ao referenciar arquivos em projetos web, use caminhos relativos com `./` para subpastas e `../` para subir niveis na estrutura de diretorios.

## Rules

1. **Use `./subpasta/arquivo` ou `subpasta/arquivo` para acessar subpastas** — ambas formas funcionam, porque o ponto-barra explicita "a partir daqui" enquanto a omissao assume o mesmo comportamento
2. **Use `../` para subir um nivel na arvore de diretorios** — cada `../` sobe exatamente um nivel, porque e assim que o navegador resolve o caminho relativo ao arquivo atual
3. **Encadeie `../` para subir multiplos niveis** — `../../arquivo.html` sobe dois niveis, porque cada `../` e resolvido sequencialmente
4. **Aplique caminhos relativos para TODOS os tipos de recurso** — links, imagens, estilos, scripts, porque o mecanismo de resolucao e identico independente do tipo de arquivo
5. **Prefira caminhos relativos sobre absolutos** — porque relativos funcionam independente do dominio ou porta do servidor
6. **Quando receber "file not found", verifique o caminho** — erro de path e a causa mais comum, porque um caractere errado quebra toda a referencia

## How to write

### Acessar arquivo em subpasta

```html
<!-- Ambas formas sao equivalentes -->
<a href="./subpasta/second.html">Ver second</a>
<a href="subpasta/second.html">Ver second</a>
```

### Voltar para pasta anterior

```html
<!-- Estando dentro de subpasta/, voltar ao nivel anterior -->
<a href="../index.html">Voltar ao índice</a>
```

### Combinar descida e subida

```html
<!-- Subir um nivel e entrar em outra pasta -->
<link rel="stylesheet" href="../styles/main.css">
<script src="../scripts/app.js"></script>
<img src="../images/logo.png" alt="Logo">
```

## Example

**Before (caminho quebrado — file not found):**

```html
<!-- Arquivo esta em subpasta/ mas o caminho ignora isso -->
<a href="second.html">Ver second</a>
<!-- Resultado: 404 file not found -->
```

**After (com esta skill aplicada):**

```html
<!-- Caminho correto apontando para a subpasta -->
<a href="subpasta/second.html">Ver second</a>
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Arquivo alvo esta DENTRO de uma subpasta | `subpasta/arquivo.html` ou `./subpasta/arquivo.html` |
| Arquivo alvo esta na pasta PAI | `../arquivo.html` |
| Arquivo alvo esta em pasta IRMÃ | `../outra-pasta/arquivo.html` |
| Arquivo alvo esta dois niveis acima | `../../arquivo.html` |
| Referenciando CSS, JS ou imagem | Mesma logica de `../` e `./` — nao muda por tipo |
| Recebeu "file not found" | Conferir cada segmento do caminho e a ortografia das pastas |

## Anti-patterns

| Nunca escreva | Escreva ao inves |
|---------------|-----------------|
| `<a href="second.html">` (arquivo esta em subpasta) | `<a href="subpasta/second.html">` |
| `<a href="index.html">` (voce esta dentro de subpasta) | `<a href="../index.html">` |
| `<a href="/subpasta/second.html">` (absoluto desnecessario) | `<a href="subpasta/second.html">` (relativo) |
| Caminho inventado sem conferir estrutura | Verificar com `ls` ou explorador a estrutura real |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes