---
name: rs-full-stack-caminhos-relativos-mesma-pasta
description: "Enforces correct relative path usage in HTML when linking files in the same directory. Use when user asks to 'link pages', 'reference files', 'create navigation', 'add href', or any HTML file linking task. Applies rules: prefer direct filename over ./ prefix for same-folder files, understand file:// protocol for local development, distinguish relative vs absolute paths. Make sure to use this skill whenever generating HTML links between local files. Not for server routing, API endpoints, or URL rewriting."
---

# Caminhos Relativos na Mesma Pasta

> Ao referenciar arquivos na mesma pasta em HTML, use o nome do arquivo diretamente — simplicidade vence.

## Rules

1. **Use o nome do arquivo diretamente** — `second.html` em vez de `./second.html`, porque ambos funcionam mas o direto e mais limpo e legivel
2. **Entenda que `./` significa "pasta atual"** — `./second.html` e equivalente a `second.html` quando o arquivo esta na mesma pasta, porque o ponto referencia o diretorio corrente
3. **Nunca use caminhos absolutos para arquivos locais** — nao copie `file:///Users/nome/projeto/second.html`, porque quebra em qualquer outra maquina
4. **Saiba que `file://` e o protocolo local** — quando abre HTML com duplo clique, o navegador usa `file://` automaticamente, porque nao ha servidor envolvido
5. **Barras invertidas no Windows** — o Windows usa `\` nos caminhos do sistema, mas em HTML sempre use `/`, porque o navegador normaliza

## How to write

### Link para arquivo na mesma pasta

```html
<!-- Correto: nome direto -->
<a href="second.html">Ver second</a>

<!-- Tambem correto: com ./ explicito -->
<a href="./second.html">Ver second</a>
```

### Navegacao entre paginas locais

```html
<!-- index.html -->
<a href="about.html">Sobre</a>
<a href="contact.html">Contato</a>

<!-- about.html -->
<a href="index.html">Voltar ao inicio</a>
```

## Example

**Before (caminho absoluto — quebra em outra maquina):**

```html
<a href="file:///Users/joao/projetos/meusite/second.html">Ver second</a>
```

**After (caminho relativo — funciona em qualquer lugar):**

```html
<a href="second.html">Ver second</a>
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Arquivo na mesma pasta | Use nome direto: `page.html` |
| Precisa ser explicito sobre pasta atual | Use `./page.html` |
| Testando local com duplo clique | Protocolo `file://` e automatico, nao se preocupe |
| Precisa referenciar caminho completo | Nunca em producao — so para debug local |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `file:///caminho/completo/page.html` | `page.html` |
| `C:\Users\nome\projeto\page.html` | `page.html` |
| `http://localhost/page.html` (sem servidor) | `page.html` (aberto via file://) |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre protocolos e caminhos
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-caminhos-relativos-a-mesma-pasta/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-caminhos-relativos-a-mesma-pasta/references/code-examples.md)
