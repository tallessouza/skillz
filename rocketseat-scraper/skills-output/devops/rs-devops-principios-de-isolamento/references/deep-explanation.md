# Deep Explanation: Principios de Isolamento

## Por que isolamento importa

Diferente de maquinas virtuais (que virtualizam hardware completo), containers compartilham o kernel do host. Isso traz performance mas exige mecanismos de isolamento a nivel de kernel para que containers nao interfiram entre si.

O instrutor destaca tres pilares:

### 1. Control Groups (cgroups)

Funcionalidade do kernel Linux que controla e limita recursos de um processo. Fica no kernel e e usado para impor limites de:
- **CPU** (millicores)
- **Memoria** (RAM)
- **I/O** (disco, rede)

**Insight do instrutor:** "A ideia e que o container nao monopolize todos os recursos daquele host." Sem cgroups, um container poderia consumir toda a RAM disponivel, prejudicando todos os outros containers e ate o proprio host.

O cenario problematico: voce tem 10 containers rodando. Um deles tem um memory leak. Sem cgroup limits, esse container consome toda a RAM do host, causando OOM killer nos outros containers. Com cgroups, apenas o container com leak e afetado.

### 2. Namespaces

Isolamento de visibilidade. Cada container tem seu proprio:
- **Filesystem** — arvore de diretorios propria
- **Processos** — PID namespace separado (PID 1 dentro do container)
- **Rede** — interfaces de rede proprias, tabela de roteamento propria

**Insight do instrutor:** "Container 1 nao consegue enxergar os arquivos do container 3, os processos que estao sendo executados no container 3, e vice-versa." Essa separacao e o que permite rodar aplicacoes completamente diferentes (e ate concorrentes) no mesmo host.

Tipos de namespaces Linux relevantes:
- `mnt` — pontos de montagem (filesystem)
- `pid` — IDs de processo
- `net` — stack de rede
- `ipc` — comunicacao inter-processo
- `uts` — hostname e domainname
- `user` — UIDs/GIDs

### 3. Unshare

Comando Linux que cria novos namespaces para processos existentes. O instrutor menciona como curiosidade, mas e importante porque:
- Permite isolamento sem container runtime (sem Docker)
- E a ferramenta "manual" por tras do que Docker faz automaticamente
- Util para debugging e entendimento do que containers realmente fazem

### OCI (Open Container Initiative)

Padronizacao de interfaces de container. Garante que Docker, containerd, podman, CRI-O e outros runtimes sigam o mesmo padrao. O instrutor descreve como "uma iniciativa que traz padroes para que as interfaces de container consigam trabalhar de forma mais unanime."

## Resumo da hierarquia

```
Kernel Linux
├── cgroups → LIMITA quanto recurso cada processo pode usar
├── namespaces → ISOLA o que cada processo pode VER
└── unshare → CRIA namespaces para processos existentes

OCI → PADRONIZA como runtimes implementam isso
```