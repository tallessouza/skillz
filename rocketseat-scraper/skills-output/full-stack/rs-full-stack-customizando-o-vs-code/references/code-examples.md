# Code Examples: Configuracao do VSCode

## Como acessar o settings.json

1. Pressione `Ctrl+P` (Windows/Linux) ou `Cmd+P` (Mac)
2. Digite `>` (sinal de maior)
3. Escreva `settings json`
4. Selecione **Preferences: Open User Settings (JSON)**

## Configuracao completa da aula

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

## Variacoes por contexto

### Para desenvolvimento pessoal (sem aula/streaming)

```json
{
  "editor.fontSize": 14,
  "editor.lineHeight": 1.5,
  "editor.tabSize": 2,
  "editor.minimap.enabled": false,
  "editor.wordWrap": "on",
  "editor.glyphMargin": true,
  "files.autoSave": "afterDelay",

  "zenMode.fullScreen": true,
  "zenMode.centerLayout": false,
  "zenMode.showTabs": "multiple"
}
```

Diferencas: fonte menor (nao precisa de legibilidade remota), glyphMargin ativa (debug disponivel), zen mode com fullscreen, multiplas tabs.

### Configuracao minima para iniciante absoluto

```json
{
  "editor.tabSize": 2,
  "editor.wordWrap": "on",
  "files.autoSave": "afterDelay"
}
```

As tres configs que mais impactam a experiencia de um iniciante: indentacao padrao, sem scroll horizontal, sem esquecer de salvar.

## Adicionando configs incrementalmente

O instrutor mostra que a melhor forma de adicionar configs e usar o autocomplete do editor:

1. Posicione o cursor dentro das chaves `{}`
2. Comece a digitar o nome da config (ex: `editor.font`)
3. O VSCode sugere as opcoes disponiveis
4. Pressione `Enter` para aceitar
5. O editor insere a config com a sintaxe correta

Isso evita erros de digitacao que fariam a config ser silenciosamente ignorada.

## Verificando indentacao

Observe o canto inferior direito do VSCode:
- Mostra `Spaces: 2` ou `Tab Size: 2`
- Clique para alternar entre Spaces e Tabs
- Arquivos criados antes da mudanca de config podem manter a indentacao antiga

## Navegacao rapida no Zen Mode

```
Cmd+P (Mac) / Ctrl+P (Windows/Linux)
  → Digitar nome do arquivo para abrir

Segurar Cmd/Ctrl + pressionar P repetido
  → Alternar entre ultimos arquivos abertos
```