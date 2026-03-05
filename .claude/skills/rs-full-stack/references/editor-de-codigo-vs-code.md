---
name: rs-full-stack-editor-de-codigo-vs-code
description: "Guides VSCode installation and edition selection when user asks to 'setup VSCode', 'install code editor', 'configure development environment', or 'which VSCode version'. Covers Stable vs Insiders vs Web (vscode.dev) with decision framework. Make sure to use this skill whenever recommending or setting up VSCode for a new project. Not for VSCode extensions, themes, settings, or keybindings configuration."
---

# Editor de Código — VSCode

> Escolha a edição correta do VSCode para o contexto certo: Stable para trabalho, Insiders para experimentação, Web para mobilidade.

## Prerequisites

- Navegador moderno (para vscode.dev)
- Sistema operacional: Windows, Mac ou Linux
- Se offline: baixar instalador de [code.visualstudio.com](https://code.visualstudio.com/)

## Decision framework

| Contexto | Edição | Motivo |
|----------|--------|--------|
| Trabalho profissional no dia a dia | **Stable** | Estável, sem surpresas, porque bugs em produção custam caro |
| Aulas, experimentos, testar novidades | **Insiders** | Atualizações diárias, instala lado a lado sem afetar o Stable |
| Computador emprestado, viagem, sem instalação | **Web (vscode.dev)** | Zero instalação, roda direto no browser |

## Steps

### Step 1: Instalar a versão Stable (prioridade principal)

1. Acessar [code.visualstudio.com](https://code.visualstudio.com/)
2. Clicar no botão de download (detecta plataforma automaticamente)
3. Se a plataforma não for detectada corretamente, clicar em "Other Platforms"
4. Baixar, executar o instalador e seguir o wizard

### Step 2: (Opcional) Instalar Insiders para experimentação

1. Na mesma página, acessar a seção Insiders
2. Baixar o instalador Insiders
3. Instalar — funciona **side by side** com o Stable, porque são aplicações independentes
4. Usar o Insiders para aulas e testes sem risco ao ambiente de trabalho

### Step 3: (Opcional) Usar a versão Web

1. Abrir [vscode.dev](https://vscode.dev/) no navegador
2. O editor abre diretamente, sem instalação
3. Ao abrir arquivos, ele acessa o sistema de arquivos local da máquina
4. Salvar código sempre no Git, porque os arquivos ficam apenas no contexto do browser

## Output format

Ambiente configurado com:
- VSCode Stable instalado e funcional
- (Opcional) VSCode Insiders para experimentação
- (Opcional) Bookmark para vscode.dev

## Error handling

- Se o download não detectar a plataforma: clicar em "Other Platforms" para selecionar manualmente
- Se Insiders apresentar bugs: usar a versão Stable normalmente, porque o Insiders recebe releases diárias que podem ser instáveis
- Se não puder instalar nada: usar vscode.dev como alternativa imediata

## Verification

- Abrir o VSCode e verificar se a interface carrega corretamente
- Se Insiders instalado: confirmar que ambos (Stable e Insiders) abrem independentemente

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre cada edição e trade-offs
- [code-examples.md](references/code-examples.md) — Configurações e dicas práticas de uso

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-editor-de-codigo-vs-code/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-editor-de-codigo-vs-code/references/code-examples.md)
