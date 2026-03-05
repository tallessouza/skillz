# Deep Explanation: Otimizacao de Imagens Docker

## Por que a ordem dos comandos importa

O erro mais sutil desta aula e a ordem de instalacao de dependencias. O instrutor demonstrou ao vivo o erro proposital: ao rodar `yarn workspaces focus --production` ANTES do `yarn run build`, o build falha porque o NestJS CLI e uma devDependency.

A CLI do Nest e usada internamente pelo `yarn run build` — ela nao e necessaria em producao, por isso esta corretamente como devDependency. O problema surge quando voce tenta otimizar cedo demais.

### Solucao: instalar tudo, buildar, depois sobrescrever

A estrategia e:
1. `yarn install` (todas as deps, incluindo dev)
2. `yarn run build` (agora o NestJS CLI esta disponivel)
3. `yarn workspaces focus --production` (sobrescreve node_modules, removendo devDeps)
4. `yarn cache clean` (limpa cache residual)

O instrutor mencionou que isso "categoriza um caso de estagio diferente" — idealmente, voce teria 3 estagios (deps, build, producao), mas para simplicidade, fazer no mesmo estagio funciona.

## Progressao de tamanho demonstrada na aula

| Versao | Tamanho | O que mudou |
|--------|---------|-------------|
| Imagem inicial (node:18) | ~1GB | Imagem Debian completa com tudo |
| Apos multi-stage com Alpine | 597MB | Alpine como base final |
| Apos copiar apenas o necessario | 383MB | Multi-stage otimizado |
| Apos production deps + cache clean | 210MB | Removeu devDeps e cache |

## Alpine vs Debian

Alpine Linux nao inclui bash — usa `sh` (BusyBox). Ao debugar containers Alpine:
- `docker exec -it <id> sh` funciona
- `docker exec -it <id> bash` falha com erro

## Demora no start

O instrutor notou que a aplicacao demorou para iniciar no container otimizado. Ele mencionou que isso "nao e incomum" e seria abordado nos modulos 4 e 5 sobre health checks e readiness probes.

## Verificando arquivos no container

Para inspecionar o conteudo do container:
```bash
docker exec -it <container_id> sh
ls -la
```

Isso permite verificar que apenas os arquivos necessarios (dist, node_modules de producao, package.json) estao presentes.