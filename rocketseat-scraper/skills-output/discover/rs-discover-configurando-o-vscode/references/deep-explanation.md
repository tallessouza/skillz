# Deep Explanation: Configurando o VSCode

## Por que usar .vscode/ por projeto

O VSCode tem dois niveis de configuracao: User Settings (global) e Workspace Settings (`.vscode/`). O instrutor ensina a usar workspace settings porque:

1. **Isolamento** — cada projeto pode ter suas proprias regras (tab size, formatter, tema)
2. **Compartilhamento** — quando o projeto e versionado com Git, outros devs recebem as mesmas configs
3. **Onboarding** — extensions.json faz o VSCode sugerir automaticamente as extensoes necessarias ao abrir o projeto

## O que cada configuracao faz

### Editor
- `wordWrap: "on"` — quebra linhas longas visualmente, sem alterar o arquivo. Evita scroll horizontal em telas menores.
- `fontSize: 18` e `lineHeight: 30` — tamanho confortavel para aulas e pair programming. Ajustar conforme preferencia pessoal.
- `tabSize: 2` — padrao da comunidade JavaScript/TypeScript. 4 espacos e mais comum em Python/Java.
- `bracketPairColorization.enabled: true` e `guides.bracketPairs: true` — colore pares de chaves/parenteses com cores diferentes. Fundamental para iniciantes identificarem blocos de codigo.
- `minimap.enabled: false` — desativa o minimapa lateral. O instrutor considera distracao para iniciantes.
- `formatOnSave: true` e `formatOnPaste: true` — aciona o Prettier automaticamente ao salvar ou colar codigo. Elimina a necessidade de formatar manualmente.

### Explorer
- `compactFolders: false` — mostra cada pasta em sua propria linha na arvore de arquivos. O padrao do VSCode compacta pastas com um unico filho (ex: `src/components` vira uma linha so), o que confunde iniciantes.

### Workbench
- `editor.enablePreview: false` — ao clicar num arquivo, ele abre como aba permanente (nao em modo preview italico). Evita perder arquivos abertos acidentalmente.
- `iconTheme: "material-icon-theme"` — icones visuais por tipo de arquivo (.html, .css, .js ganham icones distintos). Ajuda iniciantes a identificar tipos de arquivo rapidamente.
- `colorTheme: "Omni"` — tema escuro da Rocketseat. Puramente estetico, mas padroniza a experiencia visual das aulas.

### Prettier
- `defaultFormatter: "esbenp.prettier-vscode"` — define o Prettier como formatador padrao para todos os tipos de arquivo.
- `singleQuote: false` — usa aspas duplas (`"texto"`). Escolha do instrutor; muitos projetos usam `true` para aspas simples.
- `tabWidth: 2` — consistente com `editor.tabSize`.
- `semi: false` — remove ponto-e-virgula no final das linhas. Estilo preferido em projetos modernos JS/TS (ASI — Automatic Semicolon Insertion cuida disso).

### Terminal
- `fontSize: 16` — tamanho um pouco menor que o editor, porque terminal e secundario.
- `defaultProfile.windows: "Git Bash"` — usa Git Bash como terminal padrao no Windows em vez de PowerShell ou CMD. Git Bash suporta comandos Unix (`ls`, `cat`, `mkdir`) que sao ensinados nos cursos.

## extensions.json e @recommended

O arquivo `extensions.json` com o campo `recommendations` faz com que, ao digitar `@recommended` na busca de extensoes, o VSCode liste exatamente as extensoes do projeto. Isso resolve o problema de "esqueci de instalar alguma extensao" — o VSCode inclusive mostra um popup sugerindo instalar extensoes recomendadas ao abrir o projeto pela primeira vez.

## Cuidado com nomes de arquivo

O instrutor enfatiza: nomes errados simplesmente nao funcionam. O VSCode procura exatamente `.vscode/settings.json` e `.vscode/extensions.json`. Variacoes como `Settings.json`, `setting.json`, ou `.VSCode/` sao ignoradas silenciosamente — nao ha mensagem de erro.