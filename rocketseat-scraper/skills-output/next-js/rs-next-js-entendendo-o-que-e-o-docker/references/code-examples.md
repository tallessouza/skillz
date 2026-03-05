# Code Examples: Entendendo o Docker

## Nota

Esta aula e puramente conceitual — nao ha codigo demonstrado. O instrutor foca em explicar os conceitos antes de entrar na parte pratica (Docker Compose na proxima aula).

## Exemplos praticos de referencia

### Cenario do curso: Postgres em container

```bash
# Iniciar container Postgres (exemplo tipico)
docker run --name postgres-dev -e POSTGRES_PASSWORD=docker -p 5432:5432 -d postgres:17

# Parar o container
docker stop postgres-dev

# Iniciar novamente (quase instantaneo)
docker start postgres-dev

# Remover o container
docker rm postgres-dev
```

### Comparacao visual: VM vs Container

```
┌─────────────────────────────────┐
│        VIRTUALIZACAO (VM)       │
│                                 │
│  ┌──────────┐  ┌──────────┐    │
│  │  App A   │  │  App B   │    │
│  │  Libs    │  │  Libs    │    │
│  │  SO      │  │  SO      │    │  ← Cada VM tem SO completo
│  │ completo │  │ completo │    │
│  └──────────┘  └──────────┘    │
│       Hypervisor               │
│       Hardware real             │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│         CONTAINERS (Docker)     │
│                                 │
│  ┌──────────┐  ┌──────────┐    │
│  │  App A   │  │  App B   │    │
│  │  Libs    │  │  Libs    │    │  ← Apenas app + dependencias
│  └──────────┘  └──────────┘    │
│       Docker Engine             │
│       Kernel do SO hospedeiro   │  ← Compartilhado
│       Hardware real             │
└─────────────────────────────────┘
```

### Analogia em "codigo"

```
// Virtualizacao
class VM {
  hardware: VirtualHardware  // CPU, RAM, Disco virtuais
  so: OperatingSystem        // SO completo instalado
  app: Application
  // Pesado: roda SO inteiro
}

// Container
class Container {
  app: Application
  dependencies: Libraries[]  // Apenas libs necessarias
  // Leve: usa kernel do SO hospedeiro
  // Nao tem SO proprio
}
```

### Cenario de inconsistencia (o problema que Docker resolve)

```yaml
# SEM Docker - cada um com ambiente diferente
instrutor:
  os: macOS
  postgres: "17"

aluno_a:
  os: Linux
  postgres: "15"

aluno_b:
  os: Ubuntu
  postgres: "14"

servidor_producao:
  os: Linux (otimizado)
  postgres: "17"

# COM Docker - todos identicos
todos:
  container:
    image: postgres:17
    # Mesmo banco, mesma versao, mesma config
    # Independente do SO de cada um
```