# Deep Explanation: Limpando Containers e Imagens Docker

## Por que limpar o ambiente?

O instrutor demonstra uma pratica importante antes de iniciar qualquer novo projeto com Docker: comecar com o ambiente zerado. Isso evita:

1. **Conflitos de porta** — containers antigos podem estar usando a mesma porta que o novo projeto precisa (ex: Postgres na 5432)
2. **Confusao visual** — ao listar containers, ter muitos containers de projetos antigos dificulta identificar o que pertence ao projeto atual
3. **Consumo de disco** — imagens Docker ocupam espaco significativo, especialmente imagens de banco de dados como Postgres

## Ordem de remocao: containers primeiro, imagens depois

Existe uma dependencia hierarquica no Docker:

```
Imagem → Container (instancia da imagem)
```

Uma imagem e como uma "classe" e o container e como uma "instancia". Voce nao pode deletar a classe enquanto existem instancias dela. Por isso:

1. **Primeiro**: remova todos os containers (`docker rm`)
2. **Depois**: remova as imagens (`docker rmi`)

Se tentar remover a imagem antes, o Docker retorna erro dizendo que a imagem esta em uso.

## Flags importantes

### `docker ps` vs `docker ps -a`

- `docker ps` — mostra apenas containers **rodando**
- `docker ps -a` — mostra **todos** os containers, incluindo parados

Containers parados ainda existem no sistema e bloqueiam a remocao de imagens. Sempre use `-a` para ver o estado completo.

### `docker rm -f`

A flag `-f` (force) forca a remocao mesmo que o container esteja rodando. Sem ela, o Docker exige que voce pare o container primeiro com `docker stop`.

### `docker rmi`

O comando `rmi` (remove image) aceita tanto o IMAGE ID quanto o nome da imagem (ex: `postgres:latest`). O instrutor usou o ID, mas ambos funcionam.

## Contexto da aula

O instrutor esta preparando o ambiente para rodar um banco de dados **Postgres** em um container Docker para uma API de entregas de encomendas. A limpeza e o passo preparatorio antes de criar o container do Postgres do zero, garantindo que o aluno acompanhe sem conflitos com containers ou imagens pre-existentes.

## Quando NAO limpar tudo

O proprio instrutor menciona: se voce tem outros projetos usando containers, nao precisa remover tudo. A limpeza total e recomendada apenas para fins didaticos ou quando realmente deseja resetar o ambiente. Em ambientes de desenvolvimento com multiplos projetos, remova apenas os containers e imagens especificos.

## Alternativa: docker system prune

Para uma limpeza completa em um unico comando:

```bash
docker system prune -a
```

Este comando remove:
- Todos os containers parados
- Todas as networks nao utilizadas
- Todas as imagens sem containers associados
- Todo o cache de build

Use com cautela — nao ha como desfazer.