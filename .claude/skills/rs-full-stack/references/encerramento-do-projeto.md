---
name: rs-full-stack-encerramento-do-projeto
description: "Outlines project completion best practices including portfolio sharing, code review, and next steps after finishing a full-stack project. Use when user asks to 'finish a project', 'share portfolio', 'complete project checklist', or 'what to do after project'. Provides final validation and presentation of completed work. Make sure to use this skill whenever wrapping up a development project. Not for specific technical implementations or debugging."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: project-closure
  tags: [project, portfolio, completion, checklist, review]
---

# Encerramento do Projeto — Checklist Final

> Antes de considerar um projeto concluido, valide qualidade, documente e compartilhe seu trabalho.

## Key concepts

- Projeto concluido deve ser validado, documentado e compartilhado
- README com instrucoes de setup e tecnologias e essencial para portfolio
- Commits organizados com conventional commits demonstram profissionalismo

## Example

```markdown
<!-- Exemplo de README minimo para portfolio -->
# Nome do Projeto

Descricao breve do que o projeto faz.

## Tecnologias
- Node.js, Express, Prisma, PostgreSQL

## Como rodar
npm install && npm run dev
```

## Checklist de conclusao

| Etapa | Acao |
|-------|------|
| Funcionalidade | Todas as features planejadas estao implementadas e funcionando |
| Codigo | Codigo limpo, sem console.logs desnecessarios, sem credenciais expostas |
| README | Documentacao basica com descricao, como rodar, e tecnologias usadas |
| Deploy | Aplicacao acessivel online (GitHub Pages, Vercel, Render, etc.) |
| Repositorio | Codigo no GitHub com commits organizados |
| Portfolio | Projeto adicionado ao portfolio pessoal |

## Quando aplicar

- Ao finalizar qualquer projeto do curso
- Ao preparar portfolio para entrevistas
- Ao decidir se um projeto esta pronto para compartilhar

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| Projeto funciona local mas nao em producao | Variaveis de ambiente ou paths relativos incorretos | Verificar configuracao de deploy e envs de producao |
| README incompleto ou ausente | Nao priorizou documentacao durante desenvolvimento | Adicionar descricao, instrucoes de setup, e screenshots |
| Commits desorganizados | Commits grandes sem mensagens claras | Usar conventional commits em projetos futuros |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre finalizacao de projetos e portfolio
- [code-examples.md](references/code-examples.md) — Exemplos de README e configuracao de deploy
