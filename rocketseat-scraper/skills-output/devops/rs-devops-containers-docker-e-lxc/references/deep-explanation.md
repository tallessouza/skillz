# Deep Explanation: Containers, Docker e LXC

## Historia dos containers

Containers nao comecaram com Docker. O conceito existe ha mais de 20 anos:

- **Final da decada de 90:** FreeBSD Jails (James) introduziu o conceito de isolamento
- **2007-2008:** LXC (Linux Containers) surgiu como recurso nativo do kernel Linux
- **2008:** Docker tambem comecou a ser desenvolvido na mesma epoca
- **2013:** Docker ganhou popularidade massiva e "popularizou o termo container"

O instrutor enfatiza que Docker e apenas uma **interface** para lidar com containers. Container como conceito e tecnologia e muito mais amplo e antigo que o Docker.

## O principio basilar: isolamento

O instrutor usa a expressao "principio basilar" para descrever isolamento como a base de tudo em containers.

O que significa isolamento na pratica:
- Sua aplicacao precisa de recursos computacionais (CPU, RAM)
- Sua aplicacao precisa de recursos tecnologicos (Node, PHP, Java)
- O container cria um ambiente separado do SO host com TUDO isso dentro
- A aplicacao roda ali dentro sem saber que esta em um container

### Analogia do navio cargueiro (do instrutor)

O instrutor usa esta analogia central: um navio cargueiro em alto mar (ambiente de producao, com problemas, com ondas) carrega varios containers. Se um container cai do navio, o navio continua navegando com os restantes.

Computacionalmente: se um container falha, voce tem degradacao parcial, mas a operacao nao para como um todo. Isso e fundamentalmente diferente de uma VM onde tudo roda na mesma maquina.

## LXC — O container nativo do Linux

O instrutor faz questao de apresentar LXC antes de Docker para deixar claro que:
- Container nao e sinonimo de Docker
- LXC e recurso NATIVO do Linux
- Tem CLI propria para interagir com o kernel
- E open source com modelos, ferramentas e libs
- Funciona como "quase um nivel de virtualizacao do SO"

## Docker — A interface que popularizou

Docker e escrito em Go e funciona assim:
1. Usa o kernel do Linux
2. Utiliza **namespaces** para segregar usuarios e processos
3. Utiliza **cgroups** do kernel para controle de recursos
4. Segrega processos mantendo execucao independente

### O conceito de imagem

O instrutor explica a cadeia:
1. Voce tem uma aplicacao com recursos necessarios
2. Cria um **arquivo declarativo** com esses recursos
3. Faz o **build**, gerando uma **imagem**
4. A imagem e o empacotamento/binario da aplicacao
5. Voce executa essa imagem como container

A imagem permite versionamento e facilita implantacoes.

## Container vs VM — Diferenca fundamental

O instrutor destaca duas diferencas principais:

1. **VMs possuem SO proprio** — containers nao. Container compartilha o kernel do host
2. **VMs sao grandes (GB)** — containers sao leves (MB). Existem imagens de GB? Sim, mas e muito menos comum

Na VM: se o servidor para, toda a operacao para. Tudo roda na mesma maquina.
No container: ambientes isolados, cada um com seu ambiente de execucao.

## Vantagem no ciclo de entrega

O instrutor da um "spoiler" importante: sem container, para implantar uma app PHP voce precisa:
1. Ir no servidor
2. Instalar PHP (ou Node, Java, etc)
3. Configurar manualmente (ou com Ansible)
4. Implantar o software
5. Se precisar de outro servidor, repetir tudo

Com container:
1. Ter um servidor
2. Executar o container (que ja tem tudo)
3. Pronto

E o que funciona localmente funciona em qualquer lugar — no computador do colega, em staging, producao, homologacao. Nao tem segredo.

O instrutor nota: container nao automatiza nada por si so, mas facilita a governanca de todo o ciclo.