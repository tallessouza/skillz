# Deep Explanation: Efemeridade de Containers na Prática

## O conceito central

Um container Docker e **efemero por design** — ele pode ser destruido e recriado a qualquer momento sem impacto no sistema. Isso so funciona se os dados persistentes estiverem **fora** do container.

## A diferenca crucial: stop/start vs rm/run

O instrutor demonstra dois cenarios distintos que confundem iniciantes:

### Cenario 1: Stop + Start (dados preservados)

```
docker stop <id>    → Container para, mas filesystem permanece
docker start <id>   → Mesmo container, mesmo filesystem, arquivo teste.txt ainda la
```

Quando voce para um container com `docker stop`, ele nao e destruido. O processo para, mas o filesystem do container continua existindo. Ao fazer `docker start`, o mesmo container volta com todos os arquivos intactos.

### Cenario 2: Rm + Run (dados perdidos)

```
docker stop <id>    → Para o container
docker rm <id>      → Remove o container (implicit ou explicit)
docker run ...      → Cria container NOVO, filesystem limpo
```

Quando voce recria o container com `docker run`, um container completamente novo e criado. O ID muda (como o instrutor mostra), e o filesystem comeca do zero — a imagem original, sem nenhuma modificacao.

**O arquivo teste.txt criado com `touch` desaparece.**

## Por que isso importa

O instrutor criou um arquivo com `touch teste.txt` dentro do container deliberadamente para demonstrar esse comportamento. Ele mesmo diz: "Nao e uma boa pratica fazer isso" — o objetivo e puramente didatico.

Na pratica, isso significa:
- **Banco de dados** rodando em container sem volume = dados perdidos na recriacao
- **Uploads de usuario** salvos no filesystem do container = perdidos na recriacao
- **Logs importantes** dentro do container = perdidos na recriacao

## A solucao: Volumes

O instrutor conclui com a regra de ouro: "Sempre que a gente quiser guardar arquivo, conteudo, banco de dados — a gente vai utilizar volumes para guardar separado, fora do nosso container."

Volumes existem independentemente do ciclo de vida do container. Quando voce recria o container e monta o mesmo volume, os dados estao la.

## Analogia pratica

Pense no container como um escritorio temporario:
- **Stop/Start** = trancar o escritorio e reabrir (tudo continua la dentro)
- **Rm/Run** = demolir o escritorio e construir um novo (tudo que estava dentro foi destruido)
- **Volume** = um cofre externo ao escritorio (sobrevive a qualquer demolição)

## Edge cases importantes

### Container em execucao com dados nao salvos em volume
Se voce faz `docker rm -f` (force remove) em um container em execucao que tem dados nao volumados, esses dados sao perdidos instantaneamente. Nao ha confirmacao.

### Docker system prune
O comando `docker system prune` remove containers parados, networks nao usadas, e imagens dangling. Containers parados com dados nao volumados serao destruidos.

### Volumes anonimos vs nomeados
- Volume anonimo: `docker run -v /data ...` — dificil de rastrear, pode ser removido acidentalmente com `docker volume prune`
- Volume nomeado: `docker run -v meusdados:/data ...` — facil de gerenciar, sobrevive a prune (a menos que use `--all`)