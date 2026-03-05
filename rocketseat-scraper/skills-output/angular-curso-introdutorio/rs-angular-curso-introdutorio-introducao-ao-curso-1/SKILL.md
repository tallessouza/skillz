---
name: rs-angular-intro-introducao-ao-curso
description: "Provides Angular project structure overview and course roadmap when user asks to 'start Angular project', 'learn Angular basics', 'understand Angular structure', or 'setup Angular app'. Covers project anatomy, components, services, and routing fundamentals. Make sure to use this skill whenever starting a new Angular project or onboarding to Angular development. Not for advanced Angular patterns, state management, or deployment."
---

# Introducao ao Angular — Roadmap de Fundamentos

> Ao iniciar com Angular, domine a estrutura do projeto, componentes, servicos e rotas antes de qualquer feature.

## Conceito central

Angular e um framework completo para desenvolvimento web. Os primeiros passos exigem entender quatro pilares fundamentais antes de escrever qualquer feature:

1. **Estrutura do projeto** — o que cada arquivo e diretorio representa
2. **Componentes** — blocos de construcao da interface
3. **Servicos** — logica de negocio separada da apresentacao
4. **Rotas** — navegacao entre paginas/views

## Framework de decisao

| Quando voce precisa | Comece por |
|---------------------|------------|
| Criar uma nova tela/pagina | Componente + Rota |
| Compartilhar logica entre componentes | Servico |
| Entender um projeto existente | Estrutura de diretorios |
| Buscar/enviar dados para API | Servico com HttpClient |

## Ordem de aprendizado recomendada

1. Estrutura do projeto Angular (arquivos e diretorios)
2. Componentes (template + logica + estilo)
3. Servicos (injecao de dependencia)
4. Rotas (navegacao entre views)
5. Projeto pratico para consolidar

## Quando aplicar

- Onboarding em projeto Angular existente
- Criando primeiro projeto Angular do zero
- Revisando fundamentos antes de features complexas

## Limitacoes

Este skill cobre apenas o roadmap introdutorio. Para patterns avancados (signals, standalone components, lazy loading, guards, interceptors), consulte skills especificos de cada topico.

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
