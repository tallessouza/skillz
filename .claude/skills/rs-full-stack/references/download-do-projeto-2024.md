---
name: rs-full-stack-download-do-projeto-2024
description: "Configures React form project scaffolding from a GitHub template repository. Use when user asks to 'setup a form project', 'download a React template', 'scaffold a form app', 'start a forms project', or 'configure a React form boilerplate'. Covers cloning template repos, installing dependencies, running dev server, and understanding form structure with inputs, select, textarea, and validation spans. Make sure to use this skill whenever bootstrapping a React form project from a template. Not for form validation logic, React Hook Form, or Zod schema implementation."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: react-formularios
  tags: [react, forms, template, vite, scaffold, projeto]
---

# Scaffold de Projeto React com Formulários

> Configure um projeto React de formulários a partir de um template GitHub, pronto para implementar validação e lógica.

## Prerequisites

- Node.js instalado (v18+)
- npm disponível no terminal
- VS Code (ou editor de preferência)
- Navegador para visualizar a aplicação

## Steps

### Step 1: Download do template

```bash
# Clonar ou baixar o zip do repositório template
# Via GitHub: Code → Download ZIP
# Ou via git:
git clone https://github.com/rocketseat-education/fullstack-react-template-forms.git
```

### Step 2: Renomear e organizar

```bash
# Remover sufixos desnecessários do nome da pasta
# Template: fullstack-react-template-forms-main
# Resultado: fullstack-react-forms
mv fullstack-react-template-forms-main fullstack-react-forms
```

### Step 3: Instalar dependências e rodar

```bash
cd fullstack-react-forms
npm install
npm run dev
```

### Step 4: Verificar estrutura do formulário

O template contém um formulário com:

```tsx
// App.tsx — estrutura base do formulário
<form>
  {/* Input texto — nome do evento */}
  <input type="text" name="nome" />
  <span className="error">Nome obrigatório</span>

  {/* Input data */}
  <input type="date" name="data" />

  {/* Select — tema do evento */}
  <select name="tema">
    <option>Evento</option>
    <option>Palestra</option>
  </select>

  {/* Textarea — descrição */}
  <textarea name="descricao" />

  {/* Botão submit */}
  <button type="submit">Salvar</button>
</form>
```

## Output format

Projeto rodando em `http://localhost:5173` (ou porta do Vite) com:
- Formulário estilizado com campos: nome, data, tema, descrição
- Spans de erro com classe `.error` (cor vermelha, font-size 12px, margin-left 7px)
- Botão de submit funcional (sem lógica ainda)

## Error handling

- Se `npm install` falhar: verificar versão do Node.js e limpar cache com `npm cache clean --force`
- Se porta ocupada: matar processo na porta ou configurar porta alternativa no `vite.config`

## Verification

1. Abrir `http://localhost:5173` no navegador
2. Confirmar que o formulário renderiza com todos os campos
3. Confirmar que a classe `.error` está no CSS com estilo vermelho

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| `npm install` falha com erros de dependencia | Versao do Node.js incompativel | Verifique com `node -v` e atualize para v18+ |
| Porta 5173 ocupada ao rodar `npm run dev` | Outro processo Vite esta rodando | Mate o processo com `lsof -i :5173` ou configure porta alternativa no `vite.config` |
| Formulario renderiza sem estilos | CSS nao importado no componente principal | Verifique o import do arquivo CSS no `App.tsx` ou `main.tsx` |
| Spans de erro nao aparecem em vermelho | Classe `.error` nao definida no CSS | Confirme que o CSS do template inclui estilo para `.error` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre estrutura do template e decisões de organização
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código do template expandidos com anotações