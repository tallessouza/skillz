---
name: rs-full-stack-input-file
description: "Applies HTML file input patterns when building forms with file upload. Use when user asks to 'create a file upload', 'add image upload', 'build a form with attachments', 'upload files in HTML', or any form with file inputs. Enforces enctype, accept filters, and multiple file handling. Make sure to use this skill whenever generating HTML forms that include file uploads. Not for backend file processing, storage, or JavaScript file handling."
---

# Input File em Formulários HTML

> Ao criar inputs de arquivo, configure enctype, accept e multiple corretamente para garantir envio funcional.

## Rules

1. **Sempre use `enctype="multipart/form-data"` no form** — sem isso o navegador envia apenas o nome do arquivo, não o conteúdo binário
2. **Use método POST para envio de arquivos** — GET coloca dados na URL, arquivos não funcionam via query string
3. **Filtre tipos com `accept`** — restrinja no cliente quais arquivos o usuário pode selecionar, porque previne erros antes do upload
4. **Use `multiple` quando aceitar mais de um arquivo** — sem ele, o input aceita apenas um arquivo por vez

## How to write

### Upload básico (um arquivo)

```html
<form action="/upload" method="post" enctype="multipart/form-data">
  <input type="file" name="fotoPerfil" />
  <button type="submit">Enviar</button>
</form>
```

### Upload múltiplo

```html
<input type="file" name="documentos" multiple />
```

### Filtro por tipo MIME

```html
<!-- Qualquer imagem -->
<input type="file" accept="image/*" />

<!-- Qualquer vídeo -->
<input type="file" accept="video/*" />

<!-- Apenas áudio MP3 -->
<input type="file" accept="audio/mp3" />
```

### Filtro por extensão

```html
<!-- Apenas arquivos .mkv -->
<input type="file" accept=".mkv" />

<!-- Múltiplas extensões -->
<input type="file" accept=".jpg,.png,.gif" />
```

## Example

**Before (quebrado — falta enctype e method):**

```html
<form action="/upload">
  <input type="file" name="foto" />
  <button type="submit">Enviar</button>
</form>
```

**After (funcional):**

```html
<form action="/upload" method="post" enctype="multipart/form-data">
  <input type="file" name="foto" accept="image/*" />
  <button type="submit">Enviar</button>
</form>
```

## Heuristics

| Situação | Faça |
|----------|------|
| Upload de foto de perfil | `accept="image/*"`, sem `multiple` |
| Upload de documentos | `accept=".pdf,.doc,.docx"`, com `multiple` |
| Upload de vídeo | `accept="video/*"`, considere limites de tamanho no backend |
| Qualquer input file | Sempre `method="post"` + `enctype="multipart/form-data"` no form |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `<form>` sem enctype com input file | `<form enctype="multipart/form-data">` |
| `method="get"` com input file | `method="post"` |
| Input file sem `accept` quando há tipo específico | `accept="image/*"` ou `accept=".pdf"` |
| `name="file"` genérico | `name="fotoPerfil"` descritivo do conteúdo |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre enctype, método POST vs GET, e como o backend recebe arquivos
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações de accept e multiple

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-input-file/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-input-file/references/code-examples.md)
