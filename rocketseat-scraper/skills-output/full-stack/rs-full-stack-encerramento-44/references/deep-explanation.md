# Deep Explanation: Docker Containers — Resumo do Módulo

## Contexto do módulo

Este módulo encerra a etapa de Containers dentro do curso Full Stack da Rocketseat. O instrutor destaca três aprendizados centrais que formam a base do uso de Docker em desenvolvimento:

### 1. Containers com Docker

Containers são ambientes isolados que empacotam uma aplicação e suas dependências. A analogia fundamental: um container é como uma "caixa" que contém tudo que o serviço precisa para rodar, independente do sistema operacional host.

**Por que isso importa:** Sem containers, cada desenvolvedor precisa instalar e configurar manualmente bancos de dados, runtimes, e ferramentas — gerando o clássico problema "funciona na minha máquina".

### 2. Volumes

Volumes resolvem o problema da efemeridade dos containers. Por padrão, quando um container é removido, todos os dados dentro dele são perdidos. Volumes criam um "túnel" entre o filesystem do host e o container, permitindo que dados persistam.

**Insight do instrutor:** Volumes são essenciais para qualquer serviço que armazene estado — bancos de dados sendo o exemplo mais óbvio. Sem volume, cada `docker-compose down` destruiria todos os dados do banco.

### 3. Docker Compose

Docker Compose automatiza o processo de "colocar vários containers de pé". Em vez de executar múltiplos `docker run` com flags complexas, um único arquivo `docker-compose.yml` descreve toda a infraestrutura local.

**Insight do instrutor:** A automação é o valor principal. Em projetos reais, é comum ter 3-5 serviços (API, banco, cache, message broker, etc.) que precisam subir juntos e se comunicar via rede interna do Docker.

## Progressão de aprendizado

O módulo segue uma progressão lógica:

1. **Container isolado** → entender o conceito de isolamento
2. **Volumes** → resolver o problema de persistência
3. **Docker Compose** → orquestrar múltiplos containers

Cada etapa resolve uma limitação da anterior, construindo uma compreensão incremental do ecossistema Docker.

## Conexão com outros módulos

- **Módulo de API/Express:** Os containers encapsulam o servidor Node.js
- **Módulo de Banco de Dados:** Volumes garantem persistência dos dados SQL
- **Módulo de Deploy (futuro):** Docker é a base para CI/CD e deploy em cloud