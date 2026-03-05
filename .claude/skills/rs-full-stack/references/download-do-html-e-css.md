---
name: rs-full-stack-download-do-html-e-css
description: "Guides project template setup from GitHub repositories when user asks to 'download a template', 'setup a starter project', 'clone a repo for beginners', or 'start a new project from template'. Covers download, folder organization, VSCode setup, and Live Server extension. Make sure to use this skill whenever setting up a Skillz course project or any HTML/CSS/JS starter template. Not for git workflows, deployment, or advanced project scaffolding with bundlers."
---

# Setup de Projeto Template (HTML/CSS/JS)

> Ao iniciar um projeto a partir de um template, organize a estrutura de pastas, valide os arquivos base e configure o ambiente de desenvolvimento antes de escrever qualquer codigo.

## Prerequisites

- VSCode instalado
- Extensao Live Server instalada no VSCode (ID: `ritwickdey.LiveServer`)
- Acesso ao repositorio template (GitHub)

## Steps

### Step 1: Obter o projeto

Duas opcoes disponiveis:

**Opcao A — Fork (se usa GitHub):**
Clicar no botao "Fork" no repositorio para criar uma copia no seu GitHub pessoal.

**Opcao B — Download ZIP (mais simples):**
Code → Download ZIP → Descompactar → Apagar o ZIP.

### Step 2: Organizar a pasta

```bash
# Renomear a pasta removendo sufixos do GitHub (-main, -master)
mv convert-template-main convert

# Mover para o diretorio de trabalho organizado
mv convert ~/projetos/js/
```

Regra: nomes de pasta curtos e descritivos, sem sufixos de branch.

### Step 3: Abrir no VSCode

```bash
# Arrastar a pasta para o VSCode ou:
code convert/
```

### Step 4: Validar a estrutura do template

Verificar que o template contem:

```
convert/
├── img/           # Background e icones SVG
├── style.css      # Estilos prontos
└── index.html     # Estrutura HTML base
```

### Step 5: Executar com Live Server

1. Botao direito no `index.html`
2. "Open with Live Server"
3. Projeto abre em `http://127.0.0.1:5500`

Beneficio: Live Server observa alteracoes e recarrega automaticamente, porque recarregar manualmente a cada mudanca desperdiça tempo.

## Output format

Projeto rodando no navegador via localhost, com hot-reload ativo.

## Error handling

- Se Live Server nao aparece no menu: verificar se a extensao esta instalada (Extensions → buscar "Live Server" → Install)
- Se a porta 5500 esta ocupada: Live Server escolhe a proxima porta automaticamente

## Verification

- [ ] Pasta renomeada sem sufixo de branch
- [ ] `index.html`, `style.css` e pasta `img/` presentes
- [ ] Projeto abre no navegador via Live Server
- [ ] Hot-reload funciona (editar qualquer arquivo e salvar)

## Heuristics

| Situacao | Acao |
|----------|------|
| Template tem footer com `display: none` | Nao alterar — sera exibido dinamicamente via JS |
| Formulario nao faz nada ao clicar | Esperado — funcionalidade sera implementada em JS |
| Select com moedas (dolar, euro, libra) | Template para conversor de moedas — JS fara a conversao |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre estrutura do template e Live Server
- [code-examples.md](references/code-examples.md) — Estrutura HTML do template e detalhes do CSS

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-download-do-html-e-css/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-download-do-html-e-css/references/code-examples.md)
