---
name: rs-devops-containers-docker-e-lxc
description: "Applies container fundamentals when designing infrastructure, writing Dockerfiles, or choosing between VMs and containers. Use when user asks to 'containerize an app', 'create a Dockerfile', 'deploy with Docker', 'compare VMs vs containers', or discusses isolation and portability. Make sure to use this skill whenever container architecture decisions arise. Not for Kubernetes orchestration, Docker Compose multi-service setups, or CI/CD pipeline configuration."
---

# Containers, Docker e LXC

> Containers sao ambientes isolados que contem tudo que uma aplicacao precisa para rodar, sem possuir sistema operacional proprio.

## Rules

1. **Container = isolamento** — cada aplicacao roda em seu proprio ambiente isolado do SO host, porque um container defeituoso nao deve derrubar toda a operacao
2. **Container nao e VM** — containers compartilham o kernel do host e sao medidos em megabytes; VMs possuem SO proprio e sao medidas em gigabytes
3. **Docker e uma interface, nao o container em si** — Docker popularizou o termo, mas LXC ja existia como recurso nativo do Linux desde 2007-2008
4. **Baseado em imagem** — crie um arquivo declarativo com os recursos necessarios, builde a imagem, execute o container a partir dela
5. **Portabilidade total** — o que funciona localmente em container funciona em qualquer servidor, staging, producao ou homologacao
6. **Responsabilidade unica** — cada container deve executar apenas o binario da sua aplicacao, nada mais
7. **Servidor sem configuracao manual** — com containers, o servidor nao precisa ter PHP/Node/Java instalado; o container ja traz tudo

## Modelo mental

### Analogia do navio cargueiro

```
NAVIO (host de controle)
├── Container A (app Node) ✓ rodando
├── Container B (app PHP)  ✗ caiu
├── Container C (app Java) ✓ rodando
└── Container D (API Go)   ✓ rodando

Container B caiu → degradacao parcial
Navio continua navegando com A, C, D
Operacao NAO para como um todo
```

### Container vs VM

| Aspecto | Container | Maquina Virtual |
|---------|-----------|-----------------|
| Tamanho | Megabytes | Gigabytes |
| SO proprio | Nao (compartilha kernel) | Sim |
| Isolamento | Processo isolado via namespaces/cgroups | Virtualizacao completa com hypervisor |
| Portabilidade | Alta (imagem leve) | Baixa (imagem pesada) |
| Falha | Degradacao parcial | Tudo para se servidor cair |

## Como funciona o Docker

```
1. Arquivo declarativo (Dockerfile)
   → Define recursos que a app precisa
   
2. Build
   → Gera uma IMAGEM (binario empacotado + ambiente)
   
3. Execucao
   → Container roda a partir da imagem
   
4. Versionamento
   → Imagem pode ser versionada e distribuida
```

### Mecanismos do kernel Linux utilizados

| Recurso | Funcao |
|---------|--------|
| **Namespaces** | Segregar processos e usuarios |
| **cgroups** | Limitar CPU, memoria e recursos |
| **Kernel compartilhado** | Container nao carrega SO proprio |

## Heuristics

| Situacao | Faca |
|----------|------|
| App precisa rodar igual em dev e prod | Containerize com Docker |
| Precisa isolar tecnologias diferentes no mesmo servidor | Um container por tecnologia |
| Servidor novo precisa rodar a mesma app | Execute o container, sem configurar dependencias |
| Precisa de SO completo e independente | Use VM, nao container |
| Trabalha com Linux e quer containers nativos | Considere LXC como alternativa |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Instalar dependencias manualmente no servidor de producao | Declarar tudo no Dockerfile e executar o container |
| Colocar multiplas aplicacoes no mesmo container | Um container por aplicacao (responsabilidade unica) |
| Tratar container como VM (instalar SO dentro) | Container compartilha kernel, mantenha-o leve |
| Ignorar versionamento de imagens | Versionar imagens para rastreabilidade e rollback |
| Assumir que Docker e a unica opcao de container | Conhecer LXC e outras alternativas |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
