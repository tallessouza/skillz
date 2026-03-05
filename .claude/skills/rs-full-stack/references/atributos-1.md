---
name: rs-full-stack-atributos-1
description: "Enforces correct HTML attribute syntax when writing HTML markup. Use when user asks to 'create HTML', 'write a tag', 'add an attribute', 'build a page', or any HTML generation task. Applies rules: always use double quotes, never omit quotes on attribute values, space between tag name and attributes, name=value syntax. Make sure to use this skill whenever generating HTML elements with attributes. Not for CSS, JavaScript logic, or server-side code."
---

# Atributos HTML

> Atributos sao configuracoes extras para tags HTML — sempre use aspas duplas e nunca omita aspas nos valores.

## Rules

1. **Sempre use aspas duplas nos valores** — `href="url"` nao `href='url'` nem `href=url`, porque aspas simples quebram com apostrofos (ex: `isn't`) e sem aspas o navegador pode interpretar atributos adjacentes como parte do valor
2. **Nunca omita aspas** — mesmo que o navegador aceite `href=url`, adicionar outro atributo depois pode quebrar tudo, porque o navegador pode interpretar tudo como valor do primeiro atributo
3. **Separe atributos com espaco** — `<img src="x" alt="y">` nao `<img src="x"alt="y">`, porque a separacao por espaco e o padrao de parsing do HTML
4. **Espaco entre nome da tag e primeiro atributo** — `<img src` nao `<imgsrc`, porque o nome da tag precisa ser distinguido dos atributos
5. **Use sintaxe nome="valor"** — cada atributo segue o padrao `atributo="conteudo"`, porque e o formato padrao que todos os navegadores interpretam corretamente
6. **Aceite que atributos sao aprendizado continuo** — existem atributos especificos de tag e atributos globais; nao tente memorizar todos, aprenda conforme a necessidade

## How to write

### Tag com atributos

```html
<!-- Correto: aspas duplas, espacos adequados -->
<img src="caminho/imagem.jpg" alt="Descricao da imagem">
<a href="https://exemplo.com" title="Visite o exemplo">Link</a>
```

### Atributos com texto que contem apostrofo

```html
<!-- Aspas duplas protegem contra apostrofos no conteudo -->
<a href="https://exemplo.com" title="It isn't a problem">Link</a>
```

## Example

**Before (erros comuns):**

```html
<!-- Sem aspas — quebra ao adicionar mais atributos -->
<a href=https://exemplo.com title=Meu Site>Link</a>

<!-- Aspas simples — quebra com apostrofo -->
<a href='https://exemplo.com' title='It isn't good'>Link</a>
```

**After (com esta skill aplicada):**

```html
<a href="https://exemplo.com" title="Meu Site">Link</a>
<a href="https://exemplo.com" title="It isn't good">Link</a>
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Qualquer valor de atributo | Sempre envolva com aspas duplas |
| Texto com apostrofo no valor | Aspas duplas resolvem automaticamente |
| Multiplos atributos na mesma tag | Separe cada um com um espaco |
| Atributo desconhecido | Consulte a documentacao — e normal nao saber todos |
| Atributo especifico vs global | Atributos globais (class, id, title) servem para qualquer tag; especificos so para determinadas tags |

## Anti-patterns

| Nunca escreva | Escreva assim |
|---------------|---------------|
| `<a href=url>` | `<a href="url">` |
| `<a href='url'>` | `<a href="url">` |
| `<img src="x"alt="y">` | `<img src="x" alt="y">` |
| `<imgsrc="x">` | `<img src="x">` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-atributos-1/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-atributos-1/references/code-examples.md)
