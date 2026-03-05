# Code Examples: Containers, Docker e LXC

## Nota sobre esta aula

Esta aula e predominantemente teorica e conceitual. O instrutor menciona que as aulas praticas virao nas proximas aulas do modulo, onde serao construidas imagens, containerizadas aplicacoes, e demonstradas as vantagens praticas.

## Modelo conceitual: aplicacao sem container

```bash
# Cenario: implantar app Node em servidor novo (SEM container)

# 1. Configurar servidor
ssh user@servidor-novo

# 2. Instalar dependencias manualmente
sudo apt update
sudo apt install -y nodejs npm

# 3. Configurar aplicacao
git clone https://github.com/empresa/app.git
cd app
npm install

# 4. Executar
npm start

# Problema: se precisar de outro servidor, repetir TUDO
# Problema: versao do Node pode divergir entre servidores
# Problema: "na minha maquina funciona" e real
```

## Modelo conceitual: aplicacao com container

```bash
# Cenario: implantar app Node em servidor novo (COM container)

# 1. Servidor so precisa ter Docker instalado
ssh user@servidor-novo

# 2. Executar o container (que ja tem TUDO dentro)
docker run -d minha-app:1.0

# Pronto. O container tem Node, dependencias, e a app buildada.
# Funciona igual em dev, staging e producao.
```

## Dockerfile conceitual (baseado na explicacao do instrutor)

```dockerfile
# Arquivo declarativo com os recursos que a aplicacao necessita
FROM node:20-alpine

# Ambiente isolado com tudo que a app precisa
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

# Container com responsabilidade unica: executar o binario
CMD ["node", "dist/server.js"]
```

O instrutor explica este fluxo como:
1. **Arquivo declarativo** → Dockerfile
2. **Build** → `docker build -t minha-app:1.0 .` → gera a imagem
3. **Execucao** → `docker run minha-app:1.0` → roda o container
4. **Versionamento** → tag `1.0` permite controle de versoes

## LXC — Exemplo de interacao nativa

```bash
# LXC e recurso nativo do Linux com CLI propria
# Criar container LXC
lxc-create -n meu-container -t ubuntu

# Iniciar container
lxc-start -n meu-container

# Acessar container
lxc-attach -n meu-container

# Listar containers
lxc-ls --fancy
```

## Comparacao visual: VM vs Container

```
=== MAQUINA VIRTUAL ===

┌─────────────────────────────┐
│         SERVIDOR            │
│  ┌───────┐ ┌───────┐       │
│  │ App A │ │ App B │       │  Tudo na mesma maquina
│  │  SO   │ │  SO   │       │  Cada VM tem SO proprio
│  │ (3GB) │ │ (3GB) │       │  Se servidor cai, tudo cai
│  └───────┘ └───────┘       │
│      HYPERVISOR             │
│      HOST OS                │
└─────────────────────────────┘

=== CONTAINERS ===

┌──────────────────────────────────┐
│          HOST (kernel Linux)     │
│  ┌────────┐ ┌────────┐ ┌──────┐ │
│  │ App A  │ │ App B  │ │App C │ │  Ambientes isolados
│  │ (50MB) │ │ (80MB) │ │(30MB)│ │  Compartilham kernel
│  └────────┘ └────────┘ └──────┘ │  Se App B cai, A e C continuam
│      Docker Engine / LXC        │
└──────────────────────────────────┘
```

## Proximos passos mencionados pelo instrutor

O modulo continuara com:
- Principios do isolamento (namespaces, cgroups)
- Construcao de imagens na pratica
- Containerizacao de aplicacoes existentes
- Comparacao pratica: implantacao com e sem container (modulo CI/CD)