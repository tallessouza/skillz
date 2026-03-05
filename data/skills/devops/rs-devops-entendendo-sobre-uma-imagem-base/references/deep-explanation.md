# Deep Explanation: Imagem Base Docker

## O que e um Dockerfile

O Dockerfile e um manifesto declarativo — um arquivo onde voce declara tudo que sua aplicacao precisa para executar dentro de um container. E como uma receita de bolo: lista ingredientes (imagem base, dependencias) e passos (build, start).

## A analogia do instrutor: receita de bolo

O instrutor usa a metafora de "receita de bolo" para o Dockerfile. Assim como uma receita lista ingredientes e passos, o Dockerfile lista:
1. **Ambiente base** (sistema operacional + runtime) → o "forno"
2. **Instalacao de dependencias** → os "ingredientes"
3. **Build da aplicacao** → o "preparo"
4. **Comando de start** → "colocar no forno"

## Por que o FROM e a primeira instrucao

Quando voce cria um container, precisa de um sistema operacional com o runtime instalado. Em vez de partir do zero (instalar Ubuntu, depois instalar Node), voce usa uma **imagem base** que ja vem com tudo preparado. O `FROM` aponta para essa imagem.

Por padrao, o `FROM` busca no Docker Hub (registry publico da Docker). Se a imagem nao existir la, o build falha. E possivel configurar registries privados, mas o padrao e sempre o Docker Hub.

## Tags: o sistema de versionamento de imagens

Tags em imagens Docker sao analogas a commits no Git — cada tag aponta para um snapshot especifico da imagem. No contexto de imagens de tecnologias (Node, Python, Java), a tag geralmente reflete a versao da tecnologia.

Exemplos:
- `node:16` → Node.js versao 16
- `node:18` → Node.js versao 18
- `node:18-slim` → Node.js 18 com sistema operacional reduzido
- `node:18-alpine` → Node.js 18 sobre Alpine Linux (ainda menor)

## O problema das imagens "full" (sem variante)

O instrutor demonstrou na aula que a imagem `node:18` (sem variante):
- Tem **quase 400MB** de tamanho
- Contem **92 vulnerabilidades** conhecidas
- Depende de **5 imagens base** incluindo Debian completo e buildpack
- Possui **quase 800 pacotes** instalados

A pergunta-chave do instrutor: "Sera que a nossa aplicacao, que e muito simplesinha, precisa de fato rodar com esse tanto de pacote? Provavelmente, nao."

## A solucao: variantes slim e alpine

Ao trocar para `node:18-slim`:
- Tamanho cai para **~70MB** (reducao de mais de 300MB)
- Vulnerabilidades caem para **19** (reducao de ~80%)
- Apenas **2 imagens base** (Debian minimal + Node)
- **344 pacotes** (reducao pela metade)

Essa e uma otimizacao trivial que tem impacto enorme em seguranca e performance.

## Hierarquia de imagens

Imagens Docker funcionam em camadas hierarquicas. A imagem `node:18` nao e monolitica — ela aponta para outras imagens por baixo (Debian, buildpack-deps, etc). Cada camada adiciona pacotes e, consequentemente, vulnerabilidades. Escolher uma variante slim ou alpine reduz essas camadas.

## Dockerfile como arquivo

- O nome padrao e `Dockerfile` (sem extensao)
- Tambem funciona como extensao: `file.dockerfile`
- Se usar o nome padrao `Dockerfile`, o Docker o encontra automaticamente (similar ao `index.html`)
- Se usar outro nome, precisa referenciar explicitamente no build com `-f`

## Aplicabilidade universal

O mapeamento mental (runtime → dependencias → build → start) se aplica a qualquer tecnologia:
- **Java:** JDK/JRE instalado → Maven/Gradle → gerar JAR → java -jar
- **Python:** Python instalado → pip install → (sem build geralmente) → python app.py
- **Go:** Go instalado → go mod download → go build → executar binario
- **PHP:** PHP instalado → composer install → (configurar) → php-fpm

A logica e sempre a mesma: "O que sua aplicacao precisa para executar fora do container? Passe isso para o container."