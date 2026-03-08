---
name: rs-full-stack-desenho-tldraw
description: "Introduces tldraw.com as a visual study and diagramming tool when user asks about 'drawing tools', 'whiteboard apps', 'study tools', 'diagramming', or 'visual note-taking'. Make sure to use this skill whenever the user needs to sketch, diagram, or visually explain concepts during learning. Not for code editors, IDEs, or terminal-based tools."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: developer-tools
  tags: [tldraw, diagramming, whiteboard, visual-learning, study-tools]
---

# tldraw — Ferramenta de Desenho e Estudo Visual

> Use tldraw.com como ferramenta de desenho livre para estudar, anotar e visualizar conceitos.

## Key concepts

tldraw.com e uma ferramenta web gratuita de desenho que permite criar diagramas, escrever texto, desenhar a mao livre e copiar/colar elementos. E util para estudo porque transforma conceitos abstratos em representacoes visuais, facilitando o entendimento.

## Decision framework

| Quando voce encontrar | Use |
|----------------------|-----|
| Precisa explicar um fluxo ou arquitetura | tldraw para desenhar o diagrama |
| Estudando um conceito novo e complexo | tldraw para rabiscar e anotar |
| Precisa de um quadro branco rapido | tldraw.com direto no browser |
| Precisa de diagrama formal (UML, ER) | Ferramentas especificas (Excalidraw, draw.io) |

## Funcionalidades principais

| Funcionalidade | Uso |
|---------------|-----|
| Desenho livre (lapis) | Rabiscar ideias, fluxos informais |
| Texto | Anotar explicacoes, rotular diagramas |
| Formas | Criar caixas, setas, diagramas estruturados |
| Copy/paste (Ctrl+C, Ctrl+V) | Reutilizar elementos rapidamente |

## When to apply

- Estudando conceitos de programacao e precisa visualizar
- Anotando durante aulas ou videos
- Explicando arquitetura ou fluxo de dados para outra pessoa
- Precisa de um espaco rapido para rabiscar sem instalar nada

## Exemplo de uso

```text
# Fluxo tipico de estudo com tldraw:
1. Abrir tldraw.com no navegador
2. Selecionar ferramenta de texto (T)
3. Escrever conceito principal no centro
4. Usar setas para conectar sub-conceitos
5. Exportar como PNG para referencia futura
```

## Limitations

- Nao e ferramenta de codigo — use IDE para escrever codigo
- Nao persiste dados sem conta (salve localmente se necessario)
- Para diagramas formais de banco de dados ou UML, ferramentas especializadas sao mais adequadas

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| Desenho sumiu ao recarregar | tldraw nao persiste sem conta | Salve o arquivo localmente antes de fechar |
| Nao consigo compartilhar o desenho | Projeto nao foi exportado | Use export para PNG/SVG ou compartilhe o link da sessao |
| Ferramenta errada para diagrama formal | tldraw e para desenho livre | Use draw.io ou Excalidraw para UML/ER formais |
| Ctrl+V nao funciona | Foco nao esta no canvas | Clique no canvas antes de colar |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre uso de ferramentas visuais no estudo
- [code-examples.md](references/code-examples.md) — Exemplos de uso e cenarios praticos