# Deep Explanation: Instalacao do Docker Compose

## Docker Compose v1 vs v2

### v1 (Legacy)
- Binario separado: `docker-compose` (com hifen)
- Escrito em Python
- Instalado separadamente do Docker Engine
- Comando: `docker-compose up`

### v2 (Atual — recomendado)
- Plugin integrado ao Docker CLI: `docker compose` (sem hifen, com espaco)
- Escrito em Go (mais rapido)
- Instalado como plugin do Docker Engine
- Comando: `docker compose up`

A principal diferenca pratica: v2 usa `docker compose` (espaco) em vez de `docker-compose` (hifen). Scripts antigos podem precisar de ajuste.

## Por que verificar antes de instalar

O instrutor destaca que o primeiro passo e sempre verificar com `docker compose version`. Isso evita:
- Instalacao duplicada
- Conflito entre v1 e v2
- Tempo perdido reinstalando algo que ja funciona

## Onde encontrar a documentacao

- URL oficial: `docs.docker.com/compose/install/`
- A pagina oferece instrucoes especificas por SO (Linux, macOS, Windows)
- Para Linux, ha multiplos metodos (apt, manual download, snap) — preferir o metodo via plugin

## Troubleshooting comum

### "command not found" apos instalacao
1. Verificar se Docker Engine esta rodando: `docker info`
2. Verificar se o plugin foi instalado no path correto: `ls /usr/libexec/docker/cli-plugins/`
3. Reiniciar o terminal

### Permissao negada
```bash
# Adicionar usuario ao grupo docker (evita sudo)
sudo usermod -aG docker $USER
# Fazer logout/login para aplicar
```

### Versao antiga (v1) instalada
```bash
# Remover v1
sudo apt-get remove docker-compose
# Instalar v2 como plugin
sudo apt-get install docker-compose-plugin
```

## Contexto do curso

Esta aula e um pre-requisito para as proximas aulas do modulo de Containers, onde o Docker Compose sera usado para orquestrar multiplos containers (banco de dados, aplicacao, etc). Sem ele instalado, nao e possivel seguir com os exercicios praticos.