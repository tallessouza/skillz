---
name: rs-next-js-entendendo-docker
description: "Applies Docker container mental models when deciding between virtualization, emulation, and containers. Use when user asks to 'set up Docker', 'run database in container', 'configure dev environment', 'explain Docker vs VM', or 'why use containers'. Ensures correct analogies and architectural reasoning for containerization decisions. Make sure to use this skill whenever Docker or container concepts arise in project setup discussions. Not for Docker Compose configuration, Dockerfile writing, or container orchestration commands."
---

# Entendendo o Docker

> Containers compartilham o kernel do SO hospedeiro para isolar aplicacoes de forma leve, resolvendo inconsistencia de ambiente sem o custo de virtualizar hardware completo.

## Key concept

O problema fundamental: ambientes de desenvolvimento inconsistentes. Diferentes desenvolvedores com diferentes SOs, versoes de banco, configuracoes — causa o classico "na minha maxima funciona". O objetivo e criar ambientes consistentes, previsiveis e portaveis.

Docker resolve isso com containers: empacota apenas a aplicacao e suas dependencias diretas (bibliotecas, binarios), compartilhando o kernel do SO da maquina hospedeira.

## Decision framework

| Quando voce encontra | Aplique |
|---------------------|---------|
| Precisa rodar SO diferente completo (Linux inteiro no Windows) | Virtualizacao (VM) — casa dentro de casa |
| Precisa traduzir arquitetura de CPU (ex: emulador de console) | Emulacao — traduz instrucoes entre arquiteturas |
| Precisa isolar aplicacao/servico com mesma config para todos | Container Docker — quarto mobiliado na casa |
| Precisa de banco de dados local sem "sujar" a maquina | Container Docker para o banco |
| Precisa garantir mesma versao de servico entre devs | Container Docker com versao fixada |

## How to think about it

### VM vs Container

**VM (Virtualizacao):** Construir uma casa inteira (fundacao, paredes, telhado) dentro do terreno da sua casa. Hardware virtualizado + SO convidado completo. Pesada — dois SOs rodando simultaneamente.

**Container:** Alugar um quarto mobiliado na sua casa principal. O quarto vem com seus proprios moveis (aplicacao + dependencias), mas usa a estrutura da casa (fundacao, eletricidade, encanamento = kernel do SO hospedeiro).

### Quando usar Docker no projeto

Cenario tipico: rodar Postgres em container para desenvolvimento.

1. **Nao suja a maquina** — sem instalar Postgres diretamente no SO
2. **Consistencia** — todos usam mesma versao e configuracao
3. **Leve e rapido** — iniciar/parar container e quase instantaneo

## Common misconceptions

| Pensam | Realidade |
|--------|-----------|
| Docker e uma VM leve | Container compartilha kernel do SO, nao virtualiza hardware |
| Emulacao e igual a virtualizacao | Emulacao traduz instrucoes entre CPUs diferentes, e mais caro |
| Docker substitui VMs em todos os casos | Docker resolve isolamento de app, VM resolve quando precisa de SO completo diferente |
| Container tem seu proprio SO | Container usa o kernel do SO hospedeiro, empacota apenas dependencias |

## Limitations

- Docker nao resolve quando voce precisa de um SO completamente diferente (ex: rodar macOS no Linux)
- Docker nao substitui emulacao quando ha diferenca de arquitetura de CPU
- Containers Linux em Windows/Mac rodam via uma VM leve intermediaria (Docker Desktop)

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
