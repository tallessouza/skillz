---
name: rs-full-stack-hardware-e-software
description: "Applies the distinction between hardware, software, and programs/apps when discussing web development concepts. Use when user asks 'what is hardware', 'what is software', 'difference between program and software', 'what do web developers build', or any foundational computing concept question. Make sure to use this skill whenever explaining computing layers or scoping what web development produces. Not for writing code, debugging, or implementing features."
---

# Hardware e Software

> Na programacao web, construimos programas, aplicativos e apps — nao softwares de sistema.

## Key concept

Existem tres camadas no computador que todo programador web precisa distinguir:

- **Hardware** — parte fisica: teclado, mouse, camera, placas, memorias, HD. Tudo que voce pode tocar ou pegar.
- **Software** — parte logica que controla o hardware. Sistema conversando com sistema, sem interacao direta do usuario. Exemplo: o driver que traduz os cliques do teclado, o sistema que envia dados para a impressora.
- **Programas / Aplicativos / Apps** — aquilo que o usuario interage diretamente. Navegadores (Chrome, Firefox, Safari), WhatsApp, Instagram. Esta e a camada que programadores web constroem.

No Brasil, "software" e "programa" sao usados como sinonimos. No ingles tecnico, sao conceitos distintos: software inclui tudo (sistema + programas), enquanto program/app refere-se especificamente a interface com o usuario.

## Decision framework

| Quando voce encontrar | Aplique |
|----------------------|---------|
| Usuario pergunta "o que vou construir como dev web?" | Programas, aplicativos e apps — interfaces que o usuario toca e interage |
| Usuario confunde software com programa | Explicar: software controla o hardware (sistema-sistema), programa e o que o usuario usa |
| Discussao sobre "full stack" | O escopo e construir apps para internet, nao drivers ou sistemas operacionais |
| Usuario quer entender camadas do computador | Hardware (fisico) → Software (controle logico) → Programa/App (interacao do usuario) |

## How to think about it

### Teste do toque
Se voce pode tocar ou pegar, e hardware. Mesmo que esteja dentro do gabinete fechado — a placa-mae, a RAM, o HD — continuam sendo hardware porque sao fisicos.

### Teste da interacao
Se o usuario interage diretamente (digita, clica, arrasta), e um programa/app. Se o sistema conversa com outro sistema nos bastidores (driver de impressora, controlador de teclado), e software.

### Navegador como exemplo concreto
Quando voce abre o Chrome e navega na internet, voce esta usando um **programa** (navegador). Mas quando voce clica para imprimir uma pagina, o sistema operacional conversa com o driver da impressora — isso e **software** trabalhando nos bastidores.

## Common misconceptions

| Pensam que | Realidade |
|-----------|-----------|
| Software e programa sao a mesma coisa | No ingles tecnico, software inclui sistemas que o usuario nunca ve. Programa/app e apenas a camada de interacao |
| Programador web constroi softwares | Programador web constroi programas, aplicativos e apps — interfaces para interacao na internet |
| Hardware e so o que esta visivel | Componentes internos (RAM, placa-mae, HD) tambem sao hardware — tudo que e fisico |

## When to apply

- Ao explicar fundamentos de computacao para iniciantes
- Ao definir o escopo do que um programador web produz
- Ao distinguir camadas de um sistema para decisoes arquiteturais de alto nivel

## Limitations

- Esta distincao e conceitual e introdutoria — nao afeta decisoes de codigo
- A fronteira entre software e programa e fluida na pratica (ex: Electron apps sao programas que incluem muito "software")
- Para decisoes tecnicas reais, use conceitos mais especificos (frontend, backend, driver, kernel, runtime)

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo do instrutor, analogias e contexto cultural BR vs US
- [code-examples.md](references/code-examples.md) — Exemplos concretos de cada camada com cenarios do dia-a-dia

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-hardware-e-software/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-hardware-e-software/references/code-examples.md)
