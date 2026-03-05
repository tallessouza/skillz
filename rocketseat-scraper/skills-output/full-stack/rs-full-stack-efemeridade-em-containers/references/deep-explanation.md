# Deep Explanation: Efemeridade em Containers

## O que significa efemero

Efemero vem do grego "ephemeros" — que dura apenas um dia. No contexto de containers, significa que eles sao temporarios por design. Nao e um bug, e uma feature. O instrutor Rodrigo enfatiza que essa e uma caracteristica fundamental que precisa ser compreendida antes de trabalhar com containers.

## Por que containers sao efemeros

Containers sao projetados para serem:
- **Descartaveis** — podem ser removidos sem cerimonia
- **Substituiveis** — um novo container identico pode ser criado instantaneamente
- **Paraveis** — podem ser parados e o sistema continua funcionando
- **Reconstruiveis** — todas as instrucoes estao no Dockerfile

O Dockerfile funciona como uma "receita". Voce nao precisa do bolo (container rodando) para ter a receita. Se o bolo cair no chao, voce faz outro. O valor esta na receita, nao no bolo.

## A consequencia direta: perda de dados

O ponto central da aula: se voce armazena dados dentro de um container e esse container e encerrado ou removido, os dados sao perdidos. Nao ha recuperacao. Nao ha "lixeira". Os dados simplesmente deixam de existir.

Isso acontece porque o filesystem do container e uma camada de escrita (writable layer) que existe apenas enquanto o container existe. Quando o container e removido (`docker rm`), essa camada e deletada.

## A solucao: armazenamento externo

O instrutor recomenda usar ambientes externos ao container para armazenar dados. A solucao mais direta sao os **volumes Docker**:

- **Volumes nomeados**: gerenciados pelo Docker, persistem independente do container
- **Bind mounts**: mapeiam um diretorio do host para dentro do container
- **Servicos externos**: bancos de dados gerenciados, object storage (S3), etc.

## Quando a efemeridade e uma vantagem

A efemeridade nao e um problema — e uma vantagem quando bem utilizada:

1. **Atualizacoes**: pare o container antigo, suba o novo com a versao atualizada
2. **Scaling**: crie N containers identicos para lidar com carga
3. **Recuperacao**: se um container falha, outro o substitui instantaneamente
4. **Consistencia**: todo container comeca do mesmo estado limpo (imagem)

## Edge cases importantes

### Container parado vs removido
- `docker stop`: container para, mas o filesystem ainda existe. Dados ainda estao la.
- `docker rm`: container e removido, filesystem e deletado. Dados perdidos.
- Porem: depender de `docker stop` sem `docker rm` para manter dados e uma pratica perigosa, porque qualquer `docker rm` acidental ou `docker system prune` elimina tudo.

### Volumes anonimos
- Se voce usa `VOLUME` no Dockerfile sem nomear, o Docker cria um volume anonimo
- Volumes anonimos sao dificeis de rastrear e podem ser removidos com `docker system prune --volumes`
- Sempre prefira volumes nomeados para dados importantes

### Multi-stage builds e dados
- Em multi-stage builds, dados de estagios anteriores nao existem no estagio final a menos que sejam explicitamente copiados com `COPY --from`
- Isso reforça a efemeridade: ate dentro do build process, dados sao temporarios