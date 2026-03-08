---
name: rs-full-stack-download-html-css-template
description: "Scaffolds project template setup from GitHub repositories for HTML/CSS starter projects. Use when user asks to 'download a template', 'clone a starter project', 'setup HTML/CSS base', or 'start from a template repo'. Covers cloning, extracting, organizing folders, and opening in VS Code with Live Server. Make sure to use this skill whenever setting up a pre-built template as a project starting point. Not for creating HTML/CSS from scratch or building components."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: project-setup
  tags: [git, github, template, vscode, live-server, setup]
---

# Setup de Template HTML/CSS como Base de Projeto

> Clone ou baixe o template, organize a pasta, abra no editor e verifique o visual antes de codar.

## Prerequisites

- VS Code instalado com extensao Live Server
- Git instalado (para clone) ou navegador (para download ZIP)
- Acesso ao repositorio do template no GitHub

## Steps

### Step 1: Obter o template

**Opcao A — Usar como template no GitHub (recomendado):**
Clicar em "Use this template" no repositorio para criar uma copia no seu GitHub.

**Opcao B — Download ZIP:**
Code > Download ZIP, descompactar, deletar o ZIP.

**Opcao C — Git clone:**
```bash
git clone https://github.com/org/template-repo.git nome-do-projeto
```

### Step 2: Organizar a pasta

```bash
# Renomear para o nome do projeto (sem sufixo -template/-main)
mv template-repo-main/ hairday/

# Mover para o diretorio de trabalho
mv hairday/ ~/projetos/js/
```

### Step 3: Abrir no VS Code

```bash
code ~/projetos/js/hairday
```

### Step 4: Verificar a estrutura

```
projeto/
├── index.html          # Pagina principal com imports de CSS
└── src/
    ├── assets/         # Icones SVG e imagens
    └── styles/
        ├── index.css   # Importacoes unificadas de todos os estilos
        └── *.css       # Estilos separados por componente
```

### Step 5: Executar com Live Server

Botao direito no `index.html` > "Open with Live Server" para visualizar o template no navegador.

## Output format

Projeto aberto no VS Code com Live Server rodando, visual completo renderizado no navegador, pronto para implementar funcionalidades JavaScript.

## Error handling

- Se Live Server nao aparecer: instalar extensao "Live Server" no VS Code
- Se estilos nao carregarem: verificar que os paths no `<link>` do index.html apontam para `src/styles/index.css`
- Se imagens quebrarem: verificar pasta `src/assets/`

## Verification

- Abrir o navegador e confirmar que o layout esta completo visualmente
- Clicar nos botoes — devem estar sem funcionalidade (apenas visual)
- Validacao HTML nativa deve funcionar nos campos de formulario

## Dicas uteis do VS Code

| Acao | Como |
|------|------|
| Buscar texto no projeto inteiro | Ctrl+Shift+F (icone de lupa na sidebar) |
| Buscar texto no arquivo atual | Ctrl+F |
| Resultado mostra hierarquia | Arquivo > ocorrencias encontradas |

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| Live Server nao aparece no menu de contexto | Extensao nao instalada ou desabilitada | Instalar extensao "Live Server" no VS Code e verificar se esta ativa |
| Estilos CSS nao carregam | Path no `<link>` do index.html incorreto | Verificar que aponta para `src/styles/index.css` |
| Imagens quebradas (icone de imagem ausente) | Pasta `src/assets/` nao contem os arquivos | Verificar se o download/clone incluiu a pasta assets |
| Porta 5500 ja em uso | Outra instancia do Live Server rodando | Fechar outras instancias ou mudar porta nas configuracoes |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre workflow de setup e decisoes do instrutor
- [code-examples.md](references/code-examples.md) — Estrutura completa do template Hair Day com detalhes