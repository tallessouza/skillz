# Deep Explanation: Terminal — Configuracao de Ambiente

## Por que Git Bash e nao PowerShell/CMD?

O instrutor explica que a razao principal e **consistencia**. Quando ele digita comandos no terminal durante as aulas (usando ZSH no Mac), os comandos sao Unix-like: `ls`, `cd`, `pwd`, barras normais nos paths (`/home/user/projects`).

No Windows nativo (PowerShell/CMD):
- Paths usam barras invertidas: `C:\Users\user\projects`
- Alguns comandos sao diferentes ou inexistentes
- O comportamento de navegacao diverge do que aparece nas aulas

Git Bash resolve isso porque ele emula um ambiente Bash no Windows, fazendo com que os mesmos comandos funcionem de forma identica.

## Analogia do instrutor

O terminal e como navegar pelo computador — a mesma coisa que voce faz clicando em pastas e arquivos no explorador de arquivos, mas via linha de comando. O instrutor demonstra isso mostrando `ls` no terminal e comparando com os mesmos arquivos visiveis no Finder/Explorer.

## VS Code Terminal Integrado

A "sacadinha" que o instrutor destaca: nao precisa abrir um terminal externo. O VS Code tem terminal integrado que pode ser aberto com atalho de teclado. O ponto critico e **verificar qual shell esta ativo** — o dropdown no canto do painel do terminal mostra o shell atual. No Windows, o VS Code pode defaultar para PowerShell, entao e necessario trocar manualmente para Git Bash.

## Equivalencia entre plataformas

| Plataforma | Shell recomendado | Acao necessaria |
|------------|-------------------|-----------------|
| Mac | ZSH (padrao) | Nenhuma |
| Linux | Bash (padrao) | Nenhuma |
| Windows | Git Bash | Instalar Git, configurar VS Code |

O instrutor usa ZSH no Mac mas enfatiza que "tem muito a ver com Mac, voce nao precisa se preocupar com isso" — o importante e que os comandos basicos (`ls`, `cd`, `pwd`) funcionam igual em Bash e ZSH.

## Atalhos mencionados

- `Cmd+J` (Mac) — toggle terminal no VS Code
- `Ctrl+J` (Windows/Linux) — equivalente, instrutor sugere testar
- Menu Terminal > New Terminal — alternativa via menu