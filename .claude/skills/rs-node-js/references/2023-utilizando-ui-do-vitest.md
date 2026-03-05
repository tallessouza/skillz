---
name: rs-node-js-2023-vitest-ui
description: "Configures and uses Vitest UI for visual test monitoring in Node.js projects. Use when user asks to 'setup vitest ui', 'visualize tests', 'test dashboard', 'vitest interface', or 'monitor tests visually'. Applies installation, script configuration, and UI navigation patterns. Make sure to use this skill whenever setting up visual test tooling with Vitest. Not for writing test logic, test assertions, or configuring test runners without UI."
---

# Utilizando UI do Vitest

> Configurar o Vitest UI para visualizar, navegar e executar testes de forma grafica no navegador.

## Prerequisites

- Vitest ja configurado no projeto
- Node.js 18+
- Se nao encontrar vitest no projeto: verificar `package.json` antes de prosseguir

## Steps

### Step 1: Instalar o pacote

```bash
npm install -D @vitest/ui
```

### Step 2: Criar script no package.json

```json
{
  "scripts": {
    "test:ui": "vitest --ui"
  }
}
```

### Step 3: Executar

```bash
npm run test:ui
```

Abre automaticamente uma aba no navegador com a interface completa.

## Funcionalidades da UI

| Feature | Descricao |
|---------|-----------|
| **Lista de testes** | Painel esquerdo com todos os testes do projeto |
| **Describe groups** | Categorias dos testes agrupadas por `describe` |
| **Module Graph** | Grafico visual de dependencias entre o teste e modulos importados |
| **Code viewer** | Visualizacao do codigo fonte dos testes direto na UI |
| **Console output** | `console.log` dentro dos testes aparece na aba dedicada |
| **Dashboard** | Visao geral do status de todos os testes |
| **Live reload** | Testes re-executam automaticamente ao salvar arquivos |
| **Error navigation** | Clique na linha do erro para navegar direto ao codigo |

## Output format

Ao configurar, o resultado esperado e:
- Servidor local iniciado (porta automatica)
- Navegador abre com dashboard
- Testes executam automaticamente
- Falhas mostram linha exata, mensagem de erro e diff

## Error handling

- Se porta ja estiver em uso: Vitest seleciona outra porta automaticamente
- Se testes falham: UI mostra em vermelho com detalhes do erro, linha exata e expected vs received
- Se `@vitest/ui` nao esta instalado: erro `Cannot find module`, instalar com Step 1

## Verification

- Dashboard abre no navegador com lista de testes
- Todos os testes executam e mostram status (verde/vermelho)
- Alterar um teste para falhar → UI atualiza em tempo real mostrando a falha

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/node-js/rs-node-js-2023-utilizando-ui-do-vitest/references/deep-explanation.md)
- [Code examples](../../../data/skills/node-js/rs-node-js-2023-utilizando-ui-do-vitest/references/code-examples.md)
