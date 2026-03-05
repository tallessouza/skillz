---
name: rs-full-stack-customizando-o-vs-code
description: "Applies optimized VSCode settings when user asks to 'configure vscode', 'setup editor', 'vscode settings', 'settings.json', or 'customize IDE'. Generates a clean, distraction-free settings.json with font size, line height, tab size, minimap, wordwrap, autosave, and zen mode. Make sure to use this skill whenever the user wants to set up or improve their VSCode configuration. Not for terminal setup, shell config, or IDE plugins/extensions."
---

# Configuracao do VSCode

> Configurar o VSCode para um ambiente limpo, focado e sem distracoes visuais.

## Rules

1. **Use settings.json, nao a UI** — abra com `Ctrl+P > settings json`, porque o JSON e versionavel e reproduzivel
2. **Salve suas configuracoes antes de mudar** — copie o conteudo atual do settings.json para um lugar seguro, porque configuracoes perdidas causam frustacao
3. **Use autocomplete do editor** — comece a digitar o nome da config e aceite a sugestao, porque erros de digitacao causam configs silenciosamente ignoradas
4. **Menos informacao visual = mais foco** — desative minimap, glyph margin e tabs extras, porque cada elemento visual compete por atencao
5. **AutoSave elimina erros de iniciante** — configure `afterDelay` para nunca perder alteracoes por esquecer de salvar
6. **WordWrap evita scroll horizontal** — ative para ver todo o codigo na tela sem quebrar linhas manualmente

## Settings recomendados

```json
{
  "editor.fontSize": 20,
  "editor.lineHeight": 1.6,
  "editor.tabSize": 2,
  "editor.minimap.enabled": false,
  "editor.wordWrap": "on",
  "editor.glyphMargin": false,
  "files.autoSave": "afterDelay",

  // zen mode
  "zenMode.fullScreen": false,
  "zenMode.centerLayout": false,
  "zenMode.showTabs": "single"
}
```

## O que cada config faz

| Setting | Valor | Efeito |
|---------|-------|--------|
| `editor.fontSize` | 20 | Fonte maior, permite reduzir zoom da interface e manter legibilidade |
| `editor.lineHeight` | 1.6 | Espacamento confortavel entre linhas |
| `editor.tabSize` | 2 | Indentacao padrao de 2 espacos |
| `editor.minimap.enabled` | false | Remove o minimapa lateral, ganha espaco |
| `editor.wordWrap` | "on" | Quebra visual automatica de linhas longas (sem alterar o arquivo) |
| `editor.glyphMargin` | false | Remove margem de breakpoints, ganha espaco lateral |
| `files.autoSave` | "afterDelay" | Salva automaticamente apos 1 segundo |
| `zenMode.fullScreen` | false | Zen mode sem tela cheia |
| `zenMode.centerLayout` | false | Usa todo o espaco disponivel |
| `zenMode.showTabs` | "single" | Mostra apenas a aba do arquivo atual |

## Atalhos essenciais

| Acao | Mac | Windows/Linux |
|------|-----|---------------|
| Abrir command palette | `Cmd+P` | `Ctrl+P` |
| Aumentar/diminuir zoom | `Cmd+` / `Cmd-` | `Ctrl+` / `Ctrl-` |
| Toggle sidebar | `Cmd+B` | `Ctrl+B` |
| Toggle terminal | `Cmd+J` | `Ctrl+J` |
| Toggle Zen Mode | Command Palette > Zen Mode | Command Palette > Zen Mode |
| Alternar arquivos | Segurar `Cmd` + `P` repetido | Segurar `Ctrl` + `P` repetido |

## Heuristics

| Situacao | Faca |
|----------|------|
| Usuario iniciante | Ative autoSave para evitar perda de trabalho |
| Tela pequena ou aula/streaming | fontSize 20 + minimap off + glyphMargin off |
| Precisa de breakpoints para debug | Mantenha glyphMargin true |
| Edita muitos arquivos simultaneamente | Considere nao usar showTabs "single" |

## Anti-patterns

| Evite | Faca em vez disso |
|-------|-------------------|
| Apagar todo settings.json para copiar outro | Fazer backup primeiro, adicionar configs incrementalmente |
| Quebrar linhas longas manualmente no HTML | Ativar wordWrap "on" e deixar o editor quebrar visualmente |
| Escrever configs manualmente sem autocomplete | Digitar o inicio e aceitar a sugestao do editor |
| Confundir quebra visual do wordWrap com nova linha | Observar os numeros de linha — wordWrap nao cria linhas novas |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-customizando-o-vs-code/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-customizando-o-vs-code/references/code-examples.md)
