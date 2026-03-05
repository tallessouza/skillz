# Deep Explanation: Open Container Initiative (OCI)

## Por que a OCI existe

O instrutor contextualiza: Docker é **uma interface** para trabalhar com containers, mas existem outras. Sem padronização, cada ferramenta poderia definir seu próprio formato de imagem, seu próprio runtime e sua própria forma de distribuir imagens. A OCI surgiu para evitar esse caos — é a "governança" que garante que todos falem a mesma língua.

## A analogia da governança

O instrutor usa o termo "estrutura de governança" deliberadamente. Não é uma ferramenta, não é um software — é um conjunto de regras e especificações que ferramentas devem seguir. Assim como padrões web (W3C) permitem que browsers diferentes renderizem o mesmo HTML, a OCI permite que runtimes diferentes executem o mesmo container.

## Os três pilares em detalhe

### Image Spec
Define como uma imagem de container é estruturada: layers, manifests, configurações. Quando você faz `docker build`, o resultado segue (ou deveria seguir) esta especificação.

### Runtime Spec
Define como um container deve ser executado. O **runc** é a implementação de referência — um projeto Open Source mantido pela OCI. O instrutor recomenda explorar o código do runc para entender como containers realmente funcionam por baixo. Esse conhecimento se torna especialmente relevante em Kubernetes, onde o runtime é mais exposto.

### Distribution Spec
Define como imagens são transferidas entre registries (Docker Hub, GitHub Container Registry, AWS ECR, etc). Garante que um `docker push` para qualquer registry compatível funcione da mesma forma.

## O valor a longo prazo

O instrutor faz uma observação importante: **a curto prazo, seguir OCI pode não parecer fazer diferença**. Você constrói com Docker, executa com Docker, tudo funciona. Mas a longo prazo, quando precisar migrar para Kubernetes, trocar de cloud provider, ou usar Podman em vez de Docker, containers OCI-compliant migram sem fricção.

Isso é especialmente relevante para **manutenibilidade futura** — um tema que o instrutor repete: containers leves, portáteis e agnósticos são mais fáceis de manter.

## Container agnóstico — as "leis" da OCI

O instrutor lista princípios que funcionam como leis:

1. **Não vinculado a cliente** — seu container não deve depender de features exclusivas do Docker CLI
2. **Não vinculado a orquestrador** — deve funcionar em Swarm, Kubernetes, Nomad ou standalone
3. **Não vinculado a fornecedor** — deve rodar em AWS, GCP, Azure ou bare metal
4. **Portátil entre SOs e arquiteturas** — linux/amd64, linux/arm64, etc.

## runc como dica de estudo

O instrutor recomenda explorar o runc como "dever de casa". É a implementação de referência do OCI runtime spec, escrito em Go. Entender runc ajuda a desmistificar o que realmente acontece quando um container "roda" — namespaces, cgroups, filesystem isolation. O instrutor menciona que voltará ao tema em Kubernetes, onde o runtime fica mais visível (CRI + containerd + runc).

## Conexão com aulas anteriores e posteriores

- **Aulas anteriores** já abordaram portabilidade — a OCI formaliza isso em especificações
- **Próximas aulas** entram na prática com Docker, onde os padrões OCI serão aplicados na construção de containers
- **Em Kubernetes**, o runtime spec ganha protagonismo com CRI (Container Runtime Interface)