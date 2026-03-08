---
name: rs-full-stack-download-template-html-css
description: "Scaffolds project setup from GitHub template repositories with folder organization and Live Server. Use when user asks to 'clone a template', 'download starter project', 'setup from GitHub repo', or 'start from a template'. Covers GitHub template usage, zip download, folder organization, and VSCode with Live Server. Make sure to use this skill whenever setting up a new project from a Skillz or similar GitHub template. Not for git workflows, branching strategies, or CI/CD setup."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: project-setup
  tags: [github, template, vscode, live-server, setup, download]
---

# Setup de Projeto a partir de Template GitHub

> Ao iniciar um projeto a partir de template, organize arquivos corretamente e configure o ambiente antes de codar.

## Prerequisites

- VSCode instalado
- Extensao **Live Server** instalada e habilitada no VSCode
- Git (opcional, para clone via GitHub)

## Steps

### Step 1: Obter o template

**Opcao A — GitHub (recomendado se usa Git):**
1. Acessar o repositorio template
2. Clicar no botao verde "Use this template"
3. Selecionar "Create a new repository" — cria uma copia no seu GitHub
4. Clonar o repositorio criado

**Opcao B — Download ZIP (sem Git):**
1. Clicar no botao verde "Code"
2. Selecionar "Download ZIP"
3. Descompactar o arquivo
4. Deletar o `.zip` original

### Step 2: Organizar o projeto

```bash
# Renomear a pasta para o nome limpo do projeto (sem sufixos -main, -master)
mv refund-template-main refund

# Mover para uma pasta dedicada a projetos (nao deixar em Downloads)
mv refund ~/projetos/
```

### Step 3: Abrir no VSCode

```bash
code ~/projetos/refund
```

Ou: VSCode → File → Open Folder → selecionar a pasta do projeto.

### Step 4: Executar com Live Server

1. Clique direito no arquivo `index.html`
2. Selecione "Open with Live Server"
3. O projeto abre no navegador com hot-reload automatico

**Se a opcao nao aparece:** Extensions → buscar "Live Server" → verificar se esta instalado E habilitado (nao clicou em Disable sem querer).

## Output format

Estrutura tipica de um template HTML/CSS pronto para JavaScript:

```
projeto/
├── index.html      # Estrutura da aplicacao
├── styles.css      # Regras de estilo
└── assets/         # Imagens (SVG, PNG)
    ├── logo.svg
    ├── food.svg
    ├── service.svg
    ├── transport.svg
    └── accommodation.svg
```

## Error handling

- Se Live Server nao aparece no menu de contexto: verificar extensao instalada e habilitada
- Se porta ja em uso: Live Server usa 5500 por padrao, fechar outras instancias ou mudar porta nas configs

## Verification

- Projeto abre no navegador sem erros no console
- Hot-reload funciona (editar HTML, salvar, pagina atualiza sozinha)
- Todos os assets (imagens SVG) carregam corretamente

## Heuristics

| Situacao | Faca |
|----------|------|
| Tem conta GitHub e usa Git | Use "Use this template" para criar repo proprio |
| Nao usa Git | Download ZIP |
| Projeto na pasta Downloads | Mova para pasta dedicada de projetos |
| Live Server nao aparece | Verifique extensoes do VSCode |

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| Live Server nao aparece no menu de contexto | Extensao nao instalada ou desabilitada no VSCode | Acessar Extensions, buscar "Live Server", instalar e habilitar |
| Hot-reload nao funciona | Arquivo aberto diretamente no browser em vez do Live Server | Usar "Open with Live Server" no menu de contexto do index.html |
| Assets SVG nao carregam | Caminhos relativos quebrados apos mover pasta | Verificar que a estrutura de pastas permanece intacta apos descompactar |
| Erros no console do browser | Arquivo JavaScript referenciado no HTML nao existe ainda | Normal para templates — JS sera implementado nas proximas etapas |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre organizacao de projetos e workflow com Live Server
- [code-examples.md](references/code-examples.md) — Estrutura do template refund e detalhes do projeto